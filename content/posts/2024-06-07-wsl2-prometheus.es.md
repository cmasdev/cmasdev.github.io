---
layout: post
title: "Telemetría y monitoreo de procesos WSL2 con herramientas como Prometheus"
author: Christian Amado
date: 2024-06-07 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

El monitoreo de recursos y procesos es clave en cualquier entorno de desarrollo o pruebas. Gracias a la compatibilidad de WSL2 con herramientas Linux estándar, es posible usar soluciones de **observabilidad como Prometheus** y **Node Exporter** para visualizar el rendimiento del entorno WSL2 de forma clara y eficiente.

<!--more-->

## 🎯 Objetivo

- Exponer métricas del entorno Linux en WSL2
- Instalar y configurar **Node Exporter**
- Usar **Prometheus** para recolectar y visualizar métricas
- Explorar métricas útiles para desarrolladores y DevOps

## ⚙️ Paso 1: Preparar entorno WSL2

Instalar paquetes esenciales:

```bash
sudo apt update && sudo apt install -y wget curl tar
```

Crear carpeta de monitoreo:

```bash
mkdir -p ~/monitoring && cd ~/monitoring
```

## 📦 Paso 2: Instalar Node Exporter

Descargar binarios oficiales:

```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvf node_exporter-1.7.0.linux-amd64.tar.gz
cd node_exporter-1.7.0.linux-amd64
```

Ejecutar Node Exporter:

```bash
./node_exporter
```

Por defecto se expone en `http://localhost:9100/metrics`

## 🔍 Paso 3: Verificar métricas

Acceder desde el navegador o con `curl`:

```bash
curl http://localhost:9100/metrics | grep cpu
```

Métricas disponibles incluyen:
- CPU usage
- Memory
- Disk I/O
- Network stats
- Load average

## 📈 Paso 4: Configurar Prometheus para recolectar datos

Crear archivo `prometheus.yml`:

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'wsl2-node'
    static_configs:
      - targets: ['localhost:9100']
```

Descargar y ejecutar Prometheus:

```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.48.0/prometheus-2.48.0.linux-amd64.tar.gz
tar xvf prometheus-2.48.0.linux-amd64.tar.gz
cd prometheus-2.48.0.linux-amd64
./prometheus --config.file=prometheus.yml
```

Interfaz disponible en `http://localhost:9090`

## 🛠️ Integración con Docker (opcional)

Se puede ejecutar **Node Exporter** y **Prometheus** como contenedores:

```bash
docker run -d -p 9100:9100 --name node_exporter prom/node-exporter
docker run -d -p 9090:9090 -v $PWD/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

## ✅ Conclusión

WSL2 permite monitorizar recursos de manera profesional usando herramientas estándar como **Prometheus**. Esto es ideal para desarrolladores que necesitan observar el uso de CPU, RAM y procesos intensivos sin salir de su entorno **Windows**, facilitando la implementación de prácticas **DevOps** y **DataOps**.