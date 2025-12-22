import AuthTokens from "#root/libs/AuthTokens.js";
import { Server } from "socket.io";
import prisma from "#root/config/prisma.js";

let io;

export const initSocket = (servidor) => {
  io = new Server(servidor, {
    cors: { origin: "*" }, // En producción aquí irá tu dominio real
    pingTimeout: 60000,
  });

  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      socket.handshake.headers?.token;

    // 1. SI NO HAY TOKEN: En lugar de dar error, permitimos la conexión como "Invitado"
    if (!token) {
      socket.usuario = { id: null, correo: "invitado", rolId: null };
      return next(); // Permitimos que conecte para escuchar eventos públicos
    }

    // 2. SI HAY TOKEN: Aplicamos toda la robustez que definimos
    try {
      const verificado = AuthTokens.descifrarToken(token);

      if (!verificado) {
        // Si envió un token pero está mal, ahí sí damos error
        return next(new Error("TOKEN_INVALIDO_O_EXPIRADO"));
      }

      const usuarioBD = await prisma.usuario.findUnique({
        where: { correo: verificado.correo },
        select: { id: true, borrado: true, rolId: true },
      });

      if (!usuarioBD || usuarioBD.borrado) {
        return next(new Error("USUARIO_NO_AUTORIZADO"));
      }

      socket.usuario = {
        id: usuarioBD.id,
        correo: verificado.correo,
        rolId: usuarioBD.rolId,
      };

      next();
    } catch (error) {
      // Si falla algo interno, permitimos que conecte como invitado para no romper la app
      socket.usuario = { id: null, correo: "invitado", rolId: null };
      next();
    }
  });

  io.on("connection", (socket) => {
    // 1. Unir al usuario a su sala privada basada en su ID único de la DB
    // Solo si no es un "invitado"
    if (socket.usuario.id) {
      const userRoom = `user_${socket.usuario.id}`;
      socket.join(userRoom);

      // Opcional: Notificar a otros o actualizar estado a "Online" en la DB
      // console.log(`Usuario ${socket.usuario.id} conectado`);
    }

    // 2. Manejo de desconexión
    socket.on("disconnect", (reason) => {
      // Aquí podrías actualizar en la DB el campo "ultimo_acceso" o estado "Offline"
      // console.log(`Motivo de desconexión: ${reason}`);
    });

    // 3. Manejo de errores de socket
    socket.on("error", (err) => {
      console.error("Socket Error:", err);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io no ha sido inicializado");
  return io;
};
