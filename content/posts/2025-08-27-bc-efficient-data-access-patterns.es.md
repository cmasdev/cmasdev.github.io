---
layout: post
title: "BC: Patrones de acceso eficiente a datos"
author: Christian Amado
date: 2025-08-27 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, el acceso a datos es uno de los factores más determinantes en el rendimiento global del sistema. A diferencia de entornos tradicionales donde se puede optimizar directamente la base de datos, en Business Central SaaS todo el control recae sobre cómo se diseñan y ejecutan los patrones de acceso desde AL.

Cada operación de lectura o escritura implica interacción con la capa de datos gestionada por la plataforma. Por lo tanto, decisiones aparentemente simples como usar FindSet en lugar de FindFirst, o aplicar correctamente un SetRange, tienen un impacto directo en tiempos de respuesta, consumo de recursos, bloqueos y escalabilidad.

<!--more-->
En entornos empresariales con alto volumen de datos, un patrón de acceso ineficiente no solo degrada una funcionalidad puntual, sino que puede afectar a todo el tenant.

## El problema
Los problemas de acceso a datos en Business Central suelen derivar de patrones incorrectos más que de limitaciones de la plataforma.

Errores comunes:

- recorrer tablas completas sin filtros  
- ejecutar consultas dentro de loops  
- recalcular FlowFields innecesariamente  
- usar métodos de búsqueda incorrectos  
- cargar más datos de los necesarios  

Ejemplo problemático:

- obtener registros  
- dentro del loop ejecutar nuevas búsquedas  

Esto genera múltiples roundtrips a la base de datos y degrada exponencialmente el rendimiento.

## Principios fundamentales
### Filtrar siempre antes de leer
```al
Customer.SetRange("No.", CustomerNo);
if Customer.FindFirst() then;
```

### Evitar full table scans
Nunca usar FindSet sin filtros en tablas grandes.

### Elegir el método correcto
- Get: acceso directo  
- FindFirst: primer registro  
- FindSet: iteración  
- FindLast: último registro  

### Minimizar consultas en loops
Evitar:

```al
if SalesLine.FindSet() then
    repeat
        Customer.Get(SalesLine."Sell-to Customer No.");
    until SalesLine.Next() = 0;
```

## Patrones eficientes
### Prefetch de datos
Cargar datos antes del loop.

### Tablas temporales
Reducen accesos repetidos.

### Procesamiento por bloques
Evita consumo excesivo de memoria.

### Uso correcto de FindSet
```al
if Rec.FindSet(true, false) then;
```

## FlowFields
Evitar recalcular múltiples veces:

```al
Customer.CalcFields(Balance);
```

## Anti-patterns
- loops con consultas internas  
- acceso sin filtros  
- recalcular datos innecesarios  
- cargas completas  

## Conclusiones
El acceso eficiente a datos es clave para performance en Business Central. Diseñar correctamente desde el inicio permite construir soluciones escalables y robustas.