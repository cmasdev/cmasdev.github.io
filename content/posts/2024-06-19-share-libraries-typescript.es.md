---
layout: post
title: "Creación de librerías compartidas en TypeScript"
author: Christian Amado
date: 2024-06-19 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, Typescript]
thumbnail-img: /img/posts/thumbnails/typescript.png
cover-img: /img/posts/cover/typescript.png
share_img: /img/posts/shared/typescript.png
---

La creación de librerías compartidas en **TypeScript** permite a los desarrolladores encapsular funcionalidad reutilizable y mejorar la mantenibilidad del código. Este artículo explorará el proceso completo de desarrollo de librerías en **TypeScript**, desde la configuración inicial hasta el despliegue, con un enfoque moderno, ejemplos prácticos y consideraciones de seguridad.

<!--more-->

## ¿Por qué crear librerías compartidas en TypeScript?
### Beneficios principales
1. **Reutilización de código**: Evita la duplicación en diferentes proyectos.
2. **Mantenibilidad**: Centraliza la gestión de funcionalidades comunes.
3. **Escalabilidad**: Facilita la integración con nuevos proyectos.
4. **Colaboración**: Permite a los equipos trabajar en conjunto sobre componentes centrales.

## Configuración inicial
### Requisitos previos
- Tener Node.js y npm instalados.
- Familiaridad con TypeScript.

### Crear un nuevo proyecto de librería
1. Crea un directorio para la librería:
   ```
   mkdir my-shared-library
   cd my-shared-library
   ```
2. Inicializa un proyecto Node.js:
   ```
   npm init -y
   ```
3. Instala TypeScript y otras dependencias necesarias:
   ```
   npm install typescript --save-dev
   npm install tslib
   ```
4. Crea una configuración base de TypeScript:
   ```
   npx tsc --init
   ```

### Configurar `tsconfig.json`
Configura el archivo para soportar módulos comunes y optimizar la compilación:
```
{
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "target": "ES2020",
    "module": "CommonJS",
    "declaration": true,
    "sourceMap": true,
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Estructura del proyecto
Organiza los archivos de tu proyecto:
```
my-shared-library/
├── src/
│   ├── index.ts
│   ├── utils/
│   │   └── math.ts
├── dist/
├── package.json
├── tsconfig.json
└── README.md
```
## Desarrollo de la librería
### Crear funcionalidades
#### Ejemplo: Operaciones matemáticas
Archivo: `src/utils/math.ts`

```
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}
```

#### Archivo de entrada principal
Archivo: `src/index.ts`
```
export * from './utils/math';
```

## Compilación de la librería
1. Compila el código:
   ```
   npx tsc
   ```
2. Verifica que los archivos se generaron en el directorio `dist/`.

## Publicación de la librería
### Configurar `package.json`
Asegúrate de incluir los campos necesarios para npm:
```
{
  "name": "my-shared-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "tslib": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^4.0.0"
  }
}
```
### Publicar en npm
1. Inicia sesión en npm:
   ```
   npm login
   ```
2. Publica la librería:
   ```
   npm publish
   ```

## Uso de la librería en otros proyectos
1. Instala la librería:
   ```
   npm install my-shared-library
   ```
2. Usa las funciones en tu código:

   ```
   import { add, subtract } from 'my-shared-library';

   console.log(add(2, 3)); // 5
   console.log(subtract(5, 2)); // 3
   ```

## Buenas prácticas
1. **Documentación**:
   - Usa `README.md` para describir la instalación, uso y ejemplos.
2. **Pruebas unitarias**:
   - Configura un framework como Jest para validar el comportamiento de la librería.
3. **Versionado semántico**:
   - Sigue el esquema `MAJOR.MINOR.PATCH` para gestionar cambios.
4. **Optimizar el tamaño**:
   - Excluye archivos innecesarios en el campo `files` de `package.json`.
5. **Seguridad**:
   - Actualiza dependencias regularmente y realiza auditorías con:
     ```
     npm audit
     ```

## Conclusión
Crear librerías compartidas en TypeScript es una estrategia efectiva para mejorar la reutilización de código y aumentar la productividad del equipo. Siguiendo las mejores prácticas y adoptando herramientas modernas, puedes garantizar que tus librerías sean seguras, eficientes y fáciles de usar. ¡Empieza a construir tu próxima librería hoy mismo!
