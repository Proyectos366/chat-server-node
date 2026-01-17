import prisma from "#root/config/prisma.js";
import validarCrearUsuario from "#root/services/usuarios/validarCrearUsuario.js";
import { respuestaAlFront } from "#root/utils/respuestaAlFront.js";
import { emitirNuevoUsuario } from "#root/config/socket/usuarios/emitirNuevoUsuario.js";
import { emitirContactosNuevos } from "#root/config/socket/contactos/emitirContactosNuevos.js";
import validarUsuarioActivo from "#root/services/usuarios/validarUsuarioActivo.js";

export default class UserController {
  static async crearUsuario(req, res) {
    try {
      const { nombre, correo, claveUno, claveDos } = req.body;

      const validaciones = await validarCrearUsuario(
        nombre,
        correo,
        claveUno,
        claveDos,
      );

      if (validaciones.status === "error") {
        return respuestaAlFront(
          res,
          validaciones.status,
          validaciones.message,
          {},
          validaciones.codigo ? validaciones.codigo : 400,
        );
      }

      const creandoUsuario = await prisma.usuario.create({
        data: {
          nombre: validaciones.nombre,
          correo: validaciones.correo,
          clave: validaciones.claveEncriptada,
          token: validaciones.token,
          rolId: 2,
        },
      });

      if (!creandoUsuario) {
        return respuestaAlFront(
          res,
          "error",
          "Error al crear usuario",
          {},
          400,
        );
      }

      emitirNuevoUsuario({
        id: creandoUsuario.id,
        nombre: validaciones.nombre,
        correo: validaciones.correo,
      });

      const nuevoContacto = await prisma.contacto.updateMany({
        where: {
          correo: validaciones.correo,
          contactoId: null,
        },
        data: {
          contactoId: creandoUsuario.id,
          correo: null,
        },
      });

      if (nuevoContacto.count !== 0) {
        emitirContactosNuevos({
          contactoId: creandoUsuario.id,
        });
      }

      return respuestaAlFront(
        res,
        "ok",
        "Usuario creado con exito",
        {
          redirect: "/",
        },
        201,
      );
    } catch (error) {
      console.error("Error interno crear usuario:", error);

      return respuestaAlFront(
        res,
        "error",
        "Error interno crear usuario",
        {},
        500,
      );
    }
  }

  static async usuarioActivo(req, res) {
    try {
      const validaciones = await validarUsuarioActivo(req);

      if (validaciones.status === "error") {
        return respuestaAlFront(
          res,
          validaciones.status,
          validaciones.message,
          {},
          validaciones.codigo ? validaciones.codigo : 400,
        );
      }

      const userActivo = await prisma.usuario.findUnique({
        where: { correo: validaciones.usuarioActivo.correo },
        select: { id: true, nombre: true, correo: true, rolId: true },
      });

      if (!userActivo) {
        return respuestaAlFront(
          res,
          "error",
          "Error al obtener usuario activo",
          {
            usuarioActivo: userActivo,
          },
          404,
        );
      }

      return respuestaAlFront(
        res,
        "ok",
        "Usuario activo",
        {
          usuarioActivo: userActivo,
        },
        200,
      );
    } catch (error) {
      console.error("Error interno usuario activo:", error);

      return respuestaAlFront(
        res,
        "error",
        "Error interno usuario activo",
        {},
        500,
      );
    }
  }
}
