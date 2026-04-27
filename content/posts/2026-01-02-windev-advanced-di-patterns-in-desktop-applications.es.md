---
layout: post
title: Patrones avanzados de Dependency Injection en aplicaciones de escritorio
author: Christian Amado
date: 2026-01-02 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En artículos anteriores se introdujo el uso de Dependency Injection (DI) en aplicaciones WinUI 3 como un mecanismo para desacoplar dependencias y mejorar la mantenibilidad. Sin embargo, en aplicaciones reales, el uso básico de DI no es suficiente. A medida que el sistema crece, aparecen necesidades más complejas que requieren patrones avanzados.

Este artículo profundiza en patrones avanzados de Dependency Injection en aplicaciones de escritorio, abordando escenarios reales donde la simple inyección de servicios no es suficiente.
<!--more-->

El objetivo es evolucionar desde un uso básico de DI hacia un enfoque arquitectónico sólido, alineado con aplicaciones enterprise.

## El problema

Errores comunes en el uso de DI:

- Contenedor usado como Service Locator  
- Dependencias excesivas en ViewModels  
- Ciclos de vida mal definidos  
- Dificultad para manejar múltiples implementaciones  
- Falta de control sobre resolución dinámica  

### Ejemplo incorrecto

```csharp
var service = App.Services.GetService<IDataService>();
```

Problema:

- rompe inversión de dependencias  
- difícil de testear  
- acoplamiento oculto  

## Principio clave

DI no es solo registrar servicios. Es diseñar cómo las dependencias fluyen en la aplicación.

## Patrón 1: Factory Pattern con DI

Cuando se necesitan instancias dinámicas:

```csharp
public interface IViewModelFactory
{
    T Create<T>();
}

public class ViewModelFactory : IViewModelFactory
{
    private readonly IServiceProvider _provider;

    public ViewModelFactory(IServiceProvider provider)
    {
        _provider = provider;
    }

    public T Create<T>()
    {
        return _provider.GetRequiredService<T>();
    }
}
```

Permite creación controlada.

## Patrón 2: Scoped-like en desktop

Aunque no existe scope web, se puede simular:

```csharp
public class ScopeContext
{
    public Guid ScopeId { get; } = Guid.NewGuid();
}
```

Útil para:

- workflows  
- sesiones temporales  

## Patrón 3: Named services

Múltiples implementaciones:

```csharp
services.AddTransient<IDataService, ApiDataService>();
services.AddTransient<IDataService, LocalDataService>();
```

Resolver manualmente:

```csharp
public class DataServiceSelector
{
    public IDataService Resolve(bool useApi)
    {
        return useApi ? new ApiDataService() : new LocalDataService();
    }
}
```

Mejor opción: usar fábrica.

## Patrón 4: Decorator Pattern

Agregar comportamiento sin modificar implementación:

```csharp
public class LoggingService : IDataService
{
    private readonly IDataService _inner;

    public LoggingService(IDataService inner)
    {
        _inner = inner;
    }

    public async Task GetDataAsync()
    {
        _logger.LogInformation("Inicio");
        await _inner.GetDataAsync();
        _logger.LogInformation("Fin");
    }
}
```

Útil para:

- logging  
- caching  
- validación  

## Patrón 5: Lazy injection

Evitar cargar dependencias pesadas:

```csharp
public class ViewModel
{
    private readonly Lazy<IHeavyService> _service;

    public ViewModel(Lazy<IHeavyService> service)
    {
        _service = service;
    }
}
```

Mejora performance.

## Patrón 6: Configuration-driven DI

Seleccionar implementación por configuración:

```csharp
if(config.UseApi)
    services.AddSingleton<IDataService, ApiDataService>();
else
    services.AddSingleton<IDataService, LocalDataService>();
```

## Patrón 7: DI + Background services

```csharp
public class SyncService
{
    private readonly IDataService _data;

    public SyncService(IDataService data)
    {
        _data = data;
    }
}
```

Permite reutilizar lógica.

## Patrón 8: DI + ViewModels complejos

Evitar esto:

```csharp
public class VM(A,B,C,D,E,F)
```

Solución:

- agrupar servicios  
- usar facades  

## Patrón 9: Anti-patterns

Evitar:

- Service Locator  
- Singletons innecesarios  
- ViewModels con demasiadas dependencias  
- lógica dentro del contenedor  

## Problemas reales

- memoria mal gestionada  
- dependencias ocultas  
- dificultad para testear  
- código rígido  

## Estrategia profesional

Un uso avanzado de DI incluye:

- factories  
- decorators  
- control de ciclos de vida  
- configuración dinámica  
- diseño limpio  

## Buenas prácticas

- inyectar dependencias explícitamente  
- evitar Service Locator  
- controlar ciclos de vida  
- mantener DI simple  
- diseñar para testabilidad  

## Conclusión

Dependency Injection en aplicaciones de escritorio va mucho más allá de registrar servicios en un contenedor. Es una herramienta de diseño que permite construir sistemas flexibles, mantenibles y escalables.

El uso de patrones avanzados permite manejar escenarios reales donde la complejidad crece y las decisiones arquitectónicas comienzan a tener impacto directo en la calidad del sistema.

Dominar estos patrones es un paso clave hacia un nivel arquitectónico profesional.