---
layout: post
title: "BC: Diseño de una estrategia de consolidación multiempresa"
author: Christian Amado
date: 2026-03-04 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

El diseño de un sistema de consolidación multiempresa en Microsoft Dynamics 365 Business Central (BC) es uno de los desafíos más complejos dentro del dominio financiero. A diferencia de procesos operativos estándar, la consolidación requiere integrar información contable de múltiples entidades legales, posiblemente con diferentes monedas, planes de cuentas, calendarios fiscales y reglas regulatorias.

En escenarios reales —especialmente en LATAM— es común encontrar:

<!--more-->
- Empresas con distintos catálogos contables
- Operaciones en múltiples monedas
- Eliminaciones intercompany
- Ajustes manuales de consolidación
- Diferentes periodos contables

Este artículo desarrolla un enfoque avanzado, orientado a arquitectura, para diseñar un sistema de consolidación robusto, escalable y auditable en Business Central utilizando AL.

## Problemas clave a resolver
Un sistema de consolidación serio debe abordar:

- Homologación de cuentas contables
- Conversión de moneda
- Eliminación de transacciones intercompany
- Consolidación incremental
- Trazabilidad completa
- Reprocesamiento sin inconsistencias

Errores comunes:

- Consolidación manual en Excel
- Falta de control sobre eliminaciones
- Dependencia de estructuras rígidas
- Imposibilidad de auditar resultados

## Principios de diseño
Un sistema avanzado debe cumplir:

- Idempotencia (puede recalcular sin duplicar datos)
- Separación entre datos fuente y consolidados
- Configuración flexible por empresa
- Persistencia de resultados
- Soporte multi-moneda

Arquitectura recomendada:

- Data Extraction Layer
- Mapping Engine
- Currency Conversion Engine
- Elimination Engine
- Consolidation Engine
- Reporting Layer

## Modelo de datos
### Consolidation Company
```al
table 50400 "Consolidation Company"
{
    fields
    {
        field(1; "Company Name"; Text[50]) { }
        field(2; "Currency Code"; Code[10]) { }
        field(3; "Include"; Boolean) { }
    }
}
```

### Account Mapping
```al
table 50401 "Account Mapping"
{
    fields
    {
        field(1; "Source Account"; Code[20]) { }
        field(2; "Target Account"; Code[20]) { }
    }
}
```

### Consolidation Entry
```al
table 50402 "Consolidation Entry"
{
    fields
    {
        field(1; "Entry No."; Integer) { AutoIncrement = true; }
        field(2; "Company"; Text[50]) { }
        field(3; "Account"; Code[20]) { }
        field(4; "Amount"; Decimal) { }
        field(5; "Date"; Date) { }
    }
}
```

## Extracción multiempresa
```al
GLEntry.ChangeCompany(CompanyName);
```

Procesar datos de múltiples compañías en un solo flujo.

## Mapping contable
```al
if not Mapping.Get(SourceAccount) then
    Error('Mapping missing');
```

## Conversión de moneda
```al
Converted := Amount * ExchangeRate;
```

Persistir tasa utilizada.

## Eliminación intercompany
```al
if IsIntercompany then
    CreateElimination();
```

## Motor de consolidación
```al
codeunit 50410 "Consolidation Engine"
{
    procedure Run()
    begin
        // loop companies
        // process entries
    end;
}
```

## Idempotencia
```al
if Exists then exit;
```

## Auditoría
```al
Session.LogMessage('CONSOLIDATION', 'Processing', Verbosity::Normal, DataClassification::FinancialData);
```

## Testing
```al
[Test]
procedure Should_Consolidate()
begin
end;
```

## Conclusión
La consolidación multiempresa es un problema de arquitectura avanzada que requiere control total sobre datos, reglas y ejecución. Un diseño correcto permite escalar operaciones financieras sin perder control ni trazabilidad.