---
layout: post
title: "BC: Diseño de integraciones idempotentes"
author: Christian Amado
date: 2025-07-30 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En integraciones empresariales, especialmente en entornos SaaS, los
fallos de red, timeouts y errores intermitentes son inevitables.
Business Central, al integrarse con APIs externas o procesar eventos
asincrónicos, debe asumir que una operación puede ejecutarse más de una
vez. Esto introduce dos conceptos clave: **idempotencia** y **reintentos
controlados (retry)**.

La idempotencia garantiza que ejecutar la misma operación múltiples
veces produce el mismo resultado sin efectos secundarios adicionales.
Los reintentos, por su parte, permiten recuperar operaciones fallidas
sin intervención manual. En conjunto, ambos patrones son esenciales para
lograr integraciones confiables.

<!--more-->
En Business Central, donde muchas integraciones afectan datos
financieros o documentos contables, un mal diseño en este aspecto puede
provocar duplicación de registros, inconsistencias y errores difíciles
de revertir.

## El problema
El problema más común es la **duplicación de operaciones**. Por ejemplo:

-   una factura enviada a un API externo se registra dos veces\
-   un pago se procesa dos veces por un retry mal implementado\
-   un evento asincrónico se consume múltiples veces

Esto ocurre cuando:

-   no existe un identificador único de operación\
-   los retries no están controlados\
-   no se valida el estado previo antes de ejecutar

Otro problema frecuente es el retry "ingenuo", donde se reintenta
indefinidamente ante cualquier error. Esto puede generar:

-   saturación de servicios externos\
-   loops infinitos\
-   bloqueo de colas de integración

En escenarios financieros, estos errores pueden tener impacto directo en
contabilidad, conciliación y reporting.

## Diseño de la solución
Una estrategia robusta debe combinar idempotencia y retry controlado.

**1. Claves idempotentes**
Cada operación debe tener un identificador único (Idempotency Key). Este
identificador permite verificar si una operación ya fue procesada.

**2. Registro de estado**
Las operaciones deben persistirse con estados como:

-   Pending\
-   Processing\
-   Completed\
-   Failed

Esto permite controlar el ciclo de vida de cada integración.

**3. Retry con política**

Los reintentos deben:

-   tener un número máximo\
-   aplicar backoff exponencial\
-   diferenciar errores temporales vs permanentes

**4. Validación antes de ejecutar**
Antes de procesar una operación, se debe verificar si ya fue ejecutada
exitosamente.

## Implementación en AL
Tabla de control de operaciones:

``` al
table 50170 IntegrationLog
{
    fields
    {
        field(1; Id; Integer) { }
        field(2; ExternalId; Code[50]) { }
        field(3; Status; Option) { OptionMembers = Pending,Processing,Completed,Failed; }
        field(4; RetryCount; Integer) { }
    }
}
```

Validación idempotente:

``` al
procedure ProcessOperation(ExternalId: Code[50])
var
    Log: Record IntegrationLog;
begin
    if Log.Get(ExternalId) then
        if Log.Status = Log.Status::Completed then
            exit; // ya procesado

    ExecuteOperation(ExternalId);
end;
```

Retry controlado:

``` al
if Log.RetryCount < 3 then begin
    Log.RetryCount += 1;
    Log.Status := Log.Status::Pending;
    Log.Modify();
end else
    Log.Status := Log.Status::Failed;
```

## Buenas prácticas
-   usar claves idempotentes en todas las integraciones\
-   registrar estado de cada operación\
-   limitar número de reintentos\
-   aplicar backoff exponencial\
-   diferenciar errores transitorios vs definitivos\
-   evitar retries dentro de transacciones críticas\
-   monitorear operaciones fallidas

## Conclusiones
La idempotencia y los retries no son optimizaciones: son requisitos
fundamentales en cualquier integración robusta. En Business Central
SaaS, donde las integraciones impactan procesos críticos, ignorar estos
patrones puede generar errores graves en producción.

Un diseño basado en claves idempotentes, control de estado y políticas
de retry bien definidas permite construir sistemas resilientes capaces
de manejar fallos sin comprometer la integridad de los datos.

Para ISVs, dominar estos patrones es esencial para garantizar
integraciones confiables en entornos multi-cliente y de alta
concurrencia.