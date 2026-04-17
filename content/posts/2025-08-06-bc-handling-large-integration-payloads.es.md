---
layout: post
title: "BC: Manejo eficiente de integracion de grandes cargas útiles"
author: Christian Amado
date: 2025-08-06 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En escenarios empresariales reales, Business Central no solo intercambia
datos pequeños o transacciones individuales. Es común encontrarse con
integraciones que manejan payloads grandes: catálogos completos,
sincronizaciones masivas o documentos complejos.

Business Central SaaS tiene limitaciones claras en memoria, timeouts y
procesamiento, por lo que manejar grandes volúmenes requiere un enfoque
arquitectónico sólido.

<!--more-->
## El problema

Procesar grandes payloads de forma monolítica genera:

-   consumo excesivo de memoria\
-   timeouts\
-   transacciones largas\
-   pérdida total ante fallos

## Diseño de la solución

### Chunking

Dividir el payload en partes pequeñas.

### Procesamiento asincrónico

Usar Job Queue y colas.

### Staging

Persistir datos antes de procesar.

### Idempotencia

Procesar cada registro de forma independiente.

## Implementación en AL

``` al
procedure ProcessBatch()
var
    Staging: Record IntegrationStaging;
begin
    if Staging.FindSet() then
        repeat
            ProcessSingle(Staging);
        until Staging.Next() = 0;
end;
```

## Conclusiones

El manejo de grandes payloads es un problema de arquitectura, no de
código. El enfoque correcto permite resiliencia y escalabilidad.