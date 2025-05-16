---
layout: post
title: "Usando generics avanzados en TypeScript"
author: Christian Amado
date: 2025-02-19 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Typescript]
thumbnail-img: /img/posts/thumbnails/typescript.png
cover-img: /img/posts/cover/typescript.png
share_img: /img/posts/shared/typescript.jpg
---

**TypeScript** ofrece una potente funcionalidad llamada **Generics** que permite crear componentes y funciones altamente reutilizables y seguros en tiempo de compilación. Los **Generics avanzados** van más allá de lo básico y permiten escribir código flexible sin perder el tipado estricto.

En este artículo, exploraremos:
- Cómo funcionan los **Generics** en TypeScript.
- Uso de **restricciones (`extends`)**.
- Aplicación de **múltiples tipos genéricos**.
- Uso de **tipos condicionales y mapped types**.
- Casos prácticos en **funciones, clases e interfaces**.

<!--more-->

## 1. Introducción a Generics en TypeScript

Los **Generics** permiten escribir código reutilizable sin perder seguridad en el tipado. 

Ejemplo básico de una función genérica:

```
function identidad<T>(valor: T): T {
  return valor;
}

const numero = identidad<number>(42);
const texto = identidad<string>("Hola TypeScript");
```

Aquí, `T` representa un tipo genérico que será inferido por TypeScript en tiempo de ejecución.

## 2. Uso de Restricciones con `extends`

Podemos restringir los tipos que un **Generic** puede aceptar usando `extends`.

Ejemplo con restricción de objeto:

```
interface Persona {
  nombre: string;
  edad: number;
}

function mostrarNombre<T extends Persona>(obj: T): string {
  return obj.nombre;
}

const usuario = { nombre: "Carlos", edad: 30, rol: "Admin" };
console.log(mostrarNombre(usuario)); // Carlos
```

Aquí, `T` debe cumplir con la estructura de `Persona`, lo que garantiza que el objeto pasado tenga un `nombre`.

## 3. Uso de Múltiples Tipos Genéricos

Podemos definir múltiples tipos genéricos en una función o clase:

```
function combinar<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

const resultado = combinar<number, string>(42, "Hola");
console.log(resultado); // [42, 'Hola']
```

Este método permite combinar distintos tipos en un solo resultado sin perder la inferencia de tipos.

## 4. Uso de Tipos Condicionales (`Conditional Types`)

Los tipos condicionales permiten definir un tipo basado en otro.

```
type EsString<T> = T extends string ? "Es una cadena" : "No es una cadena";

type Caso1 = EsString<string>;  // "Es una cadena"
type Caso2 = EsString<number>;  // "No es una cadena"
```

Esto es útil para definir tipos que dependen de otros de manera flexible.

## 5. Uso de **Mapped Types** con Generics

Los **Mapped Types** permiten transformar tipos basados en un tipo genérico.

Ejemplo:

```
type Opcional<T> = {
  [K in keyof T]?: T[K];
};

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

type UsuarioOpcional = Opcional<Usuario>;

const user: UsuarioOpcional = { nombre: "Carlos" }; // Correcto
```

Este tipo genérico convierte todas las propiedades de `T` en opcionales.

## 6. Aplicación en Clases

Los Generics también son útiles en clases para manejar datos de forma estructurada.

```
class Caja<T> {
  private contenido: T;

  constructor(valor: T) {
    this.contenido = valor;
  }

  obtenerContenido(): T {
    return this.contenido;
  }
}

const cajaNumero = new Caja<number>(10);
console.log(cajaNumero.obtenerContenido()); // 10

const cajaTexto = new Caja<string>("Hola Mundo");
console.log(cajaTexto.obtenerContenido()); // Hola Mundo
```

Aquí, la clase `Caja<T>` puede almacenar cualquier tipo sin perder seguridad en el tipado.

## 7. Uso Avanzado con `keyof` y `in`

`keyof` nos permite trabajar con las claves de un objeto en TypeScript.

```
function obtenerValor<T, K extends keyof T>(obj: T, clave: K): T[K] {
  return obj[clave];
}

const usuario = { id: 1, nombre: "Carlos" };
console.log(obtenerValor(usuario, "nombre")); // Carlos
```

Aquí `K` solo puede ser una clave existente dentro de `T`, evitando errores en tiempo de compilación.

## 8. Conclusión

Los **Generics avanzados** en TypeScript permiten escribir código reutilizable, seguro y altamente flexible.