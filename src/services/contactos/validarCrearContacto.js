import prisma from "#root/config/prisma.js";
import respuestasAlBack from "#root/utils/respuestasAlBack.js";
import validarCamposCrearContacto from "#root/services/contactos/validarCamposCrearContacto.js";
import obtenerDatosUsuarioToken from "#root/libs/obtenerDatosUsuarioToken.js";

export default async function validarCrearContacto(nombre, correo) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return respuestasAlBack(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ? validaciones.codigo : 400
      );
    }

    const validarCampos = await validarCamposCrearContacto(nombre, correo);

    if (validarCampos.status === "error") {
      return respuestasAlBack(validarCampos.status, validarCampos.message);
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        correo: validaciones.correo,
      },
    });

    if (!usuarioExiste) {
      return respuestasAlBack("error", "Usuario no existe", {
        codigo: 404,
      });
    }

    const usuarioContactoExiste = await prisma.usuario.findUnique({
      where: {
        correo: validarCampos.correo,
      },
    });

    const contactoExiste = await prisma.contacto.findFirst({
      where: {
        usuarioId: usuarioExiste.id,
        OR: [
          { correo: validarCampos.correo },
          { contactoId: usuarioContactoExiste?.id },
        ],
      },
    });

    if (contactoExiste) {
      return respuestasAlBack("error", "Contacto ya existe", {
        codigo: 409,
      });
    }

    return respuestasAlBack("ok", "Validacion crear contacto correcta...", {
      usuarioId: usuarioExiste.id,
      nombre: validarCampos.nombre,
      correo: usuarioContactoExiste ? null : validarCampos.correo,
      contactoId: usuarioContactoExiste ? usuarioContactoExiste.id : null,
    });
  } catch (error) {
    console.error("Error interno validar crear contacto:", error);

    return respuestasAlBack("error", "Error interno validar crear contacto...");
  }
}
