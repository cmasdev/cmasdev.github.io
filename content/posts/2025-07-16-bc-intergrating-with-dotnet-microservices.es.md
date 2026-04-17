---
layout: post
title: "BC: Integración con microservicios .NET"
author: Christian Amado
date: 2025-07-16 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En arquitecturas empresariales modernas, es cada vez más común que
Microsoft Dynamics 365 Business Central SaaS actúe como el núcleo
financiero y operativo, mientras que la lógica más compleja o de alta
escalabilidad se desplaza hacia microservicios desarrollados en .NET.

Este enfoque permite aprovechar lo mejor de ambos mundos: Business
Central como sistema transaccional robusto y .NET como plataforma
flexible para construir servicios altamente escalables, desacoplados y
especializados.

<!--more-->
Sin embargo, integrar Business Central con microservicios .NET no es
simplemente consumir una API REST. Implica diseñar una arquitectura
donde ambos sistemas puedan evolucionar de forma independiente, manejar
fallos correctamente y mantener consistencia de datos.

En este contexto, la integración debe tratarse como un problema de
arquitectura distribuida, considerando latencia, resiliencia, versionado
y desacoplamiento.

## El problema

Uno de los errores más comunes es tratar a los microservicios como
"extensiones externas" de Business Central, acoplándolos fuertemente al
flujo transaccional del ERP.

Problemas típicos:

-   llamadas síncronas desde procesos críticos (ej: Sales-Post)
-   dependencia directa de disponibilidad del microservicio
-   duplicación de lógica entre BC y .NET
-   falta de versionado en APIs
-   inconsistencia de datos entre sistemas

Un caso real: Business Central envía una orden a un microservicio
durante la contabilización. Si el microservicio falla, se bloquea todo
el proceso. Esto es un anti-pattern claro.

Otro problema crítico es la falta de contratos claros. Sin contratos
bien definidos, cualquier cambio en el microservicio rompe la
integración.

## Diseño de la solución

Una arquitectura robusta BC + .NET microservices debe basarse en:

**1. Separación de responsabilidades**

Business Central: - operaciones financieras - transacciones contables -
reglas de negocio críticas

Microservicios .NET: - procesamiento intensivo - lógica compleja o
escalable - integraciones externas avanzadas

**2. Comunicación desacoplada**

Evitar llamadas síncronas en procesos críticos. Usar:

-   colas (Outbox pattern)
-   eventos
-   procesamiento asincrónico

**3. API Contracts**

Definir contratos claros (DTOs, versionado de endpoints). Nunca depender
de estructuras internas.

**4. Idempotencia y resiliencia**

Los microservicios deben aceptar operaciones repetidas sin efectos
secundarios y manejar fallos de red.

**5. Versionado independiente**

BC y los microservicios deben poder evolucionar sin romper
compatibilidad.

## Implementación en AL

Cliente HTTP hacia microservicio:

``` al
codeunit 50200 MicroserviceClient
{
    procedure SendOrder(JsonPayload: Text)
    var
        Client: HttpClient;
        Content: HttpContent;
        Response: HttpResponseMessage;
    begin
        Content.WriteFrom(JsonPayload);

        Client.Post('https://api.myservice.com/orders', Content, Response);

        if not Response.IsSuccessStatusCode() then
            Error('Error calling microservice: %1', Response.HttpStatusCode());
    end;
}
```

Desacoplamiento usando cola:

``` al
procedure EnqueueOrder(Payload: Text)
begin
    // guardar en tabla de integración
end;
```

El microservicio .NET consumirá estos eventos mediante polling o
webhook.

## Buenas prácticas

-   no invocar microservicios dentro de procesos críticos\
-   usar patrones asincrónicos (Outbox, queues)\
-   definir contratos versionados (v1, v2 APIs)\
-   implementar idempotencia en microservicios\
-   manejar timeouts y retries\
-   centralizar lógica compleja en .NET, no duplicarla en AL

## Conclusiones

Integrar Business Central con microservicios .NET permite construir
arquitecturas modernas, escalables y desacopladas. Sin embargo, hacerlo
correctamente requiere un enfoque arquitectónico sólido.

Las integraciones síncronas y acopladas deben evitarse en favor de
modelos asincrónicos, basados en eventos y contratos claros. Esto
permite que cada sistema evolucione de forma independiente, reduzca
riesgos y mejore la resiliencia.

Para ISVs y soluciones empresariales, esta integración es clave para
extender las capacidades de Business Central sin comprometer su
estabilidad ni su modelo SaaS.