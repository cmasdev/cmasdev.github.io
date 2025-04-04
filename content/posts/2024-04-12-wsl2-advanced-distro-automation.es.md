---
layout: post
title: "Automatización avanzada de distros WSL2 con wsl.conf y cloud-init"
author: Christian Amado
date: 2024-04-12 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Uno de los beneficios clave de **WSL2** es la capacidad de automatizar la configuración del entorno Linux que corre sobre Windows. Esto permite establecer comportamientos predefinidos y provisionar distros listas para el trabajo sin intervención manual. En este artículo exploramos dos mecanismos clave: `wsl.conf` y `cloud-init`.

<!--more-->

## ⚙️ ¿Qué es `wsl.conf`?

Es un archivo de configuración ubicado en `/etc/wsl.conf` dentro de cada distro. Permite modificar cómo WSL monta discos, configura redes y gestiona el entorno.

### Ejemplo básico:

```
[automount]
enabled = true
root = /mnt/
options = "metadata,umask=22,fmask=11"

[network]
generateResolvConf = false

[user]
default = devuser
```

- Monta unidades de Windows con metadatos de permisos.
- Previene conflictos DNS con `resolv.conf`.
- Define el usuario predeterminado al iniciar la terminal.

✅ Ideal para escenarios donde múltiples usuarios usan la misma distro o cuando se quiere mantener un entorno consistente.

## ☁️ ¿Qué es `cloud-init`?

Originalmente pensado para entornos cloud como EC2 o Azure VM, `cloud-init` también funciona en algunas distros WSL2 (por ejemplo, Ubuntu). Permite definir:

- Paquetes a instalar
- Archivos de configuración
- Comandos post-instalación
- Creación de usuarios

### Ejemplo YAML:

```
# /etc/cloud/cloud.cfg.d/01-wsl-autoconfig.cfg
packages:
  - git
  - zsh
  - build-essential
runcmd:
  - echo "WSL2 provisionado automáticamente" >> /etc/motd
  - chsh -s $(which zsh) devuser
```

### Activación:

```
sudo cloud-init init
sudo cloud-init status --long
```

🧠 Tip: Se puede combinar esto con `setup.sh` para instalar temas, dotfiles y CLI personales.

## 🛠️ Ejemplo de flujo automatizado para onboarding

1. Crear distro base con `wsl --import`
2. Configurar `wsl.conf` y archivos de `cloud-init`
3. Ejecutar provisioning
4. Compartir imagen exportada (`.tar`) con otros desarrolladores