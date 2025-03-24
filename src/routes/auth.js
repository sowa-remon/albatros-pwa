const { firestore } = require('./src/configs/firebaseAdmin');
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const router = express.Router();
const upload = multer();
const saltRounds = 10;

// * Inicio de sesión
router.post("/login", upload.none(), async (req, res) => {
  const { usuario, password } = req.body

  if(!usuario || !password){
    return res.status(400).send({ message: "Nombre de usuario y contraseña son requeridos" })
  }

  try{
    const snapshot = await firestore.collection("usuarios").where("usuario", "==", usuario).get()
    if(snapshot.empty){
      return res.status(404).send({ message: "Usuario no encontrado" })
    }

    const usuarioEncontrado = snapshot.docs[0].data()
    
    if(usuarioEncontrado.estado === false){
      return res.status(401).send({ message: "Este usuario está inactivo" })
    }
    
    const isValidPassword = await bcrypt.compare(password, usuarioEncontrado.password)

    if(!isValidPassword){
      return res.status(401).send({ message: "Contraseña incorrecta" })
    }

    req.session.user = usuarioEncontrado; // Establecer la sesión del usuario
    
    // Redirigir a la página correspondiente al tipo de usuario
    const tipoUsuario = usuarioEncontrado.tipo

    if(tipoUsuario === "administrador"){
      return res.status(200).send({ message: "Inicio de sesión exitoso", tipo: tipoUsuario, redirect: "/panel-administracion" })
    } 
    if(tipoUsuario === "alumno"){
      return res.status(200).send({ message: "Inicio de sesión exitoso", tipo: tipoUsuario, redirect: "/alumno-panel" })
    } 
    if(tipoUsuario === "maestro"){
      return res.status(200).send({ message: "Inicio de sesión exitoso", tipo: tipoUsuario, redirect: "/maestro-inicio" })
    }
  }

  catch(error){
    res.status(400).send({ message: "Error al iniciar sesión", error: error.message })
  }
})

// * Cerrar sesión
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if(error){
      return res.status(500).send({ message: "Error al cerrar sesión" })
    }
    res.clearCookie("sid")
    res.status(200).send({ message: "Sesión cerrada exitosamente" })
  })
})

// Ruta para obtener los datos del usuario autenticado
router.get("/perfil", async (req, res) => {
  const usuario = req.session.user;
  if (!usuario) {
    return res.status(401).send({ message: "Usuario no autenticado" });
  }

  try {
    const usuarioDoc = await firestore.collection("usuarios").doc(usuario.id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const usuarioData = usuarioDoc.data();
    res.send({ usuario: usuarioData });
  } catch (error) {
    res.status(500).send({ message: "Error al recuperar los datos del usuario", error: error.message });
  }
}); 

router.put("/actualizar-password", async (req, res) => {
  const { password } = req.body;
  const { id } = req.session.user;
  console.log(req.body, req.session.user)

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await firestore.collection("usuarios").doc(id).update({ password: hashedPassword });
    res.status(200).send({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(400).send({ message: "Error al actualizar la contraseña" });
  }
})

module.exports = router;
