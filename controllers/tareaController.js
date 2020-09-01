const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");
const { validationResult } = require("express-validator");
//const nodemon = require("nodemon");

exports.listarTareas = async (req, res) => {
  try {
    //extaer proyecto
    const { proyecto } = req.query;
    const proyectoExsite = await Proyecto.findById(proyecto);
    if (!proyectoExsite) {
      return res.status(401).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (proyectoExsite.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Obtener las tarea por proyectos
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });

    res.status(201).json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.crearTarea = async (req, res) => {
  //Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }

  try {
    //extaer proyecto
    const { proyecto } = req.body;
    const proyectoExsite = await Proyecto.findById(proyecto);
    if (!proyectoExsite) {
      return res.status(401).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (proyectoExsite.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Creamos la tarea
    const tarea = new Tarea(req.body);
    tarea.save();

    res.status(201).json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  //Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }

  try {
    //extaer proyecto
    const { proyecto, nombre, estado } = req.body;
    //buscamos si tarea existe
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no existe" });
    }

    const proyectoExsite = await Proyecto.findById(proyecto);

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (proyectoExsite.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // crear un objeto con la nueva tarea
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    //Guardar tarea
    tarea = await Tarea.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevaTarea },
      { new: true }
    );

    res.status(201).json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Eliminar Tarea
exports.eliminarTarea = async (req, res) => {
  try {
    //extaer proyecto
    const { proyecto } = req.query;
    //buscamos si tarea existe
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no existe" });
    }

    const proyectoExsite = await Proyecto.findById(proyecto);

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (proyectoExsite.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminamos la tarea
    tarea = await Tarea.findOneAndRemove({ _id: req.params.id });

    res.status(201).json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
