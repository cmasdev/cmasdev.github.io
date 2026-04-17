---
layout: post
title: "BC: Construyendo integraciones resilientes con estrategias de reintento"
author: Christian Amado
date: 2025-07-09 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En entornos SaaS, las integraciones no fallan de forma excepcional:
fallan constantemente. Timeouts, latencias elevadas, respuestas
parciales o APIs inestables son parte normal del comportamiento de
sistemas distribuidos.

Business Central no está diseñado como una plataforma de integración
resiliente "out of the box". Sin embargo, puede formar parte de
arquitecturas resilientes si se implementan correctamente ciertos
patrones: manejo de timeouts, circuit breaker, retries inteligentes y
fallback strategies.

<!--more-->
En integraciones críticas (pagos, facturación electrónica, logística),
la resiliencia no es opcional. Un diseño incorrecto puede provocar
interrupciones operativas, bloqueos de procesos o inconsistencias en
datos financieros.

## El problema
Los errores más comunes en integraciones en Business Central incluyen:

-   llamadas HTTP sin control de timeout\
-   retries agresivos que saturan APIs externas\
-   dependencia directa de servicios inestables\
-   falta de degradación controlada

Un caso típico: una API externa comienza a responder lento. Business
Central sigue intentando llamadas dentro de procesos críticos,
generando:

-   bloqueos en procesos como `Sales-Post`
-   colas saturadas
-   efecto cascada de fallos

Otro problema frecuente es no distinguir entre errores temporales
(timeout) y errores permanentes (validación fallida), tratando ambos
igual.

## Diseño de la solución
Una integración resiliente se basa en varios patrones clave:

**1. Timeouts controlados**
Cada llamada HTTP debe tener un tiempo límite. No se debe esperar
indefinidamente una respuesta.

**2. Circuit Breaker**
Cuando un servicio externo falla repetidamente, se "abre el circuito" y
se evita seguir llamándolo temporalmente.

Estados típicos:

-   Closed → todo funciona
-   Open → se bloquean llamadas
-   Half-Open → se prueba recuperación

**3. Retry inteligente**
Reintentos solo en errores transitorios (timeouts, 5xx), con límites y
backoff.

**4. Fallback**
Si la integración falla, el sistema debe degradar funcionalidad sin
romper el flujo principal. Ejemplo:

-   registrar operación para reintento posterior
-   permitir contabilización aunque la integración falle

## Implementación en AL
Ejemplo de timeout:

``` al
Client.Timeout := 10000; // 10 segundos
```

Control básico de retry:

``` al
if not Response.IsSuccessStatusCode() then begin
    if IsTransientError(Response.HttpStatusCode()) then
        RetryOperation()
    else
        Error('Error permanente');
end;
```

Simulación de Circuit Breaker (simplificada):

``` al
if ServiceState = ServiceState::Open then
    Error('Servicio temporalmente no disponible');

if FailureCount > 5 then
    ServiceState := ServiceState::Open;
```

Fallback con cola:

``` al
if not TrySend() then
    EnqueueForLaterProcessing();
```

## Buenas prácticas
-   definir timeouts en todas las llamadas HTTP\
-   diferenciar errores transitorios vs permanentes\
-   limitar retries con backoff\
-   implementar circuit breaker básico\
-   usar fallback para evitar bloquear procesos críticos\
-   monitorear estado de integraciones

## Conclusiones
La resiliencia en integraciones no es un "nice to have": es un requisito
esencial en sistemas SaaS. Business Central puede integrarse de forma
robusta si se implementan correctamente patrones como circuit breaker,
retry controlado y fallback.

Ignorar estos patrones lleva a sistemas frágiles, sensibles a fallos
externos y difíciles de operar en producción. Por el contrario, una
arquitectura resiliente permite absorber fallos, mantener la operación y
garantizar la continuidad del negocio.

Para ISVs y soluciones empresariales, este nivel de diseño es lo que
diferencia una integración funcional de una integración verdaderamente
profesional.