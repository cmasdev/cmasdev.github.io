---
layout: post
title: "BC: Cómo evitar antipatrones de rendimiento en AL"
author: Christian Amado
date: 2025-09-03 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, los problemas de performance no suelen originarse por limitaciones de infraestructura, sino por decisiones de diseño incorrectas en el código AL y en la arquitectura de la solución. A diferencia de otros entornos donde se puede escalar vertical u horizontalmente, en Business Central SaaS el desarrollador debe operar bajo un modelo controlado donde la eficiencia es obligatoria.

Los anti-patterns de performance en Business Central no son errores triviales. Son decisiones que, bajo volumen bajo, funcionan correctamente, pero que bajo carga real generan:

<!--more-->
- degradación progresiva  
- bloqueos (locking)  
- consumo excesivo de recursos  
- timeouts  
- fallos en procesos críticos como posting  

Entender estos anti-patterns no es opcional para soluciones empresariales. Es una competencia fundamental para cualquier arquitecto o desarrollador avanzado.

## El problema
El principal problema con los anti-patterns es que **no fallan inmediatamente**. Funcionan en desarrollo, funcionan en testing, incluso pueden pasar a producción sin alertas iniciales.

Pero cuando el sistema escala:
- miles de registros  
- múltiples usuarios concurrentes  
- integraciones activas  

los mismos patrones comienzan a colapsar.

El resultado típico es:
- páginas lentas  
- procesos batch interminables  
- errores intermitentes  
- degradación general del tenant  

## Anti-patterns críticos
### 1. Acceso a datos dentro de loops (N+1 problem)
Este es el error más destructivo.

```al
if SalesLine.FindSet() then
    repeat
        Customer.Get(SalesLine."Sell-to Customer No.");
    until SalesLine.Next() = 0;
```

Problema:
- cada iteración genera un acceso adicional  
- escala linealmente en cantidad de registros  

Solución:

- precargar datos  
- usar estructuras en memoria  
- reducir roundtrips  

### 2. Full table scans implícitos
```al
if Customer.FindSet() then;
```

Sin filtros, esto puede recorrer miles o millones de registros.

Impacto:

- alto consumo de recursos  
- lentitud general  
- bloqueo potencial  

Solución:

- siempre usar SetRange / SetFilter antes  

### 3. Uso incorrecto de FlowFields
```al
Customer.CalcFields(Balance);
```

Dentro de loops:

```al
repeat
    Customer.CalcFields(Balance);
until ...
```

Problema:
- cada llamada ejecuta una query adicional  
- alto costo acumulado  

Solución:
- calcular solo cuando sea necesario  
- agrupar cálculos  

### 4. Lógica pesada en triggers

Ejemplo:

- OnValidate  
- OnAfterGetRecord  

Problema:
- se ejecuta múltiples veces  
- impacta UI directamente  

Solución:
- mover lógica a procesos controlados  
- evitar operaciones costosas en triggers  

### 5. Transacciones largas
Procesar grandes volúmenes sin commit:

```al
repeat
    Modify();
until ...
```

Problemas:
- locks prolongados  
- bloqueos en otros procesos  
- rollback costoso  

Solución:
- dividir en batches  
- usar Commit() estratégicamente  

### 6. Integraciones síncronas en procesos críticos
Ejemplo:

- llamar API en Sales-Post  

Problema:
- dependencia externa  
- bloqueo del proceso  

Solución:

- usar colas  
- procesamiento asincrónico  

### 7. Uso incorrecto de FindSet
Muchos desarrolladores no entienden esto:

```al
FindSet(true, false)
```

- true → lock  
- false → no carga todo en memoria  

Mal uso puede generar:
- locking innecesario  
- consumo de memoria  

### 8. Falta de index awareness
Aunque no se accede directamente a SQL, BC usa índices.

Problema:
- filtros en campos no indexados  
- queries lentas  

Solución:
- diseñar claves adecuadas  
- usar campos indexados en filtros  

### 9. Procesamiento monolítico
Procesar todo en una sola operación.

Problemas:
- falta de resiliencia  
- errores destruyen todo el proceso  

Solución:
- chunking  
- staging tables  

## Diseño de soluciones correctas
### 1. Data access optimizado
- filtros siempre  
- métodos correctos  
- evitar loops con queries  

### 2. Arquitectura asincrónica
- Job Queue  
- colas  
- procesamiento desacoplado  

### 3. Batch processing
- dividir cargas  
- controlar tamaño  

### 4. Observabilidad
- logging  
- métricas  
- tracing  

## Trade-offs reales
Eliminar anti-patterns implica:

- más diseño  
- más complejidad  
- más código  

Pero evita:

- fallos en producción  
- degradación del sistema  
- problemas de escalabilidad  

## Buenas prácticas avanzadas
- medir con telemetría real  
- probar con datasets grandes  
- evitar optimizaciones prematuras, pero diseñar correctamente  
- revisar impacto de cada loop  
- entender cómo BC ejecuta operaciones internamente  

## Conclusiones
Los anti-patterns de performance en Business Central no son detalles menores. Son decisiones estructurales que definen el comportamiento del sistema bajo carga.

Un sistema con anti-patterns:

- funciona en demo  
- falla en producción  

Un sistema bien diseñado:

- escala  
- resiste carga  
- mantiene consistencia  

Dominar estos patrones es lo que diferencia a un desarrollador funcional de un arquitecto técnico en Business Central.
