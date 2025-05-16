---
layout: post
title: "Integración avanzada con Docker Desktop y contenedores cruzados"
author: Christian Amado
date: 2024-04-25 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**Docker** y **WSL2** trabajan juntos de forma nativa desde 2020. **Docker Desktop** para **Windows** ahora se basa completamente en **WSL2**, permitiendo ejecutar contenedores **Linux** sin la necesidad de **Hyper-V** por separado.

<!--more-->

## 🐳 Cómo funciona Docker con WSL2

**Docker** instala una distro especial llamada `docker-desktop` que actúa como backend de ejecución.

```
wsl --list --verbose
# Deberías ver:
# docker-desktop
# docker-desktop-data
```

## 🛠️ Activar integración con tu distro

Desde **Docker Desktop** → **Settings** → **Resources** → **WSL Integration**

Habilitá tu distro personalizada (Ubuntu, Debian, etc.).

Una vez activada, podés correr Docker directamente:

```
docker run --rm alpine echo "Hola desde Alpine en WSL2"
```

## 🔄 Contenedores cruzados (Windows ↔ Linux)

Si activás también la integración de **Docker Desktop** con **PowerShell**, podés correr contenedores **Linux** desde **Windows** y viceversa.

### Ejemplo: build en WSL2, deploy desde Windows

```
# WSL2: construir imagen
docker build -t myapp .

# Windows: ejecutar desde PowerShell
docker run --rm myapp
```

## ✅ Conclusión

**WSL2** + **Docker Desktop** brinda un entorno potente para desarrollo con contenedores, permitiendo compartir imágenes y redes entre sistemas. Esta integración elimina muchas barreras y mejora la productividad para desarrolladores de backend, DevOps y microservicios.