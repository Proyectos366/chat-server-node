/* Servidor principal - Express + Socket.io (ESM)
   Arquitectura MVC mínima y principios SOLID: cada responsabilidad en su módulo.
*/
import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import prisma from "#root/config/prisma.js";

import { initSocket } from "#root/services/socketService.js";
import { Server } from "socket.io";
import rutas from "#root/router/router.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static("public"));
app.use(rutas);

const port = process.env.PORT || 4000;
const server = http.createServer(app);

export const io = new Server(server, { cors: { origin: "*" } });

initSocket(io, prisma);

// Capturar errores no manejados por Prisma de forma controlada
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
