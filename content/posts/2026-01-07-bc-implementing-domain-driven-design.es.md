---
layout: post
title: "BC: Implementación de conceptos de diseño impulsados ​​por dominio en AL"
author: Christian Amado
date: 2026-01-07 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Aplicar Domain-Driven Design (DDD) en Microsoft Dynamics 365 Business Central SaaS no es un ejercicio académico ni una adaptación literal de patrones de otros ecosistemas como .NET puro o Java. Es un esfuerzo de reinterpretación. AL no es un lenguaje orientado a objetos completo, no tiene todas las abstracciones clásicas de DDD (como aggregates complejos con encapsulación total), y además está profundamente acoplado a un modelo de datos persistente y a procesos estándar del ERP.

Sin embargo, eso no significa que DDD no aplique. De hecho, en implementaciones complejas de Business Central, es precisamente el enfoque DDD el que permite evitar el caos estructural que aparece cuando la lógica de negocio se dispersa entre páginas, tablas, triggers, codeunits e integraciones sin una narrativa clara.

<!--more-->
DDD en Business Central no se trata de replicar patrones de libro. Se trata de:

- modelar correctamente el dominio de negocio
- separar responsabilidades
- evitar lógica dispersa
- definir límites claros (bounded contexts)
- construir soluciones que evolucionen sin romperse

El objetivo es que el código represente el negocio, no solo que funcione.

## El problema
El anti-pattern más común en extensiones de Business Central es el modelo anémico:

- tablas con campos
- triggers con validaciones mínimas
- lógica distribuida en múltiples codeunits
- procesos duplicados
- ausencia de lenguaje ubicuo

Esto genera:

- lógica inconsistente
- dificultad de mantenimiento
- bugs difíciles de rastrear
- fuerte acoplamiento entre módulos

Otro problema es el acoplamiento implícito al modelo estándar. Muchas soluciones “se cuelgan” del comportamiento estándar sin definir su propio dominio, lo que produce dependencias frágiles.

DDD busca resolver esto estructurando el sistema alrededor del dominio real.

## Conceptos clave adaptados a AL
### Entidades
En AL, una entidad suele mapearse a una tabla.

Pero una tabla no es automáticamente una entidad de dominio.

Una entidad de dominio tiene:

- identidad clara
- reglas de negocio
- invariantes

Ejemplo:

```al
table 51000 "Loan Application"
{
    fields
    {
        field(1; "No."; Code[20]) { }
        field(2; "Customer No."; Code[20]) { }
        field(3; Amount; Decimal) { }
        field(4; Status; Enum "Loan Status") { }
    }
}
```

Pero la lógica NO debería vivir solo en la tabla.

### Servicios de dominio
La lógica de negocio debe encapsularse en codeunits.

```al
codeunit 51001 "Loan Domain Service"
{
    procedure ApproveLoan(var Loan: Record "Loan Application")
    begin
        if Loan.Status <> Loan.Status::Pending then
            Error('Only pending loans can be approved.');

        ValidateLoanAmount(Loan);

        Loan.Status := Loan.Status::Approved;
        Loan.Modify(true);
    end;

    local procedure ValidateLoanAmount(var Loan: Record "Loan Application")
    begin
        if Loan.Amount <= 0 then
            Error('Loan amount must be greater than zero.');
    end;
}
```

Esto evita lógica dispersa.

### Aggregates (adaptado)
AL no soporta aggregates como en DDD puro, pero el patrón se puede aproximar.

Ejemplo:

- Header = Aggregate root
- Lines = internal entities

```al
table 51010 "Order Header"
{
    fields
    {
        field(1; "No."; Code[20]) { }
    }
}
```

```al
table 51011 "Order Line"
{
    fields
    {
        field(1; "Document No."; Code[20]) { }
        field(2; "Line No."; Integer) { }
    }
}
```

La lógica debe ejecutarse desde el root.

### Value Objects (simulación)
AL no tiene value objects nativos, pero se pueden simular con:

- records temporales
- structs JSON
- codeunits

Ejemplo:

```al
codeunit 51002 "Money VO"
{
    procedure Create(Amount: Decimal; Currency: Code[10]): Text
    begin
        exit(StrSubstNo('%1|%2', Amount, Currency));
    end;
}
```

No es perfecto, pero sirve para encapsular intención.

### Bounded Contexts
Una extensión compleja debería separarse por contexto.

Ejemplo:

- Sales Context
- Finance Context
- Integration Context

Cada uno con:

- sus tablas
- sus codeunits
- sus reglas

Evitar compartir lógica indiscriminadamente.

## Diseño de la solución
### 1. Separar capas
Incluso en AL, se puede estructurar:

- dominio (rules)
- aplicación (orquestación)
- infraestructura (HTTP, logs, colas)

### 2. Usar lenguaje ubicuo
Nombres deben reflejar negocio:

Mal:
- Utils
- Manager

Bien:
- Loan Approval Service
- Payment Validation Engine

### 3. Evitar lógica en páginas
Las páginas NO son dominio.

### 4. Reducir lógica en triggers

Triggers deben validar invariantes simples, no procesos completos.

## Ejemplo completo
Orquestador:

```al
codeunit 51003 "Loan Application Service"
{
    procedure ProcessLoan(var Loan: Record "Loan Application")
    var
        DomainService: Codeunit "Loan Domain Service";
    begin
        ValidateLoan(Loan);
        DomainService.ApproveLoan(Loan);
    end;

    local procedure ValidateLoan(var Loan: Record "Loan Application")
    begin
        if Loan."Customer No." = '' then
            Error('Customer is required.');
    end;
}
```

## Integración con eventos
DDD + Event Driven es potente.

```al
[IntegrationEvent(false, false)]
procedure OnLoanApproved(LoanNo: Code[20])
begin
end;
```

Esto desacopla procesos.

## Anti-patterns
- lógica distribuida sin estructura
- codeunits monolíticas
- tablas sin intención de dominio
- abuso de triggers
- falta de naming semántico

## Buenas prácticas
- modelar el dominio primero
- encapsular reglas en codeunits
- separar responsabilidades
- usar eventos para desacoplar
- pensar en evolución

## Conclusiones
Implementar DDD en Business Central no es copiar patrones de otros ecosistemas, sino adaptar principios al modelo AL. Cuando se hace correctamente, el código deja de ser una colección de soluciones puntuales y pasa a ser un reflejo estructurado del negocio.

Esto reduce complejidad, mejora mantenibilidad y permite escalar la solución sin degradación progresiva. En entornos empresariales reales, esta diferencia es crítica.