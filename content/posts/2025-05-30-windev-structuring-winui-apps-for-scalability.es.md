---
layout: post
title: Estructura de proyectos WinUI 3 para aplicaciones mantenibles y escalables
author: Christian Amado
date: 2025-05-30 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En proyectos reales, la forma en que se estructura una solución WinUI 3 determina en gran medida su capacidad de evolucionar sin degradar la calidad del código. Una estructura deficiente no suele fallar en las primeras semanas, pero introduce fricción constante a medida que el sistema crece.

Cuando la aplicación incorpora nuevas pantallas, servicios y reglas de negocio, la falta de organización clara se traduce en dependencias cruzadas, duplicación de lógica y dificultades para realizar cambios sin efectos colaterales.
<!--more-->

Este artículo presenta una estructura de proyecto para WinUI 3 orientada a mantenibilidad y escalabilidad, con un enfoque práctico y alineado a escenarios de producción.

## El problema

Las plantillas iniciales de proyectos WinUI 3 son útiles para comenzar, pero no imponen una estructura sólida. Es habitual encontrar soluciones con:

- Lógica distribuida en code-behind  
- ViewModels sin responsabilidades claras  
- Servicios mezclados con lógica de presentación  
- Falta de separación por capas  
- Proyectos monolíticos difíciles de modularizar  

### Ejemplo de estructura problemática

```
/App
/MainWindow.xaml
/MainWindow.xaml.cs
/Helpers
/Utils
/Services
```

Problemas:

- Carpetas genéricas sin propósito claro  
- Dependencias implícitas  
- Difícil navegación del código  
- Baja cohesión  

En equipos, este tipo de estructura genera inconsistencias y aumenta el costo de mantenimiento.

## La solución

Una estructura efectiva debe:

1. Separar responsabilidades por capas  
2. Facilitar la navegación del código  
3. Permitir crecimiento modular  
4. Reducir acoplamientos innecesarios  

Se propone una organización por capas y dominios.

## Paso 1: Estructura base recomendada

```
/App
/Views
/ViewModels
/Models
/Services
/Infrastructure
/Resources
```

### Descripción de cada capa

- **App**: inicialización, configuración global  
- **Views**: XAML y code-behind mínimo  
- **ViewModels**: lógica de presentación y estado  
- **Models**: entidades de dominio  
- **Services**: acceso a datos, APIs, lógica externa  
- **Infrastructure**: logging, configuración, utilidades técnicas  
- **Resources**: estilos, temas, assets  

Esta separación permite entender rápidamente el propósito de cada componente.

## Paso 2: Organización por características (feature folders)

En aplicaciones medianas o grandes, se recomienda agrupar por funcionalidad:

```
/Features
    /Customers
        CustomerView.xaml
        CustomerViewModel.cs
        CustomerService.cs
    /Orders
        OrderView.xaml
        OrderViewModel.cs
        OrderService.cs
```

Ventajas:

- Alta cohesión por dominio  
- Reducción de dependencias cruzadas  
- Facilita trabajo en paralelo  

## Paso 3: Definición clara de contratos

Los servicios deben exponerse mediante interfaces.

```csharp
public interface ICustomerService
{
    Task<List<Customer>> GetCustomersAsync();
}

public class CustomerService : ICustomerService
{
    public async Task<List<Customer>> GetCustomersAsync()
    {
        // Simulación de acceso a datos
        await Task.Delay(300);

        return new List<Customer>
        {
            new Customer { Name = "Cliente 1" },
            new Customer { Name = "Cliente 2" }
        };
    }
}
```

Esto permite desacoplar implementación y consumo.

## Paso 4: ViewModels enfocados

Cada ViewModel debe tener una única responsabilidad.

```csharp
using System.Collections.ObjectModel;

public class CustomerViewModel
{
    private readonly ICustomerService _service;

    public ObservableCollection<Customer> Customers { get; } = new();

    public CustomerViewModel(ICustomerService service)
    {
        _service = service;
    }

    public async Task LoadAsync()
    {
        var data = await _service.GetCustomersAsync();

        Customers.Clear();

        foreach (var item in data)
        {
            Customers.Add(item);
        }
    }
}
```

Características:

- Sin lógica de UI  
- Dependencias explícitas  
- Preparado para testing  

## Paso 5: Configuración de dependencias

Incluso si se comienza de forma simple, es recomendable preparar la solución para inyección de dependencias.

```csharp
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddSingleton<ICustomerService, CustomerService>();
        services.AddTransient<CustomerViewModel>();

        return services;
    }
}
```

Inicialización:

```csharp
var services = new ServiceCollection();
services.AddApplicationServices();

var provider = services.BuildServiceProvider();
```

Esto permite evolucionar hacia una arquitectura más robusta sin refactorizaciones masivas.

## Paso 6: Recursos y estilos centralizados

Los estilos deben definirse en un lugar único.

```xml
<Application.Resources>
    <ResourceDictionary>
        <Style TargetType="Button">
            <Setter Property="Padding" Value="10"/>
        </Style>
    </ResourceDictionary>
</Application.Resources>
```

Evita duplicación y mejora consistencia visual.

## Buenas prácticas

- Evitar carpetas genéricas sin propósito  
- Mantener responsabilidades claras por capa  
- Utilizar interfaces para servicios  
- Preparar la solución para modularidad  
- Centralizar recursos y configuraciones  

## Conclusión

La estructura de un proyecto WinUI 3 no es un detalle organizativo, sino una decisión arquitectónica que impacta directamente en la calidad del software. Una estructura clara reduce complejidad, mejora la colaboración y permite escalar la aplicación sin introducir deuda técnica.

Adoptar una organización por capas y, cuando corresponde, por características, facilita el mantenimiento y prepara el sistema para evolucionar de forma controlada.
