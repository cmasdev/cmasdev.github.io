---
layout: post
title: "¿Cómo configurar un proyecto TypeScript moderno con Deno?"
author: Christian Amado
date: 2024-05-01 00:00:00 -0400
category: [Software Development]
tags: [Web Development, TypeScript, Deno]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.png
---

## Introducción

Configurar un proyecto moderno en **TypeScript** con **Deno** permitirá aprovechar un entorno de desarrollo optimizado, seguro y compatible con los estándares más recientes, como **ES2024**. Este artículo mostrará cómo realizar esta configuración tanto en **Visual Studio Code** como en **JetBrains Rider**, destacando buenas prácticas, incluyendo **testing** con TypeScript, y proporcionando ejemplos prácticos de código.

<!--more-->

## Prerrequisitos

- Instalar **Deno** desde [https://deno.land](https://deno.land):
  
```
  curl -fsSL https://deno.land/x/install/install.sh | sh
```

- Tener instalado Visual Studio Code o JetBrains Rider.
- Conocer los fundamentos de TypeScript.

## Crear la configuración del proyecto
### 1. Crear un directorio base
Crear un directorio para el proyecto:

```
mkdir modern-typescript-deno
cd modern-typescript-deno
```

### 2. Configurar el archivo deno.json
Crear un archivo deno.json con configuraciones básicas para ES2024 y definir tareas útiles:

```
{
  "compilerOptions": {
    "target": "ES2024",
    "strict": true,
    "lib": ["deno.ns", "deno.unstable"]
  },
  "tasks": {
    "start": "deno run --allow-net --allow-read src/index.ts",
    "test": "deno test"
  },
  "importMap": "./import_map.json"
}
```

Esto permite:

- Establecer ES2024 como objetivo del compilador.
- Definir tareas como start y test.
- Utilizar un archivo import_map.json para gestionar rutas.

## Configuración en Visual Studio Code
### Instalar la extensión de Deno
- Abrir Visual Studio Code.
- Buscar e instalar la extensión **Deno** desarrollada por Justjavac.

### Configurar Deno en el entorno
Crear un archivo **.vscode/settings.json** para habilitar Deno:

```
{
  "deno.enable": true,
  "deno.unstable": true,
  "editor.defaultFormatter": "denoland.vscode-deno",
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  }
}
```

## Conclusión
Configurar un proyecto TypeScript moderno con Deno utilizando **ES2024** ofrece un entorno potente y seguro. Tanto Visual Studio Code como JetBrains Rider proporcionan herramientas avanzadas para aprovechar las capacidades de Deno al máximo. Implementar estas configuraciones, buenas prácticas y pruebas garantiza un desarrollo eficiente y confiable.