---
layout: post
title: "Benchmark de performance entre WSL2 y Hyper-V para cargas intensivas"
author: Christian Amado
date: 2024-07-26 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**WSL2** y **Hyper-V** son tecnologías de virtualización de Microsoft que permiten ejecutar entornos Linux sobre Windows. Aunque WSL2 internamente utiliza Hyper-V, existen diferencias en cómo se gestionan los recursos, lo que puede impactar el rendimiento en tareas intensivas como compilación, procesamiento de datos o entrenamiento de modelos.

Este artículo presenta un enfoque comparativo y práctico para medir el rendimiento de ambos entornos en escenarios de carga pesada.

<!--more-->

## Objetivo

- Comparar rendimiento de CPU, disco y memoria en WSL2 vs VM Hyper-V
- Ejecutar pruebas reproducibles con herramientas estándar
- Identificar ventajas y limitaciones de cada entorno según la carga

## Preparación del entorno

En ambos casos se utiliza Ubuntu 22.04 como sistema base, con los mismos paquetes y configuración.

### Para WSL2:

```bash
sudo apt update && sudo apt install -y sysbench stress-ng fio build-essential
```

### Para Hyper-V:

- Crear una máquina virtual con Ubuntu 22.04
- Asignar igual cantidad de CPU (por ejemplo, 4) y memoria (8 GB)
- Instalar los mismos paquetes para benchmark

## Prueba 1: CPU (sysbench)

```bash
sysbench cpu --threads=4 --time=10 run
```

Mide la cantidad de operaciones realizadas por segundo. Ejecutar la misma prueba en ambos entornos y anotar el throughput.

## Prueba 2: I/O en disco (fio)

```bash
fio --name=seqwrite --size=512M --rw=write --bs=4k --numjobs=1 --runtime=30 --group_reporting
```

Esta prueba mide el rendimiento de escritura secuencial. También se puede hacer con lectura (`--rw=read`) o mezcla (`--rw=randrw`).

## Prueba 3: Memoria (stress-ng)

```bash
stress-ng --vm 2 --vm-bytes 1G --timeout 20s
```

Simula presión de memoria con dos workers asignados a 1 GB cada uno.

## Prueba 4: Compilación intensiva

Clonar y compilar un proyecto grande, por ejemplo:

```bash
git clone https://github.com/rust-lang/rust.git
cd rust
./x.py build
```

Comparar el tiempo de compilación completo.

## Resultados esperados

| Prueba            | WSL2     | Hyper-V VM |
|------------------|----------|------------|
| CPU              | Similar  | Similar    |
| Disco (escritura)| Mejor en Hyper-V* | Peor en WSL2* |
| RAM (uso intensivo)| Similar | Similar    |
| Compilación       | Mejor en WSL2 (menos overhead de VM) |

*El rendimiento de disco en WSL2 depende de si se trabaja dentro del FS Linux (`~/`) o en `/mnt/c/`, donde es mucho más lento.

## Buenas prácticas para benchmarking

- Reiniciar ambos entornos antes de cada prueba
- Usar cronómetro o `time` para medir duración total
- Evitar procesos en segundo plano que alteren los resultados
- Repetir pruebas y tomar promedio

## Conclusión

WSL2 ofrece un excelente rendimiento para la mayoría de las cargas intensivas, con ventajas en integración con Windows y facilidad de uso. Hyper-V ofrece más aislamiento y control de hardware, con mejor I/O de disco en algunos casos. La elección depende del tipo de carga y necesidades específicas del entorno de trabajo.