---
layout: post
title: "BC: Implementación de escenarios de aplicaciones de pago avanzadas"
author: Christian Amado
date: 2026-02-25 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La aplicación de pagos en Microsoft Dynamics 365 Business Central (BC) es uno de los procesos más críticos dentro del módulo financiero. En escenarios reales, rara vez se trata de una simple aplicación uno a uno entre un pago y una factura. Por el contrario, se deben manejar múltiples facturas, pagos parciales, diferencias por tipo de cambio, descuentos por pronto pago, ajustes manuales y reglas específicas del negocio.

Este artículo profundiza en la implementación avanzada de lógica de aplicación de pagos utilizando AL, abordando diseño de procesos, personalización del motor estándar, manejo de escenarios complejos y estrategias para garantizar consistencia contable.

<!--more-->
## Conceptos clave del motor de aplicación
Business Central maneja la aplicación de pagos principalmente a través de:

- Customer Ledger Entry
- Vendor Ledger Entry
- Detailed Cust. Ledg. Entry
- Codeunit "CustEntry-Apply Posted Entries"

El motor estándar permite:

- Aplicación manual
- Aplicación automática
- Aplicación desde journals

Sin embargo, cuando los requerimientos exceden el estándar, se requiere extensión.

## Escenario base: aplicación múltiple de pagos
### Problema
Un cliente realiza un pago único que debe aplicarse a múltiples facturas:

- Diferentes fechas
- Diferentes monedas
- Diferentes condiciones

### Enfoque
1. Obtener entradas abiertas
2. Ordenarlas según criterio (FIFO, vencimiento, etc.)
3. Aplicar pago progresivamente

```al
procedure ApplyPaymentToInvoices(CustomerNo: Code[20]; Amount: Decimal)
var
    CustLedgEntry: Record "Cust. Ledger Entry";
begin
    CustLedgEntry.SetRange("Customer No.", CustomerNo);
    CustLedgEntry.SetRange(Open, true);
    CustLedgEntry.SetCurrentKey("Due Date");

    if CustLedgEntry.FindSet() then
        repeat
            if Amount <= 0 then
                exit;

            ApplyEntry(CustLedgEntry, Amount);
        until CustLedgEntry.Next() = 0;
end;
```

## Aplicación parcial
### Problema
El pago no cubre el total de la factura.

### Solución
Se debe calcular el monto aplicable:

```al
local procedure ApplyEntry(var Entry: Record "Cust. Ledger Entry"; var RemainingAmount: Decimal)
var
    AppliedAmount: Decimal;
begin
    if RemainingAmount >= Entry."Remaining Amount" then
        AppliedAmount := Entry."Remaining Amount"
    else
        AppliedAmount := RemainingAmount;

    PostApplication(Entry, AppliedAmount);
    RemainingAmount -= AppliedAmount;
end;
```

## Integración con el motor estándar
### Uso de Codeunit estándar
```al
Codeunit.Run(Codeunit::"CustEntry-Apply Posted Entries", CustLedgEntry);
```

### Estrategia avanzada
Crear wrapper personalizado para controlar el flujo:

```al
codeunit 50200 "Custom Payment Application"
{
    procedure Apply(var CustLedgEntry: Record "Cust. Ledger Entry"; Amount: Decimal)
    begin
        ApplyCore(CustLedgEntry, Amount);
    end;
}
```

## Manejo de descuentos por pronto pago
```al
if Today <= Entry."Pmt. Discount Date" then
    Discount := Entry."Remaining Amount" * Entry."Pmt. Discount %" / 100;
```

## Manejo de diferencias por tipo de cambio
```al
CurrencyDifference := AppliedAmount - Entry."Remaining Amount";
```

Registrar en cuenta contable correspondiente mediante Gen. Journal.

## Validaciones avanzadas
```al
if Amount > Entry."Remaining Amount" then
    Error('El importe excede el saldo pendiente');
```

## Logging y auditoría
```al
Session.LogMessage(
    'PAYMENT_APPLY',
    StrSubstNo('Aplicando %1 a Entry %2', Amount, Entry."Entry No."),
    Verbosity::Normal,
    DataClassification::FinancialData
);
```

## Manejo de concurrencia
```al
Entry.LockTable();
```

## Testing del proceso

```al
[Test]
procedure Should_Apply_Payment_Correctly()
begin
    // implementación de test
end;
```

## Conclusión
La implementación avanzada de aplicación de pagos en Business Central requiere un entendimiento profundo del modelo contable, control del flujo de aplicación y validaciones estrictas. Es un proceso crítico donde la precisión y trazabilidad son obligatorias.