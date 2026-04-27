---
layout: post
title: Logging y observabilidad en aplicaciones WinUI 3 en escenarios reales
author: Christian Amado
date: 2025-10-31 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones modernas, el logging y la observabilidad no son componentes opcionales, sino elementos fundamentales para comprender el comportamiento del sistema en producción. En aplicaciones WinUI 3, este aspecto suele ser ignorado o implementado de forma básica, lo que dificulta el diagnóstico de problemas reales.

A medida que la aplicación crece y se distribuye a múltiples usuarios, los errores dejan de ser reproducibles localmente. En ese punto, la única fuente confiable de información es lo que la aplicación registra y expone como telemetría.
<!--more-->

Este artículo analiza cómo implementar logging y observabilidad de forma profesional en aplicaciones WinUI 3, con un enfoque orientado a producción.

## El problema

Muchos proyectos no implementan una estrategia de logging adecuada.

Errores comunes:

- Uso exclusivo de Debug.WriteLine  
- Falta de niveles de log  
- No persistir logs  
- Falta de contexto en errores  
- Imposibilidad de diagnosticar fallos en producción  

### Ejemplo incorrecto

```csharp
Debug.WriteLine("Error al cargar datos");
```

Problemas:

- No se guarda información  
- No hay contexto  
- No es útil en producción  
- Difícil de analizar  

En entornos reales, esto equivale a no tener visibilidad del sistema.

## La solución

Una estrategia de observabilidad debe incluir:

1. Logging estructurado  
2. Niveles de severidad  
3. Persistencia  
4. Correlación de eventos  
5. Monitoreo  

## Paso 1: Usar Microsoft.Extensions.Logging

```csharp
using Microsoft.Extensions.Logging;

public class MainViewModel
{
    private readonly ILogger<MainViewModel> _logger;

    public MainViewModel(ILogger<MainViewModel> logger)
    {
        _logger = logger;
    }

    public void Load()
    {
        _logger.LogInformation("Inicio de carga de datos");
    }
}
```

Esto permite logging estructurado.

## Paso 2: Configurar el contenedor

```csharp
services.AddLogging(config =>
{
    config.AddDebug();
    config.SetMinimumLevel(LogLevel.Information);
});
```

Esto define el comportamiento base.

## Paso 3: Niveles de log

- Trace: detalle extremo  
- Debug: diagnóstico  
- Information: flujo normal  
- Warning: comportamiento inesperado  
- Error: fallos  
- Critical: errores graves  

Ejemplo:

```csharp
_logger.LogError(ex, "Error al procesar datos");
```

## Paso 4: Logging estructurado

```csharp
_logger.LogInformation("Usuario {UserId} inició sesión", userId);
```

Esto permite análisis avanzado.

## Paso 5: Persistencia de logs

```csharp
public class FileLogger
{
    public void Write(string message)
    {
        File.AppendAllText("app.log", message + Environment.NewLine);
    }
}
```

Esto permite revisar logs en producción.

## Paso 6: Contexto en logs

Agregar información relevante:

- usuario  
- operación  
- estado  
- timestamps  

Ejemplo:

```csharp
_logger.LogInformation("Procesando pedido {OrderId} para usuario {UserId}", orderId, userId);
```

## Paso 7: Manejo de excepciones globales

```csharp
AppDomain.CurrentDomain.UnhandledException += (s, e) =>
{
    // registrar error crítico
};
```

Esto captura errores no controlados.

## Paso 8: Observabilidad real

Además de logging:

- métricas  
- eventos  
- telemetría  

Ejemplo:

- tiempo de respuesta  
- uso de memoria  
- frecuencia de errores  

## Paso 9: Integración con servicios externos

Opciones:

- Azure Application Insights  
- sistemas de logging centralizado  

Esto permite monitoreo en tiempo real.

## Paso 10: Problemas en producción

- errores sin contexto  
- imposibilidad de reproducir fallos  
- falta de visibilidad  
- soporte complejo  

Solución:

- implementar logging estructurado  
- centralizar logs  
- monitorear continuamente  

## Paso 11: Estrategia profesional

Una implementación madura incluye:

- logging estructurado  
- correlación de eventos  
- persistencia  
- monitoreo externo  
- análisis de métricas  

Esto permite tomar decisiones basadas en datos.

## Buenas prácticas

- usar niveles de log correctamente  
- no abusar del logging  
- incluir contexto relevante  
- centralizar logs  
- monitorear comportamiento  

## Conclusión

El logging y la observabilidad en aplicaciones WinUI 3 son fundamentales para operar sistemas en producción. Una implementación adecuada permite detectar problemas rápidamente, entender el comportamiento del sistema y mejorar continuamente la calidad del software.

Ignorar estos aspectos conduce a aplicaciones opacas, difíciles de mantener y con alto costo operativo.