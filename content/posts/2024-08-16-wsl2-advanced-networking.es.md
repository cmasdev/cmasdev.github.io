---
layout: post
title: "Networking avanzado con WSL2: puertos, servicios y redes privadas"
author: Christian Amado
date: 2024-08-16 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**WSL2** proporciona un entorno **Linux** completo ejecutándose dentro de una **VM** ligera sobre **Windows**. Esto cambia sustancialmente el comportamiento de red respecto a **WSL1**. Para muchos desarrolladores, entender cómo funciona el networking en **WSL2** es esencial para ejecutar servicios, exponer APIs, trabajar con contenedores, y simular entornos de red en pruebas más complejas.

Este artículo explica en profundidad el modelo de red de **WSL2**, cómo manejar puertos, exponer servicios, realizar redirecciones avanzadas y configurar redes privadas para flujos DevOps, testing y desarrollo de aplicaciones distribuidas.

<!--more-->

## Introducción al modelo de red en WSL2

WSL2 ejecuta cada instancia de Linux dentro de una máquina virtual utilizando Hyper-V. A diferencia de WSL1, que compartía la pila de red del host Windows, en WSL2 la red está virtualizada:

- Cada distro tiene su propia interfaz (`eth0`)
- Tiene su propia IP interna asignada por DHCP
- Los puertos que se abren dentro de WSL2 no están disponibles automáticamente en Windows, aunque se configuran redirecciones automáticas para `localhost`

Ver IP del entorno WSL2:

```bash
ip a | grep inet
```

## Exposición de servicios en WSL2

Al ejecutar un servidor en WSL2, por ejemplo:

```bash
python3 -m http.server 8000
```

Este se expone dentro del entorno Linux. Si se accede desde el mismo WSL, la URL `http://localhost:8000` funcionará correctamente. Para acceder desde Windows o el navegador, WSL2 crea automáticamente reglas de reenvío de puertos a `localhost`.

Esto es transparente para la mayoría de los usos básicos.

## Reenvío avanzado con netsh y puertos personalizados

Si el reenvío automático no funciona, o se quiere más control, se pueden definir reglas manualmente desde PowerShell en Windows:

```powershell
netsh interface portproxy add v4tov4 listenport=8888 connectport=8000 connectaddress=WSL-IP
```

Verificar IP WSL:

```bash
ip addr show eth0 | grep inet
```

Listar reglas activas:

```powershell
netsh interface portproxy show all
```

Eliminar una regla:

```powershell
netsh interface portproxy delete v4tov4 listenport=8888
```

## Configuración de múltiples distros en red privada simulada

Para simular una red privada local, se puede trabajar con varias distros en WSL2:

```bash
wsl --list --verbose
```

Ejecutar dos distros (por ejemplo, Ubuntu y Debian), y desde una hacer ping a la otra vía su IP interna.

Si no responde, asegurarse de habilitar tráfico ICMP dentro de WSL y verificar que ambas estén activas al mismo tiempo.

## Comunicación con contenedores Docker

Si Docker Desktop está configurado para trabajar con WSL2, se puede usar la red de `docker0` para conectar servicios:

1. Correr un contenedor dentro del entorno WSL2
2. Exponerlo con `--network host` (si es compatible) o `--publish`
3. Usar `localhost` o la IP del contenedor desde otro servicio en WSL2

Ejemplo:

```bash
docker run -d -p 5432:5432 --name pg postgres
psql -h localhost -p 5432 -U postgres
```

## Simulación de red privada con herramientas adicionales

### Opción 1: Tailscale en WSL2

Tailscale permite crear una VPN mesh entre máquinas. Instalarlo en WSL2 permite acceder a servicios entre distros, otras PC o incluso entornos cloud.

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

### Opción 2: tun2socks y redes virtuales personalizadas

Para flujos más complejos o tests con proxies, se pueden usar herramientas como:

- `socat`
- `ngrok`
- `dnsmasq`
- `iptables` con NAT y routing avanzado

Estas herramientas requieren experiencia en networking de Linux, pero funcionan perfectamente en WSL2.

## Buenas prácticas para servicios y redes

- Usar puertos por encima de 1024 para evitar privilegios root
- Mantener los servicios dentro del FS Linux (`~/`) para evitar problemas de rendimiento
- Automatizar redirecciones en PowerShell o Bash con scripts
- Para uso profesional, evitar confiar en reenvíos automáticos y configurar manualmente
- Evitar trabajar con IPs cambiantes: usar DNS locales (`/etc/hosts` o resolvers)

## Conclusión

**WSL2** ofrece una red aislada, pero accesible y flexible, ideal para desarrollo y pruebas. Comprender su arquitectura y cómo manipular puertos y conexiones permite simular redes privadas, trabajar con múltiples servicios y ejecutar entornos avanzados de forma profesional desde **Windows** con un núcleo **Linux** real.