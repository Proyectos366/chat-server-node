-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "rolId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "abierto" BOOLEAN NOT NULL DEFAULT false,
    "usuarioUnoId" INTEGER NOT NULL,
    "usuarioDosId" INTEGER NOT NULL,
    "borradoUno" BOOLEAN NOT NULL DEFAULT false,
    "borradoDos" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Conversacion_usuarioUnoId_fkey" FOREIGN KEY ("usuarioUnoId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conversacion_usuarioDosId_fkey" FOREIGN KEY ("usuarioDosId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contenido" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "reenviado" BOOLEAN NOT NULL DEFAULT false,
    "horaLeido" DATETIME,
    "tipo" TEXT NOT NULL DEFAULT 'texto',
    "usuarioEnviaId" INTEGER NOT NULL,
    "conversacionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Mensaje_usuarioEnviaId_fkey" FOREIGN KEY ("usuarioEnviaId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mensaje_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Archivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "extension" TEXT NOT NULL,
    "mensajeId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Archivo_mensajeId_fkey" FOREIGN KEY ("mensajeId") REFERENCES "Mensaje" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_nombre_key" ON "Role"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_token_key" ON "Usuario"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Conversacion_usuarioUnoId_usuarioDosId_key" ON "Conversacion"("usuarioUnoId", "usuarioDosId");

-- CreateIndex
CREATE INDEX "Mensaje_conversacionId_idx" ON "Mensaje"("conversacionId");
