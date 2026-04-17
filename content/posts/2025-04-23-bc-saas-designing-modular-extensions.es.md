---
layout: post
title: "BC: Diseño de extensiones modulares"
author: Christian Amado
date: 2025-04-23 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

A medida que las implementaciones de Microsoft Dynamics 365 Business
Central SaaS crecen en complejidad, el diseño arquitectónico de las
extensiones se vuelve un factor determinante para la estabilidad y
mantenibilidad del sistema. En soluciones empresariales es habitual que
una implementación incluya múltiples procesos personalizados:
integraciones con sistemas externos, automatización de procesos
financieros, lógica específica del negocio, reporting especializado y
mecanismos de auditoría.

<!--more-->
Si todas estas funcionalidades se implementan dentro de una única
extensión o se concentran en pocos objetos AL, el resultado suele ser
una arquitectura monolítica difícil de mantener. Este problema se agrava
especialmente en entornos SaaS, donde las aplicaciones deben coexistir
con actualizaciones frecuentes del sistema y con otras extensiones
instaladas en el mismo tenant.

El concepto de **modularidad** en Business Central SaaS implica dividir
la solución en componentes funcionales bien definidos, cada uno
responsable de un conjunto específico de responsabilidades. Este enfoque
se inspira en principios de arquitectura de software ampliamente
utilizados en plataformas modernas, como la separación de dominios
funcionales y la reducción del acoplamiento entre componentes.

Para los ISVs y partners que desarrollan soluciones verticales, diseñar
extensiones modulares no es simplemente una buena práctica técnica: es
un requisito fundamental para poder evolucionar la aplicación a lo largo
del tiempo sin generar deuda técnica excesiva.

## El problema

Uno de los anti‑patrones más comunes en proyectos de Business Central es
la creación de extensiones monolíticas. En este tipo de diseño, la mayor
parte de la lógica de negocio se concentra en un número reducido de
codeunits que terminan gestionando múltiples responsabilidades: cálculos
financieros, integración con APIs externas, validaciones de datos y
automatización de procesos.

Este enfoque suele aparecer por razones prácticas durante las primeras
fases del proyecto. Los equipos de desarrollo buscan resolver
rápidamente los requerimientos del cliente y tienden a agregar nueva
lógica dentro de los mismos objetos existentes. Con el tiempo, el código
crece hasta convertirse en una estructura difícil de comprender y aún
más difícil de modificar.

Las consecuencias de esta arquitectura suelen manifestarse de varias
formas:

-   dificultades para introducir nuevas funcionalidades sin afectar
    otras áreas del sistema
-   problemas de rendimiento cuando procesos complejos se ejecutan
    dentro del mismo contexto
-   dependencias fuertes entre módulos funcionales
-   mayor riesgo de errores durante actualizaciones de la extensión

En entornos SaaS donde múltiples extensiones pueden interactuar entre
sí, este tipo de diseño monolítico reduce significativamente la
capacidad de evolución del sistema.

## Diseño de la solución

El diseño modular busca dividir la solución en componentes con
responsabilidades claras. En Business Central esto puede lograrse
estructurando la aplicación en diferentes capas funcionales.

Una arquitectura común utilizada por ISVs incluye tres tipos de módulos
principales:

**Dominio funcional**\
Contiene la lógica central del negocio: cálculos, reglas, validaciones y
procesos propios de la solución.

**Integración**\
Gestiona comunicación con sistemas externos, APIs REST o servicios
intermedios.

**Orquestación o servicios de aplicación**\
Coordina procesos complejos que involucran múltiples módulos.

Esta separación permite modificar o extender un módulo sin afectar
directamente a los demás. Además, facilita la reutilización de
componentes en distintos contextos dentro de la solución.

Otra técnica útil para reducir el acoplamiento consiste en utilizar
**interfaces en AL**. Las interfaces permiten definir contratos entre
módulos sin depender de implementaciones concretas. Esto facilita
reemplazar o extender la lógica de negocio sin modificar el resto del
sistema.

## Implementación en AL

El siguiente ejemplo muestra una interfaz que define un contrato para
calcular comisiones de ventas.

``` al
interface ICommissionCalculator
{
    procedure CalculateCommission(SalesAmount: Decimal): Decimal;
}
```

Una implementación concreta podría definirse en una codeunit específica.

``` al
codeunit 50100 StandardCommissionCalculator implements ICommissionCalculator
{
    procedure CalculateCommission(SalesAmount: Decimal): Decimal
    begin
        exit(SalesAmount * 0.05);
    end;
}
```

Al utilizar interfaces, otros módulos pueden consumir esta funcionalidad
sin depender directamente de la implementación concreta del cálculo.

## Buenas prácticas

Para diseñar extensiones modulares efectivas en Business Central SaaS es
recomendable seguir algunas prácticas clave:

-   dividir la solución en dominios funcionales bien definidos\
-   evitar concentrar demasiada lógica en pocas codeunits\
-   separar claramente integración externa y lógica de negocio\
-   utilizar interfaces cuando se requiera desacoplar implementaciones\
-   mantener responsabilidades claras dentro de cada módulo

Estas prácticas ayudan a reducir la complejidad del sistema a medida que
la solución crece.

## Conclusiones

El diseño modular es uno de los pilares fundamentales para construir
soluciones sostenibles sobre Business Central SaaS. Las extensiones que
siguen una arquitectura modular permiten evolucionar el sistema con
mayor facilidad, reducen el riesgo de errores durante actualizaciones y
facilitan la incorporación de nuevas funcionalidades.

Para ISVs que desarrollan aplicaciones verticales, adoptar este enfoque
desde las primeras fases del proyecto puede marcar una diferencia
significativa en la capacidad de escalar y mantener la solución a largo
plazo. En un ecosistema SaaS donde múltiples extensiones conviven dentro
del mismo entorno, la modularidad deja de ser simplemente una buena
práctica y se convierte en un requisito esencial para garantizar
estabilidad y flexibilidad.