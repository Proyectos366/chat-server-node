import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;



// // Configuración de Prisma Client (ESM) - carga .env y maneja adaptador para Prisma v7
// import 'dotenv/config';

// let prisma;

// async function tryInitPrisma(){
//   try{
//     const pkg = await import('@prisma/client');
//     const { PrismaClient } = pkg;

//     // Intento de construcción directa primero
//     try{
//       return new PrismaClient();
//     }catch(constructErr){
//       const msg = (constructErr && constructErr.message) ? constructErr.message : '';
//       const needsAdapter = /requires either \"adapter\" or \"accelerateUrl\"|needs to be constructed with a non-empty, valid `PrismaClientOptions`/i.test(msg);
//       if(needsAdapter){
//         try{
//           // Intentar import desde el paquete directo, y si falla, desde el archivo ESM dist
//           let adapterPkg;
//           try{
//             adapterPkg = await import('@prisma/adapter-better-sqlite3');
//           }catch(e){
//             // Fallback: intentar import por path absoluto al dist (resolveremos relativo a este archivo)
//             try{
//               const adapterPath = new URL('../../node_modules/@prisma/adapter-better-sqlite3/dist/index.mjs', import.meta.url);
//               adapterPkg = await import(adapterPath.href);
//             }catch(e2){
//               throw e2;
//             }
//           }

//           if(adapterPkg && typeof adapterPkg.PrismaBetterSqlite3 === 'function'){
//             const adapter = adapterPkg.PrismaBetterSqlite3();
//             return new PrismaClient({ adapter });
//           }
//         }catch(adapterErr){
//           console.warn('No se pudo cargar el adaptador better-sqlite3:', adapterErr && adapterErr.message ? adapterErr.message : adapterErr);
//         }
//       }

//       throw constructErr;
//     }
//   }catch(err){
//     throw err;
//   }
// }

// try{
//   prisma = await tryInitPrisma();
// }catch(err){
//   console.warn('Prisma Client no está disponible, usando mock en memoria para desarrollo.');
//   const messages = [];
//   prisma = {
//     message: {
//       findMany: async () => messages,
//       create: async ({ data }) => {
//         const item = { id: messages.length + 1, content: data.content, createdAt: new Date(), senderId: data.senderId || null };
//         messages.push(item);
//         return item;
//       },
//     },
//     user: {
//       findUnique: async () => null,
//       create: async ({ data }) => ({ id: 1, ...data }),
//     },
//     role: {
//       upsert: async ({ where, update, create }) => ({ id: 1, ...create }),
//     },
//     $disconnect: async () => {},
//   };
// }

// export default prisma;
