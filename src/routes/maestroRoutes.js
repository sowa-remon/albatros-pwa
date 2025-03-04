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


module.exports = router;
