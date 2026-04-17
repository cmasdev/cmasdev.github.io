---
layout: post
title: "BC: Diseño de procesos de registro de alto rendimiento"
author: Christian Amado
date: 2025-10-15 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

El proceso de posting en Microsoft Dynamics 365 Business Central representa uno de los puntos más críticos del sistema. Es el momento donde las transacciones pasan de ser documentos operativos a convertirse en movimientos contables persistentes: Customer Ledger Entries, Vendor Ledger Entries, Item Ledger Entries, Value Entries, G/L Entries, entre otros.

<!--more-->
En escenarios empresariales con alto volumen, el posting no es un evento ocasional. Puede ejecutarse miles de veces al día, muchas veces en paralelo, desde múltiples orígenes:

- usuarios interactivos  
- integraciones externas  
- procesos batch  
- sincronizaciones  

Diseñar procesos de posting eficientes no es solo una cuestión funcional. Es un problema de concurrencia, consistencia y rendimiento bajo carga.

Un diseño incorrecto puede provocar:

- bloqueos (locking)  
- degradación del sistema  
- inconsistencias  
- fallos intermitentes  
- cuellos de botella críticos  

Por lo tanto, el posting debe ser tratado como un componente de alta criticidad arquitectónica.

## El problema
El error más común es extender o personalizar el proceso de posting sin considerar su naturaleza transaccional.

Problemas típicos:

- agregar lógica pesada dentro de Codeunits de posting  
- ejecutar integraciones externas durante el posting  
- acceder a múltiples tablas dentro de loops críticos  
- introducir dependencias síncronas  
- extender eventos sin control de impacto  

Un caso típico:

- se agrega lógica en OnAfterPostSalesDoc  
- se realizan cálculos complejos  
- se llama a APIs externas  

Resultado:

- el posting se vuelve lento  
- aumenta el tiempo de lock  
- otros usuarios quedan bloqueados  

Otro problema frecuente es no entender que el posting es una transacción larga y compleja, que afecta múltiples tablas en un orden específico.

## Naturaleza del posting
Para optimizar correctamente, es necesario entender cómo funciona el posting internamente:

- múltiples inserts en tablas ledger  
- validaciones en cascada  
- uso intensivo de claves  
- control de consistencia transaccional  

El sistema debe garantizar que:

- todos los movimientos se registren correctamente  
- no haya inconsistencias contables  
- la transacción sea atómica  

Esto implica que cualquier extensión debe respetar estas garantías.

## Principios de diseño
### Minimizar lógica dentro del posting
El posting no es el lugar para lógica compleja.

Evitar:

- cálculos pesados  
- integraciones  
- loops extensivos  

El objetivo es mantener el proceso lo más liviano posible.

### Evitar llamadas externas
Nunca ejecutar:

- HTTP calls  
- integraciones síncronas  

dentro del posting.

En su lugar:

- registrar evento  
- procesar fuera del flujo  

### Desacoplar procesamiento
Patrón recomendado:

- posting ejecuta operación core  
- evento genera registro en cola  
- proceso asincrónico maneja lógica adicional  

### Reducir acceso a datos
Evitar:

- múltiples queries dentro del posting  
- acceso innecesario a tablas grandes  

### Controlar eventos
No todos los eventos deben ser utilizados.

Seleccionar cuidadosamente:

- puntos de extensión  
- impacto en rendimiento  

## Implementación en AL
### Patrón correcto
```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 'OnAfterPostSalesDoc', '', false, false)]
local procedure HandleAfterPostSalesDoc(...)
var
    Queue: Record "Integration Queue";
begin
    Queue.Init();
    Queue."Entity Type" := 'PostedSales';
    Queue.Status := Queue.Status::Pending;
    Queue.Insert();
end;
```

El evento no ejecuta lógica pesada. Solo desacopla.

### Patrón incorrecto
```al
// lógica compleja dentro del evento
CallExternalAPI();
ProcessLargeDataset();
```

Esto degrada el posting.

## Concurrencia y locking
El posting afecta múltiples tablas:

- G/L Entry  
- Customer Ledger Entry  
- Item Ledger Entry  

Si el proceso se alarga:

- se mantienen locks  
- otros procesos quedan bloqueados  

Por eso es crítico:

- minimizar duración  
- evitar lógica adicional  

## Patrones avanzados
### Post-commit processing
Mover lógica después del commit:

- evita locks prolongados  
- mejora concurrencia  

### Event-driven architecture
Usar eventos para desacoplar completamente el posting.

### Offloading a microservices
Para lógica compleja:

- enviar datos a .NET  
- procesar fuera de BC  

### Partitioning
Si se procesan múltiples documentos:

- dividir carga  
- evitar colisiones  

## Anti-patterns críticos
- lógica pesada en eventos de posting  
- llamadas externas síncronas  
- loops sobre datasets grandes  
- acceso a múltiples tablas sin control  
- modificar comportamiento estándar sin entender impacto  

## Trade-offs
Optimizar posting implica:

- mover lógica fuera del core  
- aceptar asincronía  
- aumentar complejidad arquitectónica  

Pero permite:

- alta concurrencia  
- estabilidad  
- escalabilidad  

## Buenas prácticas avanzadas
- tratar posting como proceso crítico  
- minimizar impacto de extensiones  
- desacoplar siempre que sea posible  
- medir tiempos de ejecución  
- analizar locking indirectamente  

## Conclusiones
El posting en Business Central es uno de los procesos más sensibles del sistema. Cualquier extensión que lo afecte debe ser diseñada con extremo cuidado.

Las soluciones que introducen lógica dentro del posting sin considerar concurrencia y transacciones generan problemas graves en producción.

Por el contrario, un enfoque basado en desacoplamiento, asincronía y minimización de impacto permite construir sistemas robustos y escalables.

El dominio de este patrón es fundamental para cualquier desarrollador o arquitecto que trabaje con Business Central en escenarios empresariales de alto volumen.