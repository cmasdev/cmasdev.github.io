---
layout: post
title: "Introducción avanzada a WSL2"
author: Christian Amado
date: 2024-04-05 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Desde su lanzamiento, WSL2 (Windows Subsystem for Linux 2) ha transformado el panorama del desarrollo en Windows, ofreciendo una integración casi nativa con Linux sin necesidad de usar máquinas virtuales tradicionales. A diferencia de WSL1, que traducía llamadas del sistema de Linux a Windows, WSL2 ejecuta un kernel Linux completo dentro de una VM optimizada y ligera. Esta diferencia técnica lo convierte en una herramienta poderosa para desarrolladores modernos, DevOps, científicos de datos y más.

<!--more-->

## 🔍 Diferencias clave entre WSL1 y WSL2

| Característica              | WSL1                            | WSL2                                 |
|----------------------------|----------------------------------|--------------------------------------|
| Kernel Linux               | No (traducción de llamadas)     | Sí (kernel completo real)            |
| Compatibilidad syscall     | Limitada                        | Total                                |
| Performance en filesystem  | Más rápido en `/mnt/c/`         | Más rápido en `/home/`               |
| Soporte para Docker        | Parcial                         | Completo con Docker Desktop y systemd|
| Uso de memoria             | Bajo                            | Mayor (usa VM)                       |

## 🧱 Arquitectura de WSL2

- Utiliza una máquina virtual ligera basada en Hyper-V, completamente administrada por Windows.
- El kernel Linux es compilado y mantenido por Microsoft, lo que garantiza compatibilidad y actualizaciones.
- Usa un sistema de archivos virtual (ext4) por cada distro, que puede residir en un archivo `.vhdx`.

```
# Ver distros instaladas con su estado
wsl --list --verbose
```

## ⚙️ Flujos de trabajo avanzados

### 🧪 Casos de uso reales

1. **DevOps híbrido**: Ejecutar herramientas de infraestructura (Terraform, Ansible) nativamente en Linux.
2. **Desarrollo Backend**: Node, Rust, Python o Go sobre distros Linux con acceso directo a servicios como PostgreSQL o Redis.
3. **Data Science & AI**: Compatibilidad con CUDA para entrenamiento de modelos con GPU.
4. **CI/CD local**: Crear pipelines reproducibles desde scripts Bash antes de subirlos a GitHub Actions o Azure Pipelines.

## ⚠️ Consideraciones y tips

- Evita trabajar en archivos dentro de `/mnt/c/` si quieres máxima performance.
- Usa `.wslconfig` para limitar recursos (CPU, memoria, swap) usados por la VM.
- Configura `~/.wslconfig` para tunear el entorno global.

```
[wsl2]
memory=4GB
processors=2
swap=2GB
```
