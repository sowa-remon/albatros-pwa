const express = require("express");
const { firestore } = require('../firebaseAdmin'); // Importa firestore correctamente
const multer = require('multer');
const bcrypt = require("bcrypt");
const router = express.Router();
const upload = multer();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(username);
    const token = await admin.auth().createCustomToken(user.uid);
    res.status(200).send({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al iniciar sesión", error: error.message });
  }
});

const saltRounds = 10;

router.post("/admin/crearUsuarioAdmin", upload.none(), async (req, res) => {
  const { username, password } = req.body;

  // Verificar que el nombre de usuario y la contraseña estén presentes
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Nombre de usuario y contraseña son requeridos" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userDocRef = firestore.collection("usuarios").doc();
    await userDocRef.set({
      username,
      password: hashedPassword,
      tipo: "admin",
    });
    res
      .status(201)
      .send({ message: "Usuario creado exitosamente", userId: userDocRef.id });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al crear usuario", error: error.message });
  }
});

module.exports = router;
