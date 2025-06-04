---
layout: post
title: "Acceso a sensores del sistema desde WinUI 3"
author: Christian Amado
date: 2025-05-13 00:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---
Las aplicaciones modernas pueden ofrecer experiencias más dinámicas si aprovechan los sensores integrados del sistema, como el acelerómetro, el estado de la batería y la ubicación geográfica. Aunque estas capacidades se asociaban tradicionalmente con dispositivos móviles, **Windows** también expone estas **APIs** a través de **WinRT**. Este artículo muestra cómo acceder a sensores clave desde una app **WinUI 3** escrita en **C#**.

<!--more-->

## Requisitos previos

- Windows 10/11 con sensores físicos (para pruebas reales).
- Visual Studio 2022+
- Windows App SDK 1.4 o superior
- Referencias a `Windows.Devices.*` vía WinRT

## Acceso al sensor de batería

El sensor de batería no requiere permisos especiales.

```csharp
using Windows.System.Power;

var report = Battery.AggregateBattery.GetReport();
var percentage = report.RemainingCapacityInMilliwattHours * 100.0 / report.FullChargeCapacityInMilliwattHours;

Debug.WriteLine($"Batería actual: {percentage:F2}%");
```

> **Tip:** Podés usar bindings para mostrar el valor en tiempo real en un `TextBlock`.

## Lectura de acelerómetro desde WinRT

Para dispositivos con sensores físicos:

```csharp
using Windows.Devices.Sensors;

Accelerometer accelerometer = Accelerometer.GetDefault();

if (accelerometer != null)
{
    accelerometer.ReadingChanged += (s, e) =>
    {
        var x = e.Reading.AccelerationX;
        var y = e.Reading.AccelerationY;
        var z = e.Reading.AccelerationZ;

        Debug.WriteLine($"X: {x}, Y: {y}, Z: {z}");
    };
}
```

> Requiere pruebas en hardware compatible (ej: laptops convertibles, tablets o equipos con IMU).

## Acceso a ubicación geográfica

Se debe declarar la **capacidad `location`** en el manifiesto del paquete (MSIX o runtime).

### Declarar la capacidad:

Editá el archivo `Package.appxmanifest`:

```xml
<Capabilities>
  <DeviceCapability Name="location"/>
</Capabilities>
```

### Código en C#:

```csharp
using Windows.Devices.Geolocation;

Geolocator geolocator = new Geolocator { DesiredAccuracy = PositionAccuracy.High };

Geoposition pos = await geolocator.GetGeopositionAsync();
var latitude = pos.Coordinate.Point.Position.Latitude;
var longitude = pos.Coordinate.Point.Position.Longitude;

Debug.WriteLine($"Latitud: {latitude}, Longitud: {longitude}");
```

> Asegurate de tener permisos activados en la Configuración de privacidad de Windows.

## Visualizando datos en la UI con WinUI 3

Podés crear un `TextBlock` o `DataGrid` para mostrar en tiempo real los datos:

```xml
<StackPanel>
    <TextBlock x:Name="BatteryText" />
    <TextBlock x:Name="AccelText" />
    <TextBlock x:Name="LocationText" />
</StackPanel>
```

Y luego desde el code-behind:

```csharp
BatteryText.Text = $"Batería: {percentage:F2}%";
AccelText.Text = $"Aceleración: X={x}, Y={y}, Z={z}";
LocationText.Text = $"Ubicación: {latitude}, {longitude}";
```

## Conclusión

Acceder a sensores del sistema en **WinUI 3** es posible gracias al poder de las **APIs WinRT** expuestas por **Windows**. Aunque no todos los dispositivos tendrán soporte físico para estos sensores, el enfoque es útil para crear apps que respondan al contexto del sistema, mejorando la experiencia del usuario.
