---
layout: post
title: Estrategias de configuración en aplicaciones WinUI 3 más allá de appsettings.json
author: Christian Amado
date: 2025-07-25 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones modernas, la gestión de configuración es un aspecto crítico que suele subestimarse en etapas iniciales. En WinUI 3, muchos proyectos comienzan utilizando valores hardcodeados o configuraciones mínimas, lo que limita la capacidad de adaptación del sistema.

A medida que la aplicación evoluciona, la necesidad de manejar múltiples entornos, valores dinámicos y configuraciones externas se vuelve inevitable.
<!--more-->

Este artículo aborda cómo diseñar una estrategia de configuración robusta en aplicaciones WinUI 3, orientada a escenarios reales y preparada para crecimiento.

## El problema

En muchos proyectos, la configuración se maneja de forma simple y poco estructurada.

Errores comunes:

- Uso de valores hardcodeados  
- Falta de separación entre entornos  
- Configuración dispersa en el código  
- Dificultad para modificar valores sin recompilar  
- Falta de seguridad en datos sensibles  

### Ejemplo incorrecto

```csharp
public class ApiService
{
    private readonly string _url = "https://api.production.com";

    public string GetUrl() => _url;
}
```

Problemas:

- No configurable  
- No adaptable a entornos  
- Requiere recompilación  
- Difícil de mantener  

En producción, esto genera rigidez y errores operativos.

## La solución

Una estrategia correcta debe permitir:

1. Externalizar configuración  
2. Soportar múltiples entornos  
3. Mantener seguridad  
4. Facilitar mantenimiento  

## Paso 1: Uso de appsettings.json

Archivo base:

```json
{
  "ApiSettings": {
    "BaseUrl": "https://api.local"
  }
}
```

Clase de configuración:

```csharp
public class ApiSettings
{
    public string BaseUrl { get; set; }
}
```

## Paso 2: Cargar configuración

```csharp
using Microsoft.Extensions.Configuration;

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false)
    .Build();
```

Esto permite desacoplar valores del código.

## Paso 3: Inyección de configuración

```csharp
services.Configure<ApiSettings>(config.GetSection("ApiSettings"));
```

Uso:

```csharp
public class ApiService
{
    private readonly ApiSettings _settings;

    public ApiService(IOptions<ApiSettings> options)
    {
        _settings = options.Value;
    }

    public string GetUrl() => _settings.BaseUrl;
}
```

Esto mejora mantenibilidad.

## Paso 4: Múltiples entornos

Se pueden definir archivos adicionales:

- appsettings.Development.json  
- appsettings.Production.json  

Carga:

```csharp
.AddJsonFile("appsettings.json")
.AddJsonFile($"appsettings.{environment}.json", optional: true)
```

Esto permite adaptar comportamiento según entorno.

## Paso 5: Configuración en tiempo de ejecución

En algunos casos, la configuración debe cambiar dinámicamente.

```csharp
public class RuntimeSettings
{
    public string Theme { get; set; }
}
```

Esto puede almacenarse en memoria o persistirse.

## Paso 6: Seguridad

Nunca se deben almacenar secretos en texto plano.

Alternativas:

- Variables de entorno  
- Azure Key Vault  
- Archivos protegidos  

Ejemplo:

```csharp
var secret = Environment.GetEnvironmentVariable("API_KEY");
```

## Paso 7: Centralización

Se recomienda tener un punto único de acceso.

```csharp
public interface IConfigService
{
    string GetApiUrl();
}

public class ConfigService : IConfigService
{
    private readonly ApiSettings _settings;

    public ConfigService(IOptions<ApiSettings> options)
    {
        _settings = options.Value;
    }

    public string GetApiUrl() => _settings.BaseUrl;
}
```

Esto evita duplicación.

## Buenas prácticas

- Evitar valores hardcodeados  
- Separar configuración por entorno  
- Utilizar inyección de dependencias  
- Proteger información sensible  
- Centralizar acceso a configuración  

## Conclusión

La gestión de configuración en aplicaciones WinUI 3 es un componente esencial que impacta directamente en la flexibilidad y mantenibilidad del sistema. Una estrategia adecuada permite adaptar la aplicación a distintos entornos sin modificar el código y facilita su evolución en el tiempo.

Ignorar este aspecto conduce a aplicaciones rígidas, difíciles de operar y propensas a errores en producción.