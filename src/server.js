import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import prisma from "#root/config/prisma.js";
import rutas from "#root/router/router.js";
import { initSocket } from "#root/config/socket.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(rutas);

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Error interno" });
});

const port = process.env.PORT || 4000;
const server = http.createServer(app);

// INICIALIZACIÓN (Aquí se crea la instancia, pero no se exporta desde aquí)
initSocket(server);

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});

/**
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJjYXJsb3NqcGVyYXphYkBnbWFpbC5jb20iLCJyb2wiOjEsImlhdCI6MTc2NjQzMjEyNCwiZXhwIjoxNzY2NDc1MzI0fQ.7siPaJjwODTZ6FOyTtrgKUXJOeMpBR0LYqEJFGpIHyI',
 */

// /* Servidor principal - Express + Socket.io (ESM)
//    Arquitectura MVC mínima y principios SOLID: cada responsabilidad en su módulo.
// */
// import "dotenv/config";

// import express from "express";
// import http from "http";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import { Server } from "socket.io";
// import prisma from "#root/config/prisma.js";

// import rutas from "#root/router/router.js";

// const app = express();
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// app.use(express.static("public"));
// app.use(rutas);

// const port = process.env.PORT || 4000;
// const server = http.createServer(app);

// export const io = new Server(server, { cors: { origin: "*" } });

// // Capturar errores no manejados por Prisma de forma controlada
// process.on("SIGINT", async () => {
//   await prisma.$disconnect();
//   process.exit();
// });

// server.listen(port, () => {
//   console.log(`Servidor escuchando en http://localhost:${port}`);
// });
