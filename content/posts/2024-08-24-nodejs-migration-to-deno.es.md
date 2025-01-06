---
layout: post
title: "Migración de Node.js a Deno: Caso práctico"
author: Christian Amado
date: 2024-08-24 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Deno,Typescript,Node.js]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.png
---

En los últimos años, **Deno** ha emergido como una alternativa moderna a **Node.js**. Desarrollado por el mismo creador de **Node.js**, **Deno** busca abordar algunas de las limitaciones y problemas de diseño que han surgido con **Node.js** a lo largo del tiempo. Este artículo presenta un caso práctico detallado sobre cómo migrar una aplicación existente de **Node.js** a **Deno**, destacando las diferencias clave, los desafíos y las soluciones.

<!--more-->

## 1. Introducción a Deno y sus ventajas

**Deno** es un runtime moderno para **JavaScript** y **TypeScript** basado en **V8** y **Rust**. Se diferencia de **Node.js** por su enfoque en la seguridad, su soporte nativo para **TypeScript** y su sistema de módulos sin un administrador de paquetes como *npm*.

### Ventajas principales de Deno:
- **Seguridad por diseño:** Deno ejecuta código en un sandbox, lo que significa que no tiene acceso a archivos, red o variables de entorno sin permisos explícitos.
- **Soporte nativo para TypeScript:** No se necesita configuración adicional para usar TypeScript.
- **Gestor de módulos simplificado:** Deno utiliza URLs para importar módulos, eliminando la necesidad de un archivo `package.json`.
- **Ecosistema moderno:** Con un enfoque en el desarrollo moderno, Deno integra herramientas como un linter y formateador.

## 2. Preparativos para la migración

### Requisitos previos
Antes de comenzar la migración, asegúrate de tener lo siguiente:
- Conocimiento básico de TypeScript.
- Acceso al código fuente de la aplicación Node.js.
- Deno instalado. Puedes instalarlo siguiendo la [documentación oficial](https://deno.land/manual@v1.0.0/getting_started/installation).

### Configuración del entorno
1. **Instalar Deno:**
   ```
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Configurar el editor:** Si usas VS Code, instala la extensión oficial de Deno.

3. **Revisar dependencias existentes:** Enumera todas las dependencias utilizadas en tu proyecto de Node.js para planificar su equivalencia en Deno.

## 3. Diferencias clave entre Node.js y Deno

| Característica               | Node.js                          | Deno                            |
|------------------------------|-----------------------------------|---------------------------------|
| Sistema de módulos           | CommonJS/ESM                     | ESM por defecto                |
| Gestor de paquetes           | npm/yarn                         | No tiene (usa URLs)            |
| Soporte para TypeScript      | Configuración adicional requerida | Soporte nativo                 |
| Seguridad                    | Sin restricciones                | Requiere permisos explícitos   |
| Herramientas integradas      | No                               | Linter, formateador, test runner |

## 4. Migrando una aplicación paso a paso

### Caso práctico: API REST
Migraré una API REST básica en Node.js a Deno. La API utiliza Express y accede a una base de datos.

#### Estructura original en Node.js:
```
project/
├── package.json
├── src/
│   ├── index.js
│   ├── routes/
│   │   └── users.js
│   ├── controllers/
│   │   └── userController.js
│   └── db/
│       └── connection.js
└── tests/
    └── user.test.js
```

#### Paso 1: Migración de módulos
Deno no utiliza npm. En su lugar, los módulos se importan directamente desde URLs.

- En Node.js:
   ```
   const express = require('express');
   const app = express();
   ```

- En Deno:
   ```
   import { Application } from "https://deno.land/x/oak/mod.ts";
   const app = new Application();
   ```

#### Paso 2: Migración del código
Deno utiliza `async`/`await` de forma nativa para operaciones de red y archivo.

- Ejemplo: Middleware para JSON en Node.js:
   ```
   const express = require('express');
   const app = express();
   app.use(express.json());
   ```

- Equivalente en Deno:
   ```
   import { Application } from "https://deno.land/x/oak/mod.ts";
   const app = new Application();

   app.use(async (ctx, next) => {
       if (ctx.request.hasBody) {
           const body = await ctx.request.body().value;
           ctx.state.body = body;
       }
       await next();
   });
   ```

#### Paso 3: Manejo de dependencias
En lugar de `package.json`, Deno recomienda usar un archivo `deps.ts` para centralizar los módulos importados:

```
export { Application } from "https://deno.land/x/oak/mod.ts";
```

#### Paso 4: Ajustes en pruebas
Deno incluye un test runner integrado:

- Prueba en Node.js (Jest):
   ```j
   test('should return all users', async () => {
       const res = await request(app).get('/users');
       expect(res.status).toBe(200);
   });
   ```

- Equivalente en Deno:
   ```
   import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

   Deno.test("should return all users", async () => {
       const res = await fetch("http://localhost:8000/users");
       assertEquals(res.status, 200);
   });
   ```

## 5. Buenas prácticas para la migración

1. **Iniciar con módulos pequeños:** Identifica partes autónomas del proyecto que puedan migrarse de manera independiente.
2. **Usar herramientas integradas:** Aprovecha el formateador (`deno fmt`) y linter (`deno lint`) integrados para mantener un código limpio.
3. **Revisar permisos:** Configura correctamente los permisos que tu aplicación necesita con `--allow-*`.
4. **Documentar el proceso:** Mantén un registro de cambios y problemas encontrados para futuras migraciones.

## 6. Conclusión y aprendizajes

Migrar de **Node.js** a **Deno** requiere un cambio de mentalidad debido a sus diferencias fundamentales. Sin embargo, **Deno** ofrece un entorno más seguro, moderno y simplificado que puede resultar beneficioso a largo plazo. Este caso práctico demuestra que, aunque la migración puede ser desafiante, las herramientas y características de **Deno** hacen que valga la pena el esfuerzo.