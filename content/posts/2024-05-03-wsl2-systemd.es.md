---
layout: post
title: "Uso de systemd en WSL2: servicios persistentes y supervisión"
author: Christian Amado
date: 2024-05-03 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Desde 2022, **WSL2** incluye soporte para `systemd`, el sistema de inicialización y gestión de servicios usado en la mayoría de las distros **Linux** modernas. Esto habilita la ejecución de servicios persistentes, como `ssh`, `postgresql` o `docker`, directamente en el entorno **WSL2**...

<!--more-->

## ⚙️ Activar systemd en WSL2

1. Asegurarse de tener WSL actualizado:

```
wsl --update
```

2. Editar el archivo `/etc/wsl.conf` en la distro:

```
[boot]
systemd=true
```

3. Cerrar todas las instancias WSL y ejecutar:

```
wsl --shutdown
```

4. Verificar que systemd esté activo:

```
systemctl list-units --type=service
```

## 🧪 Ejecutar servicios

```
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

También se puede usar `journalctl` para logs persistentes:

```
journalctl -xe
```

## 🔒 Consideraciones

- Algunas distros necesitan reconfigurar permisos o reinstalar servicios tras activar systemd.
- `sudo` se vuelve más importante para manejar correctamente el árbol de procesos.

## ✅ Conclusión

Con **systemd** habilitado en **WSL2**, se puede correr y supervisar servicios como si estuviera en un servidor **Linux** real. Esto hace que **WSL2** sea una herramienta aún más poderosa para flujos **DevOps**, testing y desarrollo backend.