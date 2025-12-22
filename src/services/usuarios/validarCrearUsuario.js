import respuestasAlBack from "#root/utils/respuestasAlBack.js";
import validarCamposCrearUsuario from "#root/services/usuarios/validarCamposCrearUsuario.js";
import prisma from "#root/config/prisma.js";
import tokenCrearUsuario from "#root/services/usuarios/tokenCrearUsuario";

export default async function validarCrearUsuario(
  nombre,
  correo,
  claveUno,
  claveDos
) {
  try {
    const validarCampos = validarCamposCrearUsuario(
      nombre,
      correo,
      claveUno,
      claveDos
    );

    if (validarCampos.status === "error") {
      return respuestasAlBack(validarCampos.status, validarCampos.message);
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        correo: validarCampos.correo,
      },
    });

    if (usuarioExiste) {
      return respuestasAlBack("error", "Usuario ya existe...", {
        codigo: 409,
      });
    }

    const token = await tokenCrearUsuario();

    if (token.status === "error") {
      return respuestasAlBack(token.status, token.message);
    }

    return respuestasAlBack("ok", "Validacion crear usuario correcta...", {
      nombre: validarCampos.nombre,
      correo: validarCampos.correo,
      claveUno: validarCampos.claveUno,
      claveDos: validarCampos.claveDos,
      token: validarCampos.token,
    });
  } catch (error) {
    console.error("Error interno validar crear usuario:", error);

    return respuestasAlBack("error", "Error interno validar crear usuario...");
  }
}
