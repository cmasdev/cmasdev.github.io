---
layout: post
title: "BC: Diseño de un motor de comisiones para equipos de ventas"
author: Christian Amado
date: 2026-02-18 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

El diseño de un motor de comisiones para equipos de ventas en Microsoft Dynamics 365 Business Central (BC) es un desafío complejo que va mucho más allá de un simple cálculo porcentual. En escenarios empresariales reales, las comisiones pueden depender de múltiples variables: tipo de cliente, producto, margen, cumplimiento de objetivos, períodos, cobranzas efectivas y reglas específicas por vendedor o equipo.

En implementaciones reales en Paraguay y LATAM, es común encontrar requisitos como:

<!--more-->
- Comisiones basadas en cobranza efectiva (no facturación)
- Diferentes porcentajes según línea de producto
- Penalizaciones por devoluciones
- Escalas progresivas por volumen mensual
- Comisiones compartidas entre vendedores

Este artículo presenta un enfoque avanzado, profundo y estructurado para diseñar un motor de comisiones enterprise-grade en Business Central.

## Problemas reales que el motor debe resolver
Un motor de comisiones serio debe abordar:

- Alta variabilidad de reglas de negocio
- Cambios frecuentes sin redeploy
- Trazabilidad contable y auditoría
- Performance con grandes volúmenes
- Integración con procesos financieros estándar

Errores típicos:

- Lógica hardcodeada en triggers
- Dependencia directa del Sales Header
- Falta de persistencia de cálculos
- Reprocesos manuales

## Principios de arquitectura
Un motor robusto debe cumplir:

- Separación total entre reglas y ejecución
- Motor idempotente (puede recalcular sin duplicar)
- Persistencia de resultados (Commission Entries)
- Soporte para recalculo histórico
- Configuración 100% basada en tablas

Arquitectura recomendada:

- Commission Engine (core)
- Rule Evaluator
- Data Provider
- Calculation Strategy
- Posting Handler

## Modelo de datos avanzado
### Commission Setup (nivel global)
```al
table 50300 "Commission Setup"
{
    fields
    {
        field(1; "Code"; Code[20]) { }
        field(2; "Description"; Text[100]) { }
        field(3; "Apply On"; Option) { OptionMembers = Invoice,Payment; }
        field(4; "Calculation Base"; Option) { OptionMembers = Amount,Margin; }
    }
}
```

### Commission Rule (nivel granular)
```al
table 50301 "Commission Rule"
{
    fields
    {
        field(1; "Setup Code"; Code[20]) { }
        field(2; "Salesperson Code"; Code[20]) { }
        field(3; "Item Category Code"; Code[20]) { }
        field(4; "Minimum Amount"; Decimal) { }
        field(5; "Maximum Amount"; Decimal) { }
        field(6; "Commission %"; Decimal) { }
    }
}
```

### Commission Ledger Entry
```al
table 50302 "Commission Entry"
{
    fields
    {
        field(1; "Entry No."; Integer) { AutoIncrement = true; }
        field(2; "Salesperson Code"; Code[20]) { }
        field(3; "Document No."; Code[20]) { }
        field(4; "Base Amount"; Decimal) { }
        field(5; "Commission Amount"; Decimal) { }
        field(6; "Applied"; Boolean) { }
        field(7; "Posting Date"; Date) { }
    }
}
```

## Motor de cálculo (core)
```al
codeunit 50310 "Commission Engine"
{
    procedure Execute(SalesHeader: Record "Sales Header")
    begin
        ProcessSalesLines(SalesHeader);
    end;

    local procedure ProcessSalesLines(SalesHeader: Record "Sales Header")
    var
        SalesLine: Record "Sales Line";
    begin
        SalesLine.SetRange("Document No.", SalesHeader."No.");

        if SalesLine.FindSet() then
            repeat
                CalculateLineCommission(SalesLine);
            until SalesLine.Next() = 0;
    end;
}
```

## Evaluación avanzada de reglas
```al
local procedure ResolveCommissionRule(SalesLine: Record "Sales Line"): Record "Commission Rule"
var
    Rule: Record "Commission Rule";
begin
    Rule.SetRange("Salesperson Code", SalesLine."Salesperson Code");
    Rule.SetRange("Item Category Code", SalesLine."Item Category Code");
    Rule.SetFilter("Minimum Amount", '<=%1', SalesLine.Amount);
    Rule.SetFilter("Maximum Amount", '>=%1', SalesLine.Amount);

    if Rule.FindFirst() then
        exit(Rule);

    Error('No commission rule found');
end;
```

## Cálculo basado en margen real
```al
local procedure CalculateMargin(SalesLine: Record "Sales Line"): Decimal
begin
    exit(SalesLine.Amount - SalesLine."Cost Amount");
end;
```

```al
Commission := CalculateMargin(SalesLine) * Rule."Commission %" / 100;
```

Esto evita pagar comisión sobre ventas no rentables.

## Comisión basada en cobranza
Este es uno de los escenarios más críticos.

### Estrategia
1. Detectar cierre de Customer Ledger Entry
2. Asociar con factura original
3. Generar comisión recién ahí

```al
if CustLedgerEntry.Open = false then
    GenerateCommissionFromPayment(CustLedgerEntry);
```

Esto asegura que la comisión se pague solo si hay ingreso real.

## Manejo de devoluciones
### Problema
Notas de crédito deben revertir comisión.

### Solución
```al
CommissionAmount := -OriginalCommissionAmount;
```

Y generar entrada compensatoria.

## Escalas por volumen
### Ejemplo

- 0–10.000 → 2%
- 10.001–50.000 → 5%
- 50.000+ → 8%

Implementación:

```al
if TotalSales > 50000 then
    Rate := 8
else if TotalSales > 10000 then
    Rate := 5
else
    Rate := 2;
```

## Performance y optimización
Problema típico:

```al
repeat
    FindRule();
until;
```

Optimización:

- Cachear reglas en memoria
- Usar Dictionary
- Evitar queries repetidas

## Idempotencia
Clave para evitar duplicados:

```al
if CommissionEntryExists(DocumentNo, LineNo) then
    exit;
```

Esto permite reejecutar sin efectos secundarios.

## Auditoría y trazabilidad
```al
Session.LogMessage(
    'COMMISSION_ENGINE',
    StrSubstNo('Doc %1 Commission %2', DocNo, Commission),
    Verbosity::Verbose,
    DataClassification::FinancialData
);
```

Además:

- Guardar base de cálculo
- Guardar regla aplicada
- Guardar timestamp

## Integración con contabilidad
Generar asiento:

```al
GenJnlLine.Validate("Account No.", CommissionExpenseAccount);
GenJnlLine.Validate(Amount, CommissionAmount);
```

Esto permite reflejar comisiones en resultados.

## Testing avanzado
```al
[Test]
procedure Should_Calculate_Margin_Based_Commission()
begin
    // Setup completo
    // Ejecutar motor
    // Validar resultado exacto
end;
```

### Casos a cubrir
- Comisión por factura
- Comisión por cobranza
- Devoluciones
- Escalas
- Multivendedor

## Conclusión
El diseño de un motor de comisiones en Business Central es un problema de arquitectura, no solo de cálculo. Requiere desacoplar reglas, asegurar trazabilidad, manejar múltiples escenarios financieros y garantizar performance.

Un motor bien diseñado se convierte en un activo estratégico del negocio, permitiendo adaptarse rápidamente a cambios comerciales sin comprometer la integridad financiera.