import { getIO } from "#root/config/socket.js";

/**
 Emite una notificación global informando que un usuario específico ha iniciado sesión (se puso online).
*/
export const emitirUsuarioOnline = (datosUsuario) => {
  const io = getIO();

  // Enviamos a todos los conectados
  io.emit("usuarioOnline", {
    status: "ok",
    message: `${datosUsuario.usuarioId} está en línea`,
    usuarioId: datosUsuario.usuarioId,
    fecha: new Date(),
  });
};
