---
layout: post
title: "Mocks, cobertura y pruebas por capas en proyectos escalables"
author: Christian Amado
date: 2025-05-02 00:00:00 -0300
category: [Desarrollo de software]
tags: [Deno,GitHub Star]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.webp
---

En el ecosistema moderno del desarrollo backend, el testing no es opcional: es esencial. En proyectos colaborativos y escalables, contar con pruebas automatizadas bien estructuradas marca la diferencia entre un código confiable y uno frágil. Deno 2 ofrece herramientas nativas poderosas para testear, pero muchas veces su uso avanzado no está del todo documentado. Este artículo muestra cómo implementar un enfoque de testing avanzado en Deno 2, incluyendo mocks manuales, cobertura de código y organización por capas.

<!--more-->

## ¿Por qué testear en Deno 2?

Deno 2 cuenta con un sistema de testing nativo muy sólido:
- Sintaxis clara para definir y ejecutar tests.
- Aislamiento automático de cada test.
- Herramientas para cobertura de código (`deno coverage`).
- Posibilidad de testear sin librerías externas.

Esto permite aplicar testing por capas y simular distintos escenarios sin introducir dependencias innecesarias.

## Tipos de pruebas por capa

### ✅ Pruebas unitarias
Se enfocan en una función o clase específica, con dependencias simuladas.

### 🔄 Pruebas de integración
Verifican cómo interactúan varios componentes entre sí, sin tocar la capa HTTP.

### 🌐 Pruebas end-to-end (E2E)
Simulan una petición real, verificando el comportamiento de la aplicación de punta a punta.

## Organización recomendada de carpetas

```
tests/
├── unit/
│   └── get_all_tasks_test.ts
├── integration/
│   └── task_repository_test.ts
└── e2e/
    └── api_tasks_test.ts
```

Esto permite escalar los tests de forma ordenada y mantener una separación lógica.

## Mocks en Deno 2 sin librerías externas

Deno permite crear mocks fácilmente utilizando clases o funciones anónimas. Ejemplo:

```ts
// Mock de TaskRepository
class MockTaskRepo {
  private tasks = [{ id: "1", title: "Test", completed: false }];

  findAll() {
    return Promise.resolve(this.tasks);
  }
}
```

Uso en el test:
```ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { GetAllTasks } from "@app/use_cases/get_all_tasks.ts";

Deno.test("Devuelve tareas del repositorio mockeado", async () => {
  const repo = new MockTaskRepo();
  const useCase = new GetAllTasks(repo);
  const result = await useCase.execute();
  assertEquals(result.length, 1);
});
```

## Simulación de errores

También podés simular excepciones:
```ts
class FailingRepo {
  findAll() {
    throw new Error("DB unavailable");
  }
}

Deno.test("Manejo de error en repositorio", () => {
  const useCase = new GetAllTasks(new FailingRepo());
  try {
    useCase.execute();
  } catch (e) {
    assertEquals(e.message, "DB unavailable");
  }
});
```

## Cobertura de código en Deno 2

### 1. Ejecutar tests con cobertura:
```bash
deno test --coverage=coverage/
```

### 2. Generar informe legible:
```bash
deno coverage coverage/ --lcov > coverage.lcov
```

### 3. Ver informe HTML:
```bash
genhtml coverage.lcov -o coverage_html
```

Podés usar [genhtml](https://manpages.debian.org/testing/lcov/genhtml.1.en.html) desde `lcov` (requiere instalación externa).

## Automatización con GitHub Actions

Un flujo simple para ejecutar los tests y verificar la cobertura:

```yaml
name: test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v2.x
      - name: Run Tests
        run: deno test --coverage=coverage/
```

También podés subir la cobertura a [coveralls.io](https://coveralls.io/) o [codecov.io](https://about.codecov.io/) si querés seguimiento continuo.

## Buenas prácticas

- ✅ Nombrar tests descriptivamente.
- ✅ Mantener las dependencias mínimas.
- ✅ Testear cada capa por separado.
- ✅ Usar import maps para simplificar imports.
- ✅ Evitar testear implementaciones internas.

## Conclusión

Con **Deno 2**, tenés todo lo necesario para aplicar pruebas por capas, cobertura de código y mocks sin dependencias externas. Adoptar estas prácticas no solo mejora la calidad de tu software, sino que también facilita la colaboración en proyectos open source.