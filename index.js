const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

//crear el servidor
const app = express();

//conectamos a la base de datos
conectarDB();
//Habilitar cors
app.use(cors());

//Habilitar express.js /ayuda para leer datos
app.use(express.json({ extended: true }));

//puerto de la app
const port = process.env.port || 4000;

//importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

//arracar la app, cambie el PORT y agrege 0.0.0.0
app.listen(port, "0.0.0.0", () => {
  console.log("init app");
});
