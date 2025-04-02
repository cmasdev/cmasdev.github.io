---
layout: post
title: "Optimización de rendimiento en Blazor WebAssembly: Estrategias y buenas prácticas con .NET"
author: Christian Amado
date: 2024-07-03 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Blazor,.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.png
---
**Blazor WebAssembly** ha revolucionado el desarrollo de aplicaciones web modernas, permitiendo ejecutar aplicaciones **.NET** directamente en el navegador utilizando **WebAssembly**. Aunque **Blazor WebAssembly** ofrece una excelente experiencia de usuario y una integración perfecta con **.NET**, es crucial aplicar estrategias y buenas prácticas de optimización para asegurar que nuestras aplicaciones funcionen de manera eficiente, especialmente cuando se trata de aplicaciones grandes y complejas.

En este artículo, exploraremos estrategias y técnicas de optimización para mejorar el rendimiento de aplicaciones **Blazor WebAssembly** usando **.NET 8**, con ejemplos prácticos de código y buenas prácticas.

<!--more-->

## 1. **Entender cómo funciona Blazor WebAssembly**

Blazor WebAssembly permite ejecutar aplicaciones .NET directamente en el navegador mediante WebAssembly, una tecnología que permite ejecutar código compilado en el navegador de forma segura y eficiente. A diferencia de Blazor Server, que realiza la lógica de la aplicación en el servidor y se comunica con el cliente a través de SignalR, Blazor WebAssembly ejecuta todo en el cliente. Esto puede mejorar la latencia y la experiencia del usuario, pero también introduce desafíos en términos de rendimiento.

### Características clave de Blazor WebAssembly:
- **Ejecución en el cliente**: El código .NET se ejecuta directamente en el navegador, lo que permite que la lógica de la aplicación no dependa del servidor para su ejecución.
- **Uso de WebAssembly**: Blazor WebAssembly aprovecha WebAssembly para ejecutar código en el navegador a una velocidad casi nativa.
- **Interoperabilidad con JavaScript**: Aunque Blazor WebAssembly se ejecuta en .NET, también puede interoperar con JavaScript para acceder a las capacidades del navegador que no están disponibles de forma nativa en .NET.

## 2. **Estrategias de optimización para Blazor WebAssembly**

### 2.1 **Reducir el tamaño de la carga inicial**

Uno de los principales desafíos de las aplicaciones Blazor WebAssembly es el tiempo de carga inicial. Cuando un usuario visita una aplicación Blazor WebAssembly, el navegador tiene que descargar la aplicación completa (incluyendo el ensamblado .NET y las bibliotecas necesarias).

#### Estrategias para reducir el tamaño de la carga inicial:
1. **Habilitar la compresión de archivos**:
   Asegúrate de que los archivos de la aplicación Blazor estén comprimidos. Esto se puede hacer fácilmente configurando la compresión en el servidor (por ejemplo, mediante GZIP o Brotli en un servidor como Nginx o Azure).
   
   **Ejemplo en Azure**:
   - En la configuración de tu aplicación en Azure, habilita la compresión para archivos `.blazor`, `.wasm`, y otros archivos estáticos.

2. **Dividir el código en fragmentos más pequeños**:
   Al usar la opción de **Lazy Loading**, puedes cargar solo las partes necesarias de la aplicación en lugar de cargar toda la aplicación al inicio.

   **Ejemplo de Lazy Loading en Blazor**:
   ```
   builder.Services.AddBlazorWebAssemblyLazyLoad();
   ```

   Esto puede ser útil cuando se tiene una aplicación con muchas rutas y componentes pesados.

3. **Optimizar los archivos WebAssembly**:
   Utiliza el compilador de .NET para optimizar el código WebAssembly para el entorno de producción. En .NET 8, esto se puede lograr configurando el `PublishTrimmed` y `OptimizeForSize` en el archivo `.csproj`:

   ```
   <PropertyGroup>
     <PublishTrimmed>true</PublishTrimmed>
     <OptimizeForSize>true</OptimizeForSize>
   </PropertyGroup>
   ```

   Esto elimina código no utilizado y reduce el tamaño del archivo `.wasm`.

### 2.2 **Optimización de la carga de recursos**

Los recursos de la aplicación, como imágenes, hojas de estilo y scripts adicionales, deben ser optimizados para reducir la latencia.

#### Buenas prácticas para la carga de recursos:
1. **Minificación de CSS y JavaScript**:
   Asegúrate de que todos los archivos CSS y JavaScript estén minificados. Esto reducirá el tamaño de los archivos y mejorará los tiempos de carga.

2. **Uso de imágenes optimizadas**:
   Utiliza formatos de imágenes modernos como WebP y SVG, que son más eficientes en cuanto a tamaño que los tradicionales JPEG y PNG.

3. **Pre-carga de recursos críticos**:
   Utiliza técnicas de pre-carga (por ejemplo, con el atributo `rel="preload"` en los enlaces de los recursos importantes como las hojas de estilo y scripts) para cargar estos recursos antes de que sean necesarios en la aplicación.

   ```
   <link rel="preload" href="styles.css" as="style" />
   <link rel="preload" href="script.js" as="script" />
   ```

### 2.3 **Optimización de la ejecución en el navegador**

Al ejecutar Blazor WebAssembly, el código .NET debe ejecutarse en el navegador, lo que puede consumir recursos. Existen estrategias para optimizar la ejecución en el cliente.

#### Estrategias de optimización para la ejecución:
1. **Uso eficiente de los hilos**:
   Blazor WebAssembly se ejecuta en un solo hilo en el navegador. Para evitar bloqueos y mejorar el rendimiento, asegúrate de no bloquear el hilo principal. Utiliza `Task.Run()` y `async/await` adecuadamente para las operaciones de larga duración.

   **Ejemplo de ejecución asincrónica**:
   ```
   public async Task LoadDataAsync()
   {
       var data = await Http.GetFromJsonAsync<MyData>("api/data");
       StateHasChanged();
   }
   ```

2. **Reducir la cantidad de renderizados**:
   Blazor WebAssembly utiliza un modelo de renderizado basado en la actualización de los componentes. Cada vez que un estado de la aplicación cambia, el componente se vuelve a renderizar. Para optimizar el rendimiento, reduce la cantidad de cambios de estado y actualiza solo cuando sea necesario.

   **Ejemplo de optimización de renderizado**:
   ```
   // Evitar un renderizado innecesario
   private async Task OnClickAsync()
   {
       if (someCondition)
       {
           // Solo actualizar si realmente es necesario
           await InvokeAsync(StateHasChanged);
       }
   }
   ```

### 2.4 **Uso de técnicas de almacenamiento en caché**

El almacenamiento en caché puede mejorar significativamente el rendimiento de una aplicación Blazor WebAssembly al reducir la necesidad de cargar datos o archivos repetidos desde el servidor.

#### Buenas prácticas para almacenamiento en caché:
1. **Almacenar datos en `localStorage` o `sessionStorage`**:
   Utiliza `localStorage` o `sessionStorage` para almacenar datos que se deben acceder rápidamente sin necesidad de hacer nuevas solicitudes al servidor.

   **Ejemplo de uso de `localStorage`**:
   ```
   public void StoreDataInLocalStorage(string key, string data)
   {
       JSRuntime.InvokeVoidAsync("localStorage.setItem", key, data);
   }

   public async Task<string> GetDataFromLocalStorage(string key)
   {
       return await JSRuntime.InvokeAsync<string>("localStorage.getItem", key);
   }
   ```

2. **Caching de API REST**:
   Si tu aplicación realiza muchas solicitudes a una API, puedes usar técnicas de almacenamiento en caché como Service Workers para cachear respuestas de API, reduciendo el tiempo de carga.

## 3. **Conclusión**

La optimización del rendimiento en Blazor WebAssembly es crucial para proporcionar una experiencia de usuario rápida y fluida. Aplicando las estrategias mencionadas, como la reducción del tamaño de la carga inicial, la optimización de recursos, la mejora en la ejecución del código y el uso de almacenamiento en caché, se puede lograr un rendimiento mucho más eficiente en aplicaciones Blazor. Además, la configuración adecuada de la infraestructura, como la compresión y el uso de técnicas de Lazy Loading, p...

Implementando estas buenas prácticas y aprovechando las características avanzadas de .NET 8, es posible crear aplicaciones Blazor WebAssembly rápidas, escalables y con una experiencia de usuario optimizada.
