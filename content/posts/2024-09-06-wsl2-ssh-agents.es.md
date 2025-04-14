---
layout: post
title: "Gestión de agentes SSH y GPG en WSL"
author: Christian Amado
date: 2024-09-06 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En entornos de desarrollo modernos, la autenticación segura es fundamental. Ya sea para acceder a servidores remotos, clonar repositorios privados o firmar commits y correos electrónicos, herramientas como **SSH** y **GPG** son imprescindibles. **WSL2** permite integrarlas con el entorno **Windows**, pero también operar de forma autónoma con control completo sobre claves y agentes.

Este artículo explica cómo gestionar agentes **SSH** y **GPG** en **WSL2** de forma segura, cómo compartir claves entre **Windows** y **Linux**, y cómo evitar fugas o mal uso de identidades criptográficas.

<!--more-->

## Objetivo

- Configurar agentes SSH y GPG funcionales en WSL2
- Compartir claves o usar claves propias dentro del entorno Linux
- Asegurar el uso exclusivo desde WSL2 o compartirlo con Windows
- Firmar commits, acceder a GitHub, y cifrar archivos de forma segura

## SSH desde WSL2

### Opción 1: Claves generadas en WSL2 (recomendado para aislamiento)

```bash
ssh-keygen -t ed25519 -C "dev@ejemplo.com"
```

Por defecto se guardan en `~/.ssh/id_ed25519`.

Agregar clave al agente:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

Copiar clave pública a GitHub:

```bash
cat ~/.ssh/id_ed25519.pub
```

### Opción 2: Compartir agente SSH de Windows

Para esto, se necesita habilitar OpenSSH Agent en Windows y compartir el socket. Requiere herramientas adicionales como `npiperelay` y `socat`.

## Agente SSH persistente en WSL2

Agregar esto al `.bashrc` o `.zshrc`:

```bash
export SSH_AUTH_SOCK="$HOME/.ssh/ssh-agent.sock"
if ! pgrep -u "$USER" ssh-agent > /dev/null; then
    eval "$(ssh-agent -a $SSH_AUTH_SOCK)" > /dev/null
fi
```

Esto evita tener que ejecutar `ssh-agent` cada vez.

## GPG en WSL2

### Generar clave nueva

```bash
gpg --full-generate-key
```

Usar tipo RSA, al menos 4096 bits, con email asociado a GitHub.

### Ver claves disponibles

```bash
gpg --list-secret-keys --keyid-format LONG
```

### Firmar commits de Git

Configurar firma:

```bash
git config --global user.signingkey ABCD123456789DEF
git config --global commit.gpgsign true
```

### Habilitar GPG-agent persistente

Agregar a `~/.gnupg/gpg-agent.conf`:

```
enable-ssh-support
default-cache-ttl 600
max-cache-ttl 7200
```

Reiniciar agente:

```bash
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent
```

## Uso conjunto: SSH + GPG para GitHub

- Claves SSH para acceso remoto a repositorios
- Claves GPG para firma de commits y verificación de autoría
- Configuraciones almacenadas por separado para mayor seguridad

## Buenas prácticas

- Usar passphrase en las claves privadas
- Mantener `.ssh` y `.gnupg` con permisos `700`
- No compartir sockets SSH/GPG con Windows si no es necesario
- Automatizar carga de claves en `.bashrc` o `direnv`
- Backups seguros con cifrado de claves privadas

## Conclusión

Con **WSL2** se puede configurar un entorno **Linux** completamente funcional y seguro para autenticación con **SSH** y **GPG**, manteniendo control total sobre las claves sin comprometer la seguridad del sistema **Windows**. Esta integración permite flujos de trabajo modernos y seguros para desarrollo, automatización y colaboración con sistemas remotos y plataformas como **GitHub**.