---
layout: post
title: "Testing en Deno: Estrategias para Aplicaciones Grandes"
author: Christian Amado
date: 2024-11-13 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, Deno]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.png
---

El desarrollo de aplicaciones grandes con **Deno** requiere un enfoque sólido en **pruebas automatizadas** para garantizar su estabilidad y escalabilidad. Deno ofrece un sistema de testing integrado con herramientas modernas que facilitan la escritura y ejecución de pruebas unitarias, de integración y funcionales. 

En este artículo, exploraremos las **estrategias para testing en Deno**, incluyendo fundamentos teóricos, mejores prácticas y ejemplos de código para aplicaciones a gran escala.

<!--more-->

## ¿Por qué es importante el testing en Deno?

A medida que una aplicación crece, es fundamental contar con un **sistema de pruebas eficiente** para evitar regresiones y asegurar que cada módulo funcione correctamente. Las pruebas en Deno permiten:

- **Detectar errores temprano** antes de que lleguen a producción.
- **Automatizar la validación** de funcionalidades clave.
- **Facilitar la refactorización** sin comprometer la estabilidad.
- **Asegurar la compatibilidad** entre módulos y servicios externos.

## Configuración del Entorno de Pruebas en Deno

Deno tiene soporte nativo para testing sin necesidad de librerías externas. Podemos ejecutar pruebas con:

```
deno test --allow-net --allow-read
```

### **1. Estructura de pruebas en un proyecto grande**

Para organizar nuestras pruebas en aplicaciones grandes, podemos seguir esta estructura:

```
/project
│── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│── deps.ts
│── mod.ts
```

Las pruebas deben dividirse en:
- **Unitarias**: Validan la lógica de funciones individuales.
- **Integración**: Aseguran que múltiples módulos funcionen juntos correctamente.
- **End-to-End (E2E)**: Simulan el comportamiento del usuario y prueban la aplicación completa.

## Pruebas Unitarias en Deno

Las **pruebas unitarias** son fundamentales para validar funciones y módulos individuales. Supongamos que tenemos un servicio `math.ts`:

```
export function suma(a: number, b: number): number {
    return a + b;
}
```

Podemos escribir una prueba unitaria en `tests/unit/math.test.ts`:

```
import { assertEquals } from "https://deno.land/std@0.194.0/testing/asserts.ts";
import { suma } from "../../src/services/math.ts";

Deno.test("suma debe retornar la suma de dos números", () => {
    assertEquals(suma(2, 3), 5);
    assertEquals(suma(-1, 1), 0);
});
```

Ejecutamos la prueba:
```
deno test tests/unit/math.test.ts
```

## Pruebas de Integración en Deno

Las **pruebas de integración** validan la comunicación entre diferentes módulos o servicios. Supongamos que tenemos un servicio que interactúa con una base de datos:

### **1. Servicio de usuarios `userService.ts`**

```
import { User } from "../models/user.ts";

export class UserService {
    private users: User[] = [];

    addUser(user: User): void {
        this.users.push(user);
    }

    getUsers(): User[] {
        return this.users;
    }
}
```

### **2. Prueba de integración `tests/integration/userService.test.ts`**

```
import { assertEquals } from "https://deno.land/std@0.194.0/testing/asserts.ts";
import { UserService } from "../../src/services/userService.ts";

Deno.test("UserService debe agregar y recuperar usuarios", () => {
    const service = new UserService();
    service.addUser({ id: "1", name: "Carlos" });
    
    const users = service.getUsers();
    assertEquals(users.length, 1);
    assertEquals(users[0].name, "Carlos");
});
```

Ejecutamos:
```bash
deno test tests/integration/userService.test.ts
```

## Pruebas End-to-End (E2E) en Deno

Las **pruebas E2E** evalúan la aplicación completa simulando interacciones de usuario. Utilizaremos **Deno y Oak** para probar una API REST.

### **1. Configurar un servidor API con Oak**

```
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router.get("/ping", (ctx) => {
    ctx.response.body = { message: "pong" };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

### **2. Prueba E2E para la API**

```
import { assertEquals } from "https://deno.land/std@0.194.0/testing/asserts.ts";

Deno.test("La API debe responder con pong", async () => {
    const response = await fetch("http://localhost:8000/ping");
    const data = await response.json();
    assertEquals(data.message, "pong");
});
```

Ejecutamos la prueba:
```
deno test tests/e2e/api.test.ts --allow-net
```

## Estrategias para Testing en Aplicaciones Grandes

Para aplicaciones grandes, es importante seguir estas estrategias:

### **1. Uso de Mocks y Stubs**
Para evitar dependencias innecesarias en pruebas unitarias, podemos utilizar mocks:

```
import { assertEquals } from "https://deno.land/std@0.194.0/testing/asserts.ts";
import { spy } from "https://deno.land/x/mock/mod.ts";

const mockFunction = spy(() => "mock response");
assertEquals(mockFunction(), "mock response");
```

### **2. Pruebas en Paralelo**
Deno permite ejecutar pruebas en paralelo para mejorar el rendimiento:

```
Deno.test("Prueba 1", async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log("Prueba 1 completada");
});

Deno.test("Prueba 2", async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log("Prueba 2 completada");
});
```

## Conclusión

El **testing en Deno** es una parte esencial del desarrollo de aplicaciones grandes. Implementar **pruebas unitarias, de integración y E2E** permite mejorar la calidad y fiabilidad del código. 

Siguiendo estas estrategias y buenas prácticas, podemos asegurar que nuestras aplicaciones en Deno sean **más estables, escalables y fáciles de mantener**.