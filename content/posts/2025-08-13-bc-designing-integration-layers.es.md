---
layout: post
title: "BC: Diseño de integraciones en capas"
author: Christian Amado
date: 2025-07-30 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En arquitecturas modernas, Business Central rara vez interactúa directamente con sistemas externos de forma “uno a uno”. A medida que crece la cantidad de integraciones —CRM, e-commerce, microservicios en .NET, plataformas fiscales, proveedores externos— aparece un problema estructural:

**la complejidad de integración explota exponencialmente**

<!--more-->
Sin una capa intermedia, Business Central termina:

- con lógica de integración dispersa  
- acoplado a múltiples sistemas externos  
- difícil de mantener  
- altamente sensible a cambios externos  

Aquí es donde entra el concepto de **Integration Layer**.

Una Integration Layer no es simplemente “un middleware” o “una API”. Es una **capa arquitectónica diseñada para desacoplar, orquestar y controlar todas las integraciones del sistema**.

En el contexto de Business Central SaaS, esta capa puede vivir:

- dentro de BC (parcialmente, en AL)
- en .NET (microservicios o backend)
- en plataformas como Azure (Functions, Service Bus, API Management)

**Business Central no debería ser el centro de integración directa, sino un participante controlado dentro de una arquitectura de integración**

## El problema

El anti-pattern más común:

```
System A → BC
System B → BC
System C → BC
System D → BC
```

Problemas:

- Acoplamiento extremo  
- Duplicación de lógica  
- Falta de control central  
- Impacto directo en BC  
- Evolución difícil  

## Diseño de la solución

### Modelo

External Systems
        ↓
Integration Layer (.NET / Azure)
        ↓
Business Central
```

## Responsabilidades de la Integration Layer

### Orquestación
Coordina flujos complejos entre sistemas.

### Transformación
Adapta modelos sin afectar BC.

### Control de tráfico
Protege BC con rate limiting y throttling.

### Resiliencia
Retries, circuit breakers, fallbacks.

### Seguridad
Centraliza autenticación y autorización.

### Observabilidad
Logging, métricas y tracing.

## Implementación en AL

### Evento hacia Integration Layer

```al
procedure NotifyOrderCreated(SalesHeader: Record "Sales Header")
var
    Queue: Record "Integration Queue";
begin
    Queue.Init();
    Queue."Entity Type" := 'SalesOrder';
    Queue."Entity No." := SalesHeader."No.";
    Queue.Status := Queue.Status::Pending;
    Queue.Insert();
end;
```

## Anti-patterns

- BC como hub de integración  
- lógica duplicada  
- múltiples integraciones directas  
- falta de capa intermedia  

## Conclusiones

Una Integration Layer permite:

- desacoplar sistemas  
- proteger Business Central  
- escalar integraciones  
- mantener arquitectura limpia  

Sin esta capa, la complejidad crece sin control.
