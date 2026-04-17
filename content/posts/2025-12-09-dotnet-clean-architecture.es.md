---
layout: post
title: "Buenas prácticas de arquitectura: separación de capas, SOLID y Clean Architecture en proyectos Web"
author: Christian Amado
date: 2025-12-09 00:00:00 -0300
category: [Desarrollo de software]
tags: [.NET,Architecture]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

La arquitectura adecuada es el cimiento sobre el que se construyen aplicaciones web escalables y mantenibles. Un error temprano en el diseño puede convertirse en deuda técnica difícil de corregir meses después. Con la llegada de **.NET 10** y **Visual Studio 2026**, la plataforma ofrece nuevas capacidades de rendimiento, AOT más estable, mejoras en Minimal APIs y tooling avanzado para diagnósticos. Sin embargo, ninguna herramienta reemplaza los principios arquitectónicos correctos.

Este artículo explica cómo aplicar **separación de capas**, principios **SOLID** y **Clean Architecture** en proyectos web modernos utilizando .NET 10, con ejemplos de código paso a paso y explicaciones detalladas orientadas a ingeniería de software profesional.

<!--more-->
## Objetivo del artículo
El objetivo es que el lector pueda:
- Diseñar aplicaciones web limpias, seguras y fáciles de evolucionar.
- Aplicar SOLID en módulos web, APIs, casos de uso y servicios.
- Implementar Clean Architecture sin sobreingeniería.
- Comprender qué va en cada capa y por qué.
- Aprovechar mejoras de .NET 10 y Visual Studio 2026 para arquitectura moderna.

## 1. Separación de capas: base de una arquitectura web sólida

Separar capas no significa distribuir carpetas sin criterio. Significa **aislar responsabilidades** y minimizar dependencias accidentales. Clean Architecture propone un flujo unidireccional donde las capas internas nunca dependen de las externas.

Estructura recomendada:

```
src/
  Web/
  Application/
  Domain/
  Infrastructure/
```

### Domain
Contiene las reglas del negocio: entidades, agregados y objetos de valor. No conoce bases de datos, HTTP ni JSON.

```csharp
namespace Payroll.Domain.Entities;

public class Employee
{
    public Guid Id { get; }
    public string FullName { get; private set; }
    public decimal BaseSalary { get; private set; }

    public Employee(Guid id, string fullName, decimal baseSalary)
    {
        Id = id;
        FullName = fullName;
        BaseSalary = baseSalary;
    }

    public void ChangeSalary(decimal newSalary)
    {
        if (newSalary <= 0)
            throw new DomainException("Salary must be greater than zero.");

        BaseSalary = newSalary;
    }
}

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}
```

### Application
Contiene los **casos de uso** del negocio.

```csharp
public record ChangeSalaryCommand(Guid EmployeeId, decimal NewSalary);

public class ChangeSalaryHandler
{
    private readonly IEmployeeRepository _repository;

    public ChangeSalaryHandler(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(ChangeSalaryCommand command)
    {
        var employee = await _repository.GetAsync(command.EmployeeId);
        if (employee is null)
            throw new ApplicationException("Employee not found");

        employee.ChangeSalary(command.NewSalary);

        await _repository.UpdateAsync(employee);
    }
}
```

Interfaces:

```csharp
public interface IEmployeeRepository
{
    Task<Employee?> GetAsync(Guid id);
    Task UpdateAsync(Employee employee);
}
```

### Infrastructure
Implementa detalles técnicos: SQL, Dapper, EF Core, Redis, colas, etc.

```csharp
public class EmployeeRepository : IEmployeeRepository
{
    private readonly NpgsqlConnection _connection;

    public EmployeeRepository(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    public async Task<Employee?> GetAsync(Guid id)
    {
        const string sql = "SELECT id, fullname, basesalary FROM employee WHERE id = @id";

        var dto = await _connection.QueryFirstOrDefaultAsync<EmployeeDto>(sql, new { id });

        return dto is null
            ? null
            : new Employee(dto.Id, dto.FullName, dto.BaseSalary);
    }

    public async Task UpdateAsync(Employee employee)
    {
        const string sql =
            "UPDATE employee SET fullname=@FullName, basesalary=@BaseSalary WHERE id=@Id";

        await _connection.ExecuteAsync(sql, employee);
    }
}

internal record EmployeeDto(Guid Id, string FullName, decimal BaseSalary);
```

### Web
La capa expuesta al usuario (API).

```csharp
app.MapGroup("/employees")
    .MapPut("/{id:guid}/salary", async (Guid id, SalaryRequest req, ChangeSalaryHandler handler) =>
    {
        await handler.Handle(new ChangeSalaryCommand(id, req.NewSalary));
        return Results.NoContent();
    });
```

## 2. Aplicación correcta de los principios SOLID

### S — Single Responsibility Principle
Cada clase debe tener una responsabilidad.

```csharp
public class PayrollCalculator
{
    public decimal Calculate(Employee employee, int hours)
        => employee.BaseSalary + (hours * 30000);
}
```

### O — Open/Closed Principle
El software debe poder extenderse sin modificarse.

```csharp
public interface IPayrollStrategy
{
    decimal Calculate(Employee employee, int factor);
}
```

### L — Liskov Substitution Principle
Las clases derivadas deben funcionar como las base sin alterar comportamiento esperado.

### I — Interface Segregation Principle
Evita interfaces demasiado amplias.

```csharp
public interface IUserCreator { Task Create(); }
public interface IUserUpdater { Task Update(); }
```

### D — Dependency Inversion Principle
Las capas superiores dependen de **abstracciones**, no de implementaciones.

```csharp
private readonly IEmployeeRepository repository;
```

## 3. Clean Architecture aplicada a .NET 10 paso a paso

### Proyecto

```
dotnet new webapi -n Web
dotnet new classlib -n Domain
dotnet new classlib -n Application
dotnet new classlib -n Infrastructure
```

### Dependencias

```
Web → Application  
Application → Domain  
Infrastructure → Application + Domain
```

### Registro de dependencias

```csharp
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<ChangeSalaryHandler>();
```

### Endpoint

```csharp
app.MapPut("/employees/{id}/salary", async (
    Guid id,
    SalaryRequest req,
    ChangeSalaryHandler handler) =>
{
    await handler.Handle(new ChangeSalaryCommand(id, req.NewSalary));
    return Results.NoContent();
});
```

### Test sin infraestructura

```csharp
public class FakeEmployeeRepository : IEmployeeRepository
{
    public Employee Employee = new(Guid.NewGuid(), "Test", 5000000);

    public Task<Employee?> GetAsync(Guid _) => Task.FromResult<Employee?>(Employee);
    public Task UpdateAsync(Employee e) { Employee = e; return Task.CompletedTask; }
}

[Fact]
public async Task Should_Change_Salary()
{
    var repo = new FakeEmployeeRepository();
    var handler = new ChangeSalaryHandler(repo);

    await handler.Handle(new ChangeSalaryCommand(repo.Employee.Id, 7000000));

    Assert.Equal(7000000, repo.Employee.BaseSalary);
}
```

## 4. Beneficios de .NET 10 y Visual Studio 2026

- AOT más rápido y predecible.
- Diagnósticos de dependencias entre capas.
- Análisis de arquitectura en tiempo real.
- Refactorización avanzada guiada.
- Herramientas para verificar cumplimiento de SOLID.

## 5. Checklist arquitectónico

- ¿El dominio contiene toda la lógica del negocio?
- ¿Application usa solo abstracciones?
- ¿Cada clase tiene una sola responsabilidad?
- ¿La API es solo una capa de orquestación?
- ¿Es posible testear sin base de datos?
- ¿Los cambios son fáciles de extender sin modificar?

## Conclusión

Clean Architecture no es una moda: es una forma de pensar el software para resistir el paso del tiempo. Combinada con **.NET 10** y las herramientas avanzadas de **Visual Studio 2026**, permite desarrollar APIs y aplicaciones web mantenibles, probadas y escalables.

La separación de capas, SOLID y una correcta aplicación de abstracciones convierten un proyecto en una base sólida lista para crecer sin dolor.