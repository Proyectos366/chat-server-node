import prisma from "#root/config/prisma.js";

async function main() {
  const rol = await prisma.role.create({
    data: { name: "admin" },
  });
  console.log("✅ Rol creado:", rol);

  // 2. Crear un usuario asociado al rol
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      roleId: rol.id, // relación con el rol creado
    },
  });
  console.log("✅ Usuario creado:", user);

  // 3. Crear un mensaje asociado al usuario
  const message = await prisma.message.create({
    data: {
      content: "Hola mundo desde Prisma + SQLite 🚀",
      senderId: user.id,
    },
  });
  console.log("✅ Mensaje creado:", message);

  // 4. Consultar todos los mensajes con su remitente
  const messages = await prisma.message.findMany({
    include: { sender: true },
  });
  console.log("📩 Mensajes en la base:", messages);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });