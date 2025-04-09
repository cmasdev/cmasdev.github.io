---
layout: post
title: "Despliegue continuo de Blazor con Azure DevOps"
author: Christian Amado
date: 2025-03-26 00:00:00 -0300
category: [Desarrollo de software]
tags: [.NET,Blazor]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

La automatización del proceso de construcción, prueba y despliegue de aplicaciones **Blazor** es esencial para mantener un ciclo de desarrollo ágil, confiable y repetible. **Azure DevOps** proporciona un conjunto completo de herramientas que permiten implementar pipelines de integración y entrega continua (CI/CD) para aplicaciones **Blazor Server** o **Blazor WebAssembly**.

Este artículo explica cómo configurar un pipeline de CI/CD para una aplicación **Blazor Server**, incluyendo la integración con un repositorio Git, la definición del proceso de build y el despliegue automático a **Azure App Service**.

<!--more-->

## Requisitos previos

- Cuenta activa en Azure y acceso al portal [https://portal.azure.com](https://portal.azure.com).
- Proyecto Blazor Server funcional y almacenado en un repositorio Git (GitHub o Azure Repos).
- Cuenta de Azure DevOps y organización configurada.
- Azure App Service creado para recibir el despliegue.

## Crear el proyecto en Azure DevOps

1. Acceder a [https://dev.azure.com](https://dev.azure.com) y crear un nuevo proyecto.
2. Importar el repositorio Git donde se encuentra el código fuente de la aplicación Blazor Server.
3. Verificar que el proyecto tenga una rama principal (`main` o `master`) correctamente configurada.

## Crear una App Service en Azure

1. En el portal de Azure, seleccionar **Crear recurso > App Service**.
2. Configurar:
   - Nombre: `blazor-devops-demo`
   - Publicar: **Código**
   - Pilas: **.NET 8 (o superior)**
   - Región: la más cercana al entorno de desarrollo
   - Grupo de recursos: crear uno nuevo si es necesario
3. Crear el servicio y esperar a que esté disponible.

## Crear un pipeline de CI/CD en Azure DevOps

1. Ir a la sección **Pipelines > Pipelines** y seleccionar **Crear Pipeline**.
2. Elegir la fuente de repositorio: GitHub o Azure Repos.
3. Seleccionar **YAML** como método de configuración.
4. Agregar el siguiente contenido para el archivo `azure-pipelines.yml`:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'windows-latest'

variables:
  buildConfiguration: 'Release'

steps:
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '8.x'
    installationPath: $(Agent.ToolsDirectory)/dotnet

- task: DotNetCoreCLI@2
  inputs:
    command: 'restore'
    projects: '**/*.csproj'

- task: DotNetCoreCLI@2
  inputs:
    command: 'build'
    projects: '**/*.csproj'
    arguments: '--configuration $(buildConfiguration)'

- task: DotNetCoreCLI@2
  inputs:
    command: 'publish'
    projects: '**/*.csproj'
    arguments: '--configuration $(buildConfiguration) --output $(Build.ArtifactStagingDirectory)'

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'drop'
```

Este pipeline compila y publica la aplicación Blazor en formato listo para despliegue. A continuación, se debe crear una **Release Pipeline**.

## Crear el pipeline de Release (Despliegue)

1. Ir a **Pipelines > Releases**, seleccionar **New Pipeline**.
2. Elegir **Empty Job**.
3. En el artefacto, seleccionar el pipeline generado anteriormente (`drop`) y enlazarlo.
4. En la fase de despliegue, agregar una nueva tarea: **Azure App Service Deploy**.
5. Configurar:
   - **App Type:** Web App on Windows
   - **App Service name:** seleccionar el creado previamente
   - **Package or folder:** `$(System.DefaultWorkingDirectory)/drop`

6. Habilitar **Despliegue automático después del build** en la pestaña **Triggers** del artefacto.

## Personalizar con variables de entorno

En Azure App Service es posible definir variables de entorno que se pueden consumir desde `appsettings.Production.json` o directamente en tiempo de ejecución:

1. En el portal de Azure, ir a la App Service > Configuración > Configuración de la aplicación.
2. Agregar claves como `ConnectionStrings__Default` o `MyCustomVariable`.

Estas configuraciones son seguras, persistentes y no requieren recompilación.

## Pruebas automáticas antes del despliegue

Si el proyecto incluye pruebas unitarias, se puede agregar el siguiente paso antes del `publish`:

```yaml
- task: DotNetCoreCLI@2
  inputs:
    command: 'test'
    projects: '**/*Tests.csproj'
    arguments: '--configuration $(buildConfiguration)'
```

Esto asegura que solo se desplieguen builds que hayan superado las pruebas.

## Conclusión

Implementar un flujo de CI/CD para aplicaciones **Blazor** con **Azure DevOps** automatiza completamente el proceso de entrega, desde la validación del código hasta el despliegue en producción. Esto no solo acelera el desarrollo, sino que también reduce errores humanos y mejora la calidad del software.

Gracias a los pipelines **YAML**, las definiciones son auditables, versionables y portables. Esta integración es ideal para proyectos **Blazor** en entornos empresariales o colaborativos, permitiendo adoptar prácticas modernas de **DevOps** sin abandonar el ecosistema **.NET**.