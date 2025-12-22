// src/utils/validarCamposRegistro.js
import respuestasAlBack from "#root/utils/respuestasAlBack.js";
import ValidarCampos from "#root/services/ValidarCampos.js";
import CifrarDescifrarClaves from "#root/libs/CifrarDescifrarClaves.js";

export default async function validarCamposCrearUsuario(
  nombre,
  correo,
  claveUno,
  claveDos
) {
  try {
    // 1. Validaciones individuales usando la clase
    const validarCorreo = ValidarCampos.validarCampoCorreo(correo);
    const validarNombre = ValidarCampos.validarCampoNombre(nombre);
    const validarClave = ValidarCampos.validarCampoClave(claveUno, claveDos);

    // 2. Retorna el primer error encontrado
    if (validarNombre.status === "error") return validarNombre;
    if (validarCorreo.status === "error") return validarCorreo;
    if (validarClave.status === "error") return validarClave;

    const claveCifrada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    if (claveCifrada.status === "error") {
      return respuestasAlBack(claveCifrada.status, claveCifrada.message);
    }

    // 3. Retorna respuesta exitosa con todos los datos validados
    return respuestasAlBack("ok", "Campos validados...", {
      nombre: validarNombre.nombre,
      correo: validarCorreo.correo,
      claveEncriptada: claveCifrada.claveEncriptada,
    });
  } catch (error) {
    console.log("Error interno, campos registro usuario:", error);

    return respuestasAlBack("error", "Error interno en validación de usuario");
  }
}
