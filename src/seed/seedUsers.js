import prisma from "#root/config/prisma.js";

async function main() {
  try {
    // Usamos $transaction para asegurar que ambos se creen o ninguno
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Crear el rol dentro de la transacción (usamos 'tx')
      await tx.role.createMany({
        data: [
          {
            nombre: "master",
            descripcion: "Rol con todos los permisos",
          },
          {
            nombre: "member",
            descripcion: "Rol con permisos comunes en la aplicacion",
          },
        ],
      });

      // 2. Crear el usuario usando el ID del rol recién creado
      const user = await tx.usuario.create({
        data: {
          nombre: "carlos",
          correo: "carlosjperazab@gmail.com",
          clave: "$2a$05$qv5dKCZmInzicTS5D0BFu.ThM5g99ScAkKKDjqKfQzMraQjhRnqgS",
          token: "6w2r5ks4rb1gd4r1",
          rolId: 1,
        },
      });

      return { user };
    });

    console.log("Transacción exitosa:", resultado);
  } catch (error) {
    // Si el correo o el rol ya existen, saltará aquí y no se guardará nada
    console.error(
      "Error en la transacción. No se guardaron datos:",
      error.message
    );
  }
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
