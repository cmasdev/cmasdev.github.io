---
layout: post
title: "Configuración de servicios persistentes en background en WSL2"
author: Christian Amado
date: 2024-09-20 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Aunque **WSL2** no ofrece un sistema de init tradicional como `systemd` por defecto, es totalmente posible configurar y ejecutar servicios persistentes como **nginx** o **PostgreSQL** desde **WSL2**. Esto permite simular entornos de producción, realizar pruebas completas o levantar microservicios sin contenedores ni VMs adicionales.

Este artículo explica cómo instalar, configurar, automatizar y mantener servicios en segundo plano en WSL2 con enfoque práctico y seguro.

<!--more-->

## Requisitos

- Windows 10/11 con WSL2 habilitado
- Distro Ubuntu 22.04 (u otra basada en Debian)
- Acceso a `sudo`
- Persistencia del sistema de archivos dentro de `~` (no usar `/mnt/c/`)

## Paso 1: Instalar nginx y PostgreSQL

```bash
sudo apt update
sudo apt install -y nginx postgresql
```

Verificar que los servicios estén disponibles:

```bash
nginx -v
psql --version
```

## Paso 2: Iniciar servicios manualmente

Como no hay `systemd`, se inician desde la terminal:

```bash
sudo service nginx start
sudo service postgresql start
```

Verificar estado:

```bash
ps -ef | grep nginx
ps -ef | grep postgres
```

Ver puertos activos:

```bash
ss -tuln
```

## Paso 3: Hacer que los servicios se inicien automáticamente

### Opción 1: Script de inicio en `.bashrc`

Agregar al final de `~/.bashrc`:

```bash
# Iniciar servicios al abrir WSL
if ! pgrep nginx > /dev/null; then
    sudo service nginx start
fi
if ! pgrep postgres > /dev/null; then
    sudo service postgresql start
fi
```

⚠️ Esto pedirá contraseña a menos que se configure `sudo` sin contraseña para estos comandos.

### Opción 2: Crear alias o comandos rápidos

```bash
alias start-services='sudo service nginx start && sudo service postgresql start'
```

Guardar en `.bash_aliases` o directamente en `.bashrc`.

## Paso 4: Configuración básica de nginx

Editar archivo principal:

```bash
sudo nano /etc/nginx/sites-available/default
```

Configurar un servidor local:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /var/www/html;
        index index.html;
    }
}
```

Reiniciar para aplicar cambios:

```bash
sudo service nginx restart
```

Probar en navegador: `http://localhost`

## Paso 5: Configurar PostgreSQL

Cambiar contraseña del usuario por defecto:

```bash
sudo -u postgres psql
\password postgres
```

Crear base de datos y usuario:

```sql
CREATE DATABASE testdb;
CREATE USER dev WITH ENCRYPTED PASSWORD 'clave123';
GRANT ALL PRIVILEGES ON DATABASE testdb TO dev;
```

Conectarse:

```bash
psql -U dev -d testdb -h localhost
```

## Paso 6: Acceso desde el host (Windows)

Por defecto, los servicios expuestos en `127.0.0.1` dentro de WSL2 son accesibles desde Windows como `localhost`.

Probar:

```powershell
curl http://localhost
psql -h localhost -U dev -d testdb
```

## Buenas prácticas

- Ejecutar servicios en `~/` o `/etc` dentro del FS Linux, nunca desde `/mnt/c/`
- Automatizar con scripts `start-services.sh`
- Usar `pgAdmin`, `DBeaver` o VS Code para conexión visual a PostgreSQL
- Para múltiples distros, considerar nginx reverse proxy o Docker
- Evitar usar `nohup` o `&` sin monitoreo de procesos (usar `tmux` si es necesario)

## Conclusión

Con unos pocos ajustes, es completamente posible ejecutar servicios persistentes como nginx y PostgreSQL en WSL2 sin contenedores. Esta configuración es ideal para desarrolladores que necesitan replicar entornos de servidor localmente con flexibilidad, rendimiento y compatibilidad total con Linux desde Windows.

