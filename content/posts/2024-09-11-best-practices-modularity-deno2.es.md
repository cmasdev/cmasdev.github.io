---
layout: post
title: "Mejores prácticas de modularidad con Deno 2"
author: Christian Amado
date: 2024-09-11 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Deno,GitHub]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.png
---

**Deno 2** ha revolucionado el desarrollo con **JavaScript** y **TypeScript** al proporcionar un entorno moderno, seguro y modular. Su sistema de importación basado en URL y su soporte nativo para **TypeScript** facilitan la creación de aplicaciones bien estructuradas y mantenibles. En este artículo, exploraremos las mejores prácticas para lograr modularidad en proyectos con **Deno 2**.

<!--more-->

## 1. Introducción a la modularidad en Deno 2

La modularidad se refiere a dividir un programa en componentes más pequeños e independientes. En **Deno 2**, cada archivo actúa como un módulo independiente, importado y exportado mediante URLs. Esto elimina la necesidad de gestores de paquetes como npm y fomenta un enfoque más directo para manejar dependencias.

### Ventajas de la modularidad en Deno 2
- **Mantenibilidad:** El código está organizado y es fácil de entender.
- **Reutilización:** Los módulos pueden reutilizarse en diferentes proyectos.
- **Escalabilidad:** Es más fácil agregar nuevas funcionalidades.
- **Colaboración:** Los equipos pueden trabajar en diferentes módulos de forma independiente.

## 2. Estructura de carpetas recomendada

Una estructura de carpetas bien organizada es esencial para la modularidad. Una configuración recomendada para proyectos en Deno es:

```
project/
├── src/
│   ├── controllers/
│   │   └── userController.ts
│   ├── services/
│   │   └── userService.ts
│   ├── utils/
│   │   └── logger.ts
│   └── deps.ts
├── tests/
│   └── userService_test.ts
├── mod.ts
└── README.md
```

- **`src/`**: Contiene el código principal de la aplicación.
- **`deps.ts`**: Centraliza las dependencias externas.
- **`tests/`**: Almacena los archivos de prueba.
- **`mod.ts`**: Archivo principal que expone los módulos necesarios.

## 3. Uso de deps.ts para centralizar dependencias

En Deno, es común utilizar un archivo `deps.ts` para centralizar todas las dependencias externas, lo que facilita su gestión y actualización.

### Ejemplo de deps.ts
```
export { Application, Router } from "https://deno.land/x/oak/mod.ts";
export { assertEquals } from "https://deno.land/std/testing/asserts.ts";
export { config } from "https://deno.land/x/dotenv/mod.ts";
```

### Uso en un módulo
```
import { Application, Router } from "../deps.ts";

const app = new Application();
const router = new Router();

router.get("/", (context) => {
  context.response.body = "Hello, Deno!";
});

app.use(router.routes());
app.listen({ port: 8000 });
```

## 4. Importaciones y exportaciones claras

Las importaciones y exportaciones claras mejoran la legibilidad del código.

### Exportaciones nombradas
Prefiere exportar funciones y clases de manera nombrada:
```
// logger.ts
export function logInfo(message: string): void {
  console.log(`[INFO]: ${message}`);
}
```

### Importaciones claras
Importa solo lo necesario para evitar confusión:
```
import { logInfo } from "./utils/logger.ts";

logInfo("Application started");
```

## 5. Modularización de funcionalidades

### Servicios
Los servicios encapsulan la lógica de negocio.

```
// userService.ts
export async function getUsers(): Promise<Array<User>> {
  return [{ id: 1, name: "John Doe" }];
}
```

### Controladores
Los controladores gestionan las solicitudes HTTP.

```
// userController.ts
import { Router } from "../deps.ts";
import { getUsers } from "../services/userService.ts";

const router = new Router();

router.get("/users", async (context) => {
  context.response.body = await getUsers();
});

export default router;
```

### Utilidades
Las utilidades ofrecen funciones auxiliares reutilizables.

```
// logger.ts
export function logError(message: string): void {
  console.error(`[ERROR]: ${message}`);
}
```

## 6. Testing modular

Deno incluye soporte integrado para pruebas, lo que facilita el desarrollo modular.

### Ejemplo de prueba
```
import { getUsers } from "../src/services/userService.ts";
import { assertEquals } from "../src/deps.ts";

deno.test("getUsers devuelve una lista de usuarios", async () => {
  const users = await getUsers();
  assertEquals(users.length, 1);
  assertEquals(users[0].name, "John Doe");
});
```

## 7. Ejemplo práctico: API REST modular

### Estructura del proyecto
```
project/
├── src/
│   ├── controllers/
│   │   └── userController.ts
│   ├── services/
│   │   └── userService.ts
│   ├── deps.ts
│   └── mod.ts
├── tests/
│   └── userService_test.ts
└── README.md
```

### mod.ts
Archivo principal que inicia la aplicación:

```
import { Application } from "./deps.ts";
import userRouter from "./controllers/userController.ts";

const app = new Application();
app.use(userRouter.routes());

console.log("Server running on http://localhost:8000");
app.listen({ port: 8000 });
```

## 8. Conclusión

La modularidad en **Deno 2** no solo mejora la organización del código, sino que también facilita la escalabilidad y mantenibilidad de los proyectos. Al seguir las mejores prácticas descritas, como centralizar dependencias, usar importaciones claras y escribir pruebas modulares, puedes garantizar que tus aplicaciones sean robustas y fáciles de gestionar a medida que crecen.