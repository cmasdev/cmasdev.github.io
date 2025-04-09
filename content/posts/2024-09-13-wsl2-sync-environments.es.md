---
layout: post
title: "Sincronización de entornos WSL2 en múltiples dispositivos"
author: Christian Amado
date: 2024-09-13 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Uno de los desafíos más comunes en equipos distribuidos o desarrolladores con múltiples dispositivos es mantener entornos consistentes entre máquinas. Gracias a las capacidades de exportación de distribuciones, el uso de **Dev Containers**, gestión de configuraciones declarativas y herramientas de backup, **WSL2** puede sincronizarse entre diferentes sistemas Windows de forma confiable y productiva.

Este artículo explora las mejores estrategias para mantener la coherencia de entornos WSL2 en múltiples PCs o notebooks, incluyendo ejemplos prácticos.

<!--more-->

## Estrategia 1: Exportar y restaurar distribuciones WSL2

WSL2 permite exportar una distribución completa a un archivo `.tar` que puede transferirse y reinstalarse en otra máquina.

### Exportar distro actual

```bash
wsl --export Ubuntu ubuntu-backup.tar
```

### Importar en otra máquina

```bash
wsl --import UbuntuRestaurado D:\WSL\Ubuntu ubuntu-backup.tar --version 2
```

Esto restaura una copia exacta del entorno, incluyendo paquetes, usuarios y configuraciones personalizadas.

## Estrategia 2: Usar dotfiles y scripts de inicialización

Versionar archivos de configuración personal (`.bashrc`, `.gitconfig`, `.profile`, etc.) en un repositorio `dotfiles`.

### Clonar y aplicar dotfiles

```bash
git clone https://github.com/tuusuario/dotfiles ~/.dotfiles
cp ~/.dotfiles/.bashrc ~/.bashrc
source ~/.bashrc
```

También se pueden automatizar con herramientas como:

- `chezmoi`
- `dotbot`

## Estrategia 3: Reproducir entornos con Dev Containers o Nix

Usar archivos `devcontainer.json` para definir entornos que pueden ser abiertos en VS Code o Codespaces:

```bash
.devcontainer/
├── devcontainer.json
├── Dockerfile
```

También se puede usar `shell.nix` o `Dockerfile` si se trabaja con entornos reproducibles.

## Estrategia 4: Sincronización de paquetes con scripts

Guardar listas de paquetes instalados:

### Debian/Ubuntu:

```bash
dpkg --get-selections > packages.list
```

En la otra máquina:

```bash
sudo dpkg --set-selections < packages.list
sudo apt-get dselect-upgrade
```

### Python:

```bash
pip freeze > requirements.txt
pip install -r requirements.txt
```

## Estrategia 5: Usar GitHub Codespaces como entorno espejo

Subir estructura del proyecto con `.devcontainer` a un repositorio permite ejecutarlo directamente en la nube con GitHub Codespaces, asegurando un entorno 100% idéntico.

Acceder desde cualquier máquina con solo iniciar sesión en GitHub.

## Recomendaciones de sincronización segura

- Almacenar `.tar` exportados en nube cifrada o con contraseña
- Evitar sincronizar `/mnt/c/` o rutas externas entre máquinas
- No exportar claves privadas ni `.ssh` en entornos compartidos
- Automatizar con scripts `setup.sh` y `make bootstrap`

## Conclusión

Mantener entornos WSL2 sincronizados entre varios dispositivos es completamente factible con herramientas estándar del ecosistema Linux y Windows. Ya sea a través de exportaciones manuales, entornos declarativos o integración con GitHub Codespaces, se puede lograr coherencia, productividad y portabilidad en cualquier máquina.
