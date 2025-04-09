---
layout: post
title: "CI/CD desde WSL2 usando GitHub Actions y Azure Pipelines"
author: Christian Amado
date: 2024-08-26 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Uno de los principales beneficios de usar **WSL2** como entorno de desarrollo es la posibilidad de trabajar con herramientas de integración y entrega continua (CI/CD) de forma local antes de empujarlas a producción. Esto permite validar scripts, simular pipelines y ajustar flujos sin depender de entornos remotos. **GitHub Actions** y **Azure Pipelines** son dos de las plataformas más populares y compatibles con **WSL2**.

Este artículo explica cómo configurar y ejecutar pipelines CI/CD localmente desde WSL2, tanto para testing como automatización de despliegues, con ejemplos prácticos y buenas prácticas.

<!--more-->

## Ventajas de usar CI/CD en WSL2

- Simulación fiel de Linux en un entorno Windows
- Ahorro de tiempo y validación previa al push
- Compatibilidad con herramientas como Docker, Node.js, Python, etc.
- Integración directa con Git y GitHub desde Linux

## Paso 1: Preparar entorno en WSL2

Asegurarse de tener:

```bash
sudo apt update
sudo apt install -y git curl build-essential
```

Configurar Git con tus credenciales:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
```

Clonar un repositorio con flujo CI/CD:

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
```

## Paso 2: Ejecutar GitHub Actions localmente con `act`

[`act`](https://github.com/nektos/act) es una herramienta que permite ejecutar workflows de GitHub Actions localmente usando contenedores Docker.

Instalar:

```bash
brew install act
```

Si no tenés Homebrew:

```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

Verificar workflows disponibles:

```bash
act -l
```

Ejecutar un job:

```bash
act -j build
```

Esto ejecuta el workflow `.github/workflows/build.yml` usando el runner predeterminado (`ubuntu-latest` por defecto).

Ejemplo de workflow para Node.js:

```yaml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install deps
        run: npm install
      - name: Run tests
        run: npm test
```

## Paso 3: Usar Azure Pipelines desde WSL2

Crear un pipeline en el portal de Azure DevOps y vincular el repositorio.

Dentro del repo, usar un archivo `azure-pipelines.yml`:

```yaml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - script: |
      echo "Instalando dependencias"
      pip install -r requirements.txt
      pytest
    displayName: 'Run tests'
```

Podés simular los pasos desde WSL2 para validar:

```bash
pip install -r requirements.txt
pytest
```

Esto garantiza que el script funcionará igual en el agente remoto de Azure.

## Paso 4: Automatizar desde WSL2 usando Git

Hacer commit de cambios en workflows:

```bash
git add .github/workflows/build.yml
git commit -m "Agrega flujo de build CI"
git push origin main
```

Esto disparará automáticamente el pipeline en GitHub o Azure según esté configurado.

## Buenas prácticas para CI/CD desde WSL2

- Usar `.env` y `secrets` en Actions/Azure para no exponer claves
- Validar localmente antes de subir
- Usar `matrix` para probar múltiples versiones (ej: Node.js 16 y 18)
- Versionar `scripts/` de build y test para integrarlos en pipelines
- Ejecutar pruebas localmente con `act` o manualmente desde terminal

## Conclusión

**WSL2** no solo es útil para desarrollo local, sino también para integrar y probar flujos CI/CD antes de llevarlos a producción. Gracias a herramientas como `act` y la compatibilidad con pipelines **YAML** de **GitHub** y **Azure**, es posible simular, depurar y optimizar procesos automatizados desde un entorno **Linux** real, sin salir de **Windows**.