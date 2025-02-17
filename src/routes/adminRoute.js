const { firestore } = require("../configs/firebaseAdmin");
const UsuarioAdmin = require("../models/usuarioAdmin");
const UsuarioMaestro = require("../models/usuarioMaestro");
const UsuarioAlumno = require("../models/usuarioAlumno");
const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");
const router = express.Router();
const saltRounds = 10;


// Configuración de multer para guardar archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
     // El nombre del archivo será el ID del anuncio + la extensión original del archivo
     const idAnuncio = req.body.idAnuncio;
     cb(null, idAnuncio + path.extname(file.originalname));
   }
});

const upload = multer({ storage: storage })

// * Rutas protegidas (creo) estáticas
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
router.post("/crearUsuarioAlumno", upload.none(), async (req, res) => {
  const {
    nombre,
    apellidos,
    fechaN,
    antecedentes,
    restricciones,
    direccion,
    telefono,
    nivel,
  } = req.body;
  const tipo = "alumno";
  const estado = true;

  // Verificar que el nombre de usuario y la contraseña estén presentes
  if (
    !nombre ||
    !apellidos ||
    !fechaN ||
    !antecedentes ||
    !restricciones ||
    !direccion ||
    !telefono ||
    !nivel
  ) {
    return res.status(400).send({ message: "Falta algun campo" });
  }
  // agregar evaluacion vacía
  const evaluacion = {
    fechaEv: " ",
    aprobado: false,
    observaciones: " ",
    maestro: " ",
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

  console.log(ape);

  const usuario =
    (await nombre.toLowerCase().split(" ")[0]) +
    ape1 +
    ape2 +
    "." +
    fechaCadena.split("-")[2] +
    fechaCadena.split("-")[1];
  console.log(usuario)
  try {
    const password = await bcrypt.hash(usuario, saltRounds);

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
      nivel,
      usuario,
      password,
      estado,
      tipo,
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
router.post("/bajaAlumno/:id", async (req, res) => {
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
router.post("/altaAlumno/:id", async (req, res) => {
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

router.post("/publicarEvaluacion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const alumnoRef = firestore.collection("usuarios").doc(id);
    await alumnoRef.update({ "evaluacion.aprobado": true });
    res.status(200).send({ message: "Alumno dado de alta exitosamente" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al dar de alta alumno", error: error.message });
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
    res
      .status(500)
      .json({
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
router.post("/crearUsuarioMaestro", upload.none(), async (req, res) => {
  const { nombre, apellidos, fechaN, direccion, telefono } = req.body;
  const tipo = "maestro";
  const estado = true;
  console.log(req.body);

  // Verificar que el nombre de usuario y la contraseña estén presentes
  if (!nombre || !apellidos || !fechaN || !direccion || !telefono) {
    return res.status(400).send({ message: "Falta algun campo" });
  }

  try {
    // agregar evaluacion vacía
    const horario = {};

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
    const password = await bcrypt.hash(usuario, saltRounds);

    const userDocRef = firestore.collection("usuarios").doc();
    const idMaestro = userDocRef.id;
    const usuarioMaestro = new UsuarioMaestro(
      idMaestro,
      nombre,
      apellidos,
      fechaN,
      direccion,
      telefono,
      usuario,
      password,
      estado,
      tipo,
      horario
    );

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
router.post("/crearAnuncio", upload.single('imagen'), async (req, res) => {
  const { nombre, apellidos, fechaN, direccion, telefono } = req.body;
  const tipo = "maestro";
  const estado = true;
  console.log(req.body);

  // Verificar que el nombre de usuario y la contraseña estén presentes
  if (!nombre || !apellidos || !fechaN || !direccion || !telefono) {
    return res.status(400).send({ message: "Falta algun campo" });
  }

  try {
    // agregar evaluacion vacía
    const horario = {};

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
    const password = await bcrypt.hash(usuario, saltRounds);

    const userDocRef = firestore.collection("usuarios").doc();
    const idMaestro = userDocRef.id;
    const usuarioMaestro = new UsuarioMaestro(
      idMaestro,
      nombre,
      apellidos,
      fechaN,
      direccion,
      telefono,
      usuario,
      password,
      estado,
      tipo,
      horario
    );

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


module.exports = router;
