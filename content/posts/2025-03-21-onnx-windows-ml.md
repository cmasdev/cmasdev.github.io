---
layout: post
title: "Integración de inferencia local ONNX con Windows ML en apps modernas"
author: Christian Amado
date: 2024-03-21 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

La inteligencia artificial en el entorno de escritorio ya no está limitada a la nube. **Windows** proporciona soporte nativo para la ejecución de modelos **ONNX** directamente desde una app **WinUI 3** utilizando **Windows ML**. Esto permite realizar inferencia local con alto rendimiento y sin necesidad de conexión a internet, ideal para escenarios de privacidad, baja latencia o ejecución offline.

En este artículo se describe cómo integrar un modelo **ONNX** a una app moderna, cómo usar la **API** de **Windows ML** y cómo estructurar un flujo de inferencia optimizado con soporte para entrada y salida de datos reales.

<!--more-->

## Requisitos

- Windows 11 (recomendado build 22621+)
- Visual Studio 2022 con Windows App SDK 1.3+
- Proyecto WinUI 3 empaquetado (MSIX)
- Referencia al paquete `Microsoft.AI.MachineLearning`
- Modelo ONNX compatible (puede ser descargado de onnxruntime zoo)

## Paso 1: Agregar el paquete NuGet de Windows ML

Agregar al proyecto:

```
Install-Package Microsoft.AI.MachineLearning
```

Esto permite cargar y ejecutar modelos ONNX directamente desde código.

## Paso 2: Copiar el modelo ONNX al proyecto

Ejemplo: `modelo_mnist.onnx` copiado a la carpeta `Assets/ML`

Configurar en propiedades:

- Build Action: Content
- Copy to Output Directory: Copy if newer

## Paso 3: Cargar el modelo ONNX

Importar:

```csharp
using Microsoft.AI.MachineLearning;
```

Cargar desde archivo:

```csharp
var file = await StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///Assets/ML/modelo_mnist.onnx"));
var session = LearningModelSession.CreateFromModel(LearningModel.LoadFromFilePath(file.Path));
```

Esto crea una sesión de inferencia desde el modelo.

## Paso 4: Preparar entrada para inferencia

Ejemplo para imagen de 28x28 píxeles escala de grises:

```csharp
float[] input = new float[1 * 1 * 28 * 28]; // NCHW
// Rellenar input con los valores de píxeles normalizados (0.0–1.0)

var tensor = TensorFloat.CreateFromArray(new[] { 1u, 1u, 28u, 28u }, input);
var binding = new LearningModelBinding(session);
binding.Bind("Input3", tensor);
```

## Paso 5: Ejecutar inferencia

```csharp
var result = await session.EvaluateAsync(binding, "Inferencia1");
var outputTensor = result.Outputs["Plus214_Output_0"] as TensorFloat;
var output = outputTensor.GetAsVectorView();
int predictedIndex = output.ToList().IndexOf(output.Max());
```

Esto retorna el índice con mayor probabilidad (en este caso, el dígito 0–9).

## Paso 6: Mostrar resultados en UI

```csharp
ResultadoText.Text = $"Predicción: {predictedIndex}";
```

En XAML:

```xml
<StackPanel>
  <Image x:Name="InputPreview"/>
  <TextBlock x:Name="ResultadoText"/>
</StackPanel>
```

## Paso 7: Optimización y aceleración

Windows ML usa DirectML y soporte para GPU si está disponible. No se requiere configuración extra: el runtime lo detecta automáticamente.

Validar el dispositivo utilizado:

```csharp
var deviceKind = session.DeviceKind.ToString(); // CPU, GPU, DirectML
```

## Paso 8: Alternativas para modelos

- Convertir PyTorch / TensorFlow → ONNX
- Usar modelos preentrenados: `squeezenet`, `resnet18`, `mobilenetv2`
- Exportar modelos propios con herramientas como `onnxruntime-tools` o `tf2onnx`

## Casos de uso reales

- Clasificación de imágenes (productos, documentos)
- Detección de anomalías locales
- Asistentes inteligentes offline
- Modelos de NLP ligeros ejecutados localmente
- Reconocimiento de escritura a mano o números

## Buenas prácticas

- Validar entradas antes de ejecutar inferencia
- Manejar fallback si no hay aceleración GPU
- No cargar el modelo en cada inferencia (persistir sesión)
- Reducir tamaño del modelo con quantization si es posible

## Conclusión

La integración de **ONNX** y **Windows ML** en aplicaciones modernas **WinUI 3** permite ejecutar inferencia local de modelos de IA de forma nativa, segura y sin latencia de red. Esto convierte a **Windows** en una plataforma ideal para aplicaciones inteligentes en el borde, desde escritorios empresariales hasta dispositivos autónomos. El soporte de **Windows App SDK** lo hace accesible a cualquier desarrollador de apps modernas.