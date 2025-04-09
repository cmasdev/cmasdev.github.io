---
layout: post
title: "Machine learning local distribuido con WSL2 + containers"
author: Christian Amado
date: 2024-10-25 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Una de las grandes ventajas de WSL2 es su compatibilidad con contenedores Docker y acceso a la GPU, lo que lo convierte en un entorno ideal para correr flujos de **machine learning distribuido** desde una única máquina con múltiples contenedores Linux. Esto permite simular ambientes de entrenamiento paralelos, microservicios de inferencia o arquitecturas de orquestación como Ray o Dask desde el entorno Windows, sin necesidad de un clúster real o acceso a la nube.

Este artículo describe cómo configurar y ejecutar cargas distribuidas de ML usando Docker, PyTorch, TensorFlow, y Ray sobre WSL2, aprovechando la integración con NVIDIA GPU y el rendimiento de Linux.

<!--more-->

## Requisitos

- Windows 11 con WSL2
- Docker Desktop con soporte WSL2 y GPU habilitado
- NVIDIA GPU compatible + drivers + WSL CUDA Toolkit
- Distro Ubuntu en WSL2

Verificar GPU:

```bash
nvidia-smi
```

Verificar Docker:

```bash
docker --version
docker info
```

## Paso 1: Crear red de contenedores para ML distribuido

```bash
docker network create ml-network
```

Esto permite que contenedores se comuniquen por nombre dentro de la red.

## Paso 2: Crear imagen base de entrenamiento con GPU

Archivo `Dockerfile`:

```Dockerfile
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime

RUN apt update && apt install -y git iputils-ping
RUN pip install ray[default] dask scikit-learn pandas matplotlib

WORKDIR /workspace
```

Construir imagen:

```bash
docker build -t ml-node .
```

## Paso 3: Ejecutar contenedores coordinados (Ray)

Iniciar nodo principal:

```bash
docker run -it --rm --gpus all --network ml-network --name ray-head ml-node   ray start --head --port=6379
```

En otra terminal, iniciar un nodo worker:

```bash
docker run -it --rm --gpus all --network ml-network --name ray-worker ml-node   ray start --address=ray-head:6379
```

Validar desde un contenedor:

```python
import ray
ray.init(address='auto')
print(ray.cluster_resources())
```

Esto habilita paralelismo local real, útil para prototipos, testing o benchmarking.

## Paso 4: Alternativa con Dask

Dask permite flujos similares con programación paralela y pandas-like API.

```python
from dask.distributed import Client
client = Client("scheduler:8786")
```

## Paso 5: Entrenamiento distribuido con PyTorch o TensorFlow

Utilizar `torch.distributed` o `tf.distribute` para paralelismo manual o con librerías de alto nivel.

Ejemplo básico con `torch.multiprocessing`:

```python
import torch.multiprocessing as mp

def train(rank):
    print(f"Proceso {rank} entrenando")

if __name__ == "__main__":
    mp.spawn(train, nprocs=2)
```

Correr en un contenedor con múltiples procesos o GPUs según configuración.

## Casos de uso prácticos

- Simulación de entrenamiento distribuido sin necesidad de Kubernetes
- Inferencia paralela desde varios servicios contenedorizados
- Microservicios de ML (FastAPI + modelo) en red local entre contenedores
- Pruebas de carga con frameworks de orquestación y métricas

## Buenas prácticas

- Usar `docker-compose` para definir múltiples nodos y servicios
- Configurar volúmenes compartidos con datasets
- Asegurar exposición de puertos entre servicios
- Monitorizar con herramientas como Ray Dashboard (`--dashboard-host 0.0.0.0`)
- Usar contenedores separados por rol (data ingestion, training, inference)

## Conclusión

WSL2, combinado con Docker y acceso a GPU, permite ejecutar flujos avanzados de machine learning distribuido desde una sola máquina. Esta capacidad potencia a desarrolladores, científicos de datos y equipos de investigación para testear y escalar soluciones ML de forma local, rápida y segura antes de llevarlas a producción.