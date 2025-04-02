---
layout: post
title: "Blazor WebAssembly con .NET 9: Nuevas características y mejoras"
author: Christian Amado
date: 2024-07-10 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Blazor,.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

**Blazor WebAssembly** ha sido una de las tecnologías más populares en el desarrollo de aplicaciones web interactivas con **C#** en lugar de **JavaScript**. Con la llegada de **.NET 9**, **Blazor WebAssembly** ha incorporado nuevas características y mejoras que optimizan tanto el rendimiento como la experiencia de desarrollo. En este artículo, exploraremos estas nuevas capacidades con ejemplos prácticos y detallaremos cómo sacarles el máximo provecho.

<!--more-->

## Introducción

Blazor WebAssembly (WASM) es una tecnología que permite ejecutar aplicaciones .NET en el navegador utilizando WebAssembly. Esto proporciona una experiencia de desarrollo unificada para aplicaciones web, permitiendo reutilizar código entre el cliente y el servidor. .NET 9 amplía este potencial al mejorar significativamente el rendimiento, la interoperabilidad con JavaScript, la integración con otras plataformas como .NET MAUI, y al simplificar la arquitectura de las aplicaciones modernas.

## Principales características nuevas en Blazor WebAssembly con .NET 9

### 1. Optimización del rendimiento en tiempo de carga
Una de las prioridades en .NET 9 ha sido reducir los tiempos de arranque de las aplicaciones. A través de mejoras en la compresión de recursos, AOT (Ahead-Of-Time Compilation) y reducción de dependencias innecesarias, las aplicaciones ahora inician de forma más ágil.

### 2. Compilación AOT mejorada
.NET 9 permite compilar completamente la aplicación a WebAssembly de forma anticipada. Esto significa que el tiempo de carga se reduce y el rendimiento de ejecución es más cercano a código nativo. 

**Configuración en el .csproj**:
```
<PropertyGroup>
  <RunAOTCompilation>true</RunAOTCompilation>
</PropertyGroup>
```

### 3. Interoperabilidad JavaScript bidireccional mejorada
Con .NET 9, se introducen nuevas APIs para facilitar la interoperabilidad con JavaScript, permitiendo una integración más fluida entre Blazor y librerías del ecosistema JS como Chart.js, Leaflet, entre otras.

**Ejemplo de invocación desde JavaScript hacia Blazor**:
```
DotNet.invokeMethodAsync("BlazorWasmExample", "Metodoblazor")
  .then(result => console.log(result));
```

### 4. Standalone Components y mejora en la modularidad
Ahora los componentes pueden desarrollarse sin necesidad de estar dentro de un `Razor Component Library` o de depender de un `App.razor`, facilitando su reutilización en entornos como MAUI o WASI.

### 5. Mejor integración con .NET MAUI
Las aplicaciones Blazor ahora pueden ejecutarse de forma híbrida en dispositivos móviles y escritorio con .NET MAUI. Esto unifica aún más el desarrollo multiplataforma.

### 6. Lazy Loading de ensamblados optimizado
La descarga bajo demanda de ensamblados ahora es más eficiente, permitiendo dividir la aplicación en módulos que se cargan dinámicamente.

**Ejemplo de configuración**:
```
builder.Services.AddTransient(sp =>
    new LazyAssemblyLoader(sp.GetRequiredService<IJSRuntime>()));
```

## Caso práctico: Creación de una aplicación con Blazor WASM y .NET 9

### Paso 1: Crear el proyecto base
```
dotnet new blazorwasm -n DemoWasmNet9 -f net9.0
```

### Paso 2: Activar AOT y trimming
Agrega en `DemoWasmNet9.csproj`:
```
<PropertyGroup>
  <RunAOTCompilation>true</RunAOTCompilation>
  <PublishTrimmed>true</PublishTrimmed>
</PropertyGroup>
```

### Paso 3: Usar interoperabilidad mejorada con JS
En `Pages/Index.razor`:
```
@inject IJSRuntime JS
<button @onclick="MostrarMensaje">Alerta JS</button>

@code {
  private async Task MostrarMensaje() {
    await JS.InvokeVoidAsync("alert", "¡Hola desde Blazor con .NET 9!");
  }
}
```

## Buenas prácticas con Blazor WebAssembly en .NET 9

- **Minimizar el uso de librerías grandes de terceros** cuando no son necesarias.
- **Utilizar lazy loading de rutas y componentes** para mejorar la experiencia inicial del usuario.
- **Aplicar almacenamiento local con `localStorage` o `IndexedDB`** para evitar solicitudes innecesarias.
- **Medir y optimizar con herramientas como Lighthouse, Application Insights o Web Vitals**.

## Conclusión

Blazor WebAssembly con .NET 9 representa una evolución significativa en la forma de construir aplicaciones web modernas con .NET. Gracias a sus mejoras en compilación, rendimiento, interoperabilidad y soporte multiplataforma, los desarrolladores pueden crear soluciones rápidas, seguras y altamente reutilizables.

Esta versión reafirma el compromiso de Microsoft con una plataforma unificada, flexible y lista para la nube y el cliente. Es el momento ideal para adoptar Blazor si aún no lo has hecho, o para actualizar tus aplicaciones actuales y aprovechar las ventajas que ofrece .NET 9.
