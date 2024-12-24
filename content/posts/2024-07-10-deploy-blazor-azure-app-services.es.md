---
layout: post
title: "Despliegue de aplicaciones Blazor en Azure App Services"
author: Christian Amado
date: 2024-07-10 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Blazor,.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

**Blazor**, el framework moderno basado en **.NET**, permite a los desarrolladores crear aplicaciones web interactivas utilizando **C#**. Combinado con **Azure App Services**, puedes desplegar aplicaciones de manera sencilla, escalable y segura. En este artículo, exploraremos los pasos para desplegar aplicaciones **Blazor (Server y WebAssembly)** en **Azure App Services**, acompañado de ejemplos detallados y buenas prácticas para garantizar un despliegue óptimo.

<!--more-->

## ¿Qué es Azure App Services?

**Azure App Services** es una plataforma de alojamiento en la nube totalmente administrada que soporta aplicaciones web, móviles y *API*. Sus principales características incluyen:

1. **Despliegue rápido**: Permite subir aplicaciones directamente desde tu entorno de desarrollo.
2. **Escalabilidad**: Ajusta los recursos según la demanda.
3. **Seguridad**: Ofrece integración con certificados SSL y autenticación.
4. **Compatibilidad con varias tecnologías**: Soporta .NET, Node.js, Python, Java y más.


## Crear y configurar un Azure App Service

### Paso 1: Crear un recurso en Azure

1. Inicia sesión en el [portal de Azure](https://portal.azure.com).
2. Selecciona **Crear un recurso** y busca **App Service**.
3. Completa los detalles:
   - **Nombre**: `blazor-app-service`.
   - **Pila de runtime**: .NET 9.
   - **Sistema operativo**: Windows o Linux.
   - **Plan de App Service**: Selecciona un plan según tus necesidades (recomendado: Plan de consumo para pruebas o B1 para producción).

### Paso 2: Configurar el entorno de despliegue

1. Habilita la autenticación si es necesario.
2. Configura las variables de entorno requeridas por la aplicación.

## Despliegue de Blazor Server en Azure App Services

### Paso 1: Crear una aplicación Blazor Server

1. Genera un nuevo proyecto Blazor Server:
   ```
   dotnet new blazorserver -o BlazorServerApp
   ```
2. Navega al directorio del proyecto:
   ```
   cd BlazorServerApp
   ```
3. Ejecuta la aplicación localmente:
   ```
   dotnet run
   ```

### Paso 2: Publicar la aplicación

1. Publica la aplicación:
   ```
   dotnet publish -c Release -o ./publish
   ```
2. Verifica los archivos generados en el directorio `publish`.

### Paso 3: Desplegar a Azure

1. Usa el CLI de Azure para iniciar sesión:
   ```
   az login
   ```
2. Despliega la aplicación:
   ```
   az webapp deploy --resource-group MyResourceGroup --name blazor-app-service --src-path ./publish
   ```


## Despliegue de Blazor WebAssembly en Azure App Services

### Paso 1: Crear una aplicación Blazor WebAssembly

1. Genera un nuevo proyecto:
   ```
   dotnet new blazorwasm -o BlazorWebAssemblyApp
   ```
2. Habilita el modo PWA si es necesario:
   ```
   dotnet new blazorwasm -o BlazorPWA --pwa
   ```
3. Ejecuta la aplicación localmente:
   ```
   dotnet run
   ```

### Paso 2: Publicar la aplicación

1. Publica la aplicación:
   ```
   dotnet publish -c Release -o ./publish
   ```

### Paso 3: Configurar y desplegar

1. Asegúrate de que el servidor web esté configurado para servir contenido estático desde el directorio `wwwroot`.
2. Usa Azure CLI o el portal de Azure para subir los archivos.

#### Subir archivos usando Azure Storage

1. Crea una cuenta de almacenamiento:
   ```
   az storage account create --name mystorageaccount --resource-group MyResourceGroup --location eastus --sku Standard_LRS
   ```
2. Usa `azcopy` para subir los archivos:
   ```
   azcopy copy ./publish/wwwroot https://mystorageaccount.blob.core.windows.net/$web --recursive
   ```


## Buenas prácticas para despliegues en Azure App Services

1. **Configurar entornos**:
   - Usa `appsettings.json` para gestionar configuraciones por entorno.
2. **Escalabilidad**:
   - Configura escalado automático para manejar incrementos de tráfico.
3. **Seguridad**:
   - Habilita HTTPS y usa certificados SSL.
4. **Monitorización**:
   - Usa Application Insights para supervisar el rendimiento.
5. **Optimizar el tamaño de la aplicación**:
   - Habilita compresión y minimización de archivos.


## Resolución de problemas comunes

### Error 500: "Internal Server Error"
- **Causa**: Configuraciones incorrectas en `appsettings.json`.
- **Solución**: Verifica las rutas y las claves de configuración.

### "Failed to Start" en Blazor Server
- **Causa**: Problemas de dependencias no satisfechas.
- **Solución**: Revisa las dependencias en el archivo `csproj`.

### Archivos estáticos no encontrados en Blazor WebAssembly
- **Causa**: Configuración errónea del servidor.
- **Solución**: Asegúrate de que el servidor apunte al directorio `wwwroot`.


## Conclusión

Desplegar aplicaciones **Blazor** en **Azure App Services** es un proceso directo que se beneficia de las capacidades robustas de Azure para escalar, monitorear y proteger aplicaciones. Siguiendo las mejores prácticas y resolviendo problemas comunes, puedes garantizar un despliegue exitoso y mantener tus aplicaciones funcionando de manera eficiente. ¡Explora **Azure App Services** y lleva tus aplicaciones **Blazor** al siguiente nivel!
