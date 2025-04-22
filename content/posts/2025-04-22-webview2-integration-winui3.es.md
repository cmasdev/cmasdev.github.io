---
layout: post
title: "Integración de WebView2 en aplicaciones WinUI 3"
author: Christian Amado
date: 2025-04-22 11:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

La necesidad de mostrar contenido web dentro de una aplicación de escritorio ha existido por décadas. Con la evolución de los navegadores modernos y la demanda de experiencias híbridas, el control **WebView2** se ha posicionado como una solución poderosa y moderna para las aplicaciones **Windows** desarrolladas con **WinUI 3**. Este artículo explora en detalle cómo integrar **WebView2** en una app de escritorio **WinUI 3** y cómo optimizar la carga de contenido web de manera eficiente.

<!--more-->

## ¿Qué es WebView2?

`WebView2` es un control de Microsoft que permite incrustar contenido web utilizando el motor de renderizado de **Microsoft Edge (Chromium)** dentro de aplicaciones Win32 o Windows App SDK. A diferencia del antiguo `WebView` basado en EdgeHTML, `WebView2` ofrece mayor compatibilidad, seguridad y rendimiento gracias a su base Chromium.

### Principales beneficios:
- Motor moderno basado en Chromium.
- Aislamiento de procesos.
- Integración con cookies y almacenamiento local.
- Comunicación bidireccional entre JavaScript y código nativo.
- Soporte a largo plazo por parte de Microsoft.

## Requisitos previos

Antes de comenzar, se deben tener en cuenta los siguientes requisitos:

- **Windows App SDK** (v1.3 o superior).
- **Microsoft Edge WebView2 Runtime** instalado (no confundir con el navegador Edge).
- **Visual Studio 2022** con soporte para escritorio con C# y WinUI 3.
- SDK de Windows 10 o 11 instalado.

## Instalación de dependencias

1. Crear un nuevo proyecto en Visual Studio:  
   Tipo: `Blank App, Packaged (WinUI 3 in Desktop)`  
   Lenguaje: C#

2. Agregar la referencia a WebView2:

En el archivo `.csproj`, añadir el paquete NuGet:

```xml
<PackageReference Include="Microsoft.Web.WebView2" Version="1.0.1901.177" />
```

Guardar y restaurar los paquetes.

## Estructura base de una app WinUI 3 con WebView2

### XAML

Editar `MainWindow.xaml` para incluir el control `WebView2`:

```xml
<Window
    x:Class="WebView2Sample.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:local="using:WebView2Sample"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:wv2="using:Microsoft.Web.WebView2.WinUI"
    Title="WebView2 Sample" Height="450" Width="800">

    <Grid>
        <wv2:WebView2 x:Name="MyWebView" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" />
    </Grid>
</Window>
```

### Code-behind (C#)

Modificar `MainWindow.xaml.cs`:

```csharp
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.Web.WebView2.Core;
using System;

namespace WebView2Sample
{
    public sealed partial class MainWindow : Window
    {
        public MainWindow()
        {
            this.InitializeComponent();
            InitializeWebViewAsync();
        }

        private async void InitializeWebViewAsync()
        {
            await MyWebView.EnsureCoreWebView2Async();
            MyWebView.Source = new Uri("https://cmas.dev");
        }
    }
}
```

## Buenas prácticas para una carga eficiente

### 1. Usar caché inteligente

```csharp
var environment = await CoreWebView2Environment.CreateAsync(null, "webview2_cache");
await MyWebView.EnsureCoreWebView2Async(environment);
```

### 2. Cargar contenido local como fallback

```csharp
MyWebView.CoreWebView2.NavigationCompleted += (s, e) =>
{
    if (!e.IsSuccess)
    {
        MyWebView.NavigateToString("<html><body><h1>Error al cargar el sitio</h1></body></html>");
    }
};
```

### 3. Optimizar el tamaño del WebView2

Evitar redimensionamientos costosos en tiempo de ejecución. Usar `Stretch` y márgenes fijos mejora la renderización.

### 4. Precalentamiento del entorno

```csharp
private static CoreWebView2Environment _preloadedEnvironment;

public static async Task PreloadWebViewEnvironment()
{
    _preloadedEnvironment ??= await CoreWebView2Environment.CreateAsync();
}
```

### 5. Comunicación entre C# y JavaScript

**Ejecutar script desde C#:**

```csharp
await MyWebView.CoreWebView2.ExecuteScriptAsync("alert('Hola desde C#');");
```

**Enviar mensaje desde JavaScript:**

```js
window.chrome.webview.postMessage("Hola desde JS");
```

**Recibir mensaje en C#:**

```csharp
MyWebView.CoreWebView2.WebMessageReceived += (s, e) =>
{
    var message = e.TryGetWebMessageAsString();
    Console.WriteLine("Mensaje recibido: " + message);
};
```

## Manejo de eventos importantes

- `NavigationStarting`: Permite cancelar navegaciones o filtrar dominios.
- `ContentLoading`: Indica que se está comenzando a renderizar el contenido.
- `NavigationCompleted`: Útil para validar si una página cargó correctamente.

Ejemplo de bloqueo de dominios:

```csharp
MyWebView.CoreWebView2.NavigationStarting += (s, e) =>
{
    if (e.Uri.Contains("facebook.com"))
    {
        e.Cancel = true;
    }
};
```

## Seguridad y aislamiento

Es recomendable usar permisos mínimos si se carga contenido externo:

```csharp
MyWebView.CoreWebView2.Settings.IsScriptEnabled = true;
MyWebView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
MyWebView.CoreWebView2.Settings.AreDevToolsEnabled = false;
```

Y para contenido local, asegurarse de usar `https` o rutas en disco firmadas.

## Escenarios de uso comunes

- Dashboards empresariales que combinan gráficos web y lógica nativa.
- Apps híbridas que consumen microfrontends.
- Visualización de documentación o ayuda contextual online.
- Integración con servicios web modernos (OAuth, APIs REST, etc).

## Conclusión

La integración de WebView2 con WinUI 3 permite desarrollar aplicaciones de escritorio modernas, ricas en experiencia y capaces de interactuar con contenido web sin sacrificar rendimiento ni seguridad. Con una arquitectura eficiente de precarga, manejo de errores y comunicación bidireccional, las aplicaciones híbridas se vuelven una opción poderosa y flexible.

El enfoque recomendado es aprovechar el ecosistema Chromium sin sacrificar la integridad del entorno de escritorio, permitiendo una experiencia fluida tanto online como offline. Con buenas prácticas y un manejo consciente de los recursos, WebView2 se convierte en un aliado fundamental para desarrolladores de WinUI 3 en el mundo actual.