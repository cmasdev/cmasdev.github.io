---
layout: post
title: "BC: Supervisión del rendimiento"
author: Christian Amado
date: 2025-10-08 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

El monitoreo de performance en Microsoft Dynamics 365 Business Central SaaS es un componente esencial en cualquier solución empresarial madura. A diferencia de entornos tradicionales donde el análisis de rendimiento puede apoyarse en herramientas de base de datos o infraestructura, en Business Central SaaS el desarrollador debe depender de mecanismos de telemetría, instrumentación y observabilidad a nivel de aplicación.

<!--more-->
El desafío principal no es únicamente detectar problemas, sino entender el comportamiento del sistema bajo condiciones reales de uso. Esto incluye:

- múltiples usuarios concurrentes  
- grandes volúmenes de datos  
- procesos batch ejecutándose en background  
- integraciones externas  

Sin una estrategia de monitoreo adecuada, los problemas de performance se vuelven invisibles hasta que afectan directamente a los usuarios.

## El problema
Uno de los errores más comunes es asumir que el sistema funciona correctamente porque no hay errores visibles. Sin embargo, muchos problemas de performance son silenciosos:

- consultas lentas que no fallan  
- procesos que tardan más de lo esperado  
- degradación progresiva  
- bloqueos intermitentes  

Estos problemas no generan excepciones claras, pero impactan directamente en la experiencia del usuario.

Otro problema crítico es la falta de trazabilidad. Sin correlación entre eventos, es imposible identificar:

- qué proceso generó el problema  
- en qué punto ocurrió  
- qué datos estaban involucrados  

Esto convierte el diagnóstico en un proceso reactivo y lento.

## Principios de monitoreo
### Observabilidad completa
El sistema debe ser observable en tres dimensiones:

- logs  
- métricas  
- trazas  

No basta con registrar errores. Se debe capturar comportamiento.

### Telemetría desde el código
El monitoreo no es externo al desarrollo. Debe integrarse desde AL:

- eventos clave  
- tiempos de ejecución  
- estados de procesos  

### Correlación de eventos
Cada operación debe poder rastrearse de inicio a fin mediante identificadores únicos.

### Monitoreo continuo

El monitoreo no es una actividad puntual. Debe ser continuo y automático.

## Herramientas y enfoque
### Application Insights
Business Central SaaS expone telemetría que puede integrarse con Application Insights. Esto permite:

- análisis de rendimiento  
- consultas sobre logs  
- visualización de métricas  

### Telemetría estándar
Incluye:

- duración de llamadas  
- uso de recursos  
- eventos del sistema  

### Telemetría personalizada
El desarrollador puede instrumentar eventos específicos.

## Implementación en AL
### Registro de eventos
```al
procedure LogProcessStart(ProcessName: Text)
begin
    // registrar inicio del proceso
end;
```

### Medición de tiempo
```al
StartTime := CurrentDateTime;

// ejecutar lógica

EndTime := CurrentDateTime;
Duration := EndTime - StartTime;
```

Esto permite identificar cuellos de botella.

### Correlación
Asignar identificadores a procesos:

```al
CorrelationId := CreateGuid();
```

Y propagarlos en todo el flujo.

## Métricas clave
### Tiempo de ejecución
Cuánto tarda cada operación.

### Volumen de datos
Cantidad de registros procesados.

### Frecuencia de ejecución

Cuántas veces se ejecuta un proceso.

### Errores y fallos
Número y tipo de errores.

### Uso de recursos
Impacto en el sistema.

## Patrones avanzados
### Distributed tracing
Seguir una operación a través de múltiples sistemas:

- BC  
- .NET services  
- APIs externas  

### Alerting
Definir umbrales:

- tiempo máximo de ejecución  
- número de errores  

Generar alertas automáticas.

### Sampling
Reducir volumen de logs en sistemas de alto tráfico.

### Dashboards
Visualizar métricas clave en tiempo real.

## Anti-patterns críticos
- no instrumentar código  
- depender solo de errores visibles  
- falta de correlación  
- logs excesivos sin estructura  
- ausencia de métricas  

## Trade-offs
Monitorear implica:

- mayor volumen de datos  
- costo de almacenamiento  
- complejidad adicional  

Pero permite:

- detección temprana de problemas  
- diagnóstico rápido  
- mejora continua  

## Buenas prácticas avanzadas
- instrumentar procesos críticos  
- usar identificadores de correlación  
- analizar métricas periódicamente  
- integrar con herramientas externas  
- evitar logs innecesarios  

## Conclusiones
El monitoreo de performance en Business Central es una disciplina fundamental para sistemas empresariales. No se trata solo de detectar fallos, sino de entender el comportamiento del sistema en producción.

Sin monitoreo, los problemas se descubren tarde. Con monitoreo adecuado, se pueden anticipar, diagnosticar y resolver de forma eficiente.

El dominio de estas técnicas es clave para construir soluciones robustas, escalables y mantenibles en Business Central SaaS.