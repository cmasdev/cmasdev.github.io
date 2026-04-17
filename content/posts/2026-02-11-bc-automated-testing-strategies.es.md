---
layout: post
title: "BC: Estrategias de pruebas automatizadas para extensiones"
author: Christian Amado
date: 2026-02-11 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La automatización de pruebas en Microsoft Dynamics 365 Business Central (BC) no es un lujo, sino una necesidad crítica cuando se desarrollan soluciones empresariales complejas, especialmente en entornos SaaS donde los despliegues son frecuentes y los errores pueden impactar directamente en operaciones financieras.

En escenarios reales, una extensión puede involucrar lógica contable, integraciones externas, procesos batch y eventos encadenados. Sin una estrategia sólida de testing automatizado, el riesgo de regresiones y errores en producción aumenta significativamente.

<!--more-->
Este artículo profundiza en estrategias avanzadas de pruebas automatizadas en AL, abordando diseño de test codeunits, aislamiento de dependencias, testing de procesos complejos, simulación de escenarios reales y ejecución continua.

## Arquitectura de testing en Business Central
Business Central proporciona un framework de testing basado en:

- Test Codeunits
- Subtype = Test
- Funciones marcadas con [Test]
- Librerías de aserciones
- Test Runner

Sin embargo, en proyectos reales, esto debe escalar hacia una arquitectura de testing bien definida.

### Estructura recomendada
- Codeunits de pruebas por dominio funcional
- Librerías de setup reutilizables
- Factories de datos de prueba
- Wrappers para dependencias externas

Ejemplo:

```al
codeunit 50100 "Customer Tests"
{
    Subtype = Test;

    [Test]
    procedure Should_Create_Customer_Successfully()
    var
        Customer: Record Customer;
    begin
        Customer := CreateTestCustomer();
        Assert.IsTrue(Customer."No." <> '', 'Customer was not created');
    end;
}
```

## Diseño de datos de prueba
Uno de los errores más comunes es depender de datos existentes.

### Problema
- Tests no determinísticos
- Dependencia del entorno
- Fallos intermitentes

### Solución: Data Builders
```al
local procedure CreateTestCustomer(): Record Customer
var
    Customer: Record Customer;
begin
    Customer.Init();
    Customer."No." := 'TEST-' + Format(CreateGuid());
    Customer.Name := 'Test Customer';
    Customer.Insert();
    exit(Customer);
end;
```

### Principios clave

- Cada test debe generar sus propios datos
- No reutilizar registros productivos
- Usar identificadores únicos

## Aislamiento de dependencias
### Problema
Muchos procesos dependen de:

- Codeunits estándar
- Integraciones externas
- Eventos

### Estrategia: Inyección de dependencias indirecta
Aunque AL no soporta DI nativo, se puede simular:

```al
interface IPaymentService
{
    procedure ProcessPayment(Amount: Decimal);
}
```

Implementación real:

```al
codeunit 50110 "Payment Service" implements IPaymentService
{
    procedure ProcessPayment(Amount: Decimal)
    begin
        // lógica real
    end;
}
```

Mock para testing:

```al
codeunit 50111 "Mock Payment Service" implements IPaymentService
{
    procedure ProcessPayment(Amount: Decimal)
    begin
        // simular comportamiento
    end;
}
```

Esto permite desacoplar lógica y testear en aislamiento.

## Testing de procesos complejos
### Escenario: Registro de factura
Un proceso típico incluye:

- Validaciones
- Cálculo de impuestos
- Asientos contables
- Eventos

### Estrategia
1. Preparar datos
2. Ejecutar proceso
3. Validar efectos

```al
[Test]
procedure Should_Post_Sales_Invoice()
var
    SalesHeader: Record "Sales Header";
begin
    SalesHeader := CreateTestSalesInvoice();
    Codeunit.Run(Codeunit::"Sales-Post", SalesHeader);

    Assert.IsTrue(SalesHeader.Status = SalesHeader.Status::Posted, 'Invoice not posted');
end;
```

### Validaciones avanzadas
- Verificar registros en G/L Entry
- Validar Customer Ledger Entry
- Confirmar impuestos calculados

## Testing de eventos
### Problema
Los eventos introducen lógica distribuida.

### Estrategia
- Testear suscriptores individualmente
- Simular evento manualmente

```al
[Test]
procedure Should_Handle_OnBeforePost()
begin
    OnBeforePostHandler();
    Assert.IsTrue(true, 'Event failed');
end;
```

### Recomendación
Separar lógica del evento en métodos reutilizables.

## Testing de rendimiento
### Problema
Los tests funcionales no detectan problemas de performance.

### Estrategia
Medición de tiempo:

```al
var
    StartTime: DateTime;
    EndTime: DateTime;
begin
    StartTime := CurrentDateTime();
    RunHeavyProcess();
    EndTime := CurrentDateTime();

    Assert.IsTrue(EndTime - StartTime < 1000, 'Performance issue detected');
end;
```

## Testing de Job Queue
### Problema
Procesos asincrónicos difíciles de validar.

### Estrategia
- Ejecutar codeunit directamente
- Validar efectos en base de datos

```al
[Test]
procedure Should_Process_JobQueue()
begin
    Codeunit.Run(Codeunit::"My Job Queue");

    Assert.IsTrue(CheckResults(), 'Job Queue failed');
end;
```

## Testing en pipelines CI/CD
### Integración con Azure DevOps o GitHub Actions
Pipeline típico:

1. Build extensión
2. Deploy a entorno sandbox
3. Ejecutar tests
4. Validar resultados

### Beneficios
- Detección temprana de errores
- Automatización total
- Confianza en despliegues

## Estrategias avanzadas
### Test Suites
Agrupar tests por funcionalidad:

- Finanzas
- Ventas
- Inventario

### Feature toggles
Permiten activar/desactivar lógica durante tests.

### Parallel testing
Ejecutar múltiples tests simultáneamente para reducir tiempo.

## Anti-patterns comunes
- Tests dependientes del orden
- Uso de datos productivos
- Tests demasiado grandes
- Falta de limpieza de datos

## Conclusión
Las estrategias avanzadas de testing automatizado en Business Central permiten construir soluciones robustas, escalables y seguras. No se trata solo de escribir tests, sino de diseñar un sistema completo que garantice calidad en cada despliegue.

Un enfoque maduro incluye aislamiento, generación controlada de datos, validación profunda de procesos y ejecución automatizada en pipelines. Esto es especialmente crítico en escenarios financieros donde la precisión no es negociable.