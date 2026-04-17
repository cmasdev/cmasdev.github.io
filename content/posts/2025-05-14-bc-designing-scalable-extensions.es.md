---
layout: post
title: "BC: Diseño de extensiones escalables para un alto volumen de transacciones"
author: Christian Amado
date: 2025-05-14 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En entornos empresariales reales, Microsoft Dynamics 365 Business
Central SaaS no opera con cargas livianas. Es común encontrar
implementaciones donde el sistema procesa miles de documentos diarios:
facturas, pagos, asientos contables, movimientos de inventario y
procesos batch ejecutados mediante Job Queue.

A diferencia de entornos on-premise, en SaaS no existe control directo
sobre la infraestructura. El rendimiento depende en gran medida de cómo
están diseñadas las extensiones. Esto convierte al diseño de software en
el principal factor de performance.

<!--more-->
El lenguaje AL abstrae muchas complejidades del motor SQL subyacente,
pero eso no elimina los problemas clásicos de sistemas transaccionales:
locking, lectura excesiva de datos, transacciones largas y operaciones
no optimizadas. En escenarios de alto volumen, pequeñas ineficiencias se
multiplican rápidamente.

Por ello, diseñar extensiones escalables no es opcional: es un requisito
crítico para evitar degradación del sistema completo.

## El problema
El problema más común en producción es la degradación progresiva del
rendimiento a medida que crece el volumen de datos. Esto suele
originarse en patrones incorrectos de acceso a datos.

Algunos anti-patrones típicos:

-   uso incorrecto de `FindFirst` dentro de loops
-   consultas sin filtros adecuados
-   loops anidados sobre tablas grandes
-   uso excesivo de `CalcFields` dentro de iteraciones
-   procesos batch ejecutados en una sola transacción

Uno de los casos más críticos ocurre en procesos de contabilización
(`Sales-Post`, `Gen. Jnl.-Post Line`). Si una extensión introduce lógica
adicional dentro de estos flujos sin optimización, puede provocar:

-   bloqueos en tablas clave (Customer, G/L Entry)
-   aumento en tiempos de contabilización
-   congestión en Job Queue

Otro problema importante es el uso incorrecto de `CHANGECOMPANY` en
procesos masivos, lo que multiplica el costo de acceso a datos.

## Diseño de la solución
El diseño de extensiones escalables debe centrarse en tres pilares:

**1. Optimización del acceso a datos**
El objetivo es minimizar roundtrips al servidor SQL y reducir la
cantidad de registros procesados. Esto implica:

-   usar `FindSet` en lugar de `FindFirst` para iteraciones
-   aplicar filtros antes de acceder a datos
-   evitar recalcular campos innecesariamente

**2. Control de transacciones**
Las transacciones largas son uno de los principales problemas en
sistemas ERP. Es recomendable:

-   dividir procesos batch en unidades pequeñas
-   evitar lógica pesada dentro de transacciones críticas
-   usar commits controlados (cuando sea necesario y seguro)

**3. Desacoplamiento de procesos críticos**
No toda la lógica debe ejecutarse dentro del flujo principal. Procesos
costosos deben moverse a:

-   Job Queue
-   procesos asincrónicos
-   colas de integración

Esto reduce el impacto en operaciones críticas como contabilización.

## Implementación en AL
Ejemplo de iteración eficiente:

``` al
if SalesLine.FindSet() then
    repeat
        ProcessLine(SalesLine);
    until SalesLine.Next() = 0;
```

Ejemplo de anti-patrón (NO recomendado):

``` al
// MAL: múltiples roundtrips
if SalesLine.FindFirst() then
    repeat
        ProcessLine(SalesLine);
    until SalesLine.Next() = 0;
```

Ejemplo de separación de procesamiento:

``` al
codeunit 50120 BatchProcessor
{
    procedure ProcessSales()
    begin
        // delegar lógica pesada fuera del posting
    end;
}
```

## Buenas prácticas
-   usar `FindSet` para iteraciones grandes\
-   aplicar filtros antes de acceder a datos\
-   evitar loops anidados sobre tablas grandes\
-   no ejecutar lógica pesada dentro de `Sales-Post`\
-   mover procesos intensivos a Job Queue\
-   evitar `CHANGECOMPANY` en loops masivos\
-   monitorear tiempos de ejecución en producción

## Conclusiones
El rendimiento en Business Central SaaS no depende únicamente de la
infraestructura, sino principalmente del diseño de las extensiones. Los
sistemas que funcionan bien con pocos datos pueden fallar completamente
cuando escalan si no se han considerado estos aspectos.

Diseñar extensiones para alto volumen implica pensar en términos de
acceso a datos, control de transacciones y desacoplamiento de procesos.
Ignorar estos principios puede generar bloqueos, degradación del sistema
y problemas operativos en producción.

En escenarios empresariales reales, la diferencia entre una extensión
funcional y una solución profesional radica en su capacidad de escalar.
Y esa capacidad se define, en gran medida, en el diseño inicial.