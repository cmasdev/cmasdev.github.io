---
layout: post
title: "Migración de aplicaciones legacy a Deno"
author: Christian Amado
date: 2025-03-05 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Deno]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.jpg
---

La evolución de **Deno** hacia su versión 2 representa un paso firme hacia una experiencia de desarrollo más coherente, segura y moderna en el ecosistema **JavaScript** y **TypeScript**. Si bien Deno 1 ya ofrecía ventajas importantes frente a **Node.js**, **Deno 2** consolida su propuesta con cambios significativos en la gestión de módulos, configuración del entorno y compatibilidad con estándares web. Este artículo describe cómo migrar una aplicación legacy —ya sea desarrollada en Node.js o en Deno 1— hacia Deno 2, abordando los desafíos técnicos y proponiendo una estrategia ordenada de transición.

<!--more-->

## Requisitos previos

- Conocimientos sólidos en JavaScript o TypeScript.
- Familiaridad con la estructura y permisos de Deno.
- Deno 2 instalado en el entorno local ([https://deno.com/manual](https://deno.com/manual)).

## ¿Qué cambia en Deno 2?

Deno 2 introduce varias diferencias clave:

- **Import Maps por defecto.**
- **`deno.json` es el archivo de configuración estándar.**
- **Las tareas (`deno task`) tienen sintaxis simplificada.**
- **Permisos más restrictivos.**
- **Mejor soporte para estándares web, como `fetch`, `ReadableStream`, `WebSocket`, etc.**
- **Mayor compatibilidad con NPM mediante `npm:` imports.**

## Evaluar la aplicación legacy

Antes de migrar, es fundamental analizar:

- ¿Se utilizan módulos CommonJS (`require`)?
- ¿Qué dependencias NPM existen y son imprescindibles?
- ¿Qué estructura de carpetas y entrada (`index.js`/`app.ts`) se maneja?
- ¿Se usan scripts definidos en `package.json`?

## Migrar una app Node.js a Deno 2

Supongamos una app Express básica en Node.js:

```js
// index.js
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hola desde Node.js"));
app.listen(3000);
```

### Crear el proyecto en Deno 2

```bash
mkdir deno2-app
cd deno2-app
```

### Estructura del archivo principal

Crear `main.ts`:

```ts
import { serve } from "https://deno.land/std/http/mod.ts";

serve((_req) => new Response("Hola desde Deno 2"), { port: 8000 });
```

Ejecutar con:

```bash
deno run --allow-net main.ts
```

## Configurar `deno.json`

Deno 2 reconoce automáticamente el archivo `deno.json`:

```json
{
  "tasks": {
    "start": "deno run --allow-net main.ts",
    "test": "deno test"
  },
  "importMap": "import_map.json",
  "lint": {
    "rules": {
      "tags": ["recommended"]
    }
  }
}
```

## Usar frameworks modernos (como Oak)

Crear `import_map.json`:

```json
{
  "imports": {
    "oak/": "https://deno.land/x/oak@v12.6.0/"
  }
}
```

En `server.ts`:

```ts
import { Application, Router } from "oak/mod.ts";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Migrado a Deno 2";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Servidor en http://localhost:8000");
await app.listen({ port: 8000 });
```

## Uso de dependencias npm

Deno 2 permite importar directamente paquetes desde NPM:

```ts
import ora from "npm:ora";

const spinner = ora("Cargando...").start();
setTimeout(() => spinner.succeed("Listo!"), 2000);
```

> No se necesita `npm install`, ni `node_modules`.

## Migrar pruebas

Deno 2 mantiene su sistema nativo de pruebas:

```ts
// example_test.ts
import { assertEquals } from "https://deno.land/std/assert/mod.ts";

Deno.test("suma", () => {
  assertEquals(2 + 2, 4);
});
```

Ejecutar con:

```bash
deno task test
```

## Migrar tareas de `package.json` a `deno.json`

De:

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

A:

```json
{
  "tasks": {
    "start": "deno run --allow-net main.ts",
    "test": "deno test"
  }
}
```

## Despliegue con Deno Deploy

1. Subir el repositorio a GitHub.
2. Ir a [https://dash.deno.com](https://dash.deno.com).
3. Crear un nuevo proyecto.
4. Seleccionar el archivo de entrada (`main.ts` o `server.ts`).
5. Deno Deploy configura automáticamente los permisos y entorno.

## Consideraciones al migrar desde Deno 1

- Validar que las URLs de importación sigan funcionando con versiones recientes.
- Revisar `deno.jsonc` → ahora debe ser `deno.json`.
- Ajustar tareas (`deno task`) y permisos explícitos.
- Aprovechar el soporte nativo para `npm:` cuando sea necesario.

## Conclusión

Deno 2 mejora sustancialmente la experiencia de desarrollo al ofrecer una configuración más limpia, soporte oficial para paquetes NPM, tareas simplificadas y una mayor adherencia a los estándares web. Migrar una aplicación legacy a Deno 2 no solo permite modernizar la base de código, sino también adoptar un stack más seguro, modular y mantenible.

Ya sea partiendo de Node.js o de una versión anterior de Deno, el proceso de migración es más directo de lo que parece y trae consigo beneficios reales en rendimiento, organización del proyecto y experiencia de desarrollo.