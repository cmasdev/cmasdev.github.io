---
layout: post
title: "Integración con la API de notificaciones nativas"
author: Christian Amado
date: 2024-12-20 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Las notificaciones del sistema son uno de los mecanismos más eficaces para comunicar información al usuario sin interrumpir su flujo de trabajo. En **Windows**, estas notificaciones pueden ser enriquecidas mediante el sistema de notificaciones nativas, que incluye soporte para contenido visual dinámico con Adaptive Cards y la posibilidad de recibir notificaciones push incluso cuando la aplicación no está en ejecución.

Con **WinUI 3** y **Windows App SDK**, es posible crear y gestionar notificaciones enriquecidas, personalizadas y reactivas. Este artículo muestra cómo implementar notificaciones toast locales, cómo personalizarlas con Adaptive Cards, y cómo configurar notificaciones push para mantener al usuario informado en tiempo real.

<!--more-->

## Requisitos

- Windows 11
- Visual Studio 2022+
- Proyecto empaquetado con MSIX (WinUI 3)
- Windows App SDK 1.3 o superior
- Referencia a `Microsoft.WindowsAppSDK` y `Microsoft.Toolkit.Uwp.Notifications`

## Paso 1: Instalar el paquete NuGet para notificaciones

Agregar al proyecto el paquete:

```bash
Install-Package Microsoft.Windows.SDK.Contracts
Install-Package Microsoft.Toolkit.Uwp.Notifications
```

Esto habilita la construcción de notificaciones toast con contenido enriquecido.

## Paso 2: Enviar una notificación toast simple

Agregar esta llamada en un evento de botón o al iniciar la app:

```csharp
new ToastContentBuilder()
    .AddText("Recordatorio")
    .AddText("No olvides guardar tus cambios")
    .Show();
```

Esto mostrará una notificación estándar en el Centro de Actividades.

## Paso 3: Notificación enriquecida con Adaptive Card

Construir una tarjeta adaptativa (JSON):

```csharp
string adaptiveJson = @"
{
  ""type"": ""AdaptiveCard"",
  ""version"": ""1.5"",
  ""body"": [
    {
      ""type"": ""TextBlock"",
      ""text"": ""Actualización disponible"",
      ""weight"": ""Bolder"",
      ""size"": ""Medium""
    },
    {
      ""type"": ""TextBlock"",
      ""text"": ""La versión 1.5 ya está lista para instalar."",
      ""wrap"": true
    }
  ],
  ""actions"": [
    {
      ""type"": ""Action.OpenUrl"",
      ""title"": ""Actualizar"",
      ""url"": ""https://miapp.com/update""
    }
  ]
}";

var toastContent = new ToastContent()
{
    Visual = new ToastVisual()
    {
        BindingGeneric = new ToastBindingGeneric()
        {
            Children =
            {
                new AdaptiveCardJsonContent(adaptiveJson)
            }
        }
    }
};

ToastNotificationManagerCompat.CreateToastNotifier().Show(new ToastNotification(toastContent.GetXml()));
```

Este código muestra una notificación visualmente rica y con botón de acción.

## Paso 4: Manejar la activación de la notificación

Al pulsar sobre la notificación, se puede invocar código personalizado.

Registrar manejador en `App.xaml.cs`:

```csharp
ToastNotificationManagerCompat.OnActivated += toastArgs =>
{
    ToastArguments args = toastArgs.Argument;
    // Lógica según argumentos
    if (args.Contains("abrirPanel"))
    {
        DispatcherQueue.TryEnqueue(() =>
        {
            new PanelWindow().Activate();
        });
    }
};
```

Para enviar argumentos desde la notificación:

```csharp
.AddArgument("abrirPanel", "true")
```

## Paso 5: Notificaciones push (via canal WNS)

### Crear canal

```csharp
var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
Debug.WriteLine("URI canal: " + channel.Uri);
```

Este URI se registra en el servidor para enviar push desde un backend.

### Recibir notificaciones push

```csharp
channel.PushNotificationReceived += (s, e) =>
{
    // Mostrar notificación o actualizar UI
    var mensaje = e.RawNotification.Content;
};
```

Esto permite recibir actualizaciones incluso si la app está suspendida (con restricciones).

## Paso 6: Permisos y manifiesto

Asegurarse de declarar lo siguiente en el `Package.appxmanifest`:

```xml
<Extensions>
  <uap:Extension Category="windows.toastNotificationActivation">
    <uap:ToastNotificationActivation ToastActivatorCLSID="YOUR-CLSID-HERE" />
  </uap:Extension>
</Extensions>
```

Y registrar el activador COM. Esto requiere el uso de un componente activador como `AppNotificationActivator`.

## Paso 7: Ejemplo completo con interacción

```csharp
new ToastContentBuilder()
    .AddArgument("action", "abrirPanel")
    .AddText("Nuevo mensaje recibido")
    .AddText("Haz clic para abrir el panel de control")
    .AddButton(new ToastButton()
        .SetContent("Abrir ahora")
        .AddArgument("action", "abrirPanel"))
    .Show();
```

Y en el manejador:

```csharp
if (args["action"] == "abrirPanel")
{
    DispatcherQueue.TryEnqueue(() =>
    {
        new PanelWindow().Activate();
    });
}
```

## Buenas prácticas

- No abusar de las notificaciones para evitar fatiga del usuario
- Personalizar con íconos, logos e identidad visual
- Combinar con lógica de actividad para mostrar solo cuando el usuario está inactivo
- Permitir al usuario desactivar ciertos tipos de notificaciones
- Usar telemetría para medir tasa de clics y efectividad

## Casos de uso

- Alertas de sistema o monitoreo en segundo plano
- Confirmaciones de procesos terminados
- Acciones rápidas desde el Centro de Actividades
- Integración con procesos push desde un backend o IoT
- UX reactiva sin abrir la ventana principal

## Conclusión

La **API** de notificaciones nativas de **Windows**, junto con las Adaptive Cards y el soporte push, brinda una poderosa plataforma para interactuar con el usuario de manera contextual y no intrusiva. Usando **WinUI 3** y **Windows App SDK**, es posible ofrecer notificaciones enriquecidas, dinámicas y conectadas, reforzando el ciclo de comunicación entre la aplicación y el usuario.

La integración adecuada de notificaciones no solo mejora la experiencia de usuario, sino que también posiciona a la aplicación como una parte activa del ecosistema Windows moderno.