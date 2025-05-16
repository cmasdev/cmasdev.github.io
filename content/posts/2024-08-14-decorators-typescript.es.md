---
layout: post
title: "Decoradores avanzados en TypeScript: Mejora tu código"
author: Christian Amado
date: 2024-08-14 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Typescript]
thumbnail-img: /img/posts/thumbnails/typescript.png
cover-img: /img/posts/cover/typescript.png
share_img: /img/posts/shared/typescript.png
---

Los decoradores son una característica poderosa y avanzada de **TypeScript** que permiten modificar el comportamiento de clases, métodos, propiedades y parámetros de una forma declarativa. Son ampliamente utilizados en frameworks como Angular, pero también pueden emplearse en proyectos personalizados para mejorar la reutilización y la claridad del código. En este artículo exploraremos los decoradores avanzados en **TypeScript**, sus usos más comunes, cómo crearlos desde cero, y las mejores prácticas para implementarlos.

<!--more-->

## Introducción a los decoradores

### ¿Qué son los decoradores?

Un decorador es una función especial que puede adjuntarse a una clase, método, accesor, propiedad o parámetro. Proporcionan una forma de agregar meta-programación a tu código, es decir, modificar su comportamiento sin cambiar su estructura básica.

### Tipos de decoradores en TypeScript

1. **Decoradores de clases**:
   - Aplicados a clases completas para modificar su estructura o comportamiento.
2. **Decoradores de métodos**:
   - Aplicados a métodos de clase para interceptar, modificar o registrar su ejecución.
3. **Decoradores de propiedades**:
   - Aplicados a propiedades de clase para añadir lógica adicional al acceso o modificación del valor.
4. **Decoradores de parámetros**:
   - Aplicados a parámetros de métodos para realizar validaciones o registrar su uso.

### Habilitar decoradores en TypeScript

Para usar decoradores, es necesario habilitar la opción `experimentalDecorators` en el archivo `tsconfig.json`:

```
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

## Decoradores de clases

Un decorador de clase se aplica a la definición de una clase completa. Es ideal para añadir funcionalidades transversales como registros o validaciones.

### Ejemplo básico

```
function LogClass(target: Function) {
  console.log(`Clase decorada: ${target.name}`);
}

@LogClass
class MyClass {
  constructor() {
    console.log('Instancia creada');
  }
}

const instance = new MyClass();
```

#### Resultado

```
Clase decorada: MyClass
Instancia creada
```

### Uso avanzado: Agregar metadatos

```
function AddMetadata(metadata: any) {
  return function (target: Function) {
    target.prototype.metadata = metadata;
  };
}

@AddMetadata({ role: 'admin', permissions: ['read', 'write'] })
class User {}

const user = new User();
console.log(user['metadata']);
```

## Decoradores de métodos

Permiten interceptar y modificar la ejecución de un método. Esto es útil para agregar registros, manejo de errores o validaciones.

### Ejemplo: Registro de ejecución

```
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Método ejecutado: ${propertyKey}, con argumentos: ${args}`);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
```

#### Resultado

```
Método ejecutado: add, con argumentos: 2,3
```

## Decoradores de propiedades

Permiten personalizar el comportamiento de las propiedades de clase, por ejemplo, agregando validaciones o valores predeterminados.

### Ejemplo: Validar propiedades

```
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    let value: string;

    Object.defineProperty(target, propertyKey, {
      get: () => value,
      set: (newValue: string) => {
        if (newValue.length < length) {
          throw new Error(`La longitud mínima de ${propertyKey} es ${length}`);
        }
        value = newValue;
      },
    });
  };
}

class User {
  @MinLength(5)
  username: string;
}

const user = new User();
user.username = 'John'; // Error: La longitud mínima de username es 5
```

## Decoradores de parámetros

Estos decoradores son útiles para realizar validaciones en los parámetros de métodos.

### Ejemplo: Validación de parámetros

```
function Validate(target: any, propertyKey: string, parameterIndex: number) {
  const existingRequiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata('required', existingRequiredParameters, target, propertyKey);
}

class OrderService {
  processOrder(@Validate orderId: string) {
    console.log(`Procesando orden: ${orderId}`);
  }
}
```

## Buenas prácticas con decoradores

1. **Mantén los decoradores reutilizables**:
   - Diseña decoradores genéricos que puedan ser aplicados en múltiples contextos.
2. **Evita la lógica compleja**:
   - Mantén los decoradores simples y delega la lógica compleja a otras partes del código.
3. **Documenta los decoradores**:
   - Proporciona descripciones claras sobre el propósito y uso de cada decorador.
4. **Combina decoradores con metadatos**:
   - Usa bibliotecas como `reflect-metadata` para almacenar y acceder a metadatos en tiempo de ejecución.
5. **Prueba los decoradores**:
   - Escribe pruebas unitarias para garantizar que los decoradores funcionen correctamente en diferentes escenarios.

## Conclusión

Los decoradores en TypeScript son una herramienta poderosa que puede transformar la forma en que organizas y escribes tu código. Desde agregar metadatos hasta interceptar métodos y propiedades, ofrecen una manera elegante y declarativa de manejar lógica transversal. Siguiendo las buenas prácticas y explorando casos de uso avanzados, puedes aprovechar al máximo esta característica y llevar tu desarrollo TypeScript al siguiente nivel.
