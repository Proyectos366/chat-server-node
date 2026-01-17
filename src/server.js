import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import prisma from "#root/config/prisma.js";
import rutas from "#root/router/router.js";
import { initSocket } from "#root/config/socket.js";

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Error interno" });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

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

app.use(rutas);

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});

/**
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJjYXJsb3NqcGVyYXphYkBnbWFpbC5jb20iLCJyb2wiOjEsImlhdCI6MTc2NjQzMjEyNCwiZXhwIjoxNzY2NDc1MzI0fQ.7siPaJjwODTZ6FOyTtrgKUXJOeMpBR0LYqEJFGpIHyI',
*/
