---
layout: post
title: "¿Cómo ejecutar modelos de IA locales desde una app WinUI 3?"
author: Christian Amado
date: 2025-06-11 00:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

La inteligencia artificial está redefiniendo la experiencia del usuario en aplicaciones modernas, y las aplicaciones nativas de **Windows** no son la excepción. Gracias a **ONNX Runtime**, es posible ejecutar modelos de inferencia de manera eficiente **sin necesidad de conectarse a la nube**, lo cual es ideal para escenarios desconectados, privados o de alto rendimiento.

Este artículo muestra cómo integrar un modelo **ONNX** en una aplicación **WinUI 3** utilizando **.NET** y el paquete `Microsoft.ML.OnnxRuntime`. Se presentará un caso práctico de clasificación de imagenes con un modelo preentrenado.

<!--more-->

## Requisitos previos

- Visual Studio 2022 o superior
- Windows App SDK 1.5+
- Modelo ONNX (ej: SqueezeNet v1.1)
- Paquetes NuGet:
  - `Microsoft.ML.OnnxRuntime`
  - `Microsoft.ML.OnnxRuntime.Managed`

## Paso 1: Preparar el proyecto WinUI 3

Crear un nuevo proyecto en Visual Studio:

1. Plantilla: **Blank App, Packaged (WinUI 3 in Desktop)**
2. Nombre: `WinUI3ONNXDemo`
3. Asegurarse de que el proyecto esté utilizando .NET 6 o superior.

Agregar los paquetes NuGet:
```bash
Install-Package Microsoft.ML.OnnxRuntime
Install-Package Microsoft.ML.OnnxRuntime.Managed
```

Agregar el modelo `.onnx` a la carpeta `Assets/Models/` del proyecto y configurar la propiedad **Copy to Output Directory** como `Copy if newer`.

## Paso 2: Cargar el modelo y ejecutar inferencia

Crear una clase de servicio para gestionar la inferencia:

```csharp
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using System.Drawing;

public class OnnxImageClassifier
{
    private InferenceSession _session;

    public OnnxImageClassifier(string modelPath)
    {
        _session = new InferenceSession(modelPath);
    }

    public string Classify(float[] input)
    {
        var tensor = new DenseTensor<float>(input, new[] { 1, 3, 224, 224 });
        var inputMeta = new NamedOnnxValue[]
        {
            NamedOnnxValue.CreateFromTensor("data", tensor)
        };

        using var results = _session.Run(inputMeta);
        var output = results.First().AsEnumerable<float>().ToArray();
        var max = output.Max();
        var index = Array.IndexOf(output, max);

        return $"Clase {index} - Score: {max:F3}";
    }
}
```

> Nota: La entrada debe estar normalizada al formato del modelo ONNX (e.g., 224x224, RGB, normalizado entre 0 y 1). Para simplificar, puede utilizarse una librería como `ImageSharp` para preparar los datos.

## Paso 3: Interfaz en WinUI 3

En `MainWindow.xaml`, incluir controles para cargar una imagen y mostrar la clasificación:

```xml
<StackPanel Spacing="12" Padding="24">
    <Button Content="Seleccionar imagen" Click="OnSelectImageClicked" />
    <Image x:Name="PreviewImage" Width="300" Height="300" />
    <TextBlock x:Name="ResultText" FontSize="20" />
</StackPanel>
```

En `MainWindow.xaml.cs`:

```csharp
private OnnxImageClassifier _classifier;

public MainWindow()
{
    this.InitializeComponent();
    var modelPath = Path.Combine(AppContext.BaseDirectory, "Assets", "Models", "squeezenet.onnx");
    _classifier = new OnnxImageClassifier(modelPath);
}

private async void OnSelectImageClicked(object sender, RoutedEventArgs e)
{
    var picker = new FileOpenPicker();
    picker.FileTypeFilter.Add(".jpg");
    picker.FileTypeFilter.Add(".png");

    WinRT.Interop.InitializeWithWindow.Initialize(picker, this.GetWindowHandle());
    var file = await picker.PickSingleFileAsync();

    if (file != null)
    {
        using var stream = await file.OpenStreamForReadAsync();
        var input = PreprocessImage(stream); // convertir a float[]
        var result = _classifier.Classify(input);
        ResultText.Text = result;
    }
}
```

## Paso 4: Empaquetado y despliegue

- Incluir el modelo `.onnx` en la MSIX.
- Probar en equipos sin acceso a internet.
- Verificar uso de CPU o GPU dependiendo del backend de ONNX.

Opcionalmente, agregar soporte a DirectML o delegados personalizados para GPU.

## Conclusión

Gracias a **ONNX Runtime**, las aplicaciones **WinUI 3** pueden ejecutar modelos de inferencia localmente, lo que abre la puerta a aplicaciones de **IA** privadas, desconectadas o de bajo costo de infraestructura. Esta capacidad es particularmente poderosa en escenarios de *Edge Computing*, *kioscos*, diagnósticos offline o soluciones de accesibilidad personalizadas.

La combinación de **IA local + UI nativa** representa uno de los pilares del futuro del ecosistema Windows.