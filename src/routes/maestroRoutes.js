const { firestore } = require("../configs/firebaseAdmin");
const express = require("express");
const path = require("path");
const router = express.Router();
const { admin } = require("../configs/firebaseAdmin");
const FieldValue = admin.firestore.FieldValue;

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
    path.join(
      __dirname,
      "../../public/pages/maestroPages/niveles-tecnicos.html"
    )
  );
});
router.get("/detalle-clase", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/maestroPages/detalle-clase.html")
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
});

router.get("/clases", async (req, res) => {
  const { id } = req.session.user;
  if (!id) {
    return res
      .status(400)
      .json({ message: "UPS. El usuario no está autenticado." });
  }

  try {
    const snapshot = await firestore
      .collection("clases")
      .where("maestro.id", "==", id)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No se encontraron clases." });
    }

    const clases = snapshot.docs.map((doc) => doc.data());

    res.status(200).json({ clases }); // Devuelve las clases en el response
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res.status(500).json({ message: "Error al obtener las clases." });
  }
});

router.get("/clase/:id", async (req, res) => {
  try {
    const claseSnapshot = await firestore
      .collection("clases")
      .doc(req.params.id)
      .get();
    const clase = claseSnapshot.data();

    if (!clase) {
      return res.status(404).send({ message: "Clase no encontrada" });
    }
    res.status(200).json(clase);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener la clase", error: error.message });
  }
});

router.get("/alumnos/:nivel", async (req, res) => {
  const { nivel } = req.params; // Obtener el nivel de la clase enviado en la ruta

  try {
    // Consultar alumnos donde "clase" sea null y "nivel" sea igual al especificado
    const alumnosSnapshot = await firestore
      .collection("usuarios")
      .where("tipo", "==", "alumno") // Asegurarse de filtrar solo alumnos
      .where("clase", "==", "") // Filtrar donde no tengan clase asignada
      .where("estado", "==", true)
      .where("nivel", "==", nivel) // Filtrar por el nivel especificado
      .get();

    // Mapear los datos de los documentos
    const alumnos = alumnosSnapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
      apellidos: doc.data().apellidos,
    }));

    // Enviar los datos de los alumnos
    res.status(200).json(alumnos);
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res
      .status(400)
      .send({ message: "Error al obtener alumnos", error: error.message });
  }
});

router.delete("/eliminarClase/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const claseRef = firestore.collection("clases").doc(id);
    const claseDoc = await claseRef.get();

    if (!claseDoc.exists) {
      return res.status(404).send({ message: "La clase no existe" });
    }

    // Obtener los alumnos de la clase
    const claseData = claseDoc.data();
    const alumnos = claseData.alumnos || []; // Lista de alumnos de la clase

    // Crear un batch para actualizar a los alumnos
    const batch = firestore.batch();

    alumnos.forEach((alumno) => {
      const alumnoRef = firestore.collection("usuarios").doc(alumno.id);
      batch.update(alumnoRef, { clase: "" }); // Eliminar el ID de la clase del campo "clase"
    });

    // Ejecutar las actualizaciones en el batch
    await batch.commit();

    // Eliminar el documento de la clase
    await claseRef.delete();

    res.status(200).send({ message: "Clase y referencias de alumnos eliminadas exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la clase:", error);
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
        apellidos: maestro.apellidos,
      },
    };
    console.log(clase);

    await claseRef.set(clase);
    res.status(200).send({ message: "Clase creada exitosamente" });
  } catch (error) {
    res.status(400).send({ message: "Error al crear la clase" });
  }
});

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
});

router.put("/actualizar-horario", async (req, res) => {
  const { horario } = req.body;
  const { id } = req.session.user;
  try {
    await firestore.collection("usuarios").doc(id).update({ horario });
    res.status(200).send({ message: "Horario actualizado exitosamente" });
  } catch (error) {
    res.status(400).send({ message: "Error al actualizar el horario" });
  }
});

router.put("/agregarAlumnos", async (req, res) => {
  const { alumnos, idClase } = req.body; // Datos enviados desde el cliente

  if (!idClase || alumnos.length === 0) {
    return res
      .status(400)
      .send({ message: "ID de clase o lista de alumnos no proporcionados." });
  }

  try {
    const batch = firestore.batch();
    const claseRef = firestore.collection("clases").doc(idClase);

    // Agregar alumnos directamente a la clase
    alumnos.forEach((alumno) => {
      const alumnoRef = firestore.collection("usuarios").doc(alumno.id);

      // Agregar el ID de la clase al alumno
      batch.update(alumnoRef, { clase: idClase });

      // Agregar los datos del alumno a la lista en la clase
      batch.update(claseRef, {
        alumnos: FieldValue.arrayUnion({
          id: alumno.id,
          nombre: alumno.nombre,
          apellidos: alumno.apellidos,
        }),
      });
    });

    // Ejecutar el batch
    await batch.commit();

    res
      .status(200)
      .json({ message: "Alumnos agregados exitosamente a la clase." });
  } catch (error) {
    console.error("Error al agregar alumnos a la clase:", error);
    res.status(500).send({
      message: "Error al agregar alumnos a la clase.",
      error: error.message,
    });
  }
});

router.put("/removerAlumno", async (req, res) => {
  const { idAlumno, idClase } = req.body; // ID del alumno e ID de la clase

  if (!idAlumno || !idClase) {
    return res
      .status(400)
      .send({ message: "ID del alumno o de la clase no proporcionado." });
  }

  try {
    // Obtener el documento de la clase
    const claseRef = firestore.collection("clases").doc(idClase);
    const claseSnapshot = await claseRef.get();

    if (!claseSnapshot.exists) {
      return res
        .status(404)
        .send({ message: "Clase no encontrada." });
    }

    // Obtener el array actual de alumnos
    const claseData = claseSnapshot.data();
    const alumnos = claseData.alumnos || [];

    // Encontrar el mapa completo del alumno que se debe remover
    const alumnoARemover = alumnos.find((alumno) => alumno.id === idAlumno);

    if (!alumnoARemover) {
      return res
        .status(404)
        .send({ message: "El alumno no está en la clase." });
    }

    const batch = firestore.batch();
    const alumnoRef = firestore.collection("usuarios").doc(idAlumno);

    // Actualizar el campo "clase" del alumno a vacío
    batch.update(alumnoRef, { clase: "" });

    // Remover al alumno del array "alumnos" en la clase
    batch.update(claseRef, {
      alumnos: admin.firestore.FieldValue.arrayRemove(alumnoARemover),
    });

    // Ejecutar el batch
    await batch.commit();

    res
      .status(200)
      .json({ message: "Alumno removido exitosamente de la clase." });
  } catch (error) {
    console.error("Error al remover al alumno de la clase:", error);
    res.status(500).send({
      message: "Error al remover al alumno de la clase.",
      error: error.message,
    });
  }
});


module.exports = router;
