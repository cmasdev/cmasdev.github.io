---
layout: post
title: "Compilación cruzada para Linux y Windows desde WSL2"
author: Christian Amado
date: 2024-06-21 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Uno de los beneficios clave de WSL2 es la posibilidad de compilar binarios para Linux dentro de un entorno Linux completo, mientras se sigue trabajando desde Windows. Además, es posible configurar **compilación cruzada** para generar ejecutables de Windows (`.exe`) directamente desde WSL2, lo cual es útil para flujos de trabajo DevOps, empaquetado o testing multiplataforma.

<!--more-->

### 🎯 Objetivo

- Compilar aplicaciones para Linux directamente en WSL2
- Generar ejecutables `.exe` de Windows desde WSL2 usando MinGW
- Compilar con CMake y Go para ambos entornos
- Automatizar la compilación multiplataforma

## ⚙️ Paso 1: Preparar entorno de compilación en WSL2

```bash
sudo apt update
sudo apt install -y build-essential cmake mingw-w64 gcc g++ git
```

Verificar toolchains:

```bash
gcc --version
x86_64-w64-mingw32-gcc --version
```

## 🧪 Paso 2: Compilar binario nativo para Linux

Crear archivo `hello.c`:

```c
#include <stdio.h>
int main() {
    printf("Hola desde Linux\n");
    return 0;
}
```

Compilar:

```bash
gcc hello.c -o hello-linux
./hello-linux
```

## 🪟 Paso 3: Compilar para Windows (.exe) desde WSL2

Usar MinGW para compilar en formato Windows:

```bash
x86_64-w64-mingw32-gcc hello.c -o hello.exe
```

Mover el binario a Windows:

```bash
cp hello.exe /mnt/c/Users/tuusuario/Desktop/
```

Ejecutar desde PowerShell:

```powershell
C:\Users\tuusuario\Desktop\hello.exe
```

## 🛠️ Paso 4: Compilación cruzada con CMake

Estructura de proyecto:

```
miapp/
├── CMakeLists.txt
└── main.c
```

CMakeLists.txt:

```cmake
cmake_minimum_required(VERSION 3.10)
project(miapp)
add_executable(miapp main.c)
```

Build Linux:

```bash
mkdir build-linux && cd build-linux
cmake ..
make
```

Build Windows:

```bash
mkdir build-win && cd build-win
cmake -DCMAKE_SYSTEM_NAME=Windows -DCMAKE_C_COMPILER=x86_64-w64-mingw32-gcc ..
make
```

## 💡 Paso 5: Compilar con Go para ambos entornos

```bash
sudo apt install -y golang
```

Go detecta plataforma con variables `GOOS` y `GOARCH`.

```bash
# Linux nativo
go build -o hello-linux main.go

# Windows desde WSL2
GOOS=windows GOARCH=amd64 go build -o hello.exe main.go
```

## ✅ Conclusión

WSL2 permite compilar aplicaciones para Linux y Windows sin salir del entorno de desarrollo, facilitando pruebas, empaquetado y automatización de builds multiplataforma. Con herramientas como MinGW, CMake y Go, es posible mantener un flujo productivo y coherente desde una única máquina.