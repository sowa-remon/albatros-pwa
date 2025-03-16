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
router.get("/obtener-horario", async (req, res) => {
    const { id } = req.session.user;
    try {
        const usuario = await firestore.collection("usuarios").doc(id).get();
        const horario = usuario.data().horario;
        res.status(200).send({ horario });
    } catch (error) {
        res.status(400).send({ message: "Error al obtener el horario" });
    }
})

router.get("/clases", async (req, res) => {
  const { id } = req.session.user
  if (!id) {
    return res.status(400).json({ message: "UPS. El usuario no está autenticado." })
  }

  try {
    const snapshot = await firestore.collection("clases")
      .where("maestro.id", "==", id) 
      .get();

      if (snapshot.empty) {
      return res.status(404).json({ message: "No se encontraron clases." });
    }

    const clases = snapshot.docs.map(doc => doc.data());

    res.status(200).json({ clases }); // Devuelve las clases en el response
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res.status(500).json({ message: "Error al obtener las clases." });
  }
});

// Eliminar clase
router.delete("/eliminarClase/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const claseRef = firestore.collection("clases").doc(id);
    const claseDoc = await claseRef.get();
    if (!claseDoc.exists) {
      return res.status(404).send({ message: "La clase no existe" });
       }

    await claseRef.delete();
    res.status(200).send({ message: "Clase eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al eliminar la clase", error: error.message });
  }
});


// * Rutas POST
router.post("/crear-clase", async (req, res) => {
  console.log(req.body);
    const { nivel, horarios } = req.body;
    const { id } = req.session.user;

  if (!id) {
    return res.status(400).send({ message: "El usuario no está autenticado." });
  }
    try {
        const usuario = await firestore.collection("usuarios").doc(id).get();
        const maestro = usuario.data();
        
    const claseRef = firestore.collection("clases").doc();
    const claseId = claseRef.id;

        const clase = {
          id: claseId,
            nivel: nivel,
            horas: horarios,
            maestro: {
                id: id,
                nombre: maestro.nombre,
                apellidos: maestro.apellidos
            }
        }
        console.log(clase);
        
    await claseRef.set(clase);
        res.status(200).send({ message: "Clase creada exitosamente" });
    } catch (error) {
        res.status(400).send({ message: "Error al crear la clase" });
    }
})

// * Rutas PUT
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

router.put("/actualizar-horario", async (req, res) => {
   const { horario } = req.body;
    const { id } = req.session.user;
    try {
        await firestore.collection("usuarios").doc(id).update({ horario });
        res.status(200).send({ message: "Horario actualizado exitosamente" });
    } catch (error) {
        res.status(400).send({ message: "Error al actualizar el horario" });
    }
})



module.exports = router;
