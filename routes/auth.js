const { firestore } = require('../firebaseAdmin');
const express = require("express");
const multer = require('multer');
const bcrypt = require("bcrypt");
const router = express.Router();
const upload = multer();

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
    const isValidPassword = await bcrypt.compare(password, usuarioEncontrado.password)

    if(!isValidPassword){
      return res.status(401).send({ message: "Contraseña incorrecta" })
    }

    // Redirigir a la página correspondiente al tipo de usuario
    const tipoUsuario = usuarioEncontrado.tipo

    if(tipoUsuario === "administrador"){
      return res.status(200).send({ message: "Inicio de sesión exitoso", tipo: tipoUsuario, redirect: "/admin-panel" })
    } 
    if(tipoUsuario === "alumno"){
      return res.status(200).send({ message: "Inicio de sesión exitoso", tipo: tipoUsuario, redirect: "/alumno-panel" })
    } 
    if(tipoUsuario === "maestro"){
      return res.status(200).send({ message: "Inicio de sesión exitoso", tipo: tipoUsuario, redirect: "/maestro-panel" })
    }
  }

  catch(error){
    res.status(400).send({ message: "Error al iniciar sesión", error: error.message })
  }
})

module.exports = router;
