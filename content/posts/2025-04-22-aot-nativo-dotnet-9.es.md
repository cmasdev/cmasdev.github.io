---
layout: post
title: "Native AOT en .NET 9"
author: Christian Amado
date: 2025-04-22 11:43:00 -0300
category: [Desarrollo de software]
tags: [.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

Con cada nueva versión de **.NET**, **Microsoft** ha trabajado activamente en mejorar el rendimiento, el tamaño de despliegue y la experiencia en entornos de bajo consumo. Uno de los avances más importantes en este sentido es **Native AOT** (*Ahead-of-Time Compilation*). Introducido como parte estable en **.NET 7**, y refinado aún más en **.NET 8** y **.NET 9**, **Native AOT** permite compilar aplicaciones directamente a código nativo, eliminando por completo la dependencia del **CLR** en tiempo de ejecución.

Este artículo explora cómo utilizar **Native AOT** en aplicaciones de consola en **.NET 9**, con un enfoque práctico para reducir significativamente el tiempo de arranque y el consumo de memoria.

<!--more-->

## ¿Qué es Native AOT?

Native AOT (Ahead-of-Time) es un modelo de compilación en el que el código IL (Intermediate Language) generado por el compilador C# es transformado directamente en código máquina antes de que la aplicación se ejecute. Esto contrasta con el modelo Just-in-Time (JIT), que compila partes del IL durante la ejecución.

### Ventajas clave:
- **Tiempo de arranque más rápido** (ideal para herramientas CLI y contenedores).
- **Menor consumo de memoria**, ya que se evita el motor JIT.
- **Distribución como binario único y autónomo**.
- **Mejor compatibilidad con entornos restringidos (por ejemplo, Alpine Linux)**.

## Requisitos previos

- **.NET 9 SDK**.
- **Visual Studio 2022 (v17.8 o superior)** o cualquier editor con soporte para .NET 9.
- Sistemas operativos compatibles: Windows, Linux, macOS.

> Nota: Native AOT **no soporta** todo el ecosistema de .NET (por ejemplo, no es compatible con Reflection completa ni con `Assembly.Load` dinámico). Es ideal para escenarios **de consola, CLI, microservicios simples o herramientas de línea de comandos**.

## Crear una aplicación de consola con Native AOT

### Paso 1: Crear el proyecto

```bash
dotnet new console -n AotConsoleApp
cd AotConsoleApp
```

### Paso 2: Modificar el archivo `.csproj`

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
    <PublishAot>true</PublishAot>
    <InvariantGlobalization>true</InvariantGlobalization>
    <StripSymbols>true</StripSymbols>
    <IlcOptimizationPreference>Size</IlcOptimizationPreference>
    <UseSystemResourceKeys>false</UseSystemResourceKeys>
  </PropertyGroup>
</Project>
```

### Paso 3: Escribir código de ejemplo

```csharp
using System;

Console.WriteLine("¡Hola desde Native AOT!");
```

### Paso 4: Publicar con AOT

```bash
dotnet publish -c Release -r win-x64 --self-contained true
```

## Medición de rendimiento

### Tiempo de arranque (ejemplo en Windows con `Measure-Command`):

```powershell
Measure-Command { .\AotConsoleApp.exe }
```

| Modelo       | Tiempo arranque | Memoria inicial |
|--------------|-----------------|------------------|
| .NET JIT     | 150-200 ms      | ~40-60 MB        |
| Native AOT   | 10-20 ms        | ~5-10 MB         |

## Buenas prácticas y consideraciones

### 1. Evitar reflexión no compatible

```csharp
// ❌ Esto fallará
Type.GetType("System.String");

// ✅ Alternativa
typeof(string);
```

### 2. Minimizar dependencias

### 3. Evaluar uso de `Trimming`

```xml
<PublishTrimmed>true</PublishTrimmed>
```

### 4. Optimizar para tamaño o velocidad

- `Speed`: para maximizar el rendimiento.
- `Size`: para minimizar el binario.

### 5. Multiplataforma

Compilar por separado para cada `RID`.

## Escenarios ideales para Native AOT

- Herramientas de línea de comandos.
- Microservicios autónomos.
- Contenedores minimalistas.
- Cronjobs o tareas agendadas.

## Conclusión

**Native AOT** en **.NET 9** representa un avance significativo en la capacidad de **.NET** para competir en entornos donde el rendimiento, el tamaño del binario y la velocidad de arranque son críticos. Si bien aún presenta limitaciones respecto a reflexión, carga dinámica y ciertas bibliotecas, para escenarios de consola, herramientas y microservicios es una solución madura, estable y recomendada.