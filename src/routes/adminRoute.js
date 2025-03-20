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
const { admin } = require("../configs/firebaseAdmin");
const bucket = admin.storage().bucket();

// Configurar almacenamiento para el archivo
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria

const upload = multer({ storage: storage });

// * Rutas protegidas estáticas
router.get("/contenido", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/adminPages/contenido.html")
  );
});
router.get("/alumnos", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/adminPages/alumnos.html")
  );
});
router.get("/maestros", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/adminPages/maestros.html")
  );
});
router.get("/anuncios", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/adminPages/anuncios.html")
  );
});
router.get("/detalle-alumno", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/adminPages/alumno-detalles.html")
  );
});
router.get("/detalle-maestro", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/adminPages/maestro-detalles.html")
  );
});

// * Rutas post
// Crear usuario admininstrador
router.post("/crearUsuarioAdmin", upload.none(), async (req, res) => {
  const { usuario, password } = req.body;
  const tipo = "administrador";

  // Verificar que el nombre de usuario y la contraseña estén presentes
  if (!usuario || !password) {
    return res
      .status(400)
      .send({ message: "Nombre de usuario y contraseña son requeridos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const usuarioAdmin = new UsuarioAdmin(null, usuario, hashedPassword, tipo);
    const userDocRef = firestore.collection("usuarios").doc();
    await userDocRef.set(usuarioAdmin.toFirestore());

    res
      .status(201)
      .send({ message: "Usuario creado exitosamente", userId: userDocRef.id });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al crear usuario", error: error.message });
  }
});

// *** ALUMNOS ***
// Crear usuario alumno
router.post("/crearUsuarioAlumno", async (req, res) => {
  const {
    nombre,
    apellidos,
    fechaN,
    antecedentes,
    restricciones,
    direccion,
    telefono,
    contactoNombre,
    contactoTelefono,
    nivel,
  } = req.body;
  const tipo = "alumno";
  const estado = true;
  const clase = ''

  // Verificar que el nombre de usuario y la contraseña estén presentes
  if (
    !nombre ||
    !apellidos ||
    !fechaN ||
    !antecedentes ||
    !restricciones ||
    !contactoNombre ||
    !contactoTelefono ||
    !direccion ||
    !telefono ||
    !nivel
  ) {
    return res.status(400).send({ message: "Falta algun campo" });
  }
  // agregar evaluacion vacía
  const evaluacion = {
    fechaEv: "",
    aprobado: false,
    observaciones: "",
    maestro: "",
  };

  // crear nombre de usuario y contraseña (usuario encriptado)
  const fechaCadena = await fechaN.toString();
  const ape = await apellidos.toLowerCase().split(" ");
  const ape1 = ape[0].charAt(0);
  let ape2 = "";
  if (ape[1]) {
    ape2 = ape[1].charAt(0);
  }
  if (!ape[1]) {
    ape2 = ape[0].charAt(1);
  }

  const usuario =
    (await nombre.toLowerCase().split(" ")[0]) +
    ape1 +
    ape2 +
    "." +
    fechaCadena.split("-")[2] +
    fechaCadena.split("-")[1];
  console.log("Usuario: ", usuario);
  const usuarioNormalized = usuario
    .normalize("NFD")
    .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
    .normalize();
  console.log("Usuario normalizado: ", usuarioNormalized);
  try {
    const password = await bcrypt.hash(usuarioNormalized, saltRounds);

    const userDocRef = firestore.collection("usuarios").doc();
    const idAlumno = userDocRef.id;
    const usuarioAlumno = new UsuarioAlumno(
      idAlumno,
      nombre,
      apellidos,
      fechaN,
      antecedentes,
      restricciones,
      direccion,
      telefono,
      (contactoE = { contactoNombre, contactoTelefono }),
      nivel,
      usuarioNormalized,
      password,
      estado,
      tipo,
      clase,
      evaluacion
    );

    await userDocRef.set(usuarioAlumno.toFirestore());

    res
      .status(201)
      .send({ message: "Usuario creado exitosamente", userId: userDocRef.id });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al crear usuario", error: error.message });
  }
});

// Dar de baja alumno
router.put("/bajaAlumno/:id", async (req, res) => {
  try {
    const alumnoRef = firestore.collection("usuarios").doc(req.params.id);
    await alumnoRef.update({ estado: false });
    res.status(200).send({ message: "Alumno dado de baja exitosamente" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al dar de baja alumno", error: error.message });
  }
});

// Dar de alta alumno
router.put("/altaAlumno/:id", async (req, res) => {
  try {
    const alumnoRef = firestore.collection("usuarios").doc(req.params.id);
    await alumnoRef.update({ estado: true });
    res.status(200).send({ message: "Alumno dado de alta exitosamente" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al dar de alta alumno", error: error.message });
  }
});

// Actualizar datos de un alumno
router.put("/actualizarAlumno/:id", async (req, res) => {
  try {
    const alumnoData = req.body;

    // Verificar que los datos no estén vacíos
    if (Object.keys(alumnoData).length === 0) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron datos para actualizar" });
    }

    await firestore
      .collection("usuarios")
      .doc(req.params.id)
      .update(alumnoData);
    res
      .status(200)
      .json({ message: "Detalles del alumno actualizados exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar los detalles del alumno",
      error: error.message,
    });
  }
});

router.put("/publicarEvaluacion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones } = req.body
    
    const alumnoRef = firestore.collection("usuarios").doc(id);
    
    await alumnoRef.update({ "evaluacion.aprobado": true });
    await alumnoRef.update({ "evaluacion.observaciones": observaciones });
    res.status(200).send({ message: "Evaluación publicada exitosamente" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al publicacr evaluacion", error: error.message });
  }
});

// * Rutas get
// Obtener lista de alumnos
router.get("/lista-alumnos", async (req, res) => {
  try {
    const alumnosSnapshot = await firestore
      .collection("usuarios")
      .where("tipo", "==", "alumno")
      .orderBy("estado", "desc")
      .get();
    const alumnos = alumnosSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(alumnos);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al obtener alumnos", error: error.message });
  }
});

// Obtener datos de un alumnno
router.get("/alumno/:id", async (req, res) => {
  try {
    const alumnoSnapshot = await firestore
      .collection("usuarios")
      .doc(req.params.id)
      .get();
    const alumno = alumnoSnapshot.data();

    if (!alumno) {
      return res.status(404).send({ message: "Alumno no encontrado" });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener alumno", error: error.message });
  }
});

// *** CONTENIDOS ***

router.post("/actualizarContenido/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { objetivos } = req.body;

    // Actualizar el contenido en la base de datos
    await firestore.collection("contenidos").doc(id).update({
      objetivos: objetivos,
    });

    res.status(200).json({ message: "Contenido actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el contenido",
      error: error.message,
    });
  }
});

router.get("/lista-contenidos", async (req, res) => {
  try {
    const contenidosSnapshot = await firestore.collection("contenidos").get();
    const contenidos = contenidosSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(contenidos);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al obtener alumnos", error: error.message });
  }
});

// *** MAESTROS
router.post("/crearUsuarioMaestro", async (req, res) => {
  console.log(req.body);
  const { nombre, apellidos, fechaN, direccion, telefono } = req.body;
  const tipo = "maestro";
  const estado = true;

  // Verificar que el nombre de usuario y la contraseña estén presentes
  if (!nombre || !apellidos || !fechaN || !direccion || !telefono) {
    return res.status(400).send({ message: "Falta algun campo" });
  }

  try {
    // agregar evaluacion vacía
    const horario = {};
    const curriculum = "";

    // crear nombre de usuario y contraseña (usuario encriptado)
    const fechaCadena = await fechaN.toString();
    const nom =
      (await nombre.toLowerCase().split(" ")[0].charAt(0)) +
      nombre.toLowerCase().split(" ")[0].charAt(1);
    const usuario =
      (await apellidos.toLowerCase().split(" ")[0]) +
      nom +
      "." +
      fechaCadena.split("-")[1] +
      fechaCadena.split("-")[2];

    const usuarioNormalized = usuario
      .normalize("NFD")
      .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
      .normalize();

    const password = await bcrypt.hash(usuarioNormalized, saltRounds);

    const userDocRef = firestore.collection("usuarios").doc();
    const idMaestro = userDocRef.id;
    const usuarioMaestro = new UsuarioMaestro(
      idMaestro,
      nombre,
      apellidos,
      fechaN,
      direccion,
      telefono,
      usuarioNormalized,
      password,
      estado,
      tipo,
      horario,
      curriculum
    );
    console.log(usuarioMaestro);

    await userDocRef.set(usuarioMaestro.toFirestore());

    res
      .status(201)
      .send({ message: "Usuario creado exitosamente", userId: userDocRef.id });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al crear usuario", error: error.message });
  }
});

// Dar de baja maestro
router.post("/bajaMaestro/:id", async (req, res) => {
  try {
    const maestroRef = firestore.collection("usuarios").doc(req.params.id);
    await maestroRef.update({ estado: false });
    res.status(200).send({ message: "Maestro dado de baja exitosamente" });
  } catch (error) {
    res.status(400).send({
      message: "Error al dar de baja al maestro",
      error: error.message,
    });
  }
});

// Dar de alta maestro
router.post("/altaMaestro/:id", async (req, res) => {
  try {
    const maestroRef = firestore.collection("usuarios").doc(req.params.id);
    await maestroRef.update({ estado: true });
    res.status(200).send({ message: "maestro dado de alta exitosamente" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al dar de alta maestro", error: error.message });
  }
});
// Obtener datos de un alumnno
router.get("/maestro/:id", async (req, res) => {
  try {
    const maestroSnapshot = await firestore
      .collection("usuarios")
      .doc(req.params.id)
      .get();
    const maestro = maestroSnapshot.data();

    if (!maestro) {
      return res.status(404).send({ message: "Maestro no encontrado" });
    }
    res.status(200).json(maestro);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener maestro", error: error.message });
  }
});

// Actualizar datos de un maestro
router.put("/actualizarMaestro/:id", async (req, res) => {
  try {
    const maestroData = req.body;

    // Verificar que los datos no estén vacíos
    if (Object.keys(maestroData).length === 0) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron datos para actualizar" });
    }

    await firestore
      .collection("usuarios")
      .doc(req.params.id)
      .update(maestroData);
    res
      .status(200)
      .json({ message: "Detalles del maestro actualizados exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar los detalles del maestro",
      error: error.message,
    });
  }
});

// * Rutas get
// Obtener lista de alumnos
router.get("/lista-maestros", async (req, res) => {
  try {
    const maestrosSnapshot = await firestore
      .collection("usuarios")
      .where("tipo", "==", "maestro")
      .orderBy("estado", "desc")
      .get();
    const maestros = maestrosSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(maestros);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al obtener maestros", error: error.message });
  }
});

// *** ANUNCIOS
router.post("/crearAnuncio", upload.single("imagen"), async (req, res) => {
  const { titulo, contenido, duracion, tipo } = req.body;
  const activo = true;

  if (!titulo || !contenido || !duracion || !tipo) {
    return res.status(400).send({ message: "Falta algún campo" });
  }

  try {
    let fechaInicio = new Date();
    let fechaFinal;
    let fechaInicioTS = admin.firestore.Timestamp.fromDate(fechaInicio);
    let fechaFinalTS;

    if (duracion === "semana") {
      fechaFinal = new Date(fechaInicio);
      fechaFinal.setDate(fechaInicio.getDate() + 7);
      fechaFinalTS = admin.firestore.Timestamp.fromDate(fechaFinal);
    } else if (duracion === "mes") {
      fechaFinal = new Date(fechaInicio);
      fechaFinal.setMonth(fechaInicio.getMonth() + 1);
      fechaFinalTS = admin.firestore.Timestamp.fromDate(fechaFinal);
    } else if (duracion === "indefinido") {
      fechaFinalTS = null;
    }

    const anuncioRef = firestore.collection("anuncios").doc();
    const anuncioId = anuncioRef.id;
    const anuncioData = {
      id: anuncioId,
      activo: activo,
      titulo: titulo,
      contenido: contenido,
      fechaInicio: fechaInicioTS,
      fechaFinal: fechaFinalTS,
      tipo,
    };

    if (req.file) {
      const archivo = req.file;
      const nombreArchivo = `imagenes-anuncios/${Date.now()}_${
        archivo.originalname
      }`;

      // Subir al almacenamiento de Firebase
      const archivoSubido = bucket.file(nombreArchivo);
      await archivoSubido.save(archivo.buffer, {
        metadata: {
          contentType: archivo.mimetype,
        },
      });

      // Usar getSignedUrl para generar una URL pública válida
      const [url] = await archivoSubido.getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // La fecha de expiración de la URL (se puede ajustar)
      });
      
      anuncioData.imagen = url; // Guardar esta URL en Firestore
    }

    await anuncioRef.set(anuncioData);

    res.status(201).send({
      message: "Anuncio agregado exitosamente",
      anuncioId: anuncioId,
    });
  } catch (error) {
    console.error("Error al agregar el anuncio:", error);
    res
      .status(500)
      .send({ message: "Error al agregar el anuncio", error: error.message });
  }
});
router.delete("/eliminarAnuncio/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Referencia al documento del anuncio
    const anuncioRef = firestore.collection("anuncios").doc(id);
    const anuncioDoc = await anuncioRef.get();

    // Verificar si el anuncio existe
    if (!anuncioDoc.exists) {
      return res.status(404).send({ message: "Anuncio no encontrado" });
    }

    const anuncio = anuncioDoc.data();

    // Verificar si el anuncio tiene imagen antes de intentar eliminarla
    if (anuncio.imagen) {
      console.log(anuncio.imagen)
      try {
        // Comprobar si la URL de la imagen tiene un formato válido
        const imagenUrl = anuncio.imagen;
        if (imagenUrl) {
          const imagenPath = imagenUrl.split("?")[0]
          console.log("imagen",imagenPath)
          const imagen2 = imagenPath.split(".app/")[1]
          console.log("imagen2", imagen2)
          const archivo = admin.storage().bucket().file(imagen2);

          // Intentar eliminar la imagen del bucket
          await archivo.delete();
          console.log("Imagen eliminada del almacenamiento.");
        } else {
          console.warn("a");
        }
      } catch (error) {
        console.error("Error al eliminar la imagen del almacenamiento:", error.message);
      }
    }

    // Eliminar el documento del anuncio en Firestore
    await anuncioRef.delete();

    res.status(200).send({ message: "Anuncio eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el anuncio:", error);
    res
      .status(500)
      .send({ message: "Error al eliminar el anuncio", error: error.message });
  }
});


module.exports = router;
