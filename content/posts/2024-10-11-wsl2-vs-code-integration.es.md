---
layout: post
title: "Integración con VS Code Dev Tunnels y Tailscale"
author: Christian Amado
date: 2024-10-11 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

WSL2 es una plataforma ideal para desarrollo distribuido y remoto gracias a su entorno Linux real y la capacidad de integrarse con herramientas modernas como **VS Code Dev Tunnels** y **Tailscale**. Estas soluciones permiten exponer servicios en desarrollo de forma segura a través de túneles públicos o redes privadas virtuales, sin abrir puertos en el router o usar VPNs corporativas complejas.

Este artículo explica cómo configurar y usar ambas herramientas desde WSL2 para exponer APIs, servidores locales, entornos de testing o aplicaciones completas a otros miembros del equipo o entornos externos.

<!--more-->

## ¿Qué son VS Code Dev Tunnels y Tailscale?

- **Dev Tunnels**: una funcionalidad integrada en Visual Studio Code que permite exponer un puerto local a internet de forma segura, ideal para compartir un servidor local en segundos.
- **Tailscale**: una VPN mesh que conecta dispositivos mediante WireGuard en una red privada segura, ideal para exponer servicios a otros dispositivos del equipo sin necesidad de configuración de red avanzada.

## Paso 1: Requisitos previos

- Windows 11 con WSL2 activo
- VS Code y la extensión **Remote - WSL**
- Cuenta de GitHub o Microsoft para autenticación en Dev Tunnels
- Cuenta de Tailscale gratuita (https://tailscale.com)
- Distro Ubuntu actualizada

## Paso 2: Usar Dev Tunnels en VS Code con WSL2

1. Abrir el proyecto en VS Code usando `Remote - WSL`.
2. Iniciar un servidor local en WSL2, por ejemplo:

```bash
python3 -m http.server 8000
```

3. Desde la paleta de comandos (`Ctrl+Shift+P`), ejecutar:

```
Dev Tunnels: Create Tunnel...
```

4. Elegir el puerto (ej. 8000) y tipo de acceso (authenticated/public).
5. Copiar la URL generada (ej. `https://<hash>.dev.tunnels.api.visualstudio.com`) y compartirla.

El túnel redirige tráfico HTTPS desde internet hacia tu entorno WSL2 local sin configuraciones de firewall ni puertos.

## Paso 3: Instalar Tailscale en WSL2

En la terminal de Ubuntu en WSL2:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Esto abrirá una URL de autenticación en el navegador. Una vez aceptado, tu máquina WSL2 estará conectada a la red privada de Tailscale.

Ver dispositivos conectados:

```bash
tailscale status
```

## Paso 4: Exponer un servicio local vía Tailscale

Ejecutar un servidor dentro de WSL2:

```bash
uvicorn main:app --host 0.0.0.0 --port 5000
```

Compartir la dirección `http://<tailscale-ip>:5000` con otro miembro del equipo en la misma red Tailscale.

Opcionalmente, habilitar el proxy MagicDNS de Tailscale para usar nombres como `ubuntu-wsl2.tailnet-name.ts.net`.

## Paso 5: Casos de uso combinados

- Exponer una API en desarrollo a un tester sin acceso al repositorio
- Probar una interfaz frontend desde una app móvil real vía Tailscale
- Compartir un notebook Jupyter ejecutado desde WSL2 con Dev Tunnels
- Simular múltiples entornos conectados entre sí (ej. base de datos + backend)

## Seguridad

- Dev Tunnels usa TLS y autenticación con tu cuenta GitHub o Microsoft
- Tailscale cifra todo el tráfico entre dispositivos con WireGuard
- Recomendado usar entornos virtuales o contenedores con puertos limitados
- Evitar exposición de `/mnt/c` y no ejecutar como root innecesariamente

## Conclusión

WSL2, combinado con VS Code Dev Tunnels y Tailscale, proporciona un entorno flexible y seguro para desarrollo distribuido. Permite exponer servicios en segundos, colaborar con otros sin complejidad de red y trabajar desde Windows con las ventajas de un entorno Linux real. Esta integración es clave para flujos modernos, equipos remotos y testing distribuido.
