import respuestasAlBack from "#root/utils/respuestasAlBack.js";
import obtenerDatosUsuarioToken from "#root/libs/obtenerDatosUsuarioToken.js";

export default async function validarUsuarioActivo(req) {
  try {
    const validaciones = await obtenerDatosUsuarioToken(req);

    if (validaciones.status === "error") {
      return respuestasAlBack(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ? validaciones.codigo : 400,
      );
    }

    return respuestasAlBack("ok", "Validacion usuario activo...", {
      usuarioActivo: validaciones,
    });
  } catch (error) {
    console.error("Error interno validar usuario activo:", error);

    return respuestasAlBack("error", "Error interno validar usuario activo");
  }
}
