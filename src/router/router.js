import UserController from "#root/controllers/UserController.js";
import express from "express";

const rutas = express.Router();

rutas.get("/", (req, res) => {
  res.json({ ok: true, message: "Servidor funcionando" });
});

rutas.post("/api/usuarios/crear-usuario", UserController.crearUsuario);

export default rutas;
