---
layout: post
title: "BC: Estrategias de optimización del rendimiento para extensiones de AL"
author: Christian Amado
date: 2025-08-20 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Optimizar performance en Microsoft Dynamics 365 Business Central SaaS no es una tarea opcional en entornos empresariales: es una necesidad crítica. A medida que los sistemas crecen en volumen de datos, número de usuarios e integraciones, cualquier ineficiencia en el código AL o en el diseño funcional se amplifica.

A diferencia de sistemas on-premise, en SaaS no se tiene control sobre la infraestructura. No se puede “escalar hardware”, ni ajustar SQL directamente. Todo debe resolverse a nivel de:

- diseño de datos  
- patrones de acceso  
- lógica AL  
- arquitectura de procesos  

<!--more-->
Por eso, la optimización en Business Central no es un tema de tuning puntual, sino de diseño desde el inicio.

## El problema
Los problemas de performance en BC suelen aparecer tarde:

- lentitud en páginas  
- procesos batch que no terminan  
- bloqueos en posting  
- timeouts en integraciones  

Y casi siempre tienen las mismas causas:

### 1. Acceso ineficiente a datos
- loops sobre grandes tablas  
- falta de filtros adecuados  
- uso incorrecto de FindSet / FindFirst  

### 2. Uso incorrecto de triggers
- lógica pesada en OnValidate  
- cálculos en OnAfterGetRecord  
- dependencia excesiva de eventos  

### 3. Transacciones largas
- múltiples operaciones dentro de una sola transacción  
- locks prolongados  

### 4. Falta de batch processing
- procesamiento registro por registro sin control  

## Principios de optimización
### 1. Minimizar roundtrips a base de datos
Cada acceso a datos cuesta. Evitar:

- llamadas dentro de loops  
- búsquedas repetidas  

Preferir:

```al
if Rec.FindSet() then
    repeat
        // procesar en memoria
    until Rec.Next() = 0;
```

### 2. Usar FindSet correctamente
```al
Rec.FindSet(true, false);
```

- true → lock optimista  
- false → evita carga innecesaria  

### 3. Filtrar siempre antes de leer
```al
Rec.SetRange("Customer No.", CustNo);
Rec.FindSet();
```

Nunca recorrer tablas completas sin necesidad.

### 4. Evitar lógica pesada en UI
No ejecutar:

- cálculos complejos en páginas  
- integraciones en triggers  

Mover a:

- background processing  
- Job Queue 

### 5. Batch processing
Procesar en bloques:

- reduce locks  
- mejora resiliencia 

### 6. Reducir tamaño de transacciones
Separar procesos grandes:

```al
Commit();
```

Usar con cuidado, pero necesario en procesos largos.

## Patrones avanzados
### 1. Caching lógico
Guardar resultados en memoria temporal:

```al
TempRec.Insert();
```

Evita recalcular.

### 2. Staging tables
Procesar fuera del flujo principal:

- staging → validación → commit  

### 3. Paralelismo controlado
Usar múltiples Job Queues:

- separar cargas  
- evitar cuellos de botella  

## Anti-patterns críticos
❌ loops sobre tablas completas  
❌ lógica en triggers  
❌ integraciones síncronas en procesos críticos  
❌ transacciones gigantes  
❌ falta de filtros 

## Trade-offs
### Optimizar vs complejidad
Más performance implica:

- más arquitectura  
- más código  
- más control  

Pero es necesario en sistemas reales.

## Buenas prácticas
- medir antes de optimizar  
- usar telemetry (Application Insights)  
- probar con datos reales  
- diseñar pensando en volumen  

## Conclusiones
La optimización de performance en Business Central no es un ajuste final, sino un principio de diseño.

Los sistemas que no consideran performance desde el inicio:

- se degradan rápidamente  
- generan problemas operativos  
- se vuelven difíciles de mantener  

Un enfoque basado en:

- acceso eficiente a datos  
- batch processing  
- separación de responsabilidades  

permite construir soluciones escalables y robustas.