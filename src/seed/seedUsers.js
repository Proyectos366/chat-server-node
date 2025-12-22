import prisma from "#root/config/prisma.js";

async function main() {
  const rol = await prisma.role.create({
    data: { nombre: "master", descripcion: "Rol con todos los permisos" },
  });
  console.log("Rol creado:", rol);

  // 2. Crear un usuario asociado al rol
  const user = await prisma.usuario.create({
    data: {
      nombre: "carlos",
      correo: "carlosjperazab@gmail.com",
      clave: "$2a$05$qv5dKCZmInzicTS5D0BFu.ThM5g99ScAkKKDjqKfQzMraQjhRnqgS",
      rolId: rol.id, // relación con el rol creado
    },
  });

  // token: "6w2r5ks4rb1gd4r1",

  console.log("Usuario creado:", user);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
