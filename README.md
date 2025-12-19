# Chat Server - Express + Socket.io + Prisma + WebRTC

Proyecto base en JavaScript (sin TypeScript) con arquitectura MVC mínima, principios SOLID, Socket.io para señalización WebRTC y SQLite vía Prisma.

Pasos rápidos:

1. Instalar dependencias: `npm install` (ya ejecutado en el repo).
2. Configurar `.env` si es necesario (`DATABASE_URL` ya apunta a `file:./dev.db`).
3. Ejecutar migración inicial de Prisma: `npm run prisma:migrate`.
4. (Opcional) Sembrar datos iniciales (roles + usuario admin): `npm run seed`.
5. Ejecutar en modo desarrollo: `npm run dev`.
5. Abrir `http://localhost:4000` y probar `public/index.html`.

Archivos importantes:
- `src/index.js` Servidor principal
- `src/services/socketService.js` Señalización y mensajería
- `prisma/schema.prisma` Esquema de BD (SQLite)
- `public/index.html` Cliente de demo WebRTC + Socket.io

Notas:
- Prisma usa SQLite por defecto aquí; para producción cambia a Postgres/MySQL y actualiza `DATABASE_URL`.
- Implementa autenticación, validaciones y control de errores adecuados según necesidades.
