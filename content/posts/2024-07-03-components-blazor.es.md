---
layout: post
title: "Creación de componentes reutilizables en Blazor para aplicaciones escalables"
author: Christian Amado
date: 2024-07-03 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Blazor,.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.png
---
**Blazor** es un framework poderoso que permite a los desarrolladores construir aplicaciones web modernas utilizando **C#**. Una de sus características clave es la capacidad de crear componentes reutilizables que promueven la modularidad, escalabilidad y mantenibilidad de las aplicaciones. En este artículo, exploraremos cómo diseñar y desarrollar componentes reutilizables en Blazor, acompañado de ejemplos prácticos y mejores prácticas.

<!--more-->

## ¿Qué son los componentes en Blazor?
Los componentes en Blazor son unidades reutilizables de la interfaz de usuario que combinan lógica y presentación. Cada componente se define en un archivo `.razor` y puede incluir código C#, HTML y CSS.

### Características principales
1. **Encapsulación**: Los componentes encapsulan la lógica y el diseño, promoviendo la reutilización.
2. **Reactividad**: Pueden responder a eventos y actualizarse dinámicamente.
3. **Comunicación entre componentes**: Soportan la transferencia de datos a través de propiedades y eventos.
4. **Renderizado eficiente**: Blazor optimiza el renderizado para minimizar los cambios en el DOM.

## Crear un componente básico
### Ejemplo: Componente de Botón
Archivo: `ButtonComponent.razor`

```
<button class="btn btn-primary" @onclick="OnClick">@Label</button>

@code {
    [Parameter]
    public string Label { get; set; } = "Click Me";

    [Parameter]
    public EventCallback OnClick { get; set; }
}
```

#### Uso del componente
Archivo: `MainLayout.razor`
```
<ButtonComponent Label="Guardar" OnClick="SaveData" />

@code {
    private void SaveData()
    {
        Console.WriteLine("Datos guardados correctamente.");
    }
}
```

## Componentes parametrizables
### Paso 1: Definir propiedades con `[Parameter]`
Las propiedades con el atributo `[Parameter]` permiten a los componentes recibir datos externos.
```
<h3>@Title</h3>
<p>@Description</p>

@code {
    [Parameter]
    public string Title { get; set; }

    [Parameter]
    public string Description { get; set; }
}
```

### Paso 2: Render Fragment
Render Fragment permite pasar bloques de contenido al componente.
```
<div class="card">
    <div class="card-header">
        @Header
    </div>
    <div class="card-body">
        @Body
    </div>
</div>

@code {
    [Parameter]
    public RenderFragment Header { get; set; }

    [Parameter]
    public RenderFragment Body { get; set; }
}
```

#### Ejemplo de uso
```
<CardComponent>
    <Header>
        <h3>Mi Título</h3>
    </Header>
    <Body>
        <p>Este es el contenido del cuerpo.</p>
    </Body>
</CardComponent>
```

## Mejores prácticas para componentes reutilizables
1. **Evitar lógica compleja**:
   - Divide la funcionalidad compleja en varios componentes más simples.
2. **Documentar parámetros**:
   - Proporciona descripciones claras de los parámetros y su uso.
3. **Usar estilos modulares**:
   - Utiliza CSS aislado para evitar conflictos de estilos.
4. **Validar entradas**:
   - Asegúrate de validar los datos recibidos a través de los parámetros.
5. **Seguir el principio DRY (Don't Repeat Yourself)**:
   - Reutiliza componentes siempre que sea posible.

## Componentes avanzados
### Componentes genéricos
Blazor soporta componentes genéricos que permiten trabajar con diferentes tipos de datos.
```
<div>
    @foreach (var item in Items)
    {
        <p>@item</p>
    }
</div>

@code {
    [Parameter]
    public IEnumerable<T> Items { get; set; }
}
```

#### Uso del componente genérico
```
<GenericComponent Items="new List<int> { 1, 2, 3 }" />
```

### Componentes dinámicos
Permiten renderizar diferentes componentes basados en datos o estados.
```
@foreach (var component in Components)
{
    <DynamicComponent Type="component" />
}

@code {
    [Parameter]
    public List<Type> Components { get; set; } = new List<Type> { typeof(ButtonComponent), typeof(CardComponent) };
}
```

## Pruebas de componentes
### Framework recomendado: `bUnit`
#### Configurar `bUnit`
1. Instalar la biblioteca:
   ```
   dotnet add package Bunit
   ```
2. Escribir pruebas:
   ```
   [Fact]
   public void ButtonComponent_DisplaysCorrectLabel()
   {
       using var ctx = new TestContext();
       var cut = ctx.RenderComponent<ButtonComponent>(parameters => parameters
           .Add(p => p.Label, "Test Button"));

       Assert.Contains("Test Button", cut.Markup);
   }
   ```

## Conclusión
La creación de componentes reutilizables en **Blazor** es clave para construir aplicaciones escalables y mantenibles. Siguiendo las buenas prácticas y aprovechando las características avanzadas del framework, los desarrolladores pueden maximizar la productividad y garantizar la calidad de sus aplicaciones. ¡Empieza a diseñar tus propios componentes reutilizables hoy mismo y lleva tus habilidades de desarrollo web al siguiente nivel!
