---
layout: post
title: "Creación de componentes reutilizables en Blazor para aplicaciones escalables"
author: Christian Amado
date: 2024-04-10 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, .NET, Blazor]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/blazor.png
---

Los componentes reutilizables son esenciales para construir aplicaciones Blazor escalables y mantenibles. Este artículo explora cómo aprovechar las capacidades de .NET 8 para crear componentes modulares que mejoren la eficiencia y la reutilización en proyectos de cualquier tamaño. Además, aprenderás las mejores prácticas y técnicas clave para optimizar la construcción de interfaces dinámicas con Blazor.

<!--more-->

## Introducción

Blazor permite a los desarrolladores de .NET construir aplicaciones web interactivas con componentes reutilizables, un enfoque que no solo mejora la eficiencia del desarrollo, sino que también facilita la escalabilidad de las aplicaciones. Con **.NET 8**, Blazor incluye mejoras significativas en el rendimiento y capacidades avanzadas para la creación de componentes, lo que lo convierte en una herramienta ideal para construir aplicaciones mantenibles y modulares.

En este artículo, exploraremos cómo crear componentes reutilizables en Blazor y cómo organizarlos de manera eficiente para aplicaciones escalables.

---

## ¿Qué son los componentes en Blazor?

Un componente en Blazor es una unidad modular de interfaz de usuario (UI) que encapsula lógica, datos y presentación. Los componentes son la base de cualquier aplicación Blazor y permiten construir UI dinámicas de forma sencilla.

Un componente puede incluir:

- **HTML y Razor**: Para definir la estructura y el diseño.
- **C#**: Para la lógica y el manejo de eventos.
- **CSS**: Para el estilo.

Estos componentes son reutilizables, lo que significa que pueden ser compartidos en diferentes partes de la aplicación o incluso entre diferentes proyectos.

---

## Beneficios de los componentes reutilizables

1. **Eficiencia en el desarrollo**:  
   Reduce la duplicación de código al centralizar funcionalidades comunes en un único componente.

2. **Facilidad de mantenimiento**:  
   Los cambios realizados en un componente se reflejan automáticamente donde sea utilizado.

3. **Escalabilidad**:  
   Una arquitectura basada en componentes facilita la expansión de la aplicación.

4. **Reutilización entre proyectos**:  
   Los componentes pueden empaquetarse como bibliotecas para su uso en múltiples aplicaciones.

---

## Creación de un componente reutilizable: Ejemplo práctico

### **Escenario: Botón genérico reutilizable**

Vamos a crear un botón genérico que se pueda reutilizar en diferentes partes de la aplicación. Este botón incluirá propiedades configurables para el texto, el estilo y la acción que ejecuta al ser clicado.

### Paso 1: Crear el componente

Crea un archivo llamado `ReusableButton.razor` en tu proyecto Blazor:

```razor
<button class="@ButtonClass" @onclick="HandleClick">
    @ButtonText
</button>

@code {
    [Parameter]
    public string ButtonText { get; set; } = "Click me";

    [Parameter]
    public string ButtonClass { get; set; } = "btn btn-primary";

    [Parameter]
    public EventCallback OnClick { get; set; }

    private async Task HandleClick()
    {
        if (OnClick.HasDelegate)
        {
            await OnClick.InvokeAsync();
        }
    }
}
```

### Paso 2: Explicación del código

- **[Parameter]**:  
  Los parámetros permiten que las propiedades del componente sean configurables desde su punto de uso.
  - `ButtonText`: El texto que aparecerá en el botón.
  - `ButtonClass`: Las clases CSS para personalizar el estilo.
  - `OnClick`: Un delegado para manejar la acción al hacer clic en el botón.

- **EventCallback**:  
  Es la forma recomendada en Blazor para manejar eventos como clics de botón.

### Paso 3: Uso del componente

Ahora puedes utilizar este componente en cualquier parte de tu aplicación:

```razor
<ReusableButton 
    ButtonText="Guardar" 
    ButtonClass="btn btn-success" 
    OnClick="GuardarCambios" />

<ReusableButton 
    ButtonText="Eliminar" 
    ButtonClass="btn btn-danger" 
    OnClick="EliminarRegistro" />

@code {
    private void GuardarCambios()
    {
        Console.WriteLine("Cambios guardados");
    }

    private void EliminarRegistro()
    {
        Console.WriteLine("Registro eliminado");
    }
}
```

### Resultado

Los dos botones tendrán textos y estilos diferentes, pero comparten la misma lógica de interacción encapsulada en el componente `ReusableButton`.

---

## Buenas prácticas para componentes reutilizables

1. **Modularidad**:  
   Divide los componentes en unidades pequeñas y específicas que puedan ser fácilmente combinadas.

2. **Evita la lógica excesiva**:  
   Mantén los componentes centrados en la UI y delega la lógica compleja a servicios o clases separadas.

3. **Uso de bibliotecas compartidas**:  
   Empaqueta componentes comunes en una **librería Razor Class Library (RCL)** para su reutilización entre proyectos.

4. **Documentación clara**:  
   Proporciona ejemplos de uso y documentación para que otros desarrolladores puedan integrarlos fácilmente.

---

## Blazor en .NET 8: Mejoras para componentes

Con **.NET 8**, Blazor introduce mejoras clave para el desarrollo basado en componentes:

- **Renderización condicional optimizada**:  
  Reduce el impacto de cambios frecuentes en la UI.

- **Soporte para componentes híbridos (Blazor United)**:  
  Combina los beneficios de Blazor Server y WebAssembly, facilitando la creación de componentes reutilizables en cualquier modelo.

- **Mejoras en la interoperabilidad con JavaScript**:  
  Permite integrar bibliotecas externas en componentes Blazor de manera más eficiente.

---

## Conclusión

Los componentes reutilizables son fundamentales para construir aplicaciones Blazor escalables y mantenibles. Al encapsular la lógica y la presentación en módulos independientes, puedes reducir la duplicación de código, mejorar la eficiencia y facilitar la expansión de tu aplicación.

Con las mejoras introducidas en **.NET 8**, crear componentes en Blazor es más poderoso que nunca. Ya sea que estés desarrollando una aplicación pequeña o un sistema complejo, el enfoque modular de Blazor te ayudará a mantener tu proyecto organizado y fácil de escalar.
