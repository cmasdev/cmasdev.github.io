---
layout: post
title: Dependency Injection en WinUI 3 aplicado correctamente en aplicaciones reales
author: Christian Amado
date: 2025-07-18 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK, WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones modernas, Dependency Injection es un componente clave para construir sistemas desacoplados, testeables y escalables. Sin embargo, en WinUI 3 su implementación no siempre es evidente, lo que lleva a soluciones improvisadas o inconsistentes.

En muchos proyectos, se observa una mezcla de instanciación manual con patrones incompletos de inyección de dependencias, lo que introduce acoplamiento y dificulta la evolución del sistema.
<!--more-->

Este artículo aborda cómo implementar Dependency Injection correctamente en WinUI 3, con un enfoque orientado a aplicaciones reales.

## El problema

Uno de los errores más comunes es evitar el uso de un contenedor de dependencias y crear instancias manualmente.

Errores típicos:

- Instanciación directa en la vista  
- Dependencias ocultas  
- Dificultad para testear  
- Código rígido y difícil de mantener  

### Ejemplo incorrecto

```csharp
public sealed partial class MainWindow : Window
{
    public MainWindow()
    {
        this.InitializeComponent();

        var service = new DataService();
        var vm = new MainViewModel(service);

        this.DataContext = vm;
    }
}
```

Problemas:

- Dependencias acopladas  
- Difícil de modificar  
- No escalable  

## La solución

Dependency Injection permite desacoplar la creación de objetos de su uso.

Principios:

1. Invertir dependencias  
2. Centralizar configuración  
3. Facilitar testing  
4. Mejorar mantenibilidad  

## Paso 1: Agregar contenedor de servicios

```csharp
using Microsoft.Extensions.DependencyInjection;

public partial class App : Application
{
    public static IServiceProvider Services { get; private set; }

    public App()
    {
        var collection = new ServiceCollection();
        ConfigureServices(collection);

        Services = collection.BuildServiceProvider();

        this.InitializeComponent();
    }

    private void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<IDataService, DataService>();
        services.AddTransient<MainViewModel>();
    }
}
```

Esto define el contenedor global.

## Paso 2: Resolver dependencias

```csharp
public sealed partial class MainWindow : Window
{
    public MainViewModel ViewModel { get; }

    public MainWindow()
    {
        this.InitializeComponent();

        ViewModel = App.Services.GetService<MainViewModel>();
        this.DataContext = this;
    }
}
```

Esto elimina instanciación manual.

## Paso 3: Inyección en ViewModel

```csharp
public class MainViewModel
{
    private readonly IDataService _service;

    public MainViewModel(IDataService service)
    {
        _service = service;
    }
}
```

El ViewModel no conoce la implementación concreta.

## Paso 4: Ciclos de vida

- Singleton: instancia única  
- Transient: nueva instancia por solicitud  
- Scoped: no común en desktop  

Ejemplo:

```csharp
services.AddSingleton<AppState>();
services.AddTransient<DetailsViewModel>();
```

Elegir correctamente es clave.

## Paso 5: Inyección en páginas

```csharp
public sealed partial class DetailsPage : Page
{
    public DetailsViewModel ViewModel { get; }

    public DetailsPage()
    {
        this.InitializeComponent();

        ViewModel = App.Services.GetService<DetailsViewModel>();
        this.DataContext = this;
    }
}
```

Esto mantiene consistencia.

## Paso 6: Testing

Dependency Injection permite reemplazar implementaciones.

```csharp
var mockService = new Mock<IDataService>();
var vm = new MainViewModel(mockService.Object);
```

Esto facilita pruebas unitarias.

## Paso 7: Errores comunes en producción

- Registrar demasiados singletons  
- Mezclar instanciación manual con DI  
- No centralizar configuración  
- Dependencias innecesarias  

Solución:

- Mantener el contenedor simple  
- Revisar ciclos de vida  
- Evitar dependencias implícitas  

## Buenas prácticas

- Usar un único contenedor  
- Definir servicios mediante interfaces  
- Mantener configuración centralizada  
- Evitar instanciación manual  
- Diseñar pensando en testing  

## Conclusión

Dependency Injection en WinUI 3 es un elemento fundamental para construir aplicaciones profesionales. Su correcta implementación permite desacoplar componentes, mejorar la mantenibilidad y facilitar la evolución del sistema.

Ignorar este patrón o aplicarlo de forma parcial conduce a aplicaciones rígidas y difíciles de escalar.