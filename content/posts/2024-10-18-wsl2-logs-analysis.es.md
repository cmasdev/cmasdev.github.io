---
layout: post
title: "Análisis de logs y observabilidad con herramientas Linux"
author: Christian Amado
date: 2024-10-18 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Una ventaja clave de usar WSL2 es tener acceso completo al ecosistema de herramientas de Linux, incluyendo aquellas utilizadas para análisis de logs, monitoreo y observabilidad. Esto permite replicar entornos de producción o staging de forma local, validar configuraciones, depurar servicios y construir flujos completos de análisis desde la línea de comandos.

Este artículo explora cómo aprovechar herramientas como `journalctl`, `logrotate`, `grep`, `htop`, `iftop`, `bmon`, `dstat`, `atop`, `goaccess` y más, directamente desde una terminal en WSL2 para tener visibilidad del sistema, servicios y tráfico de red.

<!--more-->

## Requisitos

- WSL2 con distribución Ubuntu 20.04 o 22.04
- Acceso `sudo` para instalar herramientas
- Servicios activos (nginx, PostgreSQL, Python web server, etc.)

## Análisis de logs clásicos con `grep`, `awk`, `less`

```bash
cd /var/log
sudo less syslog
sudo tail -f nginx/access.log
sudo grep "error" nginx/error.log
```

Buscar patrones o errores:

```bash
grep -i "fail" auth.log
awk '{print $1, $2, $3, $5}' nginx/access.log | sort | uniq -c | sort -nr
```

## Observabilidad del sistema

### Procesos en tiempo real

```bash
htop
```

Filtrar por nombre, CPU o RAM. Permite ordenar e identificar cuellos de botella.

### Uso de red por proceso

```bash
sudo iftop
sudo bmon
```

Monitorean el tráfico entrante y saliente en `eth0` (interfaz de WSL).

## Uso de `dstat` y `atop` para análisis extendido

```bash
sudo apt install -y dstat atop
```

Visualizar métricas combinadas:

```bash
dstat -cdnm
```

Para monitoreo prolongado:

```bash
sudo atop
```

## Manejo y rotación de logs

Instalar `logrotate`:

```bash
sudo apt install -y logrotate
```

Configurar rotación para logs personalizados:

```bash
sudo nano /etc/logrotate.d/custom
```

Ejemplo:

```
/home/usuario/proyecto/logs/*.log {
    weekly
    rotate 4
    compress
    missingok
    notifempty
    create 640 usuario usuario
}
```

Ejecutar rotación manual:

```bash
sudo logrotate -f /etc/logrotate.d/custom
```

## Visualización de logs web con GoAccess

Instalar:

```bash
sudo apt install -y goaccess
```

Analizar logs de nginx:

```bash
sudo goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED
```

Abrir `report.html` en navegador para ver estadísticas de tráfico, IPs, status codes y más.

## Automatizar análisis con scripts

Ejemplo de script `log-insights.sh`:

```bash
#!/bin/bash
echo "Errores recientes:"
tail -n 50 /var/log/nginx/error.log | grep -i "error"

echo "IPs más frecuentes:"
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10
```

Dar permisos:

```bash
chmod +x log-insights.sh
```

Ejecutar periódicamente o como parte de debugging.

## Buenas prácticas

- Evitar usar `journalctl` (no disponible sin systemd en WSL2)
- Usar `nohup` o `tee` para guardar logs de procesos manuales
- Monitorear tráfico entre servicios con `netstat`, `ss` o `lsof`
- Limitar permisos de lectura en logs sensibles (`chmod 640`)
- Automatizar análisis postmortem con scripts por proyecto

## Conclusión

Con WSL2 es posible construir flujos completos de observabilidad y análisis de logs utilizando herramientas estándar de Linux. Esto permite a los equipos depurar localmente, simular entornos productivos, y aplicar técnicas profesionales de monitoreo sin salir de Windows. Un entorno ideal para desarrollo, QA, seguridad y debugging distribuido.