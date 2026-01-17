import { rateLimit } from "express-rate-limit";
import { respuestaAlFront } from "#root/utils/respuestaAlFront.js";

// Limitador específico para el Login (más estricto)
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutos
  limit: 5, // Máximo 5 intentos por IP
  handler: (req, res) => {
    return respuestaAlFront(
      res,
      "error",
      "Demasiados intentos. Por seguridad, tu acceso se ha bloqueado por 15 minutos.",
      {},
      429 // Código HTTP para "Too Many Requests"
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador general (opcional, para proteger otras rutas)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  limit: 50, // 50 peticiones por minuto
  message: "Has excedido el límite de peticiones permitidas.",
});

// import { rateLimit } from "express-rate-limit";

// // Configuración específica para el Login
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
//   limit: 5, // Máximo 5 intentos por dirección IP
//   message: "Demasiados intentos. Inténtalo de nuevo en 15 minutos.",
//   standardHeaders: "draft-8", // Información de límite en los encabezados (estándar 2025)
//   legacyHeaders: false,
// });

// // Aplicar solo a la ruta de login en tu router
// // router.post('/login', loginLimiter, LoginController.login);
