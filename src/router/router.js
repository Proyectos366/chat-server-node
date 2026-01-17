import express from "express";
import UserController from "#root/controllers/UserController.js";
import { loginLimiter } from "#root/middlewares/rateLimited.js";
import LoginController from "#root/controllers/LoginController.js";
import ContactController from "#root/controllers/ContactController.js";

const rutas = express.Router();

rutas.get("/", (req, res) => {
  res.json({ ok: true, message: "Servidor funcionando" });
});

rutas.post("/api/usuarios/crear-usuario", UserController.crearUsuario);

rutas.get("/api/usuarios/usuario-activo", UserController.usuarioActivo);

rutas.post("/api/login/iniciar-sesion", loginLimiter, LoginController.login);
rutas.get("/api/login/cerrar-sesion", LoginController.logout);

rutas.post("/api/contactos/crear-contacto", ContactController.crearContacto);

export default rutas;
