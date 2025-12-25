import prisma from "#root/config/prisma.js";
import validarCrearContacto from "#root/services/contactos/validarCrearContacto.js";
import { respuestaAlFront } from "#root/utils/respuestaAlFront.js";

export default class ContactController {
  static async crearContacto(req, res) {
    try {
      const { nombre, correo } = req.body;

      const validaciones = await validarCrearContacto(nombre, correo);

      if (validaciones.status === "error") {
        return respuestaAlFront(
          res,
          validaciones.status,
          validaciones.message,
          {},
          validaciones.codigo ? validaciones.codigo : 422
        );
      }

      const creandoContacto = await prisma.contacto.create({
        data: {
          usuarioId: validaciones.usuarioId,
          alias: validaciones.nombre,
          correo: validaciones.correo,
          contactoId: validaciones.contactoId,
        },
      });

      if (!creandoContacto) {
        return respuestaAlFront(
          res,
          "error",
          "Error al crear contacto",
          {},
          400
        );
      }

      if (validaciones.contactoId) {
        emitirContactosNuevos({
          contactoId: validaciones.contactoId,
        });
      }

      return respuestaAlFront(
        res,
        "ok",
        "Contacto creado con exito",
        {
          messageExtra: validaciones.contactoId
            ? "Existe en el sistema"
            : "No existe en el sistema",
        },
        201
      );
    } catch (error) {
      console.error("Error interno crear contacto:", error);

      return respuestaAlFront(
        res,
        "error",
        "Error interno crear contacto",
        {},
        500
      );
    }
  }
}
