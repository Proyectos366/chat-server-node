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
CREATE TABLE "Sesion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ip" TEXT,
    "device" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sesion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contacto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "contactoId" INTEGER,
    "correo" TEXT,
    "alias" TEXT,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "favorito" BOOLEAN NOT NULL DEFAULT false,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contacto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contacto_contactoId_fkey" FOREIGN KEY ("contactoId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "originalId" INTEGER,
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

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'info',
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParticipanteConversacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "conversacionId" INTEGER NOT NULL,
    "rol" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ParticipanteConversacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipanteConversacion_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER,
    "accion" TEXT NOT NULL,
    "detalle" TEXT,
    "ip" TEXT,
    "device" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConfiguracionUsuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "tema" TEXT NOT NULL DEFAULT 'claro',
    "privacidad" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConfiguracionUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reaccion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "mensajeId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reaccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reaccion_mensajeId_fkey" FOREIGN KEY ("mensajeId") REFERENCES "Mensaje" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_nombre_key" ON "Role"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_token_key" ON "Usuario"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Sesion_token_key" ON "Sesion"("token");

-- CreateIndex
CREATE INDEX "Contacto_correo_idx" ON "Contacto"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Contacto_usuarioId_contactoId_key" ON "Contacto"("usuarioId", "contactoId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversacion_usuarioUnoId_usuarioDosId_key" ON "Conversacion"("usuarioUnoId", "usuarioDosId");

-- CreateIndex
CREATE INDEX "Mensaje_conversacionId_idx" ON "Mensaje"("conversacionId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipanteConversacion_usuarioId_conversacionId_key" ON "ParticipanteConversacion"("usuarioId", "conversacionId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionUsuario_usuarioId_key" ON "ConfiguracionUsuario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaccion_usuarioId_mensajeId_tipo_key" ON "Reaccion"("usuarioId", "mensajeId", "tipo");
