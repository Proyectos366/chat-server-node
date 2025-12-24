import { getIO } from "#root/config/socket.js";

/**
 Emite una notificación a todos los usuarios conectados
 informando sobre un nuevo contacto.
*/
export const emitirNuevoContacto = async (datosContacto) => {
  const socket = getIO();

  // Opcional: notificar al dueño de la agenda
  socket.emit("nuevoContacto", {
    status: "ok",
    message: `El contacto ${datosContacto.contactoId} ahora está disponible`,
    contactoId: datosContacto.contactoId,
    nombre: datosContacto.nombre,
    correo: datosContacto.correo,
    usuarioId: datosContacto.usuarioId,
    fecha: new Date(),
  });
};
