---
layout: post
title: "BC: Gestión de datos financieros confidenciales en extensiones"
author: Christian Amado
date: 2025-11-12 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La gestión de datos financieros sensibles en Microsoft Dynamics 365 Business Central SaaS representa uno de los aspectos más críticos dentro de cualquier implementación empresarial. A diferencia de otros tipos de datos, la información financiera tiene implicaciones directas en cumplimiento normativo, auditoría, integridad contable, riesgo operativo y reputación empresarial.

Dentro de Business Central, los datos financieros sensibles incluyen G/L Entries, Customer Ledger Entries, Vendor Ledger Entries, Value Entries, información de pagos, condiciones de crédito y datos fiscales.

<!--more-->
Estos datos no solo deben ser correctos, sino también protegidos contra accesos indebidos, modificaciones no autorizadas y exposición innecesaria.

## El problema
Muchos sistemas fallan en este punto porque tratan los datos financieros como cualquier otro tipo de información.

Errores comunes incluyen exposición de datos en APIs, acceso excesivo mediante permisos amplios, modificación directa de ledger entries y falta de auditoría.

Un caso típico es permitir modificar registros financieros directamente sin control ni trazabilidad, lo que genera inconsistencias contables y riesgo legal.

## Principios fundamentales
### Inmutabilidad
Los registros financieros no deben modificarse directamente. Los cambios deben realizarse mediante documentos correctivos o reversos.

### Trazabilidad
Cada acceso o modificación debe poder rastrearse con usuario, fecha y motivo.

### Control de acceso estricto
No todos los usuarios deben acceder a balances o información fiscal.

### Separación de funciones
Separar creación, aprobación y posting.

## Estrategias en AL
### Evitar modificaciones directas
```al
GLEntry."Amount" := 1000;
GLEntry.Modify();
```

Este patrón es incorrecto.

### Validación de permisos
```al
if not GLEntry.ReadPermission() then
    Error('No tiene permisos');
```

### Auditoría
```al
procedure LogAccess(UserId: Code[50]; EntryNo: Integer)
var
    Log: Record "Custom Audit Log";
begin
    Log.Init();
    Log."User ID" := UserId;
    Log."Entry No." := EntryNo;
    Log."Date" := CurrentDateTime;
    Log.Insert();
end;
```

## APIs seguras
```al
if not HasFinancialAccess() then
    Error('Access denied');
```

## Anti-patterns
- modificar ledger entries  
- permisos excesivos  
- falta de auditoría  

## Conclusiones
La gestión de datos financieros requiere disciplina, control y diseño adecuado para garantizar integridad y seguridad en entornos empresariales.