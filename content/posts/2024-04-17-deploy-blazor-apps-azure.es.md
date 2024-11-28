---
layout: post
title: "Despliegue de aplicaciones Blazor en Azure App Services"
author: Christian Amado
date: 2024-04-17 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, .NET, Blazor, Azure, GitHub Actions]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/blazor.png
---

El despliegue de aplicaciones Blazor en Azure App Services ofrece una forma rápida y eficiente de llevar tus proyectos al entorno de producción. Azure proporciona escalabilidad, seguridad y opciones flexibles para automatizar el flujo de trabajo de despliegue. En este artículo, exploramos tres métodos clave: usando Visual Studio, la CLI de Azure, y GitHub Actions, con pasos prácticos y ejemplos detallados. Con las mejoras de .NET 8, las aplicaciones Blazor ahora son más rápidas y optimizadas para la nube, lo que facilita la entrega de soluciones web escalables y modernas.

<!--more-->

## Introducción

Desplegar aplicaciones Blazor en **Azure App Services** es una solución sencilla y eficiente para llevar tus aplicaciones web al entorno de producción. Azure proporciona escalabilidad, seguridad y herramientas integradas para un despliegue rápido. En este artículo, exploraremos cómo configurar y desplegar una aplicación Blazor, incluyendo pasos prácticos y ejemplos detallados. Con **.NET 8**, el rendimiento y la optimización de aplicaciones Blazor han mejorado significativamente, facilitando el despliegue en la nube.

---

## Prerrequisitos

Antes de comenzar, asegúrate de contar con lo siguiente:

1. **.NET SDK 8** instalado en tu máquina.
2. Una cuenta de **Azure**.
3. Azure CLI instalada y configurada.
4. Una aplicación Blazor lista para ser desplegada.

---

## Paso 1: Crear una aplicación Blazor

Primero, crea una aplicación Blazor WebAssembly básica si no tienes una ya:

```bash
dotnet new blazorwasm -o BlazorApp
cd BlazorApp
dotnet build
```

Ejecuta el proyecto para verificar que funciona correctamente:

```bash
dotnet run
```

Accede a `http://localhost:5000` para comprobar que la aplicación se ejecuta correctamente.

---

## Paso 2: Configurar Azure App Service

### **2.1 Acceder al portal de Azure**

1. Ve al [Portal de Azure](https://portal.azure.com) e inicia sesión con tu cuenta.
2. En la barra de búsqueda superior, escribe "App Services" y selecciona la opción **App Services**.

### **2.2 Crear un nuevo App Service**

1. Haz clic en el botón **Crear** en la parte superior.
2. Aparecerá un formulario de configuración donde debes proporcionar la siguiente información:
   - **Suscripción**: Selecciona tu suscripción activa.
   - **Grupo de recursos**: Crea uno nuevo o elige un grupo existente.
   - **Nombre de la aplicación**: Introduce un nombre único, por ejemplo, `blazor-app-deploy`.
   - **Publicación**: Selecciona **Código**.
   - **Pila de ejecución**: Elige **.NET 8**.
   - **Sistema operativo**: Selecciona **Windows** o **Linux** según tu preferencia.
   - **Plan de App Service**: Crea uno nuevo o selecciona un plan existente. 

3. Haz clic en **Revisar + Crear** y luego en **Crear** para iniciar la implementación del App Service.

### **2.3 Validar la creación del App Service**

1. Una vez creada, verás un mensaje de confirmación en la parte superior del portal.
2. Haz clic en **Ir al recurso** para acceder al panel del App Service.

### **2.4 Configurar las opciones del App Service**

1. En el panel del App Service, selecciona **Configuración** en el menú lateral.
2. Verifica que la versión de .NET sea la correcta (**.NET 8**).
3. Configura las variables de entorno necesarias para tu aplicación (si aplica) en la pestaña **Configuración de aplicaciones**.

### **2.5 Obtener la URL del App Service**

1. En el panel principal del App Service, encuentra el enlace de **URL predeterminada**.
2. Esta será la dirección donde se alojará tu aplicación una vez desplegada.

---

## Paso 3: Publicar la aplicación desde Visual Studio

1. Abre tu proyecto Blazor en **Visual Studio**.
2. Haz clic derecho en el proyecto y selecciona **Publicar**.
3. Selecciona **App Service (Windows)** o **App Service (Linux)** según tu configuración.
4. Inicia sesión en tu cuenta de Azure.
5. Selecciona el App Service creado previamente.
6. Haz clic en **Publicar** y espera a que finalice el proceso.

---

## Paso 4: Usar Azure CLI para el despliegue

Si prefieres usar la CLI, sigue estos pasos:

1. Publica la aplicación localmente:

```bash
dotnet publish -c Release
```

2. Crea un recurso de App Service en Azure si aún no lo has hecho:

```bash
az webapp create --name blazor-app-deploy --resource-group <tu-grupo> --plan <tu-plan> --runtime "DOTNET-8.0"
```

3. Despliega la aplicación:

```bash
az webapp deploy --resource-group <tu-grupo> --name blazor-app-deploy --src-path ./bin/Release/net8.0/publish
```

4. Accede a la URL proporcionada por Azure para ver tu aplicación.

---

## Paso 5: Configurar CI/CD con GitHub Actions

Automatiza el despliegue utilizando GitHub Actions:

1. Crea un archivo llamado `.github/workflows/azure-webapp.yml` en tu repositorio.
2. Añade la siguiente configuración:

```yaml
name: Deploy Blazor App to Azure

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0'
    - name: Build Project
      run: dotnet build --configuration Release
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: blazor-app-deploy
        slot-name: production
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

3. Configura el secreto `AZURE_WEBAPP_PUBLISH_PROFILE` en los ajustes de tu repositorio.

---

## Conclusión

Desplegar aplicaciones Blazor en Azure App Services es un proceso flexible y eficiente. Ya sea utilizando Visual Studio, la CLI de Azure o GitHub Actions, Azure ofrece las herramientas necesarias para simplificar el flujo de trabajo de desarrollo y despliegue. Con las mejoras de **.NET 8**, tus aplicaciones serán más rápidas y escalables que nunca. ¡Empieza hoy mismo a aprovechar el poder de Blazor en la nube!