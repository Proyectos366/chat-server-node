// src/utils/validarCamposRegistro.js
import respuestasAlBack from "#root/utils/respuestasAlBack.js";
import ValidarCampos from "#root/services/ValidarCampos.js";

export default function validarCamposLogin(nombre) {
  try {
    // 1. Validaciones individuales usando la clase
    const validarNombre = ValidarCampos.validarCampoNombre(nombre);

    // 2. Retorna el primer error encontrado
    if (validarNombre.status === "error") return validarNombre;

    // 3. Retorna respuesta exitosa con todos los datos validados
    return respuestasAlBack("ok", "Campos validados...", {
      nombre: validarNombre.nombre,
    });
  } catch (error) {
    console.log("Error interno, validar campos login:", error);

    return respuestasAlBack("error", "Error interno validar campos login");
  }
}
