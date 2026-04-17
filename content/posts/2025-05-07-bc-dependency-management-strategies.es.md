---
layout: post
title: "BC: Estrategias de gestión de dependencias en extensiones de AL"
author: Christian Amado
date: 2025-05-07 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Business Central SaaS, la gestión de dependencias entre extensiones
no es simplemente un detalle de configuración en `app.json`, sino un
aspecto crítico de la arquitectura de la solución. A medida que una
implementación crece, es común que múltiples extensiones interactúen
entre sí: módulos de dominio, integraciones, frameworks internos y
soluciones de terceros conviven dentro del mismo tenant.

A diferencia de otros ecosistemas donde las dependencias son gestionadas
en runtime o mediante contenedores aislados, en Business Central todas
las extensiones comparten el mismo entorno lógico. Esto significa que
cualquier dependencia mal diseñada puede afectar directamente la
estabilidad, el despliegue y la evolución del sistema completo.

<!--more-->
Para ISVs y equipos que desarrollan soluciones empresariales complejas,
entender cómo gestionar dependencias correctamente es fundamental. No se
trata solo de declarar referencias, sino de diseñar una arquitectura que
evite acoplamientos innecesarios y permita evolución independiente de
los módulos.

## El problema
Uno de los problemas más críticos en proyectos reales es el
**acoplamiento excesivo entre extensiones**. Esto suele manifestarse
cuando una extensión depende directamente de otra para acceder a lógica
interna, tablas o procesos.

Los síntomas típicos incluyen:

-   errores de compilación por cambios mínimos en otra extensión\
-   necesidad de desplegar múltiples apps en conjunto\
-   incompatibilidad entre versiones\
-   dificultad para aislar errores en producción

Un caso particularmente problemático ocurre cuando una extensión A
depende de B, y B depende indirectamente de A. Aunque Business Central
no permite dependencias circulares explícitas, estas pueden aparecer de
forma implícita a través de múltiples capas.

Otro problema frecuente es el versionado incorrecto. Muchas extensiones
fijan versiones rígidas de dependencias, lo que impide evolucionar el
sistema sin romper compatibilidad.

En escenarios de ISVs, esto puede volverse crítico: una mala estrategia
de dependencias puede impedir actualizar clientes o distribuir nuevas
versiones de la aplicación.

## Diseño de la solución
Una estrategia sólida de gestión de dependencias debe basarse en tres
principios:

**1. Dependency minimization**\
Cada extensión debe depender de la menor cantidad posible de otras
aplicaciones. Esto reduce el impacto de cambios externos.

**2. Contract-based design**\
En lugar de depender de implementaciones concretas, las extensiones
deben interactuar mediante contratos (interfaces o eventos). Esto
permite cambiar implementaciones sin romper dependencias.

**3. Layered architecture**\
Las dependencias deben seguir una dirección clara. Por ejemplo:

-   Core (dominio)
-   Application (servicios)
-   Integration (APIs externas)

Nunca al revés.

Además, es clave diferenciar entre:

-   dependencias técnicas (frameworks internos)
-   dependencias funcionales (módulos de negocio)

Mezclar ambas suele ser una fuente importante de problemas.

## Implementación en AL
Ejemplo de dependencia en `app.json`:

``` json
"dependencies": [
  {
    "appId": "437dbf0e-84ff-417a-965d-ed2bb9650972",
    "name": "Base Application",
    "publisher": "Microsoft",
    "version": "26.0.0.0"
  }
]
```

Ejemplo de desacoplamiento mediante interfaz:

``` al
interface IIntegrationService
{
    procedure SendData(Payload: Text);
}
```

Implementación concreta:

``` al
codeunit 50110 ApiIntegrationService implements IIntegrationService
{
    procedure SendData(Payload: Text)
    begin
        // lógica de integración
    end;
}
```

De esta forma, otros módulos dependen del contrato, no de la
implementación.

## Buenas prácticas
-   evitar dependencias directas entre módulos funcionales\
-   utilizar interfaces para desacoplar lógica\
-   no exponer tablas innecesariamente entre extensiones\
-   mantener dependencias unidireccionales\
-   aplicar versionado semántico flexible (no rígido)\
-   separar claramente capas de arquitectura

## Conclusiones
La gestión de dependencias en Business Central SaaS es uno de los
factores más subestimados y, al mismo tiempo, más críticos en
arquitecturas empresariales. No es un problema de configuración, sino de
diseño.

Las soluciones que no controlan correctamente sus dependencias terminan
generando sistemas frágiles, difíciles de actualizar y con alta deuda
técnica. Por el contrario, una arquitectura basada en contratos, capas
bien definidas y bajo acoplamiento permite construir aplicaciones
resilientes y evolutivas.

Para ISVs, esto no es opcional: es la diferencia entre una solución
escalable y un producto que se rompe en cada release.