---
layout: post
title: "Gestión avanzada de múltiples distros en WSL2"
author: Christian Amado
date: 2024-04-19 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Una de las grandes ventajas de WSL2 es la posibilidad de instalar y ejecutar múltiples distribuciones de Linux simultáneamente, cada una con su propio sistema de archivos, paquetes y configuraciones.

<!--more-->

## 🔍 Listar distros disponibles

```
wsl --list --verbose
```

Esto muestra las distros instaladas, su estado actual y versión de WSL (1 o 2).

## 📦 Instalar múltiples distros

Desde Microsoft Store o usando una imagen `.tar`:

```
wsl --import Debian-Dev D:\WSL\Debian-Dev debian-rootfs.tar
```

### 🛠️ Crear un backup de una distro

```
wsl --export Ubuntu-Dev ubuntu-dev-backup.tar
```

### 🔄 Restaurar o clonar una distro

```
wsl --import Ubuntu-Clon D:\WSL\Ubuntu-Clon ubuntu-dev-backup.tar
```

## 🔁 Sincronizar configuraciones

Se puede mantener las configuraciones con `dotfiles`, scripts de provisión o herramientas como Ansible o chezmoi.

```
# Ejemplo simple con Git
git clone https://github.com/tuusuario/dotfiles ~/.dotfiles
bash ~/.dotfiles/setup.sh
```

## ⚙️ Automatización de flujos entre distros

Usar scripts Bash para pasar configuraciones, instalar paquetes o incluso ejecutar pruebas cruzadas entre distros.

```
for distro in Ubuntu-Dev Debian-Dev; do
    wsl -d $distro -- bash -c "sudo apt update && sudo apt upgrade -y"
done
```

## ✅ Conclusión

Gestionar múltiples distros con WSL2 permite aislar entornos, probar configuraciones específicas o crear pipelines DevOps más robustos. Con herramientas de exportación, scripting y dotfiles, se puede mantener un stack alineado en todos los equipos o contextos.