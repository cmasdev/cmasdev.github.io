---
layout: post
title: "WSL2 + NVIDIA GPU: configuración óptima para workloads de IA"
author: Christian Amado
date: 2024-05-10 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Desde mediados de 2020, WSL2 ofrece soporte oficial para **aceleración por GPU con NVIDIA**. Esto permite ejecutar frameworks como **[PyTorch]**(https://pytorch.org/get-started/locally/) o **TensorFlow** con **[CUDA]**(https://docs.nvidia.com/cuda/wsl-user-guide/index.html) directamente desde **Linux** en **Windows**, ideal para tareas de entrenamiento y prueba de modelos de inteligencia artificial.

<!--more-->

## 🎯 Objetivo

Configurar un entorno de desarrollo basado en WSL2 con soporte GPU, incluyendo:
- Acceso a GPU NVIDIA desde el subsistema Linux
- Instalación de CUDA Toolkit y cuDNN
- Ejecución de scripts con PyTorch y verificación del entorno
- Prácticas recomendadas para aprovechar la aceleración por hardware

## 🧰 Requisitos previos

- Windows 11 (o Windows 10 21H2 en adelante)
- WSL2 instalado y actualizado (`wsl --update`)
- GPU NVIDIA compatible (preferentemente RTX)
- Driver de GPU actualizado: [nvidia.com/Download](https://www.nvidia.com/Download/index.aspx)

Verificación del entorno desde PowerShell:

```
nvidia-smi
```

## ⚙️ Paso 1: Activar WSL2 con soporte GPU

Instalar WSL y una distribución como Ubuntu 22.04:

```
wsl --install -d Ubuntu
```

Actualizar WSL a la última versión:

```
wsl --update
wsl --shutdown
```

## 🚀 Paso 2: Instalar CUDA y herramientas base en WSL2

Desde la terminal Linux en WSL2:

```
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential dkms
```

Agregar repositorios oficiales de NVIDIA:

```
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/libnvidia-container/ubuntu$distribution/libnvidia-container.list | sudo tee /etc/apt/sources.list.d/nvidia-container.list
sudo apt update
sudo apt install -y nvidia-driver-535 nvidia-cuda-toolkit
```

## 🧪 Paso 3: Verificar acceso a la GPU desde WSL2

Dentro del entorno WSL2:

```
nvidia-smi
```

El sistema debe mostrar la tarjeta gráfica, memoria y uso actual.

## 🧠 Paso 4: Instalar PyTorch con soporte CUDA

```
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

Verificar el acceso a la GPU desde un script:

```
import torch
print("CUDA disponible:", torch.cuda.is_available())
print("GPU:", torch.cuda.get_device_name(0))
```

## 🛠️ Solución de problemas comunes

- Si `nvidia-smi` no detecta la GPU, asegurarse de tener los drivers y WSL actualizados.
- No se recomienda instalar CUDA directamente desde la web de NVIDIA; es preferible utilizar los repos oficiales para WSL.
- Es importante reiniciar el entorno después de cambios: `wsl --shutdown`

## 📈 Buenas prácticas

- Utilizar distribuciones ligeras como Debian o Ubuntu minimal para reducir el uso de recursos.
- Configurar límites de recursos en `.wslconfig` si se comparte la GPU con otros procesos.
- Monitorear la temperatura y uso con `nvidia-smi`.
- Emplear `tmux` o `screen` para mantener tareas de entrenamiento corriendo en segundo plano.

## ✅ Conclusión

Configurar **WSL2** con acceso a **GPU NVIDIA** representa una alternativa práctica y poderosa para ejecutar flujos de trabajo de **IA** desde un entorno **Linux** en **Windows**. Esta solución permite acelerar el desarrollo y pruebas de modelos, aprovechando la compatibilidad de herramientas modernas con **CUDA** y **PyTorch**.