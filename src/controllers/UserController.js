import { respuestaAlFront } from "#root/utils/respuestaAlFront.js";

export default class UserController {
  static async crearUsuario(req, res) {
    try {
      const { nombre, correo, claveUno, claveDos } = req.body;

      return respuestaAlFront(
        res,
        "ok",
        "Usuario creado con exito...",
        { nombre: nombre, correo: correo, claveUno: claveUno, claveDos: claveDos },
        201
      );
    } catch (error) {
      console.error("Error al crear usuario:", error);

      return respuestaAlFront(
        res,
        "error",
        "Error interno del servidor...",
        {},
        500
      );
    }
  }
}
