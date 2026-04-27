---
layout: post
title: Observabilidad en aplicaciones de escritorio: logging y monitoreo en WinUI 3
author: Christian Amado
date: 2025-12-19 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones modernas, la observabilidad ya no es exclusiva del backend. En entornos reales, las aplicaciones de escritorio también deben proveer visibilidad completa sobre su comportamiento en producción. Sin logging estructurado, métricas y monitoreo, cualquier error fuera del entorno de desarrollo se vuelve extremadamente difícil de diagnosticar.

En aplicaciones WinUI 3, este aspecto suele ser ignorado o reducido a simples logs locales. El resultado es una aplicación opaca, donde los errores dependen de la reproducción manual y el usuario final se convierte en el único punto de información.
<!--more-->

Este artículo aborda cómo diseñar e implementar observabilidad real en aplicaciones de escritorio modernas utilizando WinUI 3, integrando logging, monitoreo y telemetría de forma profesional.

## El problema

Errores comunes en aplicaciones desktop:

- Uso exclusivo de Debug.WriteLine  
- Logs sin estructura  
- No persistencia de logs  
- Falta de contexto (usuario, acción, estado)  
- Imposibilidad de monitoreo remoto  

### Ejemplo incorrecto

```csharp
Debug.WriteLine("Error al cargar datos");
```

Problemas:

- No hay persistencia  
- No hay contexto  
- No es útil en producción  

## Qué es observabilidad

Observabilidad no es solo logging. Incluye:

- Logs (eventos)
- Métricas (rendimiento)
- Trazas (flujo de ejecución)

El objetivo es entender:

- qué ocurrió  
- cuándo ocurrió  
- por qué ocurrió  

## Estrategia de observabilidad

Una implementación profesional debe incluir:

1. Logging estructurado  
2. Persistencia local  
3. Envío remoto  
4. Métricas  
5. Correlación de eventos  

## Paso 1: Logging estructurado

```csharp
_logger.LogInformation("Usuario {UserId} ejecutó acción {Action}", userId, action);
```

Ventajas:

- Consultas más fáciles  
- Análisis automatizado  
- Integración con herramientas  

## Paso 2: Configuración base

```csharp
services.AddLogging(config =>
{
    config.SetMinimumLevel(LogLevel.Information);
    config.AddDebug();
});
```

Esto define niveles de log.

## Paso 3: Persistencia local

```csharp
public class FileLogger
{
    public void Write(string message)
    {
        File.AppendAllText("app.log", message + Environment.NewLine);
    }
}
```

Permite diagnóstico offline.

## Paso 4: Contexto en logs

Siempre incluir:

- usuario  
- operación  
- timestamp  
- estado  

```csharp
_logger.LogError(ex, "Error en operación {Operation} para usuario {UserId}", "LoadData", userId);
```

## Paso 5: Manejo global de errores

```csharp
AppDomain.CurrentDomain.UnhandledException += (s, e) =>
{
    // log crítico
};
```

Captura errores no controlados.

## Paso 6: Métricas

Ejemplos:

- tiempo de carga  
- uso de memoria  
- frecuencia de errores  

```csharp
var start = DateTime.UtcNow;
// operación
var duration = DateTime.UtcNow - start;
_logger.LogInformation("Duración: {Duration}", duration);
```

## Paso 7: Telemetría remota

Integración con servicios externos permite:

- monitoreo en tiempo real  
- análisis centralizado  
- alertas  

Ejemplo conceptual:

```csharp
telemetryClient.TrackEvent("AppStarted");
```

## Paso 8: Correlación de eventos

```csharp
var correlationId = Guid.NewGuid();

_logger.LogInformation("Inicio operación {Id}", correlationId);
_logger.LogInformation("Fin operación {Id}", correlationId);
```

Permite seguir flujos completos.

## Paso 9: Observabilidad en background tasks

```csharp
_logger.LogInformation("Background job iniciado");
```

Importante para tareas asincrónicas.

## Paso 10: Problemas reales en producción

- errores imposibles de reproducir  
- falta de información  
- soporte reactivo  
- alto costo de mantenimiento  

## Paso 11: Estrategia profesional

Un sistema maduro incluye:

- logging estructurado  
- almacenamiento local + remoto  
- métricas clave  
- alertas  
- dashboards  

## Buenas prácticas

- no loggear información sensible  
- usar niveles correctamente  
- centralizar logging  
- monitorear continuamente  
- diseñar desde el inicio  

## Conclusión

La observabilidad en aplicaciones WinUI 3 es un componente crítico para operar sistemas reales. No se trata solo de registrar eventos, sino de entender el comportamiento del sistema en producción.

Una implementación adecuada permite detectar problemas rápidamente, mejorar la calidad del software y reducir costos operativos.

Ignorar la observabilidad convierte cualquier aplicación en una caja negra difícil de mantener.