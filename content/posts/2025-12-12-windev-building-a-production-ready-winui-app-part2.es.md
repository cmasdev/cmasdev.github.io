---
layout: post
title: "Construyendo una aplicación WinUI 3 + Azure + AI end-to-end en escenarios reales"
author: Christian Amado
date: 2025-12-12 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En el [artículo anterior](/posts/2025-12-05-windev-building-a-production-ready-winui-app-part1/) se analizó en profundidad cómo integrar aplicaciones WinUI 3 con Azure desde una perspectiva arquitectónica real. Sin embargo, comprender los conceptos no es suficiente. El verdadero salto de nivel ocurre cuando todos esos elementos se integran en una solución completa funcionando de extremo a extremo.

En este artículo se construye un escenario real: una aplicación WinUI 3 conectada a Azure con autenticación, backend y capacidades de inteligencia artificial. El objetivo no es mostrar fragmentos aislados, sino demostrar cómo se integran todas las piezas en un sistema coherente.
<!--more-->

Este tipo de arquitectura es la que realmente se utiliza en entornos empresariales modernos y representa el nivel de madurez que diferencia a un desarrollador avanzado de un arquitecto.

## El escenario

Se construirá una aplicación con las siguientes características:

- Cliente WinUI 3
- Autenticación con Microsoft Entra ID
- Backend en Azure (API)
- Consumo de servicio Azure AI
- Logging y resiliencia básica

Caso de uso:

> Una aplicación que permite al usuario ingresar texto y recibir un análisis inteligente desde Azure AI.

## Arquitectura completa

![](/img/posts/2025/12/12/1.png)

Cada capa tiene una responsabilidad clara.

## Paso 1: Cliente WinUI (UI + ViewModel)

Vista:

```xml
<StackPanel Padding="20">
    <TextBox Text="{x:Bind ViewModel.InputText, Mode=TwoWay}" />
    <Button Content="Analizar"
            Command="{x:Bind ViewModel.AnalyzeCommand}" />
    <TextBlock Text="{x:Bind ViewModel.Result}" />
</StackPanel>
```

ViewModel:

```csharp
public class MainViewModel
{
    private readonly IApiClient _api;

    public string InputText { get; set; }
    public string Result { get; set; }

    public ICommand AnalyzeCommand { get; }

    public MainViewModel(IApiClient api)
    {
        _api = api;
        AnalyzeCommand = new RelayCommand(async () => await Analyze());
    }

    private async Task Analyze()
    {
        Result = await _api.AnalyzeAsync(InputText);
    }
}
```

Aquí ya se aplican principios del artículo anterior:
- separación de capas
- uso de servicios
- desacoplamiento

## Paso 2: Cliente HTTP estructurado

```csharp
public interface IApiClient
{
    Task<string> AnalyzeAsync(string input);
}

public class ApiClient : IApiClient
{
    private readonly HttpClient _http;

    public ApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<string> AnalyzeAsync(string input)
    {
        var response = await _http.PostAsJsonAsync("/analyze", new { text = input });

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync();
    }
}
```

## Paso 3: Backend en Azure

```csharp
[Authorize]
[ApiController]
[Route("[controller]")]
public class AnalyzeController : ControllerBase
{
    private readonly IAIService _ai;

    public AnalyzeController(IAIService ai)
    {
        _ai = ai;
    }

    [HttpPost]
    public async Task<IActionResult> Analyze([FromBody] InputModel model)
    {
        var result = await _ai.AnalyzeAsync(model.Text);

        return Ok(result);
    }
}
```

Esto introduce:
- seguridad
- centralización
- control de acceso

## Paso 4: Integración con Azure AI

```csharp
public class AIService : IAIService
{
    public async Task<string> AnalyzeAsync(string text)
    {
        // Simulación de Azure OpenAI
        await Task.Delay(500);

        return $"Análisis inteligente de: {text}";
    }
}
```

En producción:

```csharp
var response = await openAiClient.GetChatCompletionsAsync(...);
```

## Paso 5: Autenticación (resumen clave)

Desde cliente:

```csharp
var result = await app.AcquireTokenInteractive(scopes).ExecuteAsync();

httpClient.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", result.AccessToken);
```

Esto conecta directamente con el artículo anterior.

## Paso 6: Resiliencia aplicada

```csharp
public async Task<string> AnalyzeSafe(string input)
{
    try
    {
        return await ExecuteWithRetry(() => _api.AnalyzeAsync(input));
    }
    catch
    {
        return "Error al procesar la solicitud";
    }
}
```

## Paso 7: Observabilidad

```csharp
_logger.LogInformation("Request enviado a Azure");
_logger.LogError(ex, "Error en análisis");
```

## Paso 8: Flujo completo

1. Usuario escribe texto
2. UI dispara comando
3. ViewModel llama servicio
4. Cliente HTTP llama API
5. API llama Azure AI
6. Resultado vuelve al cliente
7. UI se actualiza

Esto es lo importante: el flujo completo.

## Problemas reales resueltos

Esta arquitectura resuelve:

- Seguridad (tokens)
- Escalabilidad (backend)
- Resiliencia (retry)
- Observabilidad (logs)
- Experiencia de usuario (UI reactiva)

## Errores evitados

Gracias al diseño:

- No hay secretos en cliente
- No hay llamadas directas a Azure
- No hay acoplamiento UI-backend
- No hay bloqueo de UI

## Estrategia profesional

Este tipo de aplicación demuestra:

- dominio de WinUI
- dominio de Azure
- dominio de arquitectura moderna
- capacidad de integrar AI

Esto es exactamente lo que se espera en:

- roles senior
- arquitectura cloud
- Microsoft MVP

## Buenas prácticas

- separar cliente y backend
- usar autenticación siempre
- diseñar para fallos
- medir comportamiento
- abstraer servicios

## Conclusión

Construir una aplicación WinUI 3 conectada a Azure correctamente no consiste en escribir código aislado, sino en integrar múltiples componentes de forma coherente.

El artículo anterior estableció las bases arquitectónicas. Este artículo demuestra cómo esas decisiones se convierten en un sistema real funcionando de extremo a extremo.

Este es el punto donde un desarrollador deja de construir aplicaciones y comienza a construir soluciones.