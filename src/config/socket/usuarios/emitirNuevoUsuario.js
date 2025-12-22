import { getIO } from "#root/config/socket.js";

/**
 Emite una notificación a todos los usuarios conectados
 informando sobre un nuevo registro.
*/
export const emitirNuevoUsuario = (datosUsuario) => {
  const socket = getIO();

  // .broadcast enviaría a todos menos al que hace la petición,
  // pero como esto viene desde un controlador HTTP, usamos io.emit
  // para que absolutamente todos los conectados lo vean.
  socket.emit("nuevoUsuario", {
    status: "ok",
    message: `${datosUsuario.correo} se ha unido al chat`,
    id: datosUsuario.id,
    nombre: datosUsuario.nombre,
    correo: datosUsuario.correo,
    fecha: new Date(),
  });
};
