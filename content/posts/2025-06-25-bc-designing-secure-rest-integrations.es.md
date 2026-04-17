---
layout: post
title: "BC: Diseño de integraciones REST seguras"
author: Christian Amado
date: 2025-06-25 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En entornos empresariales modernos, la seguridad en las integraciones es
tan importante como la funcionalidad misma. Microsoft Dynamics 365
Business Central SaaS se integra frecuentemente con APIs externas para
procesar pagos, facturación electrónica, validaciones fiscales y
sincronización de datos con otros sistemas.

A diferencia de integraciones simples, en SaaS estas comunicaciones
ocurren sobre internet y están expuestas a múltiples riesgos:
interceptación de datos, uso indebido de credenciales, replay attacks o
accesos no autorizados. El lenguaje AL permite consumir APIs REST, pero
no impone automáticamente buenas prácticas de seguridad.

<!--more-->
Por lo tanto, diseñar integraciones seguras en Business Central implica
entender no solo cómo consumir APIs, sino cómo proteger credenciales,
validar respuestas y evitar vulnerabilidades comunes en sistemas
distribuidos.

## El problema
Uno de los errores más comunes es manejar credenciales de forma
insegura. Ejemplos reales incluyen:

-   API keys hardcodeadas en el código\
-   tokens almacenados en texto plano\
-   reutilización de tokens expirados\
-   ausencia de rotación de credenciales

Otro problema frecuente es no validar correctamente las respuestas del
servidor. Muchas integraciones asumen que una respuesta HTTP 200 es
válida, sin validar el contenido.

También es común no manejar correctamente la expiración de tokens OAuth,
lo que genera fallos intermitentes difíciles de diagnosticar.

Finalmente, existe el riesgo de ataques como:

-   replay de solicitudes\
-   exposición de endpoints internos\
-   uso indebido de APIs por falta de autenticación robusta

## Diseño de la solución
Una integración segura debe considerar los siguientes pilares:

**1. Gestión segura de credenciales**
Las credenciales nunca deben almacenarse directamente en el código.
Deben utilizarse mecanismos seguros como:

-   Azure Key Vault\
-   tablas protegidas en Business Central\
-   configuración segura en entornos

**2. Autenticación robusta**
Se deben preferir mecanismos modernos como OAuth 2.0 en lugar de API
Keys simples. Esto permite:

-   expiración controlada de tokens\
-   scopes definidos\
-   mayor control de acceso

**3. Validación de respuestas**
No basta con validar el status code. Es necesario:

-   validar estructura JSON\
-   verificar campos esperados\
-   manejar respuestas inesperadas

**4. Manejo de tokens**
En OAuth, los tokens deben:

-   renovarse automáticamente\
-   almacenarse de forma segura\
-   invalidarse cuando sea necesario

**5. Protección contra abuso**
Las integraciones deben implementar:

-   control de frecuencia (rate limiting)\
-   validación de origen\
-   logs de acceso

## Implementación en AL
Ejemplo de uso de headers seguros:

``` al
Client.DefaultRequestHeaders.Add('Authorization', 'Bearer ' + AccessToken);
```

Ejemplo de validación básica:

``` al
if not Response.IsSuccessStatusCode() then
    Error('Error HTTP: %1', Response.HttpStatusCode());
```

Ejemplo de parseo seguro:

``` al
if not JsonObject.ReadFrom(Response.Content()) then
    Error('Respuesta inválida');
```

## Buenas prácticas
-   nunca hardcodear credenciales\
-   utilizar OAuth cuando sea posible\
-   validar siempre la respuesta del API\
-   implementar renovación de tokens\
-   registrar logs de acceso y errores\
-   manejar timeouts y reintentos

## Conclusiones
Las integraciones seguras en Business Central SaaS no son opcionales:
son un requisito fundamental en cualquier arquitectura empresarial
moderna.

Un diseño deficiente puede exponer datos sensibles, generar fallos en
producción o incluso comprometer la seguridad del sistema completo. Por
el contrario, una arquitectura basada en autenticación robusta, manejo
adecuado de credenciales y validación estricta de datos permite
construir integraciones confiables y seguras.

Para ISVs y soluciones multi-cliente, este aspecto es crítico: la
seguridad no es una característica adicional, es parte del diseño desde
el inicio.