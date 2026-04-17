---
layout: post
title: "BC: Extensiones de escalado para entornos de alto volumen de transacciones"
author: Christian Amado
date: 2025-10-01 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Escalar extensiones en Microsoft Dynamics 365 Business Central SaaS no es simplemente una cuestión de rendimiento puntual, sino un desafío arquitectónico completo. A medida que una solución crece en número de usuarios, volumen de datos, complejidad funcional e integraciones, las decisiones iniciales de diseño comienzan a mostrar sus límites.

En Business Central SaaS no existe control directo sobre la infraestructura ni sobre la base de datos subyacente. No es posible ajustar índices manualmente, modificar configuraciones de SQL Server o escalar recursos de forma tradicional. Por lo tanto, la escalabilidad depende casi exclusivamente de:

<!--more-->
- diseño de extensiones en AL  
- patrones de acceso a datos  
- arquitectura de integración  
- manejo de procesos en background  
- desacoplamiento de responsabilidades  

Una extensión que funciona correctamente con 1.000 registros puede fallar completamente con 1.000.000 si no fue diseñada con escalabilidad en mente.

## El problema
El principal error en escalabilidad es diseñar pensando en bajo volumen. Muchas extensiones:

- asumen datasets pequeños  
- procesan todo en memoria  
- ejecutan lógica sin segmentación  
- dependen de operaciones síncronas  

Esto genera problemas cuando el sistema crece:

- degradación progresiva del rendimiento  
- aumento de locks  
- procesos batch que no terminan  
- impacto en usuarios concurrentes  
- fallos en integraciones  

Un patrón común es una extensión que centraliza toda la lógica en pocos objetos, generando acoplamiento y dificultad para escalar horizontalmente.

## Principios de escalabilidad
### Desacoplamiento funcional
Una extensión escalable debe separar claramente:

- lógica de negocio  
- acceso a datos  
- integración externa  
- procesamiento batch  

Evitar codeunits monolíticos que concentran múltiples responsabilidades.

### Procesamiento asincrónico
Las operaciones pesadas no deben ejecutarse en contexto interactivo.

Usar:

- Job Queue  
- tablas staging  
- colas de integración  

Esto permite distribuir carga y evitar bloqueos en UI.

### Segmentación de procesamiento
Nunca procesar grandes volúmenes en una sola operación.

Dividir por:

- rangos de registros  
- fechas  
- entidades  

Esto permite paralelismo controlado y reduce riesgo de fallo.

### Idempotencia
Cada operación debe poder ejecutarse múltiples veces sin efectos secundarios.

Esto es clave para:

- retries  
- fallos parciales  
- recuperación  

### Minimización de locking
Diseñar procesos que:

- reduzcan duración de transacciones  
- eviten acceso concurrente conflictivo  
- utilicen commits controlados  

## Patrones de diseño
### Extensiones modulares
Dividir funcionalidad en múltiples módulos:

- reduce acoplamiento  
- facilita mantenimiento  
- permite evolución independiente  

### Event-driven design
Usar eventos para desacoplar componentes:

```al
[IntegrationEvent(false, false)]
procedure OnAfterProcessOrder(OrderNo: Code[20])
begin
end;
```

Permite extender comportamiento sin modificar código existente.

### Offloading a servicios externos
Para cargas pesadas:

- mover lógica a .NET  
- usar APIs  
- procesar fuera de BC  

BC se mantiene liviano y enfocado.

### Uso de tablas staging
Permiten:

- desacoplar entrada de procesamiento  
- mejorar resiliencia  
- controlar estado  

### Partitioning lógico
Dividir datos por:

- empresa  
- rango de IDs  
- fechas  

Permite ejecutar múltiples procesos en paralelo sin conflicto.

## Diseño de datos
El modelo de datos impacta directamente en la escalabilidad.

Buenas prácticas:

- usar claves adecuadas  
- evitar campos innecesarios  
- diseñar tablas específicas para procesos batch  
- evitar sobrecargar tablas estándar  

## Anti-patterns críticos
- extensiones monolíticas  
- lógica pesada en triggers  
- procesamiento síncrono de grandes volúmenes  
- falta de segmentación  
- dependencias directas entre múltiples sistemas  
- uso excesivo de FlowFields en procesos masivos  

## Trade-offs
Escalar correctamente implica:

- mayor complejidad de diseño  
- más componentes  
- mayor esfuerzo inicial  

Pero permite:

- crecimiento sostenible  
- estabilidad bajo carga  
- evolución del sistema  

## Buenas prácticas avanzadas
- diseñar pensando en volumen desde el inicio  
- probar con datasets grandes  
- medir performance continuamente  
- desacoplar procesos críticos  
- evitar dependencias innecesarias  
- monitorear comportamiento en producción  

## Conclusiones
Escalar extensiones en Business Central no es una tarea de optimización posterior, sino una responsabilidad de diseño desde el inicio.

Las extensiones que no consideran escalabilidad:
- funcionan en escenarios pequeños  
- fallan en producción real  

Por el contrario, un enfoque basado en desacoplamiento, segmentación, asincronía y control de transacciones permite construir soluciones robustas y preparadas para crecimiento.

El dominio de estos principios es lo que diferencia a un desarrollador que implementa funcionalidades de uno que diseña soluciones empresariales escalables.