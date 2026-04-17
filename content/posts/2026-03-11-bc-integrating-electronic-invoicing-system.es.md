---
layout: post
title: "BC: Integración de sistemas de facturación electrónica"
author: Christian Amado
date: 2026-03-11 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La integración de un sistema de facturación electrónica en Microsoft Dynamics 365 Business Central (BC) es uno de los proyectos más críticos dentro de una implementación financiera moderna, especialmente en países como Paraguay y en general en LATAM, donde la normativa fiscal exige cumplimiento estricto, trazabilidad completa y comunicación en tiempo real o casi real con entidades gubernamentales.

A diferencia de integraciones simples, la facturación electrónica introduce una combinación compleja de requisitos:

<!--more-->
- Validaciones fiscales obligatorias
- Generación de documentos estructurados (XML/JSON)
- Firmado digital
- Comunicación con servicios externos (SET, APIs fiscales, proveedores autorizados)
- Manejo de estados asincrónicos
- Almacenamiento legal de documentos
- Reintentos, resiliencia y auditoría

Este artículo presenta un enfoque avanzado, profundo y estructurado para diseñar e implementar un sistema de facturación electrónica enterprise-grade dentro de Business Central utilizando AL, con foco en arquitectura, desacoplamiento, resiliencia y cumplimiento normativo.

## Problemas reales que se deben resolver
Un sistema serio de facturación electrónica debe manejar:

- Fallos en comunicación con la autoridad fiscal
- Respuestas asincrónicas (aceptado, rechazado, pendiente)
- Reintentos automáticos
- Control de duplicidad de documentos
- Integración con procesos de ventas y contabilidad
- Versionado de formatos electrónicos
- Cambios regulatorios frecuentes

Errores comunes:

- Lógica embebida directamente en Sales-Post
- Falta de cola de procesamiento
- Ausencia de retry mechanism
- No persistir estados intermedios
- Acoplamiento fuerte con API externa

## Principios de arquitectura
Un sistema robusto debe cumplir:

- Desacoplamiento total entre BC y el proveedor fiscal
- Procesamiento asincrónico
- Persistencia de estados
- Idempotencia
- Observabilidad (logging + tracing)
- Capacidad de reintento automático

Arquitectura recomendada:

- Document Generator
- Serialization Layer (XML/JSON)
- Digital Signature Layer
- Integration Layer (API Client)
- Queue Processor (Job Queue)
- Status Tracker
- Audit & Storage Layer

## Modelo de datos

### Electronic Document
```al
table 50500 "Electronic Document"
{
    fields
    {
        field(1; "Entry No."; Integer) { AutoIncrement = true; }
        field(2; "Document No."; Code[20]) { }
        field(3; "Document Type"; Option) { OptionMembers = Invoice,CreditMemo; }
        field(4; "Status"; Option) { OptionMembers = Pending,Sent,Accepted,Rejected; }
        field(5; "External ID"; Text[100]) { }
        field(6; "XML Content"; Blob) { }
        field(7; "Response"; Blob) { }
    }
}
```

### Electronic Document Log
```al
table 50501 "Electronic Doc Log"
{
    fields
    {
        field(1; "Entry No."; Integer) { AutoIncrement = true; }
        field(2; "Document Entry No."; Integer) { }
        field(3; "Message"; Text[250]) { }
        field(4; "Created At"; DateTime) { }
    }
}
```

## Generación del documento electrónico
Separar completamente la generación del documento del proceso de venta.

```al
codeunit 50510 "E-Invoice Generator"
{
    procedure Generate(SalesHeader: Record "Sales Header"): Text
    begin
        exit(BuildJson(SalesHeader));
    end;
}
```

## Serialización (JSON/XML)
```al
local procedure BuildJson(SalesHeader: Record "Sales Header"): Text
begin
    // construir estructura JSON completa
end;
```

Buenas prácticas:

- No usar texto plano manual
- Utilizar JsonObject
- Versionar estructura

## Firma digital

### Problema
Requisito obligatorio en muchos países.

### Estrategia
- Integrar con proveedor externo de firma
- O usar servicio interno con certificado

```al
SignedDocument := SignService.Sign(DocumentContent);
```

Nunca manejar certificados directamente en AL.

## Integración con API externa
```al
codeunit 50520 "E-Invoice API Client"
{
    procedure Send(Document: Text): Text
    begin
        // HTTP POST
        // manejar response
    end;
}
```

### Consideraciones críticas
- Timeout handling
- Retry strategy
- Manejo de errores HTTP
- Logging completo

## Procesamiento asincrónico (Job Queue)
Nunca enviar documentos en el proceso de venta.

### Flujo correcto
1. Registrar factura
2. Crear Electronic Document (Pending)
3. Job Queue procesa envío

```al
procedure ProcessQueue()
begin
    // obtener documentos pendientes
    // enviar
    // actualizar estado
end;
```

## Manejo de estados
Estados típicos:

- Pending
- Sent
- Accepted
- Rejected

```al
case Response.Status of
    'ACCEPTED':
        UpdateStatus(Accepted);
    'REJECTED':
        UpdateStatus(Rejected);
end;
```

## Idempotencia
Evitar duplicados:

```al
if AlreadySent(DocumentNo) then
    exit;
```

Clave en reintentos.

## Reintentos automáticos
```al
if Failed then
    RetryCount += 1;
```

Estrategia:

- Máximo de intentos
- Backoff exponencial

## Manejo de errores
Errores comunes:

- Validación fiscal
- Error de red
- Timeout

```al
try
    Send();
except
    LogError();
end;
```

## Logging y observabilidad
```al
Session.LogMessage(
    'EINVOICE',
    'Sending document ' + DocNo,
    Verbosity::Verbose,
    DataClassification::SystemMetadata
);
```

Además:

- Guardar request
- Guardar response
- Guardar timestamp

## Almacenamiento legal
Persistir:

- XML firmado
- Respuesta oficial
- Código de validación

Esto es obligatorio para auditorías.

## Integración con ventas
Hook en evento:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 'OnAfterPostSalesDoc', '', false, false)]
```

Crear documento electrónico automáticamente.

## Performance
- Procesamiento batch
- Evitar llamadas sincrónicas
- Uso de colas

## Testing

```al
[Test]
procedure Should_Send_Electronic_Invoice()
begin
    // mock API
    // validar flujo completo
end;
```

Casos:

- Aceptado
- Rechazado
- Timeout
- Retry

## Seguridad
- No exponer claves API
- Usar Azure Key Vault o configuración segura
- Validar endpoints

## Adaptabilidad regulatoria
Diseñar para cambios:

- Versionar schemas
- Parametrizar reglas
- No hardcodear validaciones

## Conclusión
La integración de facturación electrónica en Business Central no es una simple conexión API, sino un sistema distribuido que debe ser resiliente, auditable y desacoplado.

Un diseño correcto permite:

- Cumplir normativas fiscales
- Evitar interrupciones operativas
- Escalar con cambios regulatorios
- Garantizar trazabilidad completa

Este tipo de solución es crítica para cualquier organización que opere en entornos fiscales modernos.