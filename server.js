const bodyParser = require('body-parser')
const dotenv = require('dotenv').config() 
const express = require('express')
const session = require('express-session')
const multer = require('multer')
const path = require('path')
const authRoutes = require('./src/routes/auth')
const adminRoutes = require('./src/routes/adminRoute')
const maestroRoutes = require('./src/routes/maestroRoutes')
const { firestore } = require("./src/configs/firebaseAdmin");

const httpPort = process.env.PORT
const app = express()

// sesiones
var sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {},
}

// ? investiga env == prod 
if (process.env.NODE_ENV == 'production'){
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

// middleware para verificar autenticación
function isAuthenticated(req, res, next){
  if(req.session.user){
    next()
  } else {
    res.redirect('/')
  }
}

// middleware para verificar si es administrador
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.tipo === 'administrador') {
    next()
  } else {
    res.status(403).json({ message: 'No autorizado' }); // Devolver JSON en lugar de redirigir
 
  }
}

// middleware para verificar si es maestro
function isMaestro(req, res, next) {
  if (req.session.user && req.session.user.tipo === 'maestro') {
    next()
  } else {
    res.status(403).json({ message: 'No autorizado' }); 
 
  }
}

// 
app.use(session(sess))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))
app.use('/js', express.static(path.join(__dirname, "src/js")))
app.use('/css', express.static(path.join(__dirname, "public/styles")))
app.use('/icons', express.static(path.join(__dirname, "public/images/icons")))
app.use('/uploads', express.static(path.join(__dirname, "src/uploads")))


// ** Rutas importadas **
app.use('/auth', authRoutes);
app.use('/admin', isAdmin, adminRoutes);
app.use('/maestro', isMaestro, maestroRoutes);

// * Rutas personalizadas
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"))
})
app.get("/no-autorizado", function (req, res) {
  res.sendFile(path.join(__dirname, "public/no-autorizado.html"))
})
app.get('/panel-administracion', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/adminPages/admin-panel.html'))
})
app.get('/alumno-panel', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/alumnoPages/alumno-panel.html'))
})
app.get('/maestro-panel', isMaestro, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/maestroPages/maestro-panel.html'))
})


// * Rutas get
// Obtener lista de anuncios
app.get("/lista-anuncios", async (req, res) => {
  try {
    const anunciosSnapshot = await firestore
      .collection("anuncios").where("activo", "==", true)
      .orderBy("fechaInicio", "desc")
      .get();
    const anuncios = anunciosSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(anuncios);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al obtener los anuncios", error: error.message });
  }
});

app.listen(httpPort || 3000, function () {
  console.log(`Listening on port ${httpPort}!`)
})
