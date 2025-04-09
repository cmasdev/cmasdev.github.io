---
layout: post
title: "Dev Containers con WSL2: casos reales con VS Code y GitHub Codespaces"
author: Christian Amado
date: 2024-08-09 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Los **Dev Containers** son entornos de desarrollo preconfigurados definidos por archivo, que permiten a cualquier persona trabajar con el mismo stack, dependencias y configuraciones. Combinados con **WSL2** y **VS Code**, permiten construir entornos reproducibles que funcionan tanto localmente como en la nube a través de GitHub Codespaces.

Este artículo explica cómo trabajar con **Dev Containers** en **WSL2**, con ejemplos prácticos y recomendaciones para distintos escenarios.

<!--more-->

# Qué es un Dev Container

Un Dev Container se define mediante un archivo `.devcontainer/devcontainer.json` y opcionalmente un `Dockerfile`. Permite:

- Usar una imagen base o personalizada
- Instalar dependencias automáticamente
- Configurar extensiones y settings del editor
- Automatizar comandos post-configuración

## Requisitos

- Windows 10/11 con WSL2
- Docker Desktop instalado con integración WSL2 habilitada
- Visual Studio Code
- Extensiones:
  - Remote - Containers
  - Dev Containers
  - GitHub Codespaces (opcional)

## Crear un proyecto con Dev Container

Estructura mínima:

```
proyecto/
└── .devcontainer/
    ├── devcontainer.json
    └── Dockerfile (opcional)
```

Ejemplo básico de `devcontainer.json`:

```json
{
  "name": "python-dev",
  "image": "mcr.microsoft.com/devcontainers/python:3.10",
  "features": {
    "ghcr.io/devcontainers/features/git:1": {}
  },
  "postCreateCommand": "pip install -r requirements.txt",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "ms-toolsai.jupyter"
      ]
    }
  }
}
```

## Abrir el entorno con VS Code

Desde VS Code:

1. Abrir la carpeta del proyecto
2. Ir al menú Command Palette (`Ctrl+Shift+P`)
3. Ejecutar: `Dev Containers: Reopen in Container`

Esto lanzará el contenedor dentro del entorno WSL2, montado como si fuera local.

## Caso real 1: Data Science colaborativo

Un equipo define un entorno con *Python*, *Jupyter*, *pandas*, *seaborn* y *VS Code*. Todos trabajan con el mismo entorno en Windows vía WSL2 o en Codespaces, sin diferencias en comportamiento o dependencias.

## Caso real 2: Backend con Node.js y PostgreSQL

El contenedor incluye Node.js y se conecta a una base PostgreSQL que corre en otro contenedor. Toda la infraestructura de desarrollo se define en `docker-compose.yml` y el Dev Container se integra automáticamente.

## Sincronización con GitHub Codespaces

El archivo `.devcontainer/` funciona igual en la nube. Al crear un Codespace desde un repositorio con esta estructura, GitHub construye automáticamente el mismo entorno.

Esto permite:

- Switch sin fricción entre local y nube
- Reproducibilidad garantizada
- Onboarding instantáneo de nuevos colaboradores

## Buenas prácticas

- Usar imágenes base oficiales (`devcontainers/`)
- Versionar `.devcontainer` completo en el repositorio
- Automatizar instalaciones en `postCreateCommand`
- Usar `devcontainer.json` + `docker-compose.yml` para múltiples servicios

## Conclusión

**WSL2** y **Dev Containers** con **VS Code** ofrecen un entorno portátil y reproducible para desarrollo moderno. Cuando se combinan con **GitHub Codespaces**, permiten trabajar desde cualquier lugar con el mismo entorno, reduciendo errores, facilitando colaboración y acelerando el desarrollo en equipos distribuidos.

