---
layout: post
title: "Creación de microservicios con Deno y Azure Functions"
author: Christian Amado
date: 2024-07-24 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Deno,Azure]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.jpg
---

En el mundo moderno del desarrollo de software, los microservicios han revolucionado la forma de construir y desplegar aplicaciones escalables. Al combinar **Deno**, una plataforma de runtime moderna basada en **JavaScript** y **TypeScript**, con **Azure Functions**, una solución serverless flexible de **Microsoft**, los desarrolladores pueden crear microservicios rápidos, seguros y eficientes. Este artículo te guiará paso a paso en el proceso de crear microservicios utilizando estas tecnologías, destacando buenas prácticas, ejemplos prácticos y el uso de **Visual Studio Code** como herramienta principal.

<!--more-->

## Introducción a los microservicios

### ¿Qué son los microservicios?

Los microservicios son un estilo arquitectónico que divide las aplicaciones en servicios independientes, cada uno responsable de una funcionalidad específica. Estos servicios se comunican entre sí mediante protocolos ligeros como **HTTP** o **gRPC**.

### Beneficios de los microservicios

1. **Escalabilidad independiente**: Cada microservicio puede escalarse según sus necesidades.
2. **Facilidad de despliegue**: Permite actualizar y desplegar partes de la aplicación sin afectar al sistema completo.
3. **Mantenibilidad**: Facilita la organización del código y la colaboración en equipos grandes.


## Introducción a Deno y Azure Functions

### ¿Qué es Deno?

Deno es un runtime para JavaScript y TypeScript creado por Ryan Dahl, el creador de Node.js. Algunas de sus principales características incluyen:

- **Seguridad**: Permisos de ejecución para controlar el acceso a archivos, redes y entornos.
- **Soporte nativo de TypeScript**.
- **Gestor de dependencias integrado**: No requiere archivos como `package.json`.
- **APIs modernas**: Inspiradas en las especificaciones del navegador.

### ¿Qué es Azure Functions?

Azure Functions es un servicio serverless que permite ejecutar código en la nube sin necesidad de gestionar infraestructura. Ofrece:

- **Ejecución bajo demanda**: Facturación basada en el tiempo de ejecución.
- **Integraciones nativas**: Con Azure Blob Storage, Cosmos DB y otros servicios.
- **Compatibilidad con varios lenguajes**: Como JavaScript, Python, C# y TypeScript.


## Configuración del entorno

### Requisitos previos

1. **Instalar Deno**:
   ```
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```
2. **Instalar Azure Functions Core Tools**:
   ```
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```
3. **Instalar Visual Studio Code**.
4. **Configurar la extensión de Azure Functions en VS Code**.

### Crear un nuevo proyecto con Azure Functions

1. Crea un directorio para tu proyecto:
   ```
   mkdir microservices-deno
   cd microservices-deno
   ```
2. Inicializa un nuevo proyecto:
   ```
   func init --worker-runtime custom --language typescript
   ```
3. Agrega una nueva función HTTP:
   ```
   func new --template "HTTP trigger" --name MyMicroservice
   ```

## Crear un microservicio con Deno y Azure Functions

### Configuración inicial

1. Modifica el archivo `MyMicroservice/index.ts` para usar Deno:
   ```
   import { serve } from "https://deno.land/std@0.152.0/http/server.ts";

   serve(async (req) => {
       const url = new URL(req.url);
       if (url.pathname === "/api/MyMicroservice") {
           return new Response("Hello from Deno and Azure Functions!", {
               status: 200,
               headers: { "Content-Type": "text/plain" },
           });
       }
       return new Response("Not Found", { status: 404 });
   });
   ```

2. Configura los permisos necesarios en el archivo `deno.json`:
   ```
   {
       "tasks": {
           "start": "deno run --allow-net index.ts"
       }
   }
   ```

### Probar el microservicio localmente

1. Ejecuta la función localmente:
   ```
   func start
   ```
2. Accede a la URL generada, como `http://localhost:7071/api/MyMicroservice`.

## Despliegue en Azure

### Paso 1: Inicia sesión en Azure
```
az login
```

### Paso 2: Crear un recurso de Azure Functions

```
az functionapp create --resource-group MyResourceGroup --consumption-plan-location eastus --runtime custom --functions-version 4 --name MyDenoFunctionApp --storage-account MyStorageAccount
```

### Paso 3: Desplegar la función

1. Publica tu función:
   ```bash
   func azure functionapp publish MyDenoFunctionApp
   ```
2. Verifica que tu función esté activa visitando la URL proporcionada por Azure.

## Buenas prácticas

1. **Seguridad**:
   - Limita los permisos en Deno para garantizar la seguridad.
   - Usa claves de API o tokens para proteger los endpoints.

2. **Estructura del proyecto**:
   - Organiza los microservicios en carpetas independientes para facilitar el mantenimiento.

3. **Pruebas unitarias**:
   - Usa bibliotecas como `deno test` para escribir pruebas y asegurar la calidad del código.

4. **Monitorización**:
   - Configura Azure Monitor para supervisar el rendimiento y detectar errores.

5. **Optimizar la ejecución**:
   - Minimiza las dependencias externas y cachea resultados frecuentes.


## Conclusión

La combinación de **Deno** y **Azure Functions** ofrece una solución moderna y eficiente para construir microservicios escalables y seguros. Con las herramientas adecuadas, como **Visual Studio Code**, y siguiendo buenas prácticas, puedes maximizar el potencial de tus proyectos serverless. Empieza hoy mismo a explorar estas tecnologías y lleva tus microservicios al siguiente nivel.