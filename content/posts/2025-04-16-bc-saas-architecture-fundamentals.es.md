---
layout: post
title: "BC: Fundamentos de Arquitecrtura para Extensiones Empresariales"
author: Christian Amado
date: 2025-04-16 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Microsoft Dynamics 365 Business Central en modalidad SaaS representa un cambio profundo respecto al modelo tradicional de personalización de ERP. En entornos on-premise, los partners e ISVs podían modificar objetos estándar o controlar completamente el ciclo de despliegue del sistema. Sin embargo, en el modelo SaaS el sistema base es gestionado por Microsoft y las extensiones deben coexistir con actualizaciones frecuentes del producto.

Para los ISVs que desarrollan soluciones verticales sobre Business Central, esto implica adoptar una arquitectura completamente distinta. Las aplicaciones deben diseñarse como extensiones desacopladas, capaces de convivir con múltiples aplicaciones instaladas en el mismo tenant y de soportar cambios de plataforma sin intervención manual.

<!--more-->
En este contexto, la arquitectura SaaS se vuelve un elemento clave. No se trata únicamente de escribir código AL funcional, sino de diseñar aplicaciones que puedan escalar, integrarse con otros sistemas y mantenerse compatibles con las actualizaciones del producto.

## El problema

Muchas soluciones comienzan como extensiones simples que resuelven
necesidades específicas del cliente. Con el tiempo estas extensiones
crecen y acumulan lógica de negocio compleja. Si no existe una
arquitectura clara aparecen problemas como dependencias rígidas,
duplicación de lógica o dificultades para actualizar la solución.

En entornos SaaS estos problemas se agravan porque Microsoft introduce
actualizaciones varias veces al año. Las extensiones que dependen
demasiado del comportamiento interno del sistema pueden romperse cuando
cambia la lógica estándar.

## Diseño de la solución

Una arquitectura SaaS sólida debe basarse en modularidad,
desacoplamiento y extensibilidad mediante eventos. Los módulos deben
dividirse por responsabilidad funcional, evitando concentrar toda la
lógica en pocas codeunits.

También es importante utilizar eventos del sistema para extender
procesos estándar en lugar de modificar el comportamiento base.

## Implementación en AL

```
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 'OnAfterPostSalesDoc', '', false, false)]
local procedure AfterPostSalesDoc(SalesHeader: Record "Sales Header")
begin
    RegistrarAuditoria(SalesHeader."No.");
end;
```

## Buenas prácticas

-   Diseñar módulos independientes.
-   Evitar replicar lógica estándar.
-   Usar eventos para extender comportamiento.
-   Minimizar dependencias entre extensiones.

## Conclusiones

La arquitectura SaaS correcta permite construir aplicaciones robustas,
compatibles con actualizaciones y capaces de escalar en implementaciones
empresariales.

