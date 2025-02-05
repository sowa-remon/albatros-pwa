const { firestore } = require('../firebaseAdmin');
const UsuarioAdmin = require('../models/usuarioAdmin');
const express = require("express");
const multer = require('multer');
const bcrypt = require("bcrypt");
const router = express.Router();
const upload = multer();
const saltRounds = 10;

// Crear usuario admininstrador
router.post("/admin/crearUsuarioAdmin", upload.none(), async (req, res) => {
    const { usuario, password } = req.body
    const tipo = "administrador"
  
    // Verificar que el nombre de usuario y la contraseña estén presentes
    if (!usuario || !password) {
      return res.status(400).send({ message: "Nombre de usuario y contraseña son requeridos" })
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const usuarioAdmin = new UsuarioAdmin(null, usuario, hashedPassword, tipo)
      const userDocRef = firestore.collection("usuarios").doc()
      await userDocRef.set(usuarioAdmin.toFirestore())
  
      res.status(201).send({ message: "Usuario creado exitosamente", userId: userDocRef.id })
    } 
  
    catch (error) {
      res.status(400).send({ message: "Error al crear usuario", error: error.message })
    }
  })
  