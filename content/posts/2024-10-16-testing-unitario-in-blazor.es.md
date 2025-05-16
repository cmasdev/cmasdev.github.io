---
layout: post
title: "Testing unitario en Blazor: Herramientas y estrategias"
author: Christian Amado
date: 2024-10-16 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, .NET, Blazor]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.png
---

El desarrollo de aplicaciones robustas y fiables en **Blazor** requiere un enfoque disciplinado hacia las pruebas unitarias. Las pruebas unitarias no solo garantizan que los componentes y servicios funcionen como se espera, sino que también facilitan el mantenimiento, la detección temprana de errores y la calidad del software. En este artículo, exploraremos en detalle cómo realizar pruebas unitarias en Blazor utilizando herramientas modernas, estrategias eficaces y ejemplos prácticos.

<!--more-->

## ¿Qué es el testing unitario?

El testing unitario es un tipo de prueba de software que se enfoca en verificar la funcionalidad de componentes individuales, como clases, métodos o funciones. En Blazor, esto implica probar componentes y servicios para garantizar que realicen su tarea específica de manera correcta.

### Beneficios del testing unitario

1. **Detección temprana de errores**:
   - Ayuda a identificar problemas en etapas iniciales del desarrollo.
2. **Facilita el refactoring**:
   - Permite realizar cambios en el código con confianza.
3. **Mejora la calidad del software**:
   - Garantiza que cada unidad de código funcione correctamente.
4. **Documentación viva**:
   - Las pruebas actúan como una guía sobre cómo debe comportarse el sistema.

## Herramientas para testing unitario en Blazor

### 1. **xUnit**

xUnit es un framework popular para pruebas unitarias en .NET. Ofrece una sintaxis simple y características avanzadas para escribir y ejecutar pruebas.

**Instalación:**
```
dotnet add package xunit
```

### 2. **bUnit**

bUnit es un framework especializado para probar componentes de Blazor. Proporciona una API fácil de usar para renderizar componentes y realizar aserciones sobre su salida.

**Instalación:**
```
dotnet add package Bunit
```

### 3. **Moq**

Moq es una biblioteca de mocking que permite simular dependencias como servicios o repositorios durante las pruebas.

**Instalación:**
```
dotnet add package Moq
```

### 4. **FluentAssertions**

FluentAssertions es una biblioteca que facilita escribir aserciones legibles y expresivas.

**Instalación:**
```
dotnet add package FluentAssertions
```

## Configuración del entorno

1. **Crear un proyecto de pruebas**
   ```
   dotnet new xunit -o BlazorApp.Tests
   cd BlazorApp.Tests
   ```

2. **Agregar referencias al proyecto principal**
   ```
   dotnet add reference ../BlazorApp/BlazorApp.csproj
   ```

3. **Instalar las herramientas necesarias**
   ```
   dotnet add package Bunit
   dotnet add package Moq
   dotnet add package FluentAssertions
   ```

## Estrategias para el testing unitario en Blazor

### 1. **Pruebas de componentes**

Probar componentes de Blazor implica verificar su renderizado, interacción y estado interno.

#### Ejemplo básico: Prueba de un componente de contador

**Componente Counter.razor:**
```
@page "/counter"

<h3>Contador</h3>
<p>Valor actual: @count</p>
<button @onclick="Increment">Incrementar</button>

@code {
    private int count = 0;

    private void Increment()
    {
        count++;
    }
}
```

**Prueba unitaria:**
```
using Bunit;
using Xunit;

public class CounterTests
{
    [Fact]
    public void CounterShouldIncrementWhenButtonClicked()
    {
        // Configurar el contexto de pruebas
        using var context = new TestContext();

        // Renderizar el componente
        var component = context.RenderComponent<Counter>();

        // Verificar el estado inicial
        Assert.Contains("Valor actual: 0", component.Markup);

        // Interactuar con el componente
        component.Find("button").Click();

        // Verificar el nuevo estado
        Assert.Contains("Valor actual: 1", component.Markup);
    }
}
```

### 2. **Pruebas de servicios**

Los servicios en Blazor suelen manejar la lógica de negocio y las interacciones con APIs. Estas pruebas garantizan que los servicios funcionen correctamente.

#### Ejemplo: Servicio de datos

**Servicio IDataService:**
```
public interface IDataService
{
    Task<List<string>> GetItemsAsync();
}
```

**Implementación DataService:**
```
public class DataService : IDataService
{
    public async Task<List<string>> GetItemsAsync()
    {
        // Simulación de datos desde una API
        await Task.Delay(100);
        return new List<string> { "Item1", "Item2", "Item3" };
    }
}
```

**Prueba unitaria con Moq:**
```
using Moq;
using Xunit;
using FluentAssertions;

public class DataServiceTests
{
    [Fact]
    public async Task GetItemsAsync_ShouldReturnListOfItems()
    {
        // Crear un mock del servicio
        var mockService = new Mock<IDataService>();
        mockService.Setup(s => s.GetItemsAsync()).ReturnsAsync(new List<string> { "MockItem1", "MockItem2" });

        // Llamar al método
        var result = await mockService.Object.GetItemsAsync();

        // Verificar resultados
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.Should().Contain("MockItem1");
    }
}
```

### 3. **Pruebas de integración**

Las pruebas de integración verifican cómo interactúan múltiples componentes o servicios.

#### Ejemplo: Integración de un componente con un servicio

**Componente ItemList.razor:**
```
@inject IDataService DataService

<h3>Lista de Items</h3>
<ul>
    @foreach (var item in Items)
    {
        <li>@item</li>
    }
</ul>

@code {
    private List<string> Items = new();

    protected override async Task OnInitializedAsync()
    {
        Items = await DataService.GetItemsAsync();
    }
}
```

**Prueba de integración:**
```
using Bunit;
using Moq;
using Xunit;

public class ItemListTests
{
    [Fact]
    public void ItemListShouldRenderItemsFromService()
    {
        // Crear el mock del servicio
        var mockService = new Mock<IDataService>();
        mockService.Setup(s => s.GetItemsAsync()).ReturnsAsync(new List<string> { "Item1", "Item2" });

        // Configurar el contexto de pruebas
        using var context = new TestContext();
        context.Services.AddSingleton(mockService.Object);

        // Renderizar el componente
        var component = context.RenderComponent<ItemList>();

        // Verificar el contenido renderizado
        Assert.Contains("Item1", component.Markup);
        Assert.Contains("Item2", component.Markup);
    }
}
```

## Buenas prácticas

1. **Aislar las pruebas**:
   - Usa mocks para evitar dependencias externas.

2. **Pruebas pequeñas y específicas**:
   - Cada prueba debe centrarse en un solo comportamiento.

3. **Automatización**:
   - Integra las pruebas en un pipeline CI/CD para garantizar que se ejecuten automáticamente.

4. **Cobertura de pruebas**:
   - Asegúrate de cubrir tanto escenarios positivos como negativos.

## Conclusión

El testing unitario en Blazor es esencial para garantizar la calidad y fiabilidad de las aplicaciones. Al utilizar herramientas como xUnit, bUnit, Moq y FluentAssertions, junto con estrategias efectivas, puedes construir una base sólida de pruebas que facilite el desarrollo y mantenimiento del software. ¡Empieza a implementar estas prácticas en tus proyectos Blazor hoy mismo!