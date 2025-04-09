---
layout: post
title: "Entrenamiento de modelos de ML en WSL2 con CUDA y cuDNN"
author: Christian Amado
date: 2024-08-30 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Con la llegada del soporte oficial de GPU a WSL2, Windows se transforma en una plataforma viable y potente para desarrollo de inteligencia artificial desde un entorno Linux real. Gracias a la integración de CUDA y cuDNN, es posible entrenar modelos intensivos directamente desde WSL2, sin necesidad de usar máquinas virtuales completas ni infraestructura en la nube.

Este artículo guía el proceso completo de habilitación de GPU, instalación de herramientas y entrenamiento con PyTorch, incluyendo consideraciones prácticas, troubleshooting y optimización de recursos.

<!--more-->

## Arquitectura: cómo funciona la GPU en WSL2

- WSL2 ejecuta un kernel Linux real dentro de una VM gestionada por Windows
- NVIDIA desarrolló un stack que permite exponer la GPU del host Windows al kernel Linux de WSL2
- La interfaz expuesta es `libcuda.so`, compatible con CUDA Toolkit y cuDNN
- Desde Linux, se puede usar `nvidia-smi`, `nvcc` y cualquier framework ML compatible con CUDA

## Verificar drivers NVIDIA en Windows

Es importante instalar la versión correcta del driver para CUDA en WSL2:

1. Descargar desde: [https://developer.nvidia.com/cuda/wsl](https://developer.nvidia.com/cuda/wsl)
2. Verificar en PowerShell:

```powershell
nvidia-smi
```

Se debe ver la versión del driver y el modelo de la GPU (ej: RTX 3080).

## Preparar el entorno WSL2

Crear una distro Ubuntu específica para ML:

```bash
wsl --install -d Ubuntu
```

O usar una distro existente y prepararla:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-venv build-essential nvidia-cuda-toolkit
```

Verificar acceso:

```bash
nvidia-smi
```

Si aparece “No devices were found”, cerrar con `wsl --shutdown` y reiniciar.

## Crear entorno virtual para ML

```bash
python3 -m venv ~/.venvs/ml
source ~/.venvs/ml/bin/activate
pip install --upgrade pip
```

Instalar bibliotecas de IA con soporte CUDA:

### PyTorch (CUDA 11.8):

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### TensorFlow (CUDA 11.2+):

```bash
pip install tensorflow
```

## Validar entorno con PyTorch

```python
import torch

if torch.cuda.is_available():
    print("GPU detectada:", torch.cuda.get_device_name(0))
else:
    print("CUDA no está disponible.")
```

## Caso práctico: entrenamiento con GPU

### Código completo (PyTorch)

```python
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

# Datos sintéticos
X = torch.randn(5000, 20)
y = torch.randn(5000, 1)

# Dataset
ds = TensorDataset(X, y)
loader = DataLoader(ds, batch_size=64)

# Modelo simple
model = nn.Sequential(nn.Linear(20, 128), nn.ReLU(), nn.Linear(128, 1)).cuda()
loss_fn = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters())

# Entrenamiento
for epoch in range(10):
    for batch_x, batch_y in loader:
        batch_x, batch_y = batch_x.cuda(), batch_y.cuda()
        pred = model(batch_x)
        loss = loss_fn(pred, batch_y)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")
```

## Optimización y monitoreo

### Monitoreo de GPU

Desde WSL2:

```bash
watch -n 1 nvidia-smi
```

O usar `gpustat`:

```bash
pip install gpustat
gpustat
```

### Control de dispositivos

Si se desea usar una sola GPU en multi-GPU:

```bash
CUDA_VISIBLE_DEVICES=0 python train.py
```

### Configurar uso mixto de CPU/GPU

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
```

## Buenas prácticas

- Activar entorno virtual siempre (`source ~/.venvs/ml/bin/activate`)
- Mantener requirements.txt actualizado (`pip freeze > requirements.txt`)
- Usar notebooks desde VS Code con Remote WSL + Jupyter
- Evitar ejecutar entrenamiento desde `/mnt/c/` (mejor rendimiento en `~/`)
- Desactivar reenvíos de puertos innecesarios en WSL para liberar recursos

## Conclusión

WSL2 con soporte CUDA y cuDNN permite ejecutar flujos completos de entrenamiento de IA con aceleración por GPU directamente desde Windows. Esta arquitectura híbrida simplifica el desarrollo y la depuración, al mismo tiempo que mantiene la potencia y flexibilidad del ecosistema Linux para ciencia de datos y machine learning avanzado.