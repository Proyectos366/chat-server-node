// Servicio de sockets: señalización para WebRTC + mensajería básica (ESM)

const rooms = new Map(); // roomId -> Set(socketId)

export function initSocket(io, prisma) {
  io.on('connection', (socket) => {
    console.log('Socket conectado', socket.id);

    socket.on('join', (room) => {
      socket.join(room);
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(socket.id);
      io.to(room).emit('room:update', Array.from(rooms.get(room)));
    });

    socket.on('leave', (room) => {
      socket.leave(room);
      if (rooms.has(room)) {
        rooms.get(room).delete(socket.id);
        io.to(room).emit('room:update', Array.from(rooms.get(room)));
      }
    });

    // Señalización WebRTC: offer, answer, ice-candidate
    socket.on('offer', ({ to, offer }) => {
      io.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }) => {
      io.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      io.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    // Mensajería simple (persistir con Prisma)
    socket.on('message', async ({ room, content, senderId }) => {
      try {
        const msg = await prisma.message.create({
          data: { content, senderId: senderId || null },
        });
        io.to(room).emit('message', msg);
      } catch (err) {
        console.error('Error guardando mensaje:', err);
      }
    });

    socket.on('disconnect', () => {
      rooms.forEach((set) => set.delete(socket.id));
      console.log('Socket desconectado', socket.id);
    });
  });
}
