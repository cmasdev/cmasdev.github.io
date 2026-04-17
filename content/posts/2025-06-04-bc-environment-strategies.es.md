---
layout: post
title: "BC: Estrategia de Entornos: Sandboxes, producción y CI/CD"
author: Christian Amado
date: 2025-06-04 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Business Central SaaS, la gestión de entornos no es simplemente una
práctica organizativa, sino un componente crítico de la arquitectura de
entrega de software. A diferencia de modelos tradicionales donde el
despliegue podía hacerse manualmente en servidores controlados por el
cliente, en SaaS todo el ciclo de vida del software ocurre dentro de un
ecosistema administrado por Microsoft.

Esto implica que los desarrolladores y equipos de ISVs deben diseñar una
estrategia clara para gestionar múltiples entornos: desarrollo, sandbox
y producción. Cada uno de estos entornos cumple un rol específico dentro
del ciclo de vida de la aplicación.

<!--more-->
El entorno de desarrollo permite iterar rápidamente sobre el código. Los
sandboxes funcionan como entornos de validación donde se prueban
integraciones, procesos complejos y actualizaciones. Finalmente,
producción es el entorno donde el sistema debe operar con estabilidad,
performance y tolerancia a errores.

En este contexto, el uso de pipelines de CI/CD (Continuous Integration /
Continuous Deployment) se vuelve fundamental. No solo para automatizar
despliegues, sino para garantizar consistencia, trazabilidad y control
sobre cada versión liberada.

## El problema
Uno de los errores más frecuentes en implementaciones de Business
Central SaaS es la ausencia de una estrategia clara de entornos. Esto
suele derivar en prácticas riesgosas como:

-   despliegues manuales directamente en producción.
-   falta de validación previa en sandbox.
-   inconsistencias entre entornos.
-   ausencia de control de versiones en despliegues.

En muchos casos, los equipos desarrollan y prueban directamente en el
mismo entorno, lo que introduce un alto riesgo de errores en procesos
críticos como contabilización o integración con sistemas externos.

Otro problema importante es la falta de automatización. Sin pipelines
definidos, los despliegues dependen de procesos manuales que son
propensos a errores humanos. Esto puede generar inconsistencias entre
clientes o fallos difíciles de reproducir.

En escenarios de ISVs que manejan múltiples clientes, estos problemas
escalan rápidamente. Sin una estrategia clara, es prácticamente
imposible mantener control sobre qué versión está desplegada en cada
cliente.

## Diseño de la solución
Una estrategia robusta de entornos en Business Central SaaS debe basarse
en tres pilares:

**1. Separación clara de entornos**
El flujo recomendado es:

Development → Sandbox → Production

Cada cambio debe pasar por estas etapas antes de llegar a producción.

**2. Automatización mediante CI/CD**
Los pipelines deben encargarse de:

-   compilar extensiones AL\
-   ejecutar validaciones automáticas\
-   publicar artefactos\
-   desplegar en sandbox\
-   promover a producción tras validación

Esto elimina errores manuales y asegura consistencia.

**3. Estrategia de despliegue por cliente**
Para ISVs, es clave manejar versiones por cliente. No todos los clientes
deben actualizar al mismo tiempo. Es necesario poder:

-   desplegar versiones específicas\
-   controlar releases progresivos\
-   revertir cambios si es necesario

Esto implica que el pipeline debe soportar múltiples destinos y
configuraciones.

## Implementación en AL / DevOps
Aunque AL no gestiona directamente los entornos, sí forma parte del
proceso de build. Un pipeline típico incluye:

``` yaml
steps:
- task: CompileAL
- task: PublishArtifact
- task: DeployToSandbox
```

En GitHub Actions o Azure DevOps, herramientas como AL-Go permiten
automatizar este proceso.

Ejemplo conceptual:

``` text
Push → Build → Test → Sandbox Deployment → Approval → Production
```

## Buenas prácticas
-   nunca desplegar directamente en producción\
-   automatizar completamente el pipeline de despliegue\
-   mantener entornos alineados en configuración\
-   probar upgrades en sandbox antes de producción\
-   versionar cada release desplegado\
-   utilizar aprobaciones manuales antes de producción

## Conclusiones
En Business Central SaaS, la gestión de entornos y despliegues es un
problema de arquitectura, no de operaciones. Los equipos que no definen
una estrategia clara terminan generando sistemas frágiles,
inconsistentes y difíciles de mantener.

Implementar un flujo estructurado basado en Development, Sandbox y
Production, junto con pipelines de CI/CD, permite construir soluciones
mucho más confiables. Para ISVs, esto es aún más crítico, ya que deben
gestionar múltiples clientes y versiones simultáneamente.

Una estrategia de entornos bien definida no solo reduce riesgos, sino
que también acelera la entrega de valor, mejora la calidad del software
y permite escalar el producto de manera controlada.