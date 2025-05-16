---
layout: post
title: "API RESTful con TypeScript y Deno: Guía completa"
author: Christian Amado
date: 2024-05-29 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, Deno, Typescript]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.png
---
Deno, el moderno entorno de ejecución para JavaScript y TypeScript creado por Ryan Dahl, está transformando la manera en que se desarrollan aplicaciones backend. A diferencia de Node.js, Deno se centra en la seguridad, el rendimiento y una experiencia de desarrollo simplificada. En este artículo, exploraremos cómo construir una API RESTful utilizando **TypeScript** y **Deno** desde cero, cubriendo todas las operaciones CRUD (**POST, GET, PUT, DELETE**) junto con buenas prácticas, seguridad y optimización...

<!--more-->

## ¿Qué es Deno y por qué usarlo?
Deno es un entorno de ejecución seguro para JavaScript y TypeScript que se ejecuta en el motor V8 de Google. Fue diseñado para abordar algunas limitaciones de Node.js y proporcionar:

1. **Seguridad por defecto**: No se permite acceso al sistema de archivos, red o variables de entorno sin permisos explícitos.
2. **Soporte nativo para TypeScript**: No es necesario usar compilers externos como `tsc`.
3. **Manejo de módulos con URL**: No hay `node_modules`, los módulos se cargan desde URLs.
4. **Ecosistema moderno**: Incluye un test runner, formateador y otras herramientas integradas.

## Configuración inicial del entorno de desarrollo
### Instalación de Deno
Primero, instala Deno en tu sistema operativo siguiendo los comandos oficiales:

**Windows (PowerShell):**
```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

**macOS/Linux:**
```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Verifica la instalación:
```
deno --version
```

### Creación de la estructura del proyecto
Crea un directorio para tu API y estructura el proyecto de la siguiente manera:
```
api-restful-deno/
├── controllers/
├── models/
├── routes/
├── server.ts
├── deps.ts
└── utils/
```
## Paso 1: Configurar el servidor HTTP con Deno
Deno utiliza bibliotecas como `oak` para manejar solicitudes HTTP. Agrega las dependencias en un archivo `deps.ts`:

```
// deps.ts
export { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
export { v4 } from "https://deno.land/std@0.197.0/uuid/mod.ts";
```

Ahora, configura el servidor en `server.ts`:

```
// server.ts
import { Application, Router } from "./deps.ts";
import router from "./routes/index.ts";

const app = new Application();
const port = 8000;

// Middleware para registrar las solicitudes
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// Rutas principales
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Servidor escuchando en http://localhost:${port}`);
await app.listen({ port });
```

Ejecuta el servidor:
```
deno run --allow-net server.ts
```

## Paso 2: Crear rutas y controladores
### Crear rutas base
Crea un archivo `routes/index.ts` para definir las rutas principales de la API:

```
// routes/index.ts
import { Router } from "../deps.ts";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.ts";

const router = new Router();

router
  .get("/api/users", getAllUsers)
  .get("/api/users/:id", getUserById)
  .post("/api/users", createUser)
  .put("/api/users/:id", updateUser)
  .delete("/api/users/:id", deleteUser);

export default router;
```

### Crear controladores CRUD
En `controllers/userController.ts`, define la lógica para cada operación CRUD:

```
// controllers/userController.ts
import { Context } from "../deps.ts";
import { v4 } from "../deps.ts";

interface User {
  id: string;
  name: string;
  email: string;
}

let users: User[] = [];

// Obtener todos los usuarios
export const getAllUsers = (ctx: Context) => {
  ctx.response.body = users;
};

// Obtener un usuario por ID
export const getUserById = (ctx: Context) => {
  const { id } = ctx.params;
  const user = users.find((u) => u.id === id);
  if (user) {
    ctx.response.body = user;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Usuario no encontrado" };
  }
};

// Crear un nuevo usuario
export const createUser = async (ctx: Context) => {
  const { name, email } = await ctx.request.body({ type: "json" }).value;
  const newUser: User = { id: v4.generate(), name, email };
  users.push(newUser);
  ctx.response.status = 201;
  ctx.response.body = newUser;
};

// Actualizar un usuario
export const updateUser = async (ctx: Context) => {
  const { id } = ctx.params;
  const { name, email } = await ctx.request.body({ type: "json" }).value;
  const user = users.find((u) => u.id === id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    ctx.response.body = user;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Usuario no encontrado" };
  }
};

// Eliminar un usuario
export const deleteUser = (ctx: Context) => {
  const { id } = ctx.params;
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    ctx.response.status = 204;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Usuario no encontrado" };
  }
};
```
## Conclusión
Construir una API RESTful con TypeScript y Deno no solo es sencillo, sino que ofrece ventajas en términos de seguridad y rendimiento. Siguiendo las buenas prácticas y utilizando las herramientas modernas que Deno proporciona, puedes crear APIs escalables y fáciles de mantener.