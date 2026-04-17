---
layout: post
title: "BC: Patrones de integración basados ​​en eventos"
author: Christian Amado
date: 2025-07-02 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En arquitecturas modernas, los sistemas empresariales ya no se integran
únicamente mediante llamadas síncronas entre APIs. En su lugar, muchas
soluciones adoptan un enfoque orientado a eventos, donde los sistemas
reaccionan a cambios de estado en lugar de invocarse directamente entre
sí.

Business Central SaaS, aunque tradicionalmente orientado a procesos
transaccionales, puede participar en este tipo de arquitecturas mediante
el uso de eventos internos, colas de integración y patrones como el
Outbox. Esto permite desacoplar sistemas, mejorar resiliencia y reducir
dependencias directas entre aplicaciones.

<!--more-->
Para ISVs y arquitectos, adoptar un enfoque event-driven implica
repensar cómo Business Central interactúa con el resto del ecosistema:
no como un sistema que "llama APIs", sino como un sistema que "emite
eventos de negocio".

## El problema
El enfoque clásico de integración síncrona presenta múltiples
limitaciones:

-   dependencia directa entre sistemas\
-   fallos en cascada si un servicio externo no responde\
-   bloqueo de procesos críticos\
-   dificultad para escalar

Por ejemplo, si durante `Sales-Post` se llama a un API externo y este
falla, se puede bloquear la contabilización completa.

Otro problema es la falta de consistencia eventual. En sistemas
distribuidos, intentar mantener consistencia inmediata entre múltiples
sistemas suele generar complejidad innecesaria.

Además, sin un modelo de eventos, es difícil reaccionar a cambios del
sistema sin introducir acoplamiento fuerte.

## Diseño de la solución
El enfoque event-driven propone cambiar el modelo:

En lugar de:

BC → llama API → espera respuesta

Se utiliza:

BC → genera evento → sistema externo consume

Esto introduce varios patrones clave:

**1. Outbox Pattern**
Business Central registra eventos en una tabla (outbox), que luego son
procesados por un dispatcher asincrónico.

**2. Eventual Consistency**
Los sistemas no necesitan estar sincronizados en tiempo real. Se acepta
un pequeño retraso a cambio de mayor resiliencia.

**3. Idempotencia**
Los eventos deben poder procesarse más de una vez sin efectos
secundarios.

**4. Desacoplamiento**
Business Central no necesita conocer el sistema consumidor.

## Implementación en AL
Ejemplo de tabla Outbox (conceptual):

``` al
table 50160 IntegrationOutbox
{
    fields
    {
        field(1; Id; Integer) { }
        field(2; Payload; Text) { }
        field(3; Processed; Boolean) { }
    }
}
```

Registro de evento:

``` al
procedure RegisterEvent(Payload: Text)
var
    Outbox: Record IntegrationOutbox;
begin
    Outbox.Init();
    Outbox.Payload := Payload;
    Outbox.Processed := false;
    Outbox.Insert();
end;
```

Dispatcher asincrónico:

``` al
procedure ProcessOutbox()
var
    Outbox: Record IntegrationOutbox;
begin
    if Outbox.FindSet() then
        repeat
            if not Outbox.Processed then begin
                SendToExternalSystem(Outbox.Payload);
                Outbox.Processed := true;
                Outbox.Modify();
            end;
        until Outbox.Next() = 0;
end;
```

Este patrón permite desacoplar completamente el proceso de integración.

## Buenas prácticas
-   no ejecutar integraciones en procesos críticos\
-   utilizar outbox para eventos\
-   diseñar eventos idempotentes\
-   implementar retry con control\
-   usar Job Queue para procesamiento asincrónico\
-   monitorear estado de eventos

## Conclusiones
Adoptar un enfoque orientado a eventos en Business Central SaaS permite
construir integraciones más resilientes, escalables y desacopladas.

Aunque introduce complejidad adicional, los beneficios en entornos
empresariales son significativos: menor acoplamiento, mejor tolerancia a
fallos y mayor capacidad de evolución.

Para ISVs, este patrón representa un salto de madurez arquitectónica,
acercando Business Central a modelos modernos de integración utilizados
en sistemas distribuidos.