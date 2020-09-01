const Proyecto = require("../models/Proyecto");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Listar proyectos
exports.listaProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.status(201).json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Crear Proyecto
exports.crearProyecto = async (req, res) => {
  //Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    //crear un nuevo proyecto
    const proyecto = new Proyecto(req.body);
    //Guardamos el usuario via JWT
    proyecto.creador = req.usuario.id;
    //guardamos el proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Hubo un error" });
  }
};

// actualizar proyecto
exports.actualizarProyecto = async (req, res) => {
  //Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //extraer la informacion
  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    //revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    //si el proyecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //verificar eel creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //actualizar proyecto
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.status(201).json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

//Eliminar Proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
  //Revisar si hay errores
  try {
    //revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    //si el proyecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //verificar eel creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminar el proyecto
    await Proyecto.findOneAndRemove({ _id: req.params.id });

    res.status(201).json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
