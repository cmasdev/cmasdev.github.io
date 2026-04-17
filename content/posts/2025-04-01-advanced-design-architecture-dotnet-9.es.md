---
layout: post
title: "Arquitectura .NET Parte 1: Diseño Backend avanzado"
author: Christian Amado
date: 2025-04-01 00:00:00 -0300
category: [Desarrollo de software]
tags: [.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

Diseñar un backend moderno en .NET no consiste en crear un proyecto Web API y comenzar a escribir controladores. La arquitectura avanzada partebde decisiones estructurales: modularidad, separación de responsabilidades, resiliencia, seguridad y observabilidad desde el primer commit.  

En **.NET 9**, el modelo de hosting minimal permite estructurar una solución limpia y explícita. Un backend empresarial debe estar organizado, por ejemplo, en:
-   API (capa de entrada)
-   Application (casos de uso)
-   Domain (reglas de negocio)
-   Infrastructure (persistencia, servicios externos)

## 1. Estructura base del proyecto
Program.cs debe ser intencional, no improvisado:
``` csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Inyección explícita de dependencias
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Configuración fuerte
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("Database"));

var app = builder.Build();

app.UseExceptionHandler("/error");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```
Aquí no hay lógica de negocio. Solo composición.

## 2. Separación de dominio
El dominio no debe depender de ASP.NET Core.
``` csharp
public class Order
{
    public Guid Id { get; private set; }
    public decimal Total { get; private set; }

    public Order(decimal total)
    {
        if (total <= 0)
            throw new ArgumentException("El total debe ser mayor a cero");

        Id = Guid.NewGuid();
        Total = total;
    }
}
```
Las reglas viven aquí, no en el controller.

## 3. Capa de aplicación
El caso de uso coordina dominio e infraestructura:
``` csharp
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;

    public OrderService(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> CreateAsync(decimal total)
    {
        var order = new Order(total);
        await _repository.AddAsync(order);
        return order.Id;
    }
}
```

## 4. Infraestructura desacoplada
``` csharp
public class OrderRepository : IOrderRepository
{
    private readonly IDbConnection _connection;

    public OrderRepository(IConfiguration config)
    {
        _connection = new NpgsqlConnection(
            config.GetConnectionString("Default"));
    }

    public async Task AddAsync(Order order)
    {
        const string sql = 
            "INSERT INTO orders (id, total) VALUES (@Id, @Total)";

        await _connection.ExecuteAsync(sql, order);
    }
}
```

Aquí se usa Dapper para alto rendimiento.

## 5. Principios arquitectónicos clave
Un backend avanzado debe considerar:

-   Diseño orientado a dominio.
-   Independencia del framework.
-   Manejo centralizado de errores.
-   Seguridad desde el inicio.
-   Observabilidad (logs estructurados y métricas).
-   Preparación para escalar horizontalmente.

No se trata de aplicar Clean Architecture como dogma, sino de diseñar pensando en evolución.

## Conclusión
La arquitectura backend avanzada en .NET no se construye agregando paquetes. Se construye tomando decisiones conscientes sobre separación, dependencias y responsabilidades.

El verdadero salto desde .NET Framework hacia .NET moderno no es sintáctico, es mental: el framework ya no es el centro, la arquitectura lo es.