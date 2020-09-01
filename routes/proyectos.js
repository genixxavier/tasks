const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const proyectos = require("../controllers/proyectoController");
const auth = require("../middleware/auth");

//lista proyectos
router.get("/", auth, proyectos.listaProyectos);

//crea proyectos
router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectos.crearProyecto
);

router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectos.actualizarProyecto
);

router.delete("/:id", auth, proyectos.eliminarProyecto);

module.exports = router;
