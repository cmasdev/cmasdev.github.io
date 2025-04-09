---
layout: post
title: "Implementación de Widgets personalizados para Windows 11 desde una app moderna"
author: Christian Amado
date: 2024-01-31 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**Windows 11** ha reintroducido el concepto de widgets como parte central de su experiencia de usuario, permitiendo a las aplicaciones modernas integrar contenido interactivo directamente en el panel de Widgets. Con la reciente apertura del canal de desarrollo de widgets para terceros, los desarrolladores pueden crear experiencias ligeras, contextuales y persistentes ancladas al sistema operativo, todo desde una aplicación moderna basada en Windows App SDK.

Este artículo detalla paso a paso cómo estructurar, registrar y mostrar un widget personalizado en Windows 11, partiendo de una aplicación moderna **WinUI 3** empaquetada. Se incluye la configuración del manifiesto, diseño visual y manejo de datos dinámicos.

<!--more-->

## Requisitos

- Windows 11 22H2 (Build 22621+) o superior
- Visual Studio 2022 actualizado
- Windows App SDK 1.3 o superior
- Proyecto Packaged (MSIX)
- Microsoft Store para habilitar canal de publicación del widget
- Cuenta de desarrollador registrada

## Paso 1: Entender el modelo de Widgets

Los widgets de Windows 11 están construidos como una extensión de la app principal. Técnicamente son controles WebView2 renderizados como tarjetas, que viven en un host de sistema y son impulsados por Adaptive Cards o contenido HTML.

La integración se realiza a través de un manifiesto especial `WidgetsManifest.xml` y archivos de configuración complementarios.

## Paso 2: Crear el paquete del widget

Estructura típica:

```
MyApp/
├── App.xaml
├── MainWindow.xaml
├── Widgets/
│   └── myWidget/
│       ├── index.html
│       ├── widget.json
│       └── logo.png
├── WidgetsManifest.xml
```

El archivo `widget.json` define el contenido del widget:

```json
{
  "title": "Resumen diario",
  "description": "Muestra tareas, clima y calendario",
  "hostedAppId": "MyAppWidget",
  "image": "logo.png",
  "defaultSize": "medium",
  "content": {
    "type": "webview",
    "url": "ms-appx-web:///Widgets/myWidget/index.html"
  }
}
```

`index.html` contiene el contenido visible:

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
  <h1>Mi widget</h1>
  <p>Bienvenido, usuario</p>
</body>
</html>
```

## Paso 3: Crear WidgetsManifest.xml

Este manifiesto registra los widgets para la app:

```xml
<WidgetManifest xmlns="http://schemas.microsoft.com/appx/2022/widgetmanifest">
  <HostAppId>MyAppWidget</HostAppId>
  <Widgets>
    <Widget>
      <Id>widget.resumen</Id>
      <Path>ms-appx-web:///Widgets/myWidget/widget.json</Path>
    </Widget>
  </Widgets>
</WidgetManifest>
```

Este archivo se incluye en el empaquetado MSIX.

## Paso 4: Configurar el manifiesto MSIX

Editar `Package.appxmanifest` y agregar:

```xml
<Extensions>
  <Extension Category="windows.widget">
    <Widget>
      <ManifestPath>ms-appx:///WidgetsManifest.xml</ManifestPath>
    </Widget>
  </Extension>
</Extensions>
```

Esto indica que la app soporta widgets y dónde encontrar su configuración.

## Paso 5: Publicar e instalar

Actualmente, los widgets solo se activan para apps publicadas o en canal Insider con habilitación por parte de Microsoft. Para pruebas:

- Enviar a canal privado de Microsoft Store
- Solicitar habilitación del widget en tu cuenta desarrollador
- Instalar con `Add-AppxPackage` local + flags de prueba de widgets

## Paso 6: Comunicación entre app y widget

Los widgets pueden enviar mensajes al proceso principal usando WebView2 o protocolos internos:

```js
window.chrome.webview.postMessage("abrirApp");
```

Y desde la app:

```csharp
WebView.CoreWebView2.WebMessageReceived += (s, e) =>
{
    var mensaje = e.TryGetWebMessageAsString();
    if (mensaje == "abrirApp")
    {
        App.ShowMainWindow();
    }
};
```

Esto permite que el widget lance secciones de la app o actualice información.

## Paso 7: Actualización de datos dinámica

Los widgets pueden obtener datos dinámicamente:

- Desde `localStorage` o APIs JS
- Desde URI internas (ej. REST desde localhost)
- Desde la app principal usando canal de comunicación

Por ejemplo, un widget de clima puede actualizar su contenido vía JavaScript cada 10 minutos.

## Buenas prácticas

- Mantener el contenido mínimo y legible
- No sobrecargar visualmente el widget
- Usar Adaptive Cards o HTML accesible
- Probar en múltiples resoluciones (small, medium, large)
- Permitir configuración desde la app principal

## Casos de uso reales

- Widgets de calendario, clima, tareas, actividad
- Panel de control para apps de productividad
- Resumen de salud del sistema o estadísticas personales
- Entrada rápida de datos (notas, eventos)

## Conclusión

La posibilidad de implementar widgets personalizados en **Windows 11** abre nuevas puertas para la visibilidad, productividad e integración del usuario con una aplicación. Los widgets son ligeros, contextuales y permanecen visibles más allá del tiempo de ejecución de la app, reforzando su utilidad y presencia diaria. Gracias a **Windows App SDK**, su implementación desde apps modernas es posible, estructurada y alineada con las mejores prácticas de experiencia de usuario en el ecosistema **Windows** moderno.