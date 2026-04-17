---
layout: post
title: "BC: Manejo eficiente de grandes conjuntos de datos en AL"
author: Christian Amado
date: 2025-09-17 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

El manejo de grandes volúmenes de datos en Microsoft Dynamics 365 Business Central SaaS es uno de los desafíos más complejos en escenarios empresariales reales. A medida que el sistema crece, tablas como Customer Ledger Entry, Item Ledger Entry, Value Entry o Sales Line pueden alcanzar millones de registros, y cualquier operación mal diseñada sobre estas entidades genera un impacto inmediato en el rendimiento global.

A diferencia de sistemas tradicionales donde se puede intervenir directamente en SQL o escalar infraestructura, en Business Central SaaS el desarrollador debe optimizar exclusivamente a través de patrones de acceso en AL y diseño arquitectónico. Esto implica que cada decisión relacionada con cómo se recorren, filtran y procesan los datos tiene consecuencias directas en la estabilidad del sistema.

<!--more-->
El problema no es únicamente procesar datos grandes, sino hacerlo sin degradar el sistema, sin generar bloqueos y sin comprometer la experiencia de otros usuarios concurrentes.

## El problema
Los errores en manejo de datasets grandes suelen aparecer en producción y bajo carga real. Algunos síntomas típicos incluyen:

- procesos batch que no terminan  
- bloqueos en tablas críticas  
- consumo elevado de memoria  
- timeouts en ejecución  
- degradación general del tenant  

Las causas más comunes son:

- iteraciones completas sin filtros  
- uso incorrecto de FindSet  
- falta de segmentación en el procesamiento  
- lógica pesada dentro de loops  
- ausencia de control de transacciones  

Uno de los errores más graves es asumir que Business Central puede procesar millones de registros de forma monolítica en una sola operación.

## Principios fundamentales
### Segmentación del dataset
Nunca se debe procesar un dataset grande en una sola ejecución. La estrategia debe ser dividir el conjunto en bloques manejables.

### Procesamiento incremental
El procesamiento debe ser continuo y reanudable mediante control de estado.

### Minimización de locks
Se deben diseñar transacciones cortas con commits controlados.

### Reducción de roundtrips
Evitar consultas repetidas dentro de loops.

## Patrones eficientes
### Procesamiento por rangos
```al
Entry.SetRange("Entry No.", FromEntryNo, ToEntryNo);
if Entry.FindSet() then
    repeat
        ProcessEntry(Entry);
    until Entry.Next() = 0;
```

### Uso de claves adecuadas
```al
Entry.SetCurrentKey("Posting Date");
Entry.SetRange("Posting Date", StartDate, EndDate);
```

### Control de transacciones
```al
if Counter mod 1000 = 0 then
    Commit();
```

### Tablas temporales
Reducen accesos repetidos.

### Procesamiento asincrónico
Uso de Job Queue para cargas pesadas.

## Anti-patterns críticos
- recorrer tablas completas sin filtros  
- procesar grandes volúmenes en una sola transacción  
- usar FlowFields en loops masivos  
- no controlar commits  

## Conclusiones
El manejo eficiente de grandes datasets en Business Central es un problema de arquitectura. La segmentación, el procesamiento incremental y el control de transacciones son esenciales para garantizar estabilidad y escalabilidad.