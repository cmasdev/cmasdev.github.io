---
layout: post
title: "Arquitectura limpia con Deno: estructuras escalables para proyectos open source"
author: Christian Amado
date: 2025-04-24 00:00:00 -0300
category: [Desarrollo de software]
tags: [Go,GitHub Star]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.webp
---

**Deno 2** ha consolidado su lugar como una plataforma moderna para el desarrollo backend, enfocada en seguridad, rendimiento y simplicidad. Sin embargo, aún existe el desafío de estructurar proyectos de forma escalable y mantenible, especialmente cuando se busca colaborar en comunidad. Este artículo explora cómo aplicar los principios de **Clean Architecture** en proyectos con **Deno 2**, creando un código desacoplado, testable y abierto a contribuciones.

<!--more-->

## Principios de Clean Architecture

Clean Architecture, propuesto por Robert C. Martin (Uncle Bob), se basa en separar responsabilidades y controlar la dirección de las dependencias. Su objetivo es crear sistemas mantenibles, independientes de frameworks y fácilmente testeables.

Los principios clave son:

- **Independencia de frameworks:** El core del sistema no depende de tecnologías externas.
- **Testabilidad:** Las reglas de negocio pueden probarse sin UI, base de datos o entorno externo.
- **Separación por capas:** Cada capa tiene su rol: `domain`, `application`, `infrastructure`, `interfaces`.
- **Dependencias hacia adentro:** Las capas externas pueden depender de las internas, pero nunca al revés.

## Organización del proyecto en Deno 2

### Estructura de carpetas sugerida:

```
project-root/
├── import_map.json
├── deps.ts
├── main.ts
├── domain/
│   ├── entities/
│   └── interfaces/
├── application/
│   └── use_cases/
├── infrastructure/
│   └── repositories/
├── interfaces/
│   └── http/
└── tests/
```

### Uso de `import_map.json`:

Permite evitar rutas relativas complejas:
```json
{
  "imports": {
    "@domain/": "./domain/",
    "@app/": "./application/",
    "@infra/": "./infrastructure/",
    "@http/": "./interfaces/http/"
  }
}
```

Luego, en tus módulos:
```ts
import { Task } from "@domain/entities/task.ts";
```

### Archivo `deps.ts`:
Centraliza tus dependencias externas para facilitar testing y actualizaciones:
```ts
export { Application, Router } from "https://deno.land/x/oak@12.6.1/mod.ts";
```

## Ejemplo práctico: API para gestión de tareas

### 1. Capa `domain`
```ts
// domain/entities/task.ts
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}
```

```ts
// domain/interfaces/task_repository.ts
import { Task } from "./task.ts";

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  save(task: Task): Promise<void>;
}
```

### 2. Capa `application`
```ts
// application/use_cases/get_all_tasks.ts
import { TaskRepository } from "@domain/interfaces/task_repository.ts";

export class GetAllTasks {
  constructor(private repo: TaskRepository) {}

  execute() {
    return this.repo.findAll();
  }
}
```

### 3. Capa `infrastructure`
```ts
// infrastructure/repositories/in_memory_task_repo.ts
import { Task } from "@domain/entities/task.ts";
import { TaskRepository } from "@domain/interfaces/task_repository.ts";

export class InMemoryTaskRepo implements TaskRepository {
  private tasks: Task[] = [];

  findAll(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }

  save(task: Task): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve();
  }
}
```

### 4. Capa `interfaces`
```ts
// interfaces/http/routes.ts
import { Router } from "../deps.ts";
import { InMemoryTaskRepo } from "@infra/repositories/in_memory_task_repo.ts";
import { GetAllTasks } from "@app/use_cases/get_all_tasks.ts";

const router = new Router();
const taskRepo = new InMemoryTaskRepo();
const getAllTasks = new GetAllTasks(taskRepo);

router.get("/tasks", async (ctx) => {
  const tasks = await getAllTasks.execute();
  ctx.response.body = tasks;
});

export default router;
```

```ts
// main.ts
import { Application } from "./deps.ts";
import router from "./interfaces/http/routes.ts";

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

## Testing por capas

Puedes testear sin depender del servidor HTTP ni de la base de datos:

```ts
// tests/get_all_tasks_test.ts
import { InMemoryTaskRepo } from "@infra/repositories/in_memory_task_repo.ts";
import { GetAllTasks } from "@app/use_cases/get_all_tasks.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("GetAllTasks devuelve una lista vacía al inicio", async () => {
  const repo = new InMemoryTaskRepo();
  const useCase = new GetAllTasks(repo);
  const result = await useCase.execute();
  assertEquals(result.length, 0);
});
```

## Buenas prácticas para proyectos open source

1. **README.md claro:** Explica la estructura, propósito y cómo contribuir.
2. **CONTRIBUTING.md:** Guía para pull requests, testeo y estándares.
3. **GitHub Actions:** Añade flujos CI con `deno lint`, `deno test`, `deno check`.
4. **Etiquetas y Issues bien definidas:** Ayuda a nuevos contribuidores.
5. **Uso de versiones específicas:** Siempre usa URLs con versiones fijas para evitar rupturas.

## Conclusión

Deno 2 facilita el desarrollo moderno, pero estructurar bien el código es clave para su crecimiento en proyectos reales. Clean Architecture ofrece una guía sólida para escalar, probar y colaborar en proyectos open source. Con esta base, no solo mejorarás la calidad de tus aplicaciones, sino que también te posicionás como un referente técnico dentro del ecosistema Deno.

¿Te interesa ver esta arquitectura aplicada en un proyecto real? Encontralo en el repositorio [github.com/tu-usuario/deno-clean-architecture](https://github.com/tu-usuario/deno-clean-architecture)