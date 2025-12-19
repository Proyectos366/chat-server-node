// Controlador simple para la API de chat (ESM)
import prisma from '#root/config/prisma.js';

export async function listMessages(req, res) {
  const messages = await prisma.message.findMany({ include: { sender: true }, orderBy: { createdAt: 'asc' } });
  res.json(messages);
}
