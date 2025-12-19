import respuestasAlBack from "#root/utils/respuestasAlBack.js";

export default function validarCrearUsuario({
  nombre,
  correo,
  claveUno,
  claveDos,
}) {
  try {
    if (!nombre) {
      return respuestasAlBack("error", "Campo nombre vacio...");
    }
  } catch (error) {
    console.error("Error interno validar crear usuario:", error);

    return respuestasAlBack("error", "Error interno validar crear usuario...");
  }
}
