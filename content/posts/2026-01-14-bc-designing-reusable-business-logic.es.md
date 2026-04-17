---
layout: post
title: "BC: Diseño de módulos de lógica empresarial reutilizables"
author: Christian Amado
date: 2026-01-14 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, uno de los problemas que más rápidamente degrada la calidad de una solución es la duplicación de lógica de negocio. Al principio suele parecer inofensiva: una validación repetida en dos páginas, un cálculo copiado entre dos codeunits, una regla de pricing replicada en un proceso batch y en una integración. Sin embargo, a medida que la solución crece, esa duplicación deja de ser un problema de estilo y se convierte en un problema estructural. Cada nuevo cambio funcional exige tocar múltiples puntos, aumenta la probabilidad de inconsistencia y debilita la capacidad del sistema para evolucionar sin errores.

Diseñar lógica reutilizable no significa “mover código a una codeunit común” de manera indiscriminada. Ese enfoque suele crear otro anti-pattern: la codeunit utilitaria gigante que centraliza funciones sin cohesión, sin contexto de dominio y sin fronteras claras. La reutilización verdadera exige identificar qué partes de la lógica pertenecen al dominio, cuáles son variaciones de comportamiento, cuáles dependen de infraestructura y cuáles deben exponerse como capacidades estables para otros módulos o extensiones.

<!--more-->
En Business Central, este problema tiene características particulares. La lógica de negocio puede quedar dispersa entre triggers de tabla, páginas, reportes, codeunits, subscribers, APIs e integraciones. El desarrollador no solo debe decidir “cómo reutilizar”, sino también “desde dónde debe vivir la regla”, “quién debe invocarla” y “qué nivel de estabilidad contractual debe tener”. Reutilizar una validación no es igual que reutilizar un cálculo financiero, una política de aprobación o un builder de payload. Cada tipo de lógica tiene un perfil distinto de cambio, dependencia y criticidad.

En soluciones empresariales reales, la lógica reutilizable bien diseñada permite mantener coherencia de negocio entre UI, batch, APIs, integraciones y procesos de posting sin acoplar todo el sistema. Cuando esto se hace mal, cada canal termina implementando su propia versión de la verdad. Cuando se hace bien, la solución gana consistencia, testabilidad, extensibilidad y velocidad de mantenimiento.

## El problema
El problema más frecuente no es la ausencia total de reutilización, sino la reutilización equivocada. Muchas extensiones comienzan extrayendo funciones repetidas hacia una codeunit llamada `Common Functions`, `Utilities`, `Helper`, `Management` o alguna variante genérica. En poco tiempo, esa codeunit se transforma en un contenedor de lógica sin identidad arquitectónica. Allí conviven validaciones financieras, utilidades de texto, acceso a setup, reglas de negocio, integración y quizás hasta logging. El resultado no es reutilización sostenible, sino centralización caótica.

Otro problema habitual es la duplicación encubierta. Aunque la lógica “parece” similar, en realidad existen varias implementaciones levemente distintas en distintos puntos del sistema. Un cálculo de comisión usado en una página no coincide exactamente con el cálculo del reporte. La validación de crédito del proceso batch no coincide con la del API. La integración externa usa reglas de redondeo diferentes a las del posting interno. Este tipo de divergencia es particularmente dañino en Business Central porque el usuario suele asumir que el ERP tiene una única verdad de negocio.

También existe un anti-pattern muy frecuente relacionado con la reutilización prematura. A veces se intenta generalizar demasiado pronto una lógica que todavía no está madura. Eso produce abstracciones artificiales, codeunits sobreingenierizadas y contratos demasiado genéricos que luego nadie entiende ni quiere tocar. Reutilizar no significa volver abstracto todo desde el día uno. Significa identificar capacidades que efectivamente deben ser compartidas y modelarlas con una intención clara.

Otro problema importante aparece cuando la lógica reutilizable no queda desacoplada del canal de entrada. Si la regla vive en una página, luego no puede ser usada correctamente desde un Job Queue o desde una API. Si vive pegada a una integración externa, no puede ser reutilizada desde el dominio. La consecuencia es que la misma regla se termina reescribiendo para cada caso de uso.

## Qué significa realmente lógica de negocio reutilizable
La lógica de negocio reutilizable tiene varias propiedades:

- expresa una regla o capacidad del dominio con intención clara;
- puede ser invocada desde distintos puntos del sistema sin cambiar su semántica;
- no depende innecesariamente de UI, transporte, infraestructura o contexto accidental;
- tiene una frontera explícita de entrada y salida;
- puede evolucionar sin romper a todos sus consumidores indiscriminadamente;
- permite construir variantes o extensiones sin duplicar comportamiento.

En Business Central, esto suele traducirse en servicios de dominio, policy engines, evaluadores, builders, validadores, orquestadores o interfaces que encapsulan capacidades concretas del negocio.

## Principios de diseño
### 1. Reutilizar reglas, no solo líneas de código
Copiar cinco líneas repetidas y extraerlas a una función puede ser útil, pero la reutilización valiosa ocurre cuando se encapsula una regla de negocio completa. Por ejemplo:

- “puede liberarse este pedido según exposición de crédito”
- “cómo se calcula la comisión”
- “qué campos forman el payload oficial de sincronización”
- “qué condiciones permiten aprobar un pago”

Ese tipo de capacidad tiene más valor arquitectónico que un conjunto de helpers genéricos.

### 2. Mantener la lógica cerca del dominio, no del canal
Si una regla debe aplicarse desde página, API y batch, entonces no debe vivir en la página ni en la API. Debe vivir en una codeunit orientada al dominio o en una capa de aplicación bien definida.

### 3. Separar cálculo, validación, orquestación e infraestructura
No toda reutilización es del mismo tipo. Conviene distinguir:

- lógica de cálculo;
- lógica de validación;
- orquestación del caso de uso;
- detalles de integración o persistencia auxiliar.

Esa separación permite reutilizar correctamente sin forzar acoplamientos innecesarios.

### 4. Diseñar contratos claros
Una capacidad reutilizable debería exponer una entrada y una salida comprensibles. Si una codeunit solo funciona cuando cierto estado global fue inicializado previamente o depende de muchas variables implícitas, la reutilización se vuelve frágil.

### 5. Evitar la codeunit genérica sin cohesión
Una codeunit reutilizable debe tener nombre y propósito claros. `Credit Limit Evaluator` es mejor que `General Sales Management`. `Payment Approval Policy` es mejor que `Common Functions`.

## Patrones recomendados
### Pattern 1: Domain service
Una lógica reusable muy frecuente es la evaluación de reglas del dominio.

```al
codeunit 51100 "Credit Limit Evaluator"
{
    procedure CanReleaseSalesDocument(var SalesHeader: Record "Sales Header"): Boolean
    var
        Customer: Record Customer;
        CurrentExposure: Decimal;
    begin
        if not Customer.Get(SalesHeader."Sell-to Customer No.") then
            Error('Customer %1 does not exist.', SalesHeader."Sell-to Customer No.");

        Customer.CalcFields("Balance (LCY)");
        CurrentExposure := Customer."Balance (LCY)" + SalesHeader."Amount Including VAT";

        exit(CurrentExposure <= Customer."Credit Limit (LCY)");
    end;

    procedure GetExposure(var SalesHeader: Record "Sales Header"): Decimal
    var
        Customer: Record Customer;
    begin
        if not Customer.Get(SalesHeader."Sell-to Customer No.") then
            Error('Customer %1 does not exist.', SalesHeader."Sell-to Customer No.");

        Customer.CalcFields("Balance (LCY)");
        exit(Customer."Balance (LCY)" + SalesHeader."Amount Including VAT");
    end;
}
```

Esta codeunit puede ser usada desde una página, un proceso batch o una API sin reescribir la regla.

### Pattern 2: Validation service
Separar validaciones reutilizables evita dispersión en triggers y páginas.

```al
codeunit 51101 "Sales Document Validator"
{
    procedure ValidateBeforeRelease(var SalesHeader: Record "Sales Header")
    begin
        if SalesHeader.Status <> SalesHeader.Status::Open then
            Error('Only open sales documents can be released.');

        if SalesHeader."Sell-to Customer No." = '' then
            Error('Sell-to customer is required.');

        if SalesHeader."Document Date" = 0D then
            Error('Document date is required.');
    end;
}
```

La misma validación puede invocarse desde distintos canales sin duplicación.

### Pattern 3: Policy codeunit
Una policy modela una decisión de negocio reusable.

```al
codeunit 51102 "Payment Approval Policy"
{
    procedure RequiresSecondaryApproval(Amount: Decimal; CurrencyCode: Code[10]): Boolean
    begin
        if CurrencyCode = 'USD' then
            exit(Amount >= 10000);

        exit(Amount >= 50000000);
    end;
}
```

Esto evita reglas “hardcodeadas” dispersas por la solución.

### Pattern 4: Payload builder
Cuando una integración usa siempre la misma estructura, el payload debe construirse desde una capacidad única.

```al
codeunit 51103 "Customer Sync Payload Builder"
{
    procedure BuildCustomerPayload(var Customer: Record Customer): Text
    var
        Json: JsonObject;
    begin
        Json.Add('customerNo', Customer."No.");
        Json.Add('name', Customer.Name);
        Json.Add('email', Customer."E-Mail");
        Json.Add('phoneNo', Customer."Phone No.");

        exit(Format(Json));
    end;
}
```

Si mañana cambia el contrato, solo una unidad debe modificarse.

### Pattern 5: Orchestrator using reusable services
La reutilización no elimina la necesidad de una codeunit que coordine el caso de uso.

```al
codeunit 51104 "Sales Release Orchestrator"
{
    procedure ReleaseSalesDocument(var SalesHeader: Record "Sales Header")
    var
        Validator: Codeunit "Sales Document Validator";
        CreditEvaluator: Codeunit "Credit Limit Evaluator";
        AuditMgt: Codeunit "Financial Audit Mgt.";
        CorrelationId: Guid;
    begin
        CorrelationId := AuditMgt.StartFinancialOperation('SALES_RELEASE', 'SalesHeader', SalesHeader."No.", 0);

        Validator.ValidateBeforeRelease(SalesHeader);

        if not CreditEvaluator.CanReleaseSalesDocument(SalesHeader) then begin
            AuditMgt.FailFinancialOperation(CorrelationId, 'Credit validation failed.');
            Error('Sales document %1 exceeds customer credit policy.', SalesHeader."No.");
        end;

        SalesHeader.Status := SalesHeader.Status::Released;
        SalesHeader.Modify(true);

        AuditMgt.CompleteFinancialOperation(CorrelationId, 'Sales document released successfully.');
    end;
}
```

Aquí se reutilizan reglas sin convertir el orquestador en una codeunit monolítica.

## Interfaces para lógica reusable con variantes
Cuando una capacidad puede tener distintas implementaciones, conviene usar interfaces.

```al
interface 51110 "ICommissionCalculator"
{
    procedure CalculateCommission(DocumentNo: Code[20]): Decimal;
}
```

Implementación estándar:

```al
codeunit 51111 "Standard Commission Calculator" implements "ICommissionCalculator"
{
    procedure CalculateCommission(DocumentNo: Code[20]): Decimal
    begin
        exit(100);
    end;
}
```

Implementación premium:

```al
codeunit 51112 "Premium Commission Calculator" implements "ICommissionCalculator"
{
    procedure CalculateCommission(DocumentNo: Code[20]): Decimal
    begin
        exit(250);
    end;
}
```

Este patrón evita copiar lógica por tipo de cliente, canal o contexto.

## Reutilización y bounded contexts
Un error común es intentar reutilizar lógica entre contextos donde en realidad la semántica no es la misma. No toda “lógica parecida” debe ser compartida. Si ventas y finanzas usan reglas similares pero con intención diferente, forzar una sola implementación puede introducir acoplamiento indebido.

La pregunta correcta no es “¿puedo reutilizar esto?”, sino “¿pertenece realmente al mismo concepto del dominio?”. La reutilización correcta respeta bounded contexts. La reutilización incorrecta los rompe.

## Reutilización y testabilidad
La lógica reutilizable bien diseñada tiende a ser más testeable. Si una capacidad está encapsulada en una codeunit con entradas y salidas claras, se puede probar en aislamiento. Si la lógica está repartida entre página, tabla, evento e integración, probarla correctamente se vuelve mucho más difícil.

Ejemplo de servicio con comportamiento claro:

```al
codeunit 51113 "Discount Eligibility Evaluator"
{
    procedure IsEligibleForDiscount(CustomerNo: Code[20]; Amount: Decimal): Boolean
    var
        Customer: Record Customer;
    begin
        if not Customer.Get(CustomerNo) then
            Error('Customer %1 does not exist.', CustomerNo);

        if Customer.Blocked <> Customer.Blocked::" " then
            exit(false);

        exit(Amount >= 1000);
    end;
}
```

Un servicio así puede validarse con facilidad en tests. Esa es una señal de diseño saludable.

## Anti-patterns críticos
Hay varios errores que conviene evitar expresamente:

- reutilización a través de una codeunit genérica sin cohesión;
- duplicación de reglas de negocio entre página, API y batch;
- helpers que mezclan dominio, texto, integración y setup;
- reutilización forzada entre bounded contexts distintos;
- procedimientos reutilizables que dependen de variables globales ocultas;
- codeunits que exponen demasiadas responsabilidades bajo el argumento de “centralizar”.

## Buenas prácticas
- Reutilizar capacidades del dominio, no solo fragmentos de código.
- Mantener la lógica reusable fuera de la UI y del transporte.
- Diferenciar cálculo, validación, política y orquestación.
- Usar nombres semánticos y específicos.
- Introducir interfaces cuando la capacidad pueda variar por implementación.
- No confundir reutilización con centralización indiscriminada.
- Evaluar la cohesión del objeto antes de decidir compartirlo.
- Diseñar para consistencia de negocio entre canales.

## Conclusiones
Diseñar lógica de negocio reutilizable en Business Central SaaS exige mucho más que extraer código repetido. Exige identificar reglas estables, encapsularlas con intención clara, ubicarlas en el nivel correcto de la arquitectura y permitir que distintos canales del sistema consuman la misma verdad del dominio sin duplicación ni acoplamiento innecesario.

Cuando esto se hace bien, la solución gana coherencia, capacidad de evolución y sostenibilidad. Las reglas cambian en un solo lugar, los canales se mantienen alineados y el sistema puede crecer sin multiplicar inconsistencias. Cuando se hace mal, la aparente reutilización degenera en una red opaca de utilidades genéricas que termina siendo más difícil de mantener que la duplicación original.

En soluciones empresariales reales, esta diferencia es decisiva. La lógica reusable bien diseñada no solo ahorra trabajo. Protege la integridad conceptual del negocio dentro del sistema.