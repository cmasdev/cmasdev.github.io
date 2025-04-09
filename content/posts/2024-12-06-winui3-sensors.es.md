---
layout: post
title: "Acceso a sensores del sistema desde WinUI 3 con Windows.Devices.Sensors"
author: Christian Amado
date: 2024-12-06 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Las apps modernas desarrolladas con **WinUI 3** y **Windows App SDK** pueden aprovechar una amplia gama de sensores disponibles en el sistema operativo Windows. Esto incluye acelerómetro, giroscopio, brújula, inclinación, orientación y sensores de luz ambiental. Estas capacidades permiten que una app de escritorio moderna reaccione al entorno físico, lo cual es especialmente útil en dispositivos portátiles como tablets, convertibles, laptops o incluso PCs todo-en-uno con sensores.

En este artículo se explora paso a paso cómo acceder a sensores desde una aplicación **WinUI 3** utilizando la API `Windows.Devices.Sensors`, incluyendo el manejo de eventos, actualización de UI en tiempo real y recomendaciones de uso avanzado para escenarios como logging, visualización de datos y adaptación dinámica de la interfaz.

<!--more-->

## Requisitos previos

Para este tutorial se asume que ya está configurado un entorno de desarrollo con:

- Windows 11
- Visual Studio 2022 o superior
- Windows App SDK 1.3+ instalado
- Proyecto WinUI 3 en C# (aplicación empaquetada con MSIX)

También es importante habilitar las capacidades necesarias en el manifiesto de la app si se va a distribuir. Para pruebas locales, basta con permisos de ejecución.

## Paso 1: Crear un nuevo proyecto WinUI 3

1. Abrir Visual Studio y crear un nuevo proyecto.
2. Seleccionar **Blank App, Packaged (WinUI 3 in Desktop)**.
3. Asignar nombre: `SensorReaderApp`
4. Confirmar el uso de Windows App SDK y arquitectura x64.

Esto generará la estructura básica con `MainWindow.xaml` y `App.xaml`.

## Paso 2: Agregar namespaces y referencias

Agregar las siguientes directivas al archivo `MainWindow.xaml.cs`:

```csharp
using Windows.Devices.Sensors;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Dispatching;
```

Estas son necesarias para acceder a sensores, actualizar UI y trabajar con el hilo de UI en WinUI 3.

## Paso 3: Declarar sensores en la clase MainWindow

En la clase `MainWindow`, declarar los sensores que se desean utilizar:

```csharp
private Accelerometer _accelerometer;
private Gyrometer _gyrometer;
private Compass _compass;
private OrientationSensor _orientationSensor;
private LightSensor _lightSensor;
```

En el constructor, inicializar los sensores y registrar los eventos:

```csharp
public MainWindow()
{
    this.InitializeComponent();

    _accelerometer = Accelerometer.GetDefault();
    _gyrometer = Gyrometer.GetDefault();
    _compass = Compass.GetDefault();
    _orientationSensor = OrientationSensor.GetDefault();
    _lightSensor = LightSensor.GetDefault();

    if (_accelerometer != null)
        _accelerometer.ReadingChanged += Accelerometer_ReadingChanged;

    if (_gyrometer != null)
        _gyrometer.ReadingChanged += Gyrometer_ReadingChanged;

    if (_compass != null)
        _compass.ReadingChanged += Compass_ReadingChanged;

    if (_orientationSensor != null)
        _orientationSensor.ReadingChanged += OrientationSensor_ReadingChanged;

    if (_lightSensor != null)
        _lightSensor.ReadingChanged += LightSensor_ReadingChanged;
}
```

## Paso 4: Manejar los eventos de lectura

Cada evento entrega una estructura de datos con las lecturas. Por ejemplo:

```csharp
private async void Accelerometer_ReadingChanged(Accelerometer sender, AccelerometerReadingChangedEventArgs args)
{
    var reading = args.Reading;
    await DispatcherQueue.EnqueueAsync(() =>
    {
        txtAccel.Text = $"Accel X: {reading.AccelerationX:F2}, Y: {reading.AccelerationY:F2}, Z: {reading.AccelerationZ:F2}";
    });
}
```

Repetir para los demás sensores. Ejemplo para el giroscopio:

```csharp
private async void Gyrometer_ReadingChanged(Gyrometer sender, GyrometerReadingChangedEventArgs args)
{
    var reading = args.Reading;
    await DispatcherQueue.EnqueueAsync(() =>
    {
        txtGyro.Text = $"Gyro X: {reading.AngularVelocityX:F2}, Y: {reading.AngularVelocityY:F2}, Z: {reading.AngularVelocityZ:F2}";
    });
}
```

Y para la orientación:

```csharp
private async void OrientationSensor_ReadingChanged(OrientationSensor sender, OrientationSensorReadingChangedEventArgs args)
{
    var quaternion = args.Reading.Quaternion;
    await DispatcherQueue.EnqueueAsync(() =>
    {
        txtOrientation.Text = $"Quaternion: X={quaternion.X:F2}, Y={quaternion.Y:F2}, Z={quaternion.Z:F2}, W={quaternion.W:F2}";
    });
}
```

## Paso 5: Diseño de la interfaz de usuario

En `MainWindow.xaml`, agregar un StackPanel con TextBlocks:

```xml
<StackPanel Spacing="10" Padding="20">
    <TextBlock x:Name="txtAccel" FontSize="14" />
    <TextBlock x:Name="txtGyro" FontSize="14" />
    <TextBlock x:Name="txtCompass" FontSize="14" />
    <TextBlock x:Name="txtOrientation" FontSize="14" />
    <TextBlock x:Name="txtLight" FontSize="14" />
</StackPanel>
```

Esto mostrará las lecturas en tiempo real cada vez que cambien.

## Paso 6: Consideraciones de rendimiento y energía

Los sensores pueden consumir energía. Se recomienda:

- Activar sensores solo cuando se necesita
- Detener sensores en `OnSuspending` o al minimizar
- Utilizar `ReportInterval` para reducir frecuencia de actualización

Ejemplo:

```csharp
if (_accelerometer != null)
    _accelerometer.ReportInterval = 500; // milisegundos
```

## Paso 7: Aplicaciones reales y escenarios de uso

Este tipo de integración es útil para:

- Apps de visualización de entorno (IoT, educación, ciencia)
- Adaptación de UI a inclinación o orientación
- Logging de movimiento para auditorías
- Control de juegos, cámaras o navegación mediante sensores
- Accesibilidad aumentada y experiencia context-aware

## Paso 8: Diagnóstico de compatibilidad

No todos los equipos tienen todos los sensores. Se debe validar su disponibilidad:

```csharp
if (_accelerometer == null)
    txtAccel.Text = "Acelerómetro no disponible";
```

Esto mejora la experiencia del usuario final.

## Conclusión

Acceder a sensores desde una aplicación **WinUI 3** es completamente posible y está bien soportado por Windows App SDK mediante las APIs de `Windows.Devices.Sensors`. Con unos pocos pasos se pueden integrar funcionalidades contextuales que elevan la experiencia del usuario en dispositivos modernos. Ya sea para orientación, lectura de luz, movimiento o estado físico del dispositivo, los sensores ofrecen un puente natural entre hardware y software en el desarrollo de apps modernas para **Windows**.

Esta capacidad posiciona a WinUI 3 como una plataforma no solo estética, sino también funcional, lista para aprovechar al máximo la interacción con el sistema operativo y el hardware disponible en equipos modernos.