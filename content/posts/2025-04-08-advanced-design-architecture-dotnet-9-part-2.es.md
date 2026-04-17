---
layout: post
title: "Arquitectura .NET Parte 2: Diseño Avanzado de Backend"
author: Christian Amado
date: 2025-04-08 00:00:00 -0300
category: [Desarrollo de software]
tags: [.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

El primer paso para una arquitectura sólida en .NET es separar responsabilidades y diseñar el dominio como núcleo. Sin embargo, un backend empresarial no se vuelve "avanzado" hasta que incorpora capacidades de **seguridad, consistencia y contratos estables**. Este segundo artículo profundiza en tres pilares: validación y contratos,
manejo de errores estandarizado y diseño de servicios con límites claros.

El objetivo no es agregar complejidad, sino **controlarla**. En .NET 9, el framework ofrece una base poderosa, pero el diseño final depende de decisiones arquitectónicas explícitas.

## 1. Contratos estables con DTOs y mapeo explícito
Una de las causas más comunes de deuda técnica es permitir que las entidades de dominio viajen directamente hacia el exterior. Un backend avanzado define contratos explícitos (DTOs) que se mantienen estables aunque el dominio evolucione.

Ejemplo de DTO para creación de órdenes:
``` csharp
public sealed record CreateOrderRequest(decimal Total, string Currency);
public sealed record CreateOrderResponse(Guid Id);
```

El dominio mantiene invariantes propias:

``` csharp
public sealed class Order
{
    public Guid Id { get; }
    public decimal Total { get; }
    public string Currency { get; }

    public Order(decimal total, string currency)
    {
        if (total <= 0) throw new ArgumentException("Total inválido");
        if (string.IsNullOrWhiteSpace(currency)) throw new ArgumentException("Moneda requerida");

        Id = Guid.NewGuid();
        Total = total;
        Currency = currency.ToUpperInvariant();
    }
}
```

Y el mapeo se hace explícito en la capa de aplicación, no en el controller:
``` csharp
public sealed class OrderService : IOrderService
{
    private readonly IOrderRepository _repo;

    public OrderService(IOrderRepository repo) => _repo = repo;

    public async Task<CreateOrderResponse> CreateAsync(CreateOrderRequest request)
    {
        var order = new Order(request.Total, request.Currency);
        await _repo.AddAsync(order);
        return new CreateOrderResponse(order.Id);
    }
}
```

Esto evita que cambios internos rompan integraciones externas.

## 2. Validación consistente (antes del dominio)
La validación avanzada se aplica en dos niveles:
-   Validación de request (contrato y reglas superficiales)
-   Invariantes del dominio (reglas no negociables)

Ejemplo con validación manual y resultados claros:
``` csharp
public static class CreateOrderValidator
{
    public static (bool IsValid, string? Error) Validate(CreateOrderRequest request)
    {
        if (request.Total <= 0) return (false, "El total debe ser mayor a cero");
        if (string.IsNullOrWhiteSpace(request.Currency)) return (false, "La moneda es obligatoria");
        if (request.Currency.Length is < 3 or > 5) return (false, "Moneda inválida");
        return (true, null);
    }
}
```

Esto permite responder de forma predecible sin llegar a tocar el dominio
cuando el request es inválido.

## 3. Manejo de errores con ProblemDetails
En un backend empresarial, el manejo de errores debe ser uniforme. .NET ofrece `ProblemDetails` como estándar. El objetivo es que el cliente reciba siempre la misma estructura.

Middleware para errores:
``` csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandler = context.Features.Get<IExceptionHandlerPathFeature>();
        var ex = exceptionHandler?.Error;

        var problem = Results.Problem(
            title: "Error interno",
            detail: ex?.Message,
            statusCode: StatusCodes.Status500InternalServerError,
            type: "https://httpstatuses.com/500"
        );

        await problem.ExecuteAsync(context);
    });
});
```

Este enfoque elimina respuestas inconsistentes y facilita observabilidad
y debugging.

## 4. Diseño de endpoints con límites claros
Un error frecuente al migrar desde .NET Framework es dejar que los controladores se conviertan en "mini servicios". En diseño avanzado, el controller es un adaptador mínimo.

Ejemplo:
``` csharp
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        var (isValid, error) = CreateOrderValidator.Validate(request);
        if (!isValid)
            return Problem(title: "Request inválido", detail: error, statusCode: 400);

        var response = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id) => Ok(new { id });
}
```

El controller: - Valida contrato - Llama caso de uso - Devuelve respuesta

No contiene reglas de negocio.

## 5. Principio clave: límites y consistencia
Una arquitectura madura siempre respeta límites:

-   Dominio: reglas
-   Aplicación: orquestación
-   Infraestructura: IO
-   API: transporte

La consistencia en contratos y errores reduce costos y aumenta la capacidad de evolución del sistema.

## Conclusión
Este segundo paso consolida la arquitectura: contratos explícitos, validación consistente y errores estandarizados. En .NET moderno, un backend avanzado se define por cómo maneja la complejidad, no por la cantidad de librerías.

En el próximo artículo se abordará seguridad multiempresa con JWT, políticas dinámicas y claims enriquecidos, sentando bases para soluciones enterprise y arquitecturas integradas con Business Central.