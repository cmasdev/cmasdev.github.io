---
layout: post
title: "Interacción con el portapapeles del sistema usando Windows.ApplicationModel.DataTransfer"
author: Christian Amado
date: 2025-01-24 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

El portapapeles es una funcionalidad crítica para la experiencia del usuario en **Windows**. Permite copiar y pegar texto, imágenes, URIs y otros datos entre aplicaciones. En las apps modernas desarrolladas con **WinUI 3** y **Windows App SDK**, se puede interactuar programáticamente con el portapapeles del sistema para mejorar la productividad, ofrecer funcionalidades avanzadas y controlar la experiencia de transferencia de contenido.

Este artículo explica paso a paso cómo acceder, escribir y leer del portapapeles en aplicaciones modernas, así como técnicas para escuchar cambios en su contenido, realizar transformaciones y trabajar con múltiples formatos.

<!--more-->

## Requisitos

- Proyecto WinUI 3 empaquetado con Windows App SDK
- SDK mínimo: Windows 10 19041+
- Namespace clave: `Windows.ApplicationModel.DataTransfer`

## Escribir texto en el portapapeles

```csharp
using Windows.ApplicationModel.DataTransfer;

var dataPackage = new DataPackage();
dataPackage.SetText("Texto copiado desde mi app WinUI 3");
Clipboard.SetContent(dataPackage);
```

También se puede agregar metadatos:

```csharp
dataPackage.Properties.Title = "Título de contenido";
dataPackage.Properties.Description = "Descripción opcional";
```

Para notificar explícitamente al sistema:

```csharp
Clipboard.Flush();
```

## Leer texto del portapapeles

```csharp
var dataView = Clipboard.GetContent();
if (dataView.Contains(StandardDataFormats.Text))
{
    string texto = await dataView.GetTextAsync();
    ClipboardOutput.Text = $"Contenido: {texto}";
}
```

Este método se puede invocar desde un botón o temporizador.

## Soporte para otros formatos

```csharp
dataPackage.SetUri(new Uri("https://ejemplo.com"));
dataPackage.SetHtmlFormat("<b>HTML</b> con formato");
dataPackage.SetBitmap(RandomAccessStreamReference.CreateFromUri(new Uri("ms-appx:///Assets/logo.png")));
```

Verificar formatos disponibles:

```csharp
var formats = dataView.AvailableFormats;
```

## Detectar cambios en el portapapeles

No hay un evento oficial en `Clipboard`, pero se puede implementar polling:

```csharp
DispatcherQueueTimer timer = DispatcherQueue.CreateTimer();
string ultimoTexto = "";

timer.Interval = TimeSpan.FromSeconds(1);
timer.Tick += async (s, e) =>
{
    var contenido = Clipboard.GetContent();
    if (contenido.Contains(StandardDataFormats.Text))
    {
        var actual = await contenido.GetTextAsync();
        if (actual != ultimoTexto)
        {
            ultimoTexto = actual;
            ClipboardOutput.Text = $"Nuevo texto: {actual}";
        }
    }
};

timer.Start();
```

Esto permite detectar cuando el usuario copia nuevo contenido desde otra app.

## Restringir formatos permitidos

Para seguridad o control de flujo, verificar antes de aceptar contenido:

```csharp
if (dataView.Contains(StandardDataFormats.Text) &&
    !dataView.Contains(StandardDataFormats.Html))
{
    // Solo texto plano permitido
}
```

## Copiar contenido personalizado (JSON, archivos)

```csharp
dataPackage.SetData("custom/json", jsonString);
```

Nota: se necesita compatibilidad en la app que reciba ese contenido para leer formatos personalizados.

## Ejemplo de uso completo en UI

XAML:

```xml
<StackPanel Padding="20">
    <TextBox x:Name="ClipboardInput" Header="Texto a copiar"/>
    <Button Content="Copiar al portapapeles" Click="Copiar_Click"/>
    <Button Content="Leer portapapeles" Click="Leer_Click"/>
    <TextBlock x:Name="ClipboardOutput" TextWrapping="Wrap"/>
</StackPanel>
```

Code-behind:

```csharp
private void Copiar_Click(object sender, RoutedEventArgs e)
{
    var data = new DataPackage();
    data.SetText(ClipboardInput.Text);
    Clipboard.SetContent(data);
    ClipboardOutput.Text = "Copiado.";
}

private async void Leer_Click(object sender, RoutedEventArgs e)
{
    var contenido = Clipboard.GetContent();
    if (contenido.Contains(StandardDataFormats.Text))
    {
        var texto = await contenido.GetTextAsync();
        ClipboardOutput.Text = $"Leído: {texto}";
    }
}
```

## Casos de uso reales

- Pegar contenido enriquecido en editores (markdown, HTML)
- Copiar información contextual como tokens, ID o URIs
- Integrar con “Copiar imagen” o “Copiar como JSON”
- Composición de snippets o macros desde múltiples fuentes
- Interacción fluida entre apps modernas y legacy

## Buenas prácticas

- Siempre verificar que el contenido exista antes de leer
- No sobrescribir el portapapeles sin notificar al usuario
- Usar `Clipboard.Clear()` solo si estrictamente necesario
- Adaptar al formato correcto según destino (no forzar HTML si no se soporta)
- Considerar privacidad al manipular datos sensibles

## Conclusión

El acceso al portapapeles del sistema desde **WinUI 3** permite a las apps modernas integrarse de forma directa con el flujo de trabajo del usuario. Esta capacidad desbloquea múltiples escenarios avanzados como composición de datos, interoperabilidad entre apps, lectura de contenido contextual y productividad mejorada. Gracias a Windows App SDK, estas operaciones son seguras, versátiles y completamente compatibles con el sistema operativo.