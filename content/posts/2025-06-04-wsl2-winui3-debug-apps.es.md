---
layout: post
title: "Cómo depurar aplicaciones WinUI 3 con herramientas del sistema operativo"
author: Christian Amado
date: 2025-06-04 00:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Desarrollar aplicaciones modernas con **WinUI 3** implica más que escribir código funcional: también requiere un enfoque riguroso hacia el diagnóstico y la resolución de problemas en producción. Las aplicaciones construidas con el **Windows App SDK** pueden presentar cuellos de botella, pérdidas de memoria o bloqueos del hilo de interfaz de usuario, especialmente cuando combinan operaciones intensivas, concurrencia y bindings visuales complejos.

Este artículo explora un conjunto de herramientas avanzadas del sistema operativo Windows que permiten depurar, perfilar y estabilizar aplicaciones **WinUI 3** en distintos entornos. La combinación de **Event Viewer**, **Windows Performance Analyzer**, **PerfView**, y herramientas de diagnóstico de Visual Studio proporciona una visión profunda del comportamiento interno de estas aplicaciones.

<!--more-->

## Instrumentación mínima recomendada

Antes de comenzar cualquier depuración avanzada, la aplicación debe emitir eventos e información de diagnóstico. Algunas prácticas esenciales incluyen:

- Registrar excepciones no controladas en archivos de log.
- Utilizar `EventSource` para emitir trazas personalizadas.
- Habilitar métricas con `System.Diagnostics.Metrics` o counters personalizados.

Estas medidas permiten correlacionar eventos del sistema operativo con acciones específicas del usuario o de la lógica de la aplicación.

## Uso de Event Viewer para errores en producción

**Event Viewer** es la primera línea de diagnóstico en entornos donde el debugger no está disponible.

### Pasos recomendados:

1. Abrir Event Viewer (`eventvwr.msc`).
2. Navegar a **Windows Logs > Application**.
3. Filtrar eventos por nombre de la aplicación o ID de evento.
4. Prestar atención a:
   - `Application Error` con `Exception code: 0xc0000005` (acceso a memoria inválido).
   - `Faulting module path` que apunta a bibliotecas no gestionadas.
   - `.NET Runtime` con detalles de excepciones CLR no controladas.

> En aplicaciones MSIX, también se puede consultar `Microsoft-Windows-AppModel-Runtime/Admin`.

## Diagnóstico con Windows Performance Analyzer (WPA)

**WPA**, parte del Windows Performance Toolkit, permite analizar la actividad de hilos, uso de CPU, bloqueos, y tiempos de renderizado.

### Escenario: bloqueo de la interfaz durante carga de datos

1. Ejecutar **WPR** con los perfiles `UI Delays`, `CPU Usage`, y `XAML Analysis`.
2. Usar la aplicación hasta reproducir el retraso.
3. Abrir el archivo `.etl` con **WPA** y examinar:
   - `CPU Usage (Precise)` > agrupar por hilo > buscar el UI Thread.
   - `XAML Parsing & Layout` para identificar cuellos de botella de renderizado.
   - `UI Delay Analysis` para obtener gráficos de latencia visual.

### Recomendación

Evitar operaciones síncronas pesadas en el hilo de UI. Usar `Task.Run` o `DispatcherQueue.TryEnqueue` para descargar trabajo al hilo de fondo.

## Análisis de memoria y fugas con PerfView

**PerfView** ofrece una vista detallada de las asignaciones de memoria y los tiempos de ejecución.

### Escenario: crecimiento progresivo de memoria

1. Descargar y ejecutar **PerfView**.
2. Realizar una captura: `Collect > Run`, ejecutar la app y detener tras algunas acciones.
3. Abrir `Heap Snapshots > Diff` para comparar uso de memoria entre dos momentos.
4. Investigar objetos que permanecen anclados (`GC Root`) y posibles referencias circulares.

> Útil para detectar ViewModels que no se eliminan al navegar entre vistas, o listeners no removidos.

## Visual Studio Diagnostic Tools

Durante una sesión de depuración en modo Debug, Visual Studio ofrece paneles útiles:

- **Memory Usage**: tomar snapshots, buscar crecimiento de colecciones.
- **CPU Usage**: localizar métodos intensivos en CPU.
- **Events**: rastrear eventos de entrada, bindings y excepciones.
- **Thread Activity**: visualizar cambios de contexto y tareas asincrónicas.

### Ejemplo

Un `ItemsRepeater` que tarda demasiado en cargar puede estar ejecutando bindings complejos en el hilo principal. Esto puede optimizarse con `x:Load` diferido o simplificando el `DataTemplate`.

## Captura de trazas en producción con `dotnet-trace`

`dotnet-trace` permite capturar trazas de eventos en tiempo de ejecución incluso fuera del depurador.

```bash
dotnet-trace collect -p <pid> --providers Microsoft-Windows-DotNETRuntime
```

El archivo resultante (`.nettrace`) puede analizarse con PerfView o WPA, permitiendo detectar:

- Recolecciones de GC anómalas.
- Excepciones no visibles desde logs.
- Latencia de tareas asincrónicas.

## Conclusión

Depurar una aplicación WinUI 3 de forma eficaz implica ir más allá del uso del debugger tradicional. Las herramientas del sistema operativo permiten acceder a datos detallados del comportamiento en ejecución, facilitando la identificación de problemas de rendimiento, fugas de memoria y condiciones de carrera.

Adoptar una estrategia de diagnóstico basada en herramientas como **WPA**, **PerfView**, **Event Viewer**, y **dotnet-trace**, no solo mejora la estabilidad de las aplicaciones, sino que eleva el estándar técnico del desarrollo en Windows.