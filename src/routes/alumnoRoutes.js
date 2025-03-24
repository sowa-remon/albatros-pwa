const { firestore } = require("../configs/firebaseAdmin");
const express = require("express");
const path = require("path");
const router = express.Router();
const { admin } = require("../configs/firebaseAdmin");

router.get("/clase", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/alumnoPages/clase.html")
  );
});
router.get("/estructura-de-niveles", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/alumnoPages/niveles.html")
  );
});
router.get("/anuncios", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/alumnoPages/anuncios.html")
  );
});

router.get("/mi-clase/:id", async (req, res) => {
  const { id } = req.params;
  const claseRef = firestore.collection("clases").doc(id);

  try {
    // Obtener el documento
    const claseSnapshot = await claseRef.get();

    if (!claseSnapshot.exists) {
      throw new Error("El documento no existe.");
    }

    // Recuperar solo los datos específicos que necesitas
    const { maestro, horas } = claseSnapshot.data();

    res.status(200).send({maestro, horas});

  } catch (error) {
    console.error("Error al obtener la clase:", error.message);
  }
});
router.get("/contenido/:n", async (req, res) => {
    const { n } = req.params;
    let contenidoQuery;

    // Definir la consulta según el valor de "n"
    if (n == 1) {
        contenidoQuery = firestore.collection("contenidos").where("programa", "==", "1");
    } else if (n == 2) {
        contenidoQuery = firestore.collection("contenidos").where("programa", "==", "2");
    } else if (n == 3) {
        contenidoQuery = firestore.collection("contenidos").where("programa", "==", "3");
    } else if (n >= 4 && n <= 7) {
        contenidoQuery = firestore.collection("contenidos").where("programa", "==", "4");
    } else if (n >= 8 && n <= 14) {
        contenidoQuery = firestore.collection("contenidos").where("programa", "==", "5");
    } else if (n == 15) {
        contenidoQuery = firestore.collection("contenidos").where("programa", "==", "6");
    } else {
        return res.status(400).send({ message: "El parámetro proporcionado no es válido." });
    }

    try {
        // Ejecutar la consulta y obtener los resultados
        const contenidoSnapshot = await contenidoQuery.limit(1).get(); // Solo obtener el primer documento

        // Verificar si la consulta tiene resultados
        if (contenidoSnapshot.empty) {
            return res.status(404).send({ message: "No se encontró ningún contenido para el programa solicitado." });
        }

        // Obtener el primer documento de la consulta
        const contenido = contenidoSnapshot.docs[0].data();

        // Devolver los datos del documento
        res.status(200).send(contenido);
    } catch (error) {
        console.error("Error al obtener el contenido:", error.message);
        res.status(500).send({ message: "Error al obtener el contenido.", error: error.message });
    }
});


module.exports = router;
