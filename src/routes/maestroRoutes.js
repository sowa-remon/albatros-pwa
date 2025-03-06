const { firestore } = require("../configs/firebaseAdmin");
const UsuarioAdmin = require("../models/usuarioAdmin");
const UsuarioMaestro = require("../models/usuarioMaestro");
const UsuarioAlumno = require("../models/usuarioAlumno");
const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const { Timestamp } = require("firebase-admin/firestore");
const router = express.Router();
const saltRounds = 10;

// * Rutas protegidas estáticas
router.get("/mis-clases", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/maestroPages/mis-clases.html")
  );
});
router.get("/anuncios", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/maestroPages/anuncios.html")
  );
});
router.get("/tabla-niveles-tecnicos", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/maestroPages/niveles-tecnicos.html")
  );
});

// * Rutas GET


// * Rutas POST
router.put("/actualizar-curriculum", async (req, res) => {
    const { curriculum } = req.body;
    const { id } = req.session.user;
    try {
        await firestore.collection("usuarios").doc(id).update({ curriculum });
        res.status(200).send({ message: "Currículum actualizado exitosamente" });
    } catch (error) {
        res.status(400).send({ message: "Error al actualizar el currículum" });
    }
})

module.exports = router;
