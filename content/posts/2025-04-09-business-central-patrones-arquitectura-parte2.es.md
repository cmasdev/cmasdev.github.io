---
layout: post
title: "BC: Integration Series Part 2: Patrones de Arquitectura SaaS Avanzados"
author: Christian Amado
date: 2025-04-09 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En el primer artículo se abordaron principios fundamentales como API-First y Anti-Corruption Layer. En esta segunda parte se profundiza en patrones avanzados necesarios cuando Business Central 26 SaaS forma parte de una arquitectura empresarial distribuida.

En entornos reales, la integración no solo implica intercambio de datos, sino consistencia transaccional, resiliencia y control de errores distribuidos.

## 1. Patrón Outbox para consistencia eventual

En SaaS no se tiene acceso directo a la base de datos de Business Central, por lo tanto no es posible implementar transacciones distribuidas clásicas. Una estrategia recomendable es el patrón Outbox desde el backend .NET.

Flujo típico:
1.  Se procesa una operación en el backend.
2.  Se registra el evento en una tabla Outbox.
3.  Un Worker Service publica el evento hacia Business Central.

Ejemplo simplificado en .NET:
``` csharp
public class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; } = default!;
    public string Payload { get; set; } = default!;
    public DateTime OccurredOn { get; set; }
    public bool Processed { get; set; }
}
```

Worker que publica hacia BC:
``` csharp
public class OutboxProcessor : BackgroundService
{
    private readonly IOutboxRepository _repository;
    private readonly IBusinessCentralClient _bcClient;

    public OutboxProcessor(IOutboxRepository repository, IBusinessCentralClient bcClient)
    {
        _repository = repository;
        _bcClient = bcClient;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var messages = await _repository.GetPendingAsync();

            foreach (var message in messages)
            {
                await _bcClient.PublishAsync(message.Payload);
                message.Processed = true;
                await _repository.UpdateAsync(message);
            }

            await Task.Delay(5000, stoppingToken);
        }
    }
}
```

Esto garantiza resiliencia y evita pérdida de eventos ante fallos.

## 2. Idempotencia en integraciones financieras
En procesos contables, duplicar una operación puede generar
inconsistencias graves. Toda integración con Business Central debe ser
idempotente.

Ejemplo de header idempotente:
``` csharp
var request = new HttpRequestMessage(HttpMethod.Post, url);
request.Headers.Add("Idempotency-Key", Guid.NewGuid().ToString());
request.Content = JsonContent.Create(payload);

var response = await _httpClient.SendAsync(request);
```

El backend debe almacenar la clave y verificar si ya fue procesada antes
de reenviar información a BC.

## 3. Control de concurrencia y reintentos
Las APIs SaaS pueden devolver errores temporales (429 o 503). Es
obligatorio implementar políticas de reintento controlado.

Ejemplo con Polly:
``` csharp
builder.Services.AddHttpClient<IBusinessCentralClient, BusinessCentralClient>()
    .AddPolicyHandler(Policy
        .Handle<HttpRequestException>()
        .OrResult<HttpResponseMessage>(r => 
            r.StatusCode == HttpStatusCode.TooManyRequests ||
            r.StatusCode == HttpStatusCode.ServiceUnavailable)
        .WaitAndRetryAsync(3, retryAttempt =>
            TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))));
```

Esto protege la integración frente a límites de tasa o mantenimiento temporal.

## 4. Multiempresa y aislamiento de contexto
En Business Central SaaS, cada compañía (Company) representa un contexto aislado. El backend debe respetar este aislamiento.

Ejemplo de construcción dinámica de endpoint:

``` csharp
public async Task<HttpResponseMessage> PostAsync(string companyId, object payload)
{
    var url = $"/api/v2.0/companies({companyId})/salesOrders";
    return await _httpClient.PostAsJsonAsync(url, payload);
}
```

Nunca se debe mezclar información entre compañías. El contexto debe viajar explícitamente en cada operación.

## 5. Observabilidad en integraciones

Toda arquitectura SaaS debe ser observable. Cada llamada a Business Central debe registrar:
-   Correlation ID
-   Tiempo de respuesta
-   Código HTTP
-   Payload reducido (sin datos sensibles)

Ejemplo:
``` csharp
_logger.LogInformation(
    "BC Call | Company: {Company} | Status: {Status} | Duration: {Elapsed}ms",
    companyId,
    response.StatusCode,
    stopwatch.ElapsedMilliseconds);
```

Sin observabilidad, no existe arquitectura confiable.

## Conclusión
La integración avanzada con Business Central 26 SaaS exige patrones maduros: Outbox, Idempotencia, Reintentos controlados y aislamiento multiempresa. No se trata únicamente de consumir APIs, sino de diseñar un ecosistema robusto donde el ERP funcione como sistema de registro confiable dentro de una arquitectura moderna en .NET.

En el próximo artículo se abordará la seguridad avanzada con OAuth2, permisos delegados y control granular de acceso en entornos empresariales.