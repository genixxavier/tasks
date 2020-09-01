//Rutas para crear Auth
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

//Crear un Auth
//api/Auth
router.post("/", authController.autenticarUsuario);

//Obtener el usuario autenticado
router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
