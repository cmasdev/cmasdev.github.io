---
layout: post
title: "BC: Integración con API externas mediante AL"
author: Christian Amado
date: 2025-06-18 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En arquitecturas empresariales modernas, Microsoft Dynamics 365 Business
Central rara vez funciona de forma aislada. Es común que actúe como
núcleo financiero y operativo dentro de un ecosistema de aplicaciones
que incluye plataformas de e-commerce, sistemas de facturación
electrónica, CRMs, servicios de pago y microservicios desarrollados en
.NET o Node.js.

En este contexto, la capacidad de integrar Business Central con APIs
externas es crítica. El lenguaje AL proporciona soporte nativo para
realizar llamadas HTTP, lo que permite implementar integraciones
directamente desde extensiones. Sin embargo, aunque la tecnología está
disponible, diseñar integraciones robustas en entornos SaaS implica
mucho más que consumir un endpoint REST.

<!--more-->
Las integraciones deben considerar aspectos como resiliencia,
idempotencia, manejo de errores, autenticación segura y desacoplamiento
de procesos. En entornos de alta concurrencia, una integración mal
diseñada puede afectar directamente el rendimiento del sistema o generar
inconsistencias de datos.

Por ello, integrar Business Central con APIs externas debe tratarse como
un problema de arquitectura, no como una simple llamada HTTP.

## El problema
Uno de los errores más comunes en integraciones con Business Central es
implementar llamadas HTTP directamente dentro de procesos críticos como
`Sales-Post` o validaciones de datos. Esto introduce varios riesgos:

-   bloqueo del proceso si la API externa responde lentamente\
-   fallos en contabilización por errores de red\
-   dependencias fuertes entre sistemas\
-   duplicación de operaciones en caso de reintentos

Otro problema frecuente es la falta de idempotencia. Si una operación
falla parcialmente y se reintenta, puede generar duplicación de datos en
el sistema externo.

También es común encontrar integraciones sin logging ni monitoreo, lo
que dificulta detectar errores en producción.

En escenarios empresariales, estos problemas pueden provocar
inconsistencias financieras, pérdida de datos o interrupciones en
procesos críticos.

## Diseño de la solución
Una integración robusta debe basarse en varios principios
arquitectónicos:

**1. Desacoplamiento del proceso principal**
Las llamadas a APIs externas no deben ejecutarse dentro de procesos
críticos. En su lugar, deben delegarse a:

-   Job Queue\
-   colas de integración\
-   procesos asincrónicos

**2. Idempotencia**
Cada operación debe poder ejecutarse múltiples veces sin generar efectos
secundarios no deseados. Esto se logra utilizando identificadores únicos
de operación.

**3. Manejo de errores y reintentos**
Las integraciones deben contemplar:

-   reintentos controlados\
-   logging de errores\
-   estados de procesamiento

**4. Seguridad**
Las credenciales y tokens deben gestionarse de forma segura, evitando
hardcodeo y utilizando mecanismos de autenticación adecuados (OAuth, API
Keys, etc.).

## Implementación en AL

Ejemplo básico de cliente HTTP:

``` al
codeunit 50130 ExternalApiClient
{
    procedure SendData(JsonPayload: Text)
    var
        Client: HttpClient;
        Content: HttpContent;
        Response: HttpResponseMessage;
    begin
        Content.WriteFrom(JsonPayload);

        Client.Post('https://api.example.com/data', Content, Response);

        if not Response.IsSuccessStatusCode() then
            Error('Error en integración: %1', Response.HttpStatusCode());
    end;
}
```

Ejemplo de desacoplamiento mediante Job Queue:

``` al
codeunit 50131 IntegrationDispatcher
{
    procedure EnqueueOperation()
    begin
        // registrar operación para ejecución asincrónica
    end;
}
```

En escenarios reales, este patrón se complementa con tablas de cola que
almacenan el estado de cada operación.

## Buenas prácticas
-   no ejecutar llamadas HTTP dentro de procesos críticos\
-   implementar colas de integración para desacoplar procesos\
-   diseñar operaciones idempotentes\
-   registrar logs de integración\
-   implementar reintentos controlados\
-   manejar correctamente timeouts y errores HTTP

## Conclusiones
La integración de Business Central con APIs externas es un componente
clave en arquitecturas empresariales modernas, pero también una de las
principales fuentes de problemas cuando no se diseña correctamente.

Las integraciones deben tratarse como procesos distribuidos, con sus
propios mecanismos de control, resiliencia y monitoreo. Ignorar estos
aspectos puede generar sistemas frágiles, inconsistentes y difíciles de
operar en producción.

Por el contrario, un enfoque basado en desacoplamiento, idempotencia y
manejo robusto de errores permite construir integraciones confiables que
escalan correctamente en entornos SaaS.

En el contexto de ISVs y soluciones multi-cliente, dominar estos
patrones no es opcional: es fundamental para garantizar la estabilidad y
evolución del sistema.