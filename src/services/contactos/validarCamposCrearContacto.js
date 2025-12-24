// src/utils/validarCamposRegistro.js
import respuestasAlBack from "#root/utils/respuestasAlBack.js";
import ValidarCampos from "#root/services/ValidarCampos.js";

export default async function validarCamposCrearContacto(nombre, correo) {
  try {
    // 1. Validaciones individuales usando la clase
    const validarCorreo = ValidarCampos.validarCampoCorreo(correo);
    const validarNombre = ValidarCampos.validarCampoNombre(nombre);

    // 2. Retorna el primer error encontrado
    if (validarNombre.status === "error") return validarNombre;
    if (validarCorreo.status === "error") return validarCorreo;

    // 3. Retorna respuesta exitosa con todos los datos validados
    return respuestasAlBack("ok", "Campos validados...", {
      nombre: validarNombre.nombre,
      correo: validarCorreo.correo,
    });
  } catch (error) {
    console.log("Error interno campos registro contacto:", error);

    return respuestasAlBack("error", "Error interno campos registro contacto");
  }
}
