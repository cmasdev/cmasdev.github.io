---
layout: post
title: "Diseño de APIs escalables con Deno y TypeScript"
author: Christian Amado
date: 2025-01-15 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Deno,Typescript]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.jpg
---

El desarrollo de APIs escalables es un aspecto clave en la construcción de aplicaciones modernas. **Deno**, un runtime moderno para JavaScript y TypeScript, ofrece una serie de características que lo convierten en una excelente alternativa para la creación de APIs seguras y eficientes. En este artículo, exploraremos cómo diseñar una API REST escalable utilizando **Deno y TypeScript**, aplicando las mejores prácticas y optimizaciones.

<!--more-->

## 1. Introducción a Deno y sus Ventajas

### **¿Qué es Deno?**
Deno es un runtime para JavaScript y TypeScript creado por **Ryan Dahl**, el mismo creador de Node.js. Se diseñó para corregir deficiencias de Node.js y proporcionar un entorno más seguro y moderno.

### **Ventajas de Deno sobre Node.js**
- **Seguridad integrada**: Requiere permisos explícitos para acceder a archivos, red y variables de entorno.
- **Soporte nativo para TypeScript**: No necesita configuración adicional.
- **Gestión de dependencias sin `node_modules`**: Usa importaciones desde URLs.
- **Servidor HTTP eficiente**: Basado en el estándar `fetch`.

## 2. Configuración del Entorno de Desarrollo

### **Instalar Deno**
Para instalar Deno, ejecuta el siguiente comando en tu terminal:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Verifica la instalación:

```
deno --version
```

## 3. Creación de una API REST con Deno

### **3.1 Estructura del Proyecto**

Organizaremos el código de nuestra API de la siguiente manera:

```
/deno-api
│── /controllers
│   ├── userController.ts
│── /models
│   ├── userModel.ts
│── /routes
│   ├── userRoutes.ts
│── /middlewares
│   ├── authMiddleware.ts
│── server.ts
│── deps.ts
│── config.ts
```

### **3.2 Definir Dependencias (`deps.ts`)**

Deno no utiliza `package.json`, por lo que centralizamos las dependencias en un archivo `deps.ts`:

```
export { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
export { v4 } from "https://deno.land/std@0.194.0/uuid/mod.ts";
export { config } from "https://deno.land/x/dotenv/mod.ts";
```

### **3.3 Configurar el Servidor (`server.ts`)**

```
import { Application } from "./deps.ts";
import router from "./routes/userRoutes.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Servidor corriendo en http://localhost:8080");
await app.listen({ port: 8080 });
```

### **3.4 Definir el Modelo de Usuario (`models/userModel.ts`)**

```
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### **3.5 Crear el Controlador (`controllers/userController.ts`)**

```
import { Context, v4 } from "../deps.ts";
import { User } from "../models/userModel.ts";

let users: User[] = [];

export const getUsers = (ctx: Context) => {
  ctx.response.body = users;
};

export const createUser = async (ctx: Context) => {
  const { name, email } = await ctx.request.body().value;
  const newUser: User = { id: v4.generate(), name, email };
  users.push(newUser);
  ctx.response.status = 201;
  ctx.response.body = newUser;
};
```

### **3.6 Definir las Rutas (`routes/userRoutes.ts`)**

```
import { Router } from "../deps.ts";
import { getUsers, createUser } from "../controllers/userController.ts";

const router = new Router();
router.get("/users", getUsers);
router.post("/users", createUser);

export default router;
```

## 4. Implementación de Seguridad con Middleware

### **4.1 Middleware de Autenticación (`middlewares/authMiddleware.ts`)**

```
import { Context } from "../deps.ts";

export const authMiddleware = async (ctx: Context, next: Function) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Acceso no autorizado" };
    return;
  }
  await next();
};
```

### **4.2 Aplicación del Middleware en las Rutas**

```
import { authMiddleware } from "../middlewares/authMiddleware.ts";

router.get("/users", authMiddleware, getUsers);
router.post("/users", authMiddleware, createUser);
```

## 5. Optimización y Escalabilidad

### **5.1 Uso de Caching**
Deno permite usar Redis para mejorar el rendimiento:

```
import { connect } from "https://deno.land/x/redis/mod.ts";

const redis = await connect({ hostname: "127.0.0.1", port: 6379 });
```

### **5.2 Uso de WebSockets**
Para mejorar la escalabilidad, podemos utilizar WebSockets:

```
const listener = Deno.listen({ port: 8080 });
for await (const conn of listener) {
  handleConn(conn);
}
```

---

## 6. Despliegue de la API

### **6.1 Uso de Deno Deploy**
Deno ofrece un servicio de despliegue en la nube llamado **Deno Deploy**:

```
deno deploy --project my-deno-api server.ts
```

### **6.2 Despliegue en Docker**
Podemos usar Docker para desplegar nuestra API:

**Dockerfile:**

```
FROM denoland/deno:latest
WORKDIR /app
COPY . .
CMD ["run", "--allow-net", "server.ts"]
```

**Ejecutar el contenedor:**

```
docker build -t deno-api .
docker run -p 8080:8080 deno-api
```

## 7. Conclusión

Diseñar una API escalable con **Deno y TypeScript** proporciona seguridad, rendimiento y facilidad de despliegue. **Deno** ofrece un entorno moderno con ventajas significativas sobre Node.js, como la seguridad integrada y el soporte nativo para TypeScript.