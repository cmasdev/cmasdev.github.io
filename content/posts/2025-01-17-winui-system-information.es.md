---
layout: post
title: "Consumo de información del sistema desde WinUI 3"
author: Christian Amado
date: 2025-01-17 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Una aplicación moderna que corre sobre Windows no tiene por qué operar de manera aislada. Gracias a las APIs del sistema operativo disponibles en **Windows App SDK**, es posible acceder a múltiples fuentes de información contextual del sistema como el estado de la batería, conectividad de red, nivel de volumen y hasta el estado de energía. Esto permite que una app se adapte dinámicamente al entorno del usuario, optimizando la experiencia, reduciendo consumo o informando condiciones especiales.

En este artículo se muestra cómo consumir información clave del sistema desde una app **WinUI 3** usando C#, incluyendo suscriptores a eventos para obtener actualizaciones en tiempo real.

<!--more-->

## Requisitos

- Proyecto WinUI 3 Packaged con Windows App SDK
- Visual Studio 2022+
- SDK mínimo 10.0.18362
- Namespaces usados:
  - `Windows.System.Power`
  - `Windows.Networking.Connectivity`
  - `Windows.Media.Devices`

## Batería: estado y nivel de carga

Primero, importar el espacio de nombres:

```csharp
using Windows.System.Power;
```

Obtener el estado actual:

```csharp
var level = PowerManager.RemainingChargePercent;
var state = PowerManager.EnergySaverStatus;
```

Suscribirse a cambios:

```csharp
PowerManager.RemainingChargePercentChanged += (s, e) =>
{
    var updatedLevel = PowerManager.RemainingChargePercent;
    DispatcherQueue.TryEnqueue(() =>
    {
        BatteryText.Text = $"Batería: {updatedLevel}%";
    });
};
```

## Red: conectividad y tipo de conexión

Importar:

```csharp
using Windows.Networking.Connectivity;
```

Obtener el perfil actual:

```csharp
var profile = NetworkInformation.GetInternetConnectionProfile();
bool isConnected = profile?.GetNetworkConnectivityLevel() == NetworkConnectivityLevel.InternetAccess;
string interfaceType = profile?.NetworkAdapter?.IanaInterfaceType.ToString();
```

Ejemplo de monitoreo:

```csharp
NetworkInformation.NetworkStatusChanged += (s) =>
{
    var current = NetworkInformation.GetInternetConnectionProfile();
    var status = current?.GetNetworkConnectivityLevel();
    DispatcherQueue.TryEnqueue(() =>
    {
        NetworkText.Text = $"Conectado: {status}";
    });
};
```

## Volumen: nivel actual del sistema

Importar:

```csharp
using Windows.Media.Devices;
```

Obtener el volumen de salida:

```csharp
var volumeLevel = AudioEndpointVolume.GetVolume();
```

Nota: el acceso directo al volumen del sistema puede requerir componentes COM o APIs Win32 mediante `CoreAudioAPI`. Alternativa:

```csharp
var audioManager = MediaDevice.GetAudioRenderSelector();
```

Para actualizaciones en tiempo real, usar WinRT interop o bibliotecas externas como NAudio.

## Estado de energía: enchufado o batería

```csharp
var status = PowerManager.PowerSupplyStatus;
```

Opciones posibles:

- `PowerSupplyStatus.Inadequate`
- `PowerSupplyStatus.Adequate`
- `PowerSupplyStatus.NotPresent`
- `PowerSupplyStatus.Unknown`

Ejemplo:

```csharp
PowerManager.PowerSupplyStatusChanged += (s, e) =>
{
    var pluggedIn = PowerManager.PowerSupplyStatus;
    DispatcherQueue.TryEnqueue(() =>
    {
        StatusText.Text = $"Fuente de energía: {pluggedIn}";
    });
};
```

## Integración UI

En `MainWindow.xaml`:

```xml
<StackPanel Spacing="10" Padding="20">
    <TextBlock x:Name="BatteryText"/>
    <TextBlock x:Name="NetworkText"/>
    <TextBlock x:Name="StatusText"/>
</StackPanel>
```

En el constructor, inicializar datos actuales + suscripciones.

## Casos de uso reales

- Modo ahorro de batería automático cuando baja del 20%
- Advertencia de red metered o limitada (para evitar descargas)
- Reducción de recursos gráficos cuando no hay energía alterna
- Silenciar notificaciones o sonidos si el volumen es 0

## Conclusión

Las apps modernas en **Windows** pueden y deben responder al contexto del sistema operativo. Acceder a información como batería, conectividad, energía o audio permite desarrollar aplicaciones adaptativas, eficientes y conscientes del entorno. **WinUI 3** permite hacerlo de forma natural, segura y en tiempo real gracias a los eventos y APIs disponibles a través de **Windows App SDK**.