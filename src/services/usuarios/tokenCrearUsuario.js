import prisma from "#root/config/prisma";
import AuthTokens from "#root/libs/AuthTokens";
import respuestasAlBack from "#root/utils/respuestasAlBack";

export default async function tokenCrearUsuario() {
  let tokenGenerado;
  let tokenEsUnico = false;

  try {
    while (!tokenEsUnico) {
      // 1. Generar el token
      const resultadoToken = AuthTokens.tokenValidarUsuario(10);

      // Si hay un error en la generación (ej. fallo de librería)
      if (resultadoToken.status === "error") {
        return respuestasAlBack(resultadoToken.status, resultadoToken.message);
      }

      tokenGenerado = resultadoToken.token;

      // 2. Verificar disponibilidad en la base de datos
      const tokenEnUso = await prisma.usuario.findUnique({
        where: { token: tokenGenerado },
      });

      // 3. Si no existe, el token es válido y salimos del bucle
      if (!tokenEnUso) {
        tokenEsUnico = true;
      }
    }

    // Retorno exitoso con el token único encontrado
    return respuestasAlBack("ok", "Token generado exitosamente", {
      token: tokenGenerado,
    });
  } catch (error) {
    console.error("Error al generar token único:", error);
    return respuestasAlBack(
      "error",
      "Error interno al validar unicidad del token"
    );
  }
}
