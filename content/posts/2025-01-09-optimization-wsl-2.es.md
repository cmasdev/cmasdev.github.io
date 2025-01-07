---
layout: post
title: "Optimización avanzada de rendimiento en WSL para desarrollo intensivo"
author: Christian Amado
date: 2025-01-09 00:00:00 -0400
category: [Windows]
tags: [WinDev, WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

El Subsistema de Windows para Linux (WSL) ha demostrado ser una herramienta esencial para desarrolladores que buscan integrar Linux en su flujo de trabajo en Windows. Sin embargo, para obtener el mejor rendimiento en escenarios de desarrollo intensivo, es importante realizar ajustes y configuraciones avanzadas. En este artículo, aprenderás cómo optimizar **WSL** con ejemplos prácticos y código, además de visualizar los resultados con capturas de pantalla y diagramas.

<!--more-->

## 1. Configuración de recursos asignados

WSL 2 utiliza una máquina virtual ligera para ejecutar el kernel de Linux. De forma predeterminada, WSL asigna recursos de manera dinámica, pero puedes ajustar manualmente la cantidad de CPU y memoria disponibles para mejorar el rendimiento.

### Paso 1: Crear o editar el archivo `.wslconfig`

1. Abre el archivo `.wslconfig` en el directorio de tu usuario:
   ```
   notepad %USERPROFILE%\.wslconfig
   ```
2. Configura los parámetros según tus necesidades:
   ```
   [wsl2]
   memory=4GB  # Límite de memoria RAM
   processors=2  # Número de CPUs asignadas
   ```
3. Reinicia WSL para aplicar los cambios:
   ```
   wsl --shutdown
   wsl
   ```

## 2. Mejorar el rendimiento del sistema de archivos

Las operaciones de E/S son un área donde el rendimiento puede degradarse, especialmente al trabajar con archivos en el sistema de Windows desde Linux. Para mejorar esto:

### Paso 1: Usa el sistema de archivos de Linux para proyectos intensivos
Guarda tu código y datos en el sistema de archivos nativo de Linux (`/home/<usuario>` en lugar de `/mnt/c`) para minimizar la latencia.

```
# Crear un directorio en el sistema de archivos de Linux
mkdir -p ~/projects/my-intensive-app

# Clonar un repositorio
cd ~/projects/my-intensive-app
git clone https://github.com/example/project.git
```

### Paso 2: Deshabilitar el acceso automático a carpetas de Windows
Evita que WSL indexe innecesariamente carpetas de Windows configurando los métodos de montaje:

1. Agrega esta configuración a `.wslconfig`:
   ```
   [automount]
   enabled=false
   ```
2. Reinicia WSL.

### Visualización
![](https://i.ibb.co/NNF0gF4/lectura-vs-escritura-wsl.png)

## 3. Configurar un servidor DNS personalizado

Por defecto, WSL utiliza el servidor DNS de Windows. Sin embargo, puedes mejorar el rendimiento de las solicitudes de red configurando un servidor DNS optimizado.

### Paso 1: Modificar el archivo de resolución de DNS
1. Crea o edita `/etc/wsl.conf` en tu distribución:
   ```
   sudo nano /etc/wsl.conf
   ```
2. Agrega las siguientes líneas:
   ```
   [network]
   generateResolvConf = false
   ```
3. Configura manualmente el servidor DNS:
   ```
   sudo rm /etc/resolv.conf
   echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
   ```
4. Reinicia WSL:
   ```
   wsl --shutdown
   wsl
  ```

## 4. Habilitar aceleración de hardware para Docker

Si utilizas Docker en WSL 2, habilitar la aceleración de hardware puede reducir los tiempos de construcción y mejorar la eficiencia general.

### Paso 1: Instalar los controladores de GPU
1. Asegúrate de tener los controladores de GPU compatibles con WSL 2 instalados:
   - [Controladores NVIDIA para CUDA en WSL](https://developer.nvidia.com/cuda/wsl)

### Paso 2: Configurar Docker para usar GPU
1. Instala el paquete `nvidia-container-toolkit` dentro de tu distribución:
   ```
   sudo apt update
   sudo apt install -y nvidia-container-toolkit
   ```
2. Verifica que la GPU esté disponible:
   ```
   docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
   ```

## 5. Ajustar la configuración del kernel Linux

WSL 2 utiliza un kernel Linux real que puede ajustarse para optimizar su rendimiento. Esto se logra a través del archivo `/etc/sysctl.conf`.

### Paso 1: Optimizar parámetros de red
1. Edita `/etc/sysctl.conf`:
   ```
   sudo nano /etc/sysctl.conf
   ```
2. Agrega los siguientes ajustes:
   ```
   net.core.default_qdisc=fq
   net.ipv4.tcp_congestion_control=bbr
   ```
3. Aplica los cambios:
   ```
   sudo sysctl -p
   ```

## Conclusión

Con estos ajustes, puedes optimizar **WSL** para maximizar su rendimiento en proyectos de desarrollo intensivo. Desde la asignación eficiente de recursos hasta la configuración de red y almacenamiento, estos pasos te ayudarán a aprovechar al máximo esta poderosa herramienta.