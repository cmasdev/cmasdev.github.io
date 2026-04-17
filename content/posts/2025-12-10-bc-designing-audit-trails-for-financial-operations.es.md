---
layout: post
title: "BC: Diseño de registros de auditoría para operaciones financieras"
author: Christian Amado
date: 2025-12-10 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Diseñar auditoría para operaciones financieras en Microsoft Dynamics 365 Business Central SaaS no consiste únicamente en registrar que algo ocurrió. En un entorno empresarial real, un audit trail debe permitir reconstruir con precisión qué operación se ejecutó, quién la ejecutó, desde qué contexto, sobre qué entidad, con qué información relevante y cuál fue el resultado final. Cuando la operación afecta documentos de venta, compras, pagos, journals, conciliaciones, límites de crédito, aprobaciones o posting, esa trazabilidad deja de ser una mejora deseable y pasa a ser un requisito operativo, de control interno y, muchas veces, regulatorio.

Business Central ya ofrece mecanismos estándar valiosos, como Change Log, Approval Entries, historial documental y múltiples registros derivados del posting. Sin embargo, esas capacidades no siempre responden las preguntas que realmente importan en auditoría financiera. Un controller, un auditor interno o un responsable de cumplimiento no quiere solo saber que un campo cambió. Necesita entender el proceso de negocio completo: quién inició una operación, quién la aprobó, qué sistema externo participó, si el registro fue interactivo o batch, qué reglas se ejecutaron y si hubo intentos fallidos previos.

<!--more-->
La auditoría financiera debe diseñarse, por tanto, como una capa de observabilidad y evidencia de proceso. No debe confundirse con debugging, logging técnico o bitácoras genéricas. Un mensaje textual del tipo “posting completed” puede ser útil para soporte, pero no constituye por sí solo un audit trail robusto. Del mismo modo, activar Change Log sobre muchas tablas puede producir grandes cantidades de información con bajo valor explicativo si no existe un modelo claro de qué se quiere auditar y por qué.

En Business Central SaaS, donde se trabaja con extensiones, eventos, APIs, procesos en background y múltiples empresas, la arquitectura de auditoría debe definirse desde el inicio. Agregarla después casi siempre produce resultados pobres: demasiados registros sin contexto, ausencia de correlación, campos no relevantes o estructuras que terminan siendo imposibles de consultar.

## El problema
El error más frecuente es tratar la auditoría financiera como un subproducto de la lógica funcional. Eso lleva a tres anti-patterns muy comunes.

El primero es confundir Change Log con auditoría de proceso. Change Log sirve para saber que ciertos valores cambiaron, pero normalmente no permite reconstruir el significado financiero completo de una operación. Un asiento contable revertido, una factura liberada y luego registrada, o una propuesta de pago aprobada y ejecutada involucran varias entidades y pasos. Si solo se audita el cambio de campos, se pierde la narrativa operativa.

El segundo anti-pattern es registrar eventos sin correlación. El sistema escribe mensajes dispersos en varias tablas o codeunits, pero luego no existe forma simple de saber qué eventos pertenecieron a la misma operación. Eso dificulta diagnósticos, auditoría y trazabilidad cruzada con integraciones o aprobaciones.

El tercer anti-pattern es la sobrecarga inútil. Algunos equipos intentan registrar absolutamente todo: cada validación, cada lectura, cada modificación menor. El resultado es una masa de datos que no ayuda a investigar nada, consume almacenamiento y degrada el valor del rastro de auditoría. La buena auditoría no registra todo; registra lo necesario con el contexto correcto.

También existen errores de seguridad. Si la tabla de auditoría permite modificaciones, borrado o acceso excesivo, entonces el propio rastro deja de ser confiable. Un audit trail financiero debe tener características de inmutabilidad lógica, o al menos protección fuerte frente a alteraciones operativas.

## Qué debe responder un audit trail financiero
Un audit trail serio para operaciones financieras debería ser capaz de responder preguntas como estas:

- Qué operación se intentó o ejecutó.
- Sobre qué entidad o documento ocurrió.
- Qué usuario o identidad técnica participó.
- En qué empresa se ejecutó.
- Cuándo ocurrió exactamente.
- Si la operación fue interactiva, batch, integración o sistema.
- Qué estado tenía la entidad antes y después, cuando aplique.
- Si hubo aprobación, quién la realizó.
- Si hubo error, en qué etapa ocurrió.
- Qué correlation id permite reconstruir la secuencia completa.

Si el modelo no responde esas preguntas, probablemente no está diseñado como auditoría financiera real, sino como logging operativo.

## Diseño de la solución
### 1. Auditar procesos críticos, no solo tablas
La unidad correcta de auditoría no es únicamente la tabla, sino el proceso de negocio. En una solución financiera madura, conviene auditar explícitamente operaciones como:

- liberación de documentos
- aprobación o rechazo
- posting
- reversos
- cambios en límites de crédito
- cambios en configuración financiera sensible
- generación de pagos o propuestas
- sincronización de operaciones financieras hacia sistemas externos

Este enfoque produce eventos con valor explicativo.

### 2. Estructura de auditoría separada
La auditoría no debe incrustarse en ledger entries ni distorsionar tablas estándar. Lo correcto es una estructura separada y especializada.

```al
table 50600 "Financial Audit Trail"
{
    DataClassification = SystemMetadata;

    fields
    {
        field(1; "Entry No."; BigInteger)
        {
            AutoIncrement = true;
        }
        field(2; "Occurred At"; DateTime)
        {
        }
        field(3; "User ID"; Code[50])
        {
        }
        field(4; "Company Name"; Text[30])
        {
        }
        field(5; "Operation Type"; Code[50])
        {
        }
        field(6; "Entity Type"; Code[50])
        {
        }
        field(7; "Entity No."; Code[50])
        {
        }
        field(8; "Correlation ID"; Guid)
        {
        }
        field(9; "Source Type"; Option)
        {
            OptionMembers = Interactive,Batch,Integration,System;
        }
        field(10; "Status"; Option)
        {
            OptionMembers = Started,Succeeded,Failed,Rejected;
        }
        field(11; "Before State"; Blob)
        {
        }
        field(12; "After State"; Blob)
        {
        }
        field(13; "Message"; Text[250])
        {
        }
        field(14; "Approver User ID"; Code[50])
        {
        }
        field(15; "Session ID"; Integer)
        {
        }
    }

    keys
    {
        key(PK; "Entry No.")
        {
            Clustered = true;
        }

        key(K1; "Occurred At", "Operation Type")
        {
        }

        key(K2; "Entity Type", "Entity No.")
        {
        }

        key(K3; "Correlation ID")
        {
        }
    }
}
```

Esta tabla está pensada para eventos de proceso, no para reemplazar contabilidad estándar.

### 3. Correlation ID como base del diseño
Toda operación crítica debería poder identificarse de forma transversal. Para eso sirve el correlation id.

```al
codeunit 50601 "Financial Audit Mgt."
{
    procedure StartFinancialOperation(OperationType: Code[50]; EntityType: Code[50]; EntityNo: Code[50]; SourceType: Option Interactive,Batch,Integration,System): Guid
    var
        AuditTrail: Record "Financial Audit Trail";
        CorrelationId: Guid;
    begin
        CorrelationId := CreateGuid();

        AuditTrail.Init();
        AuditTrail."Occurred At" := CurrentDateTime();
        AuditTrail."User ID" := UserId();
        AuditTrail."Company Name" := CompanyName();
        AuditTrail."Operation Type" := OperationType;
        AuditTrail."Entity Type" := EntityType;
        AuditTrail."Entity No." := EntityNo;
        AuditTrail."Correlation ID" := CorrelationId;
        AuditTrail."Source Type" := SourceType;
        AuditTrail.Status := AuditTrail.Status::Started;
        AuditTrail."Session ID" := SessionId();
        AuditTrail.Insert();

        exit(CorrelationId);
    end;

    procedure CompleteFinancialOperation(CorrelationId: Guid; ResultMessage: Text)
    var
        AuditTrail: Record "Financial Audit Trail";
    begin
        AuditTrail.SetRange("Correlation ID", CorrelationId);
        AuditTrail.SetRange(Status, AuditTrail.Status::Started);

        if AuditTrail.FindLast() then begin
            AuditTrail.Status := AuditTrail.Status::Succeeded;
            AuditTrail."Message" := CopyStr(ResultMessage, 1, MaxStrLen(AuditTrail."Message"));
            AuditTrail.Modify();
        end;
    end;

    procedure FailFinancialOperation(CorrelationId: Guid; ErrorMessage: Text)
    var
        AuditTrail: Record "Financial Audit Trail";
    begin
        AuditTrail.SetRange("Correlation ID", CorrelationId);
        AuditTrail.SetRange(Status, AuditTrail.Status::Started);

        if AuditTrail.FindLast() then begin
            AuditTrail.Status := AuditTrail.Status::Failed;
            AuditTrail."Message" := CopyStr(ErrorMessage, 1, MaxStrLen(AuditTrail."Message"));
            AuditTrail.Modify();
        end;
    end;
}
```

Este patrón permite abrir, cerrar o fallar una operación manteniendo continuidad semántica.

### 4. Snapshot controlado del estado relevante
No todas las operaciones requieren before/after state. Pero cuando el cambio es sensible, conviene capturar un snapshot resumido.

```al
procedure WriteSalesHeaderSnapshot(var SalesHeader: Record "Sales Header"; var BlobField: Blob)
var
    OutS: OutStream;
    SnapshotText: Text;
begin
    BlobField.CreateOutStream(OutS);

    SnapshotText :=
        StrSubstNo(
            'DocumentType=%1;No=%2;SellToCustomer=%3;AmountIncludingVAT=%4;Status=%5',
            Format(SalesHeader."Document Type"),
            SalesHeader."No.",
            SalesHeader."Sell-to Customer No.",
            Format(SalesHeader."Amount Including VAT"),
            Format(SalesHeader.Status));

    OutS.WriteText(SnapshotText);
end;
```

Esto es preferible a serializar registros completos sin criterio. La auditoría debe capturar lo que realmente ayuda a explicar el cambio.

### 5. Suscripción a eventos de alta criticidad
La auditoría financiera suele apoyarse bien en eventos del sistema estándar. Un caso útil es el posting de ventas.

```al
codeunit 50602 "Posted Sales Audit Subscriber"
{
    [EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 'OnAfterPostSalesDoc', '', false, false)]
    local procedure OnAfterPostSalesDoc(
        var SalesHeader: Record "Sales Header";
        GenJnlPostLine: Codeunit "Gen. Jnl.-Post Line";
        SalesShptHdrNo: Code[20];
        RetRcpHdrNo: Code[20];
        SalesInvHdrNo: Code[20];
        SalesCrMemoHdrNo: Code[20];
        CommitIsSuppressed: Boolean;
        InvtPickPutaway: Boolean;
        WhseShip: Boolean;
        WhseReceive: Boolean;
        var CustLedgerEntry: Record "Cust. Ledger Entry";
        var WhseShptHeader: Record "Warehouse Shipment Header";
        var WhseRcptHeader: Record "Warehouse Receipt Header";
        PreviewMode: Boolean)
    var
        AuditMgt: Codeunit "Financial Audit Mgt.";
        CorrelationId: Guid;
    begin
        CorrelationId := AuditMgt.StartFinancialOperation(
            'SALES_POSTED',
            'SalesHeader',
            SalesHeader."No.",
            0);

        AuditMgt.CompleteFinancialOperation(
            CorrelationId,
            StrSubstNo('Sales posting completed. Invoice No.: %1, Credit Memo No.: %2', SalesInvHdrNo, SalesCrMemoHdrNo));
    end;
}
```

Este ejemplo no pretende auditar todos los detalles del posting interno, sino registrar el evento financiero de negocio con su resultado.

### 6. Auditoría de decisiones de aprobación
Las aprobaciones son parte central del control financiero y deben quedar registradas como eventos propios.

```al
procedure RegisterApprovalDecision(DocumentNo: Code[20]; ApproverUserId: Code[50]; Approved: Boolean)
var
    AuditTrail: Record "Financial Audit Trail";
begin
    AuditTrail.Init();
    AuditTrail."Occurred At" := CurrentDateTime();
    AuditTrail."User ID" := UserId();
    AuditTrail."Company Name" := CompanyName();
    AuditTrail."Operation Type" := 'APPROVAL_DECISION';
    AuditTrail."Entity Type" := 'Document';
    AuditTrail."Entity No." := DocumentNo;
    AuditTrail."Approver User ID" := ApproverUserId;

    if Approved then
        AuditTrail.Status := AuditTrail.Status::Succeeded
    else
        AuditTrail.Status := AuditTrail.Status::Rejected;

    AuditTrail."Message" := 'Approval decision registered';
    AuditTrail.Insert();
end;
```

Este tipo de registro facilita auditoría de segregación de funciones y revisión de decisiones.

### 7. Auditoría de cambios en configuración financiera sensible
No toda auditoría financiera gira en torno a documentos. También es crítico saber cuándo cambian parámetros de alto impacto: límites de crédito, posting groups, cuentas bancarias, configuración de aprobación, etc.

```al
procedure AuditCreditLimitChange(CustomerNo: Code[20]; OldLimit: Decimal; NewLimit: Decimal)
var
    AuditTrail: Record "Financial Audit Trail";
begin
    AuditTrail.Init();
    AuditTrail."Occurred At" := CurrentDateTime();
    AuditTrail."User ID" := UserId();
    AuditTrail."Company Name" := CompanyName();
    AuditTrail."Operation Type" := 'CREDIT_LIMIT_CHANGED';
    AuditTrail."Entity Type" := 'Customer';
    AuditTrail."Entity No." := CustomerNo;
    AuditTrail.Status := AuditTrail.Status::Succeeded;
    AuditTrail."Message" := CopyStr(
        StrSubstNo('Credit limit changed from %1 to %2', Format(OldLimit), Format(NewLimit)),
        1,
        MaxStrLen(AuditTrail."Message"));
    AuditTrail.Insert();
end;
```

### 8. Auditoría de integraciones financieras
Si una operación financiera se refleja hacia un sistema externo, conviene dejar evidencia de esa interacción.

```al
procedure LogFinancialIntegration(DocumentNo: Code[20]; SourceSystem: Code[20]; CorrelationId: Guid; ResultText: Text)
var
    AuditTrail: Record "Financial Audit Trail";
begin
    AuditTrail.Init();
    AuditTrail."Occurred At" := CurrentDateTime();
    AuditTrail."User ID" := UserId();
    AuditTrail."Company Name" := CompanyName();
    AuditTrail."Operation Type" := 'FIN_INTEGRATION';
    AuditTrail."Entity Type" := 'Document';
    AuditTrail."Entity No." := DocumentNo;
    AuditTrail."Correlation ID" := CorrelationId;
    AuditTrail."Source Type" := AuditTrail."Source Type"::Integration;
    AuditTrail.Status := AuditTrail.Status::Succeeded;
    AuditTrail."Message" := CopyStr(StrSubstNo('Source=%1; Result=%2', SourceSystem, ResultText), 1, MaxStrLen(AuditTrail."Message"));
    AuditTrail.Insert();
end;
```

Esto conecta el plano financiero interno con el ecosistema de integración.

## Protección del propio audit trail
Un audit trail financiero no sirve si sus registros pueden alterarse con facilidad.

### Permisos restrictivos
```al
permissionset 50610 "FINANCIAL AUDIT READ"
{
    Assignable = true;
    Permissions =
        tabledata "Financial Audit Trail" = R,
        page "Financial Audit Trail List" = X;
}
```

### Página de consulta en solo lectura
```al
page 50611 "Financial Audit Trail List"
{
    PageType = List;
    SourceTable = "Financial Audit Trail";
    InsertAllowed = false;
    DeleteAllowed = false;
    ModifyAllowed = false;
    ApplicationArea = All;

    layout
    {
        area(Content)
        {
            repeater(Group)
            {
                field("Occurred At"; Rec."Occurred At") { ApplicationArea = All; }
                field("User ID"; Rec."User ID") { ApplicationArea = All; }
                field("Operation Type"; Rec."Operation Type") { ApplicationArea = All; }
                field("Entity Type"; Rec."Entity Type") { ApplicationArea = All; }
                field("Entity No."; Rec."Entity No.") { ApplicationArea = All; }
                field(Status; Rec.Status) { ApplicationArea = All; }
                field("Message"; Rec."Message") { ApplicationArea = All; }
            }
        }
    }
}
```

### Bloqueo de borrado
```al
tableextension 50612 "Financial Audit Trail Guard" extends "Financial Audit Trail"
{
    trigger OnBeforeDelete()
    begin
        Error('Financial audit entries cannot be deleted.');
    end;
}
```

Si no quieres usar tableextension sobre tu propia tabla, puedes mover esta validación al trigger de la tabla base. Lo importante es la intención: la auditoría debe ser resistente a manipulación operativa.

## Anti-patterns críticos
Conviene evitar explícitamente estos enfoques:

- usar Change Log como sustituto total de auditoría financiera de proceso;
- registrar solo cambios técnicos y no eventos de negocio;
- no usar correlation id;
- auditar solo éxitos y no registrar errores o rechazos;
- guardar snapshots completos de todo sin criterio;
- permitir edición o borrado de la tabla de auditoría;
- registrar mensajes genéricos sin entidad, usuario ni contexto;
- mezclar auditoría con ledger entries o estructuras contables estándar.

## Buenas prácticas
- Auditar procesos críticos, no solo tablas.
- Modelar operación, entidad, usuario, empresa, resultado y correlación.
- Capturar snapshots solo cuando agreguen valor real.
- Registrar aprobaciones y rechazos como eventos propios.
- Diferenciar operaciones interactivas, batch e integración.
- Proteger la tabla de auditoría con permisos y UI de solo lectura.
- Mantener un nivel de detalle intencional y sostenible.
- Diseñar auditoría desde la arquitectura, no como parche final.

## Conclusiones
Diseñar audit trails para operaciones financieras en Business Central SaaS exige dejar de pensar en términos de simple logging y comenzar a pensar en evidencia de proceso. Un buen audit trail no solo dice que algo cambió. Explica qué operación ocurrió, sobre qué entidad, bajo qué usuario, con qué contexto, con qué resultado y cómo se relaciona con otros eventos del mismo flujo.

Cuando está bien diseñado, el rastro de auditoría mejora control interno, soporte, investigación de incidentes, cumplimiento y confianza operativa. Cuando está mal diseñado, produce ruido, lagunas de información o una falsa sensación de trazabilidad.

En entornos donde Business Central forma parte del núcleo financiero, esta disciplina no es opcional. Es una parte esencial de la arquitectura de control.