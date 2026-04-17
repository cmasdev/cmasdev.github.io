---
layout: post
title: "BC: Sincronización de datos con sistemas externos"
author: Christian Amado
date: 2025-07-23 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En arquitecturas empresariales modernas, Microsoft Dynamics 365 Business
Central (BC) rara vez opera como un sistema aislado. En la mayoría de
implementaciones reales, BC convive con múltiples sistemas: CRMs,
plataformas de e-commerce, sistemas de facturación electrónica, data
lakes, microservicios en .NET, entre otros.

Esto convierte a la **sincronización de datos** en un problema central
de arquitectura. No se trata únicamente de "enviar y recibir datos",
sino de mantener coherencia entre sistemas distribuidos con distintas
reglas de negocio, latencias y modelos de datos.

<!--more-->
A diferencia de integraciones simples basadas en requests HTTP, la
sincronización implica:

-   control de cambios
-   resolución de conflictos
-   consistencia entre sistemas
-   trazabilidad de modificaciones

En Business Central SaaS, este problema es aún más relevante porque no
existe acceso directo a la base de datos ni control sobre la
infraestructura subyacente. Todo debe resolverse a nivel de aplicación
(AL + arquitectura).

## El problema

Los errores más comunes en sincronización de datos no aparecen en
desarrollo, sino en producción con volumen real.

Algunos problemas típicos:

-   **Duplicación de registros** (clientes, productos, documentos)
-   **Conflictos de actualización** (dos sistemas modifican el mismo
    dato)
-   **Pérdida de cambios** (last-write sin control)
-   **Dependencias síncronas innecesarias**
-   **Sincronización "en tiempo real" mal aplicada**

Un caso real clásico:

1.  Un cliente se actualiza en un CRM
2.  Simultáneamente se modifica en Business Central
3.  Ambos sistemas sincronizan sin control de versión

Resultado: inconsistencia de datos y pérdida de información.

Otro problema grave es asumir que todo debe sincronizarse
inmediatamente. Esto genera:

-   presión sobre el sistema
-   mayor probabilidad de fallos
-   complejidad innecesaria

## Diseño de la solución

Una arquitectura correcta de sincronización debe basarse en principios
de sistemas distribuidos.

### 1. Definir ownership de datos

Cada entidad debe tener un único **source of truth**:

-   Business Central → contabilidad, facturación
-   CRM → clientes
-   e-commerce → pedidos

Esto evita conflictos de escritura.

### 2. Consistencia eventual (no fuerte)

Intentar mantener consistencia fuerte entre sistemas distribuidos es
costoso y frágil.

👉 Lo correcto en la mayoría de escenarios: **Eventual Consistency**

Esto implica aceptar un pequeño retraso a cambio de mayor resiliencia.

### 3. Sincronización basada en eventos

En lugar de sincronizar todo periódicamente:

-   detectar cambios
-   emitir eventos
-   sincronizar solo lo necesario

Modelo:

BC → evento → cola → sistema externo

### 4. Control de versiones de datos

Cada registro debe tener:

-   timestamp (`Last Modified`)
-   version number (si aplica)

Esto permite detectar qué versión es más reciente.

### 5. Resolución de conflictos

Definir reglas explícitas:

-   last write wins
-   prioridad por sistema
-   merge de campos específicos

No definir esto es un error crítico.

## Implementación en AL

### Detección de cambios

``` al
if Rec."Last Modified Date Time" > LastSyncDate then begin
    EnqueueSync(Rec);
end;
```

### Encolado de sincronización

``` al
procedure EnqueueSync(var Customer: Record Customer)
var
    Queue: Record IntegrationQueue;
begin
    Queue.Init();
    Queue.Payload := Format(Customer."No.");
    Queue.Status := Queue.Status::Pending;
    Queue.Insert();
end;
```

### Procesamiento asincrónico

``` al
procedure ProcessSync()
var
    Queue: Record IntegrationQueue;
begin
    if Queue.FindSet() then
        repeat
            SyncCustomer(Queue.Payload);
        until Queue.Next() = 0;
end;
```

## Buenas prácticas

-   No sincronizar en tiempo real sin necesidad
-   Definir claramente ownership de datos
-   Usar colas para desacoplar procesos
-   Implementar idempotencia en sincronización
-   Registrar estado de cada operación
-   Manejar conflictos explícitamente
-   Evitar sincronización bidireccional sin control

## Anti-patterns críticos

Evitar:

-   sincronización síncrona dentro de `Sales-Post`
-   replicar toda la base de datos innecesariamente
-   asumir que BC es siempre el source of truth
-   no versionar datos
-   ignorar conflictos

## Conclusiones

La sincronización de datos en Business Central no es un problema técnico
simple, sino un desafío de arquitectura distribuida.

Las soluciones que intentan sincronizar todo en tiempo real, sin control
de ownership ni versionado, terminan siendo frágiles e inconsistentes.

Por el contrario, un enfoque basado en:

-   eventos
-   colas
-   consistencia eventual
-   control de versiones

permite construir sistemas robustos, escalables y mantenibles.

Para ISVs y arquitectos, dominar este patrón es fundamental. Es la
diferencia entre una integración funcional y una arquitectura
empresarial sólida.