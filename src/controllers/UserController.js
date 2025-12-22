import prisma from "#root/config/prisma.js";
import { emitirNuevoUsuario } from "#root/config/socket/usuarios/emitirNuevoUsuario.js";
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

      if (validaciones.status === "error") {
        return respuestaAlFront(
          res,
          validaciones.status,
          validaciones.message,
          {},
          validaciones.codigo ? validaciones.codigo : 400
        );
      }

      const creandoUsuario = await prisma.usuario.create({
        data: {
          nombre: validaciones.nombre,
          correo: validaciones.correo,
          clave: validaciones.claveEncriptada,
          token: validaciones.token,
          rolId: 1,
        },
      });

      if (!creandoUsuario) {
        return respuestaAlFront(
          res,
          "error",
          "Error al crear usuario",
          {},
          400
        );
      }

      emitirNuevoUsuario({
        id: creandoUsuario.id,
        nombre: nombre,
        correo: correo,
      });

      return respuestaAlFront(res, "ok", "Usuario creado con exito", {}, 201);
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
