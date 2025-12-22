import validarCrearUsuario from "#root/services/usuarios/validarCrearUsuario.js";
import { respuestaAlFront } from "#root/utils/respuestaAlFront.js";

export default class UserController {
  static async crearUsuario(req, res) {
    try {
      const { nombre, correo, claveUno, claveDos } = req.body;

      const validaciones = await validarCrearUsuario(
        nombre,
        correo,
        claveUno,
        claveDos
      );

      console.log(validaciones);

      if (validaciones.status === "error") {
        return respuestaAlFront(
          res,
          validaciones.status,
          validaciones.message,
          {},
          validaciones.codigo ? validaciones.codigo : 400
        );
      }

      return respuestaAlFront(
        res,
        "ok",
        "Usuario creado con exito...",
        {
          nombre: nombre,
          correo: correo,
          claveUno: claveUno,
          claveDos: claveDos,
        },
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
