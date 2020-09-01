const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.get("/", auth, tareaController.listarTareas);

router.post(
  "/",
  auth,
  [check("nombre", "El nombre es obligatorio").not().isEmpty()],
  [check("proyecto", "El proyecto es obligatorio").not().isEmpty()],
  tareaController.crearTarea
);

router.put(
  "/:id",
  auth,
  [check("proyecto", "El proyecto es obligatorio").not().isEmpty()],
  tareaController.actualizarTarea
);

router.delete(
  "/:id",
  auth,
  [check("proyecto", "El proyecto es obligatorio").not().isEmpty()],
  tareaController.eliminarTarea
);

module.exports = router;
