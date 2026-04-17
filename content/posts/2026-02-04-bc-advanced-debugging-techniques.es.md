---
layout: post
title: "BC: Técnicas avanzadas de depuración para desarrolladores de AL"
author: Christian Amado
date: 2026-02-04 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La depuración avanzada en Microsoft Dynamics 365 Business Central (BC) es una disciplina clave para desarrolladores que trabajan en soluciones complejas, especialmente en entornos SaaS donde el acceso a recursos de bajo nivel es limitado. A medida que las extensiones crecen en tamaño, complejidad y criticidad (por ejemplo, procesos financieros o integraciones), las técnicas básicas de debugging dejan de ser suficientes.

Este artículo profundiza en técnicas avanzadas de depuración en AL, combinando herramientas del entorno, patrones de diagnóstico, instrumentación de código y estrategias para escenarios complejos como procesos batch, eventos, concurrencia y problemas en producción.

<!--more-->
## Fundamentos del debugging en Business Central
Antes de avanzar, es importante recordar que el debugging en BC se basa en:

- Visual Studio Code como entorno principal
- AL Language Extension
- Debugger conectado a sandbox o entorno local
- Breakpoints, variables, call stack y watch

Sin embargo, en escenarios avanzados, estas herramientas deben complementarse con estrategias adicionales.

## Configuración avanzada del debugger
### launch.json optimizado
Un archivo `launch.json` bien configurado permite mayor control sobre la depuración.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Sandbox Debug",
            "type": "al",
            "request": "launch",
            "server": "https://businesscentral.dynamics.com",
            "environmentType": "Sandbox",
            "environmentName": "Sandbox",
            "authentication": "UserPassword",
            "startupObjectType": "Page",
            "startupObjectId": 22,
            "breakOnError": true,
            "enableLongRunningSqlStatements": true,
            "enableSqlInformationDebugger": true
        }
    ]
}
```

## Debugging de procesos batch (Job Queue)
Uno de los escenarios más complejos es depurar procesos ejecutados por Job Queue.

### Problema
El código no se ejecuta en sesión interactiva, por lo tanto:

- No se detienen los breakpoints
- No hay UI visible

### Solución: Attach Debugger
Se debe usar la opción **Attach to Session**:

1. Ir a "AL: Attach Debugger"
2. Seleccionar la sesión activa del Job Queue
3. Ejecutar el proceso nuevamente

## Uso de Session.LogMessage para debugging estructurado
Esta es una de las herramientas más poderosas en entornos SaaS.

### Ejemplo avanzado
```al
Session.LogMessage(
    'PAYMENT_PROCESS',
    StrSubstNo('Procesando pago Cliente: %1 Importe: %2', Customer."No.", Amount),
    Verbosity::Verbose,
    DataClassification::CustomerContent,
    TelemetryScope::ExtensionPublisher
);
```

## Debugging en producción
En SaaS no se puede depurar directamente con breakpoints.

### Estrategia
1. Usar `Session.LogMessage`
2. Implementar feature flags
3. Activar logging condicional

## Conclusión
La depuración avanzada en Business Central requiere mucho más que breakpoints. Implica una combinación de configuración adecuada, instrumentación del código, telemetría y diseño orientado a diagnósticos.