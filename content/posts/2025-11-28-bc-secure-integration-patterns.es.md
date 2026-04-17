---
layout: post
title: "BC: Patrones de integración segura para sistemas externos"
author: Christian Amado
date: 2025-11-28 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, la integración con sistemas externos no debe verse como una simple capacidad técnica adicional, sino como una de las superficies de riesgo más importantes de toda la solución. Cada API consumida, cada evento publicado, cada token almacenado y cada payload transmitido extiende el perímetro de seguridad del sistema. En otras palabras, una integración mal diseñada no solo falla funcionalmente: puede comprometer confidencialidad, integridad, trazabilidad y cumplimiento normativo.

En entornos empresariales reales, Business Central suele integrarse con múltiples tipos de sistemas: plataformas de facturación electrónica, CRMs, e-commerce, pasarelas de pago, microservicios en .NET, plataformas de identidad, ERPs satélite y proveedores externos. Cada uno introduce riesgos distintos. Algunos exponen credenciales, otros requieren manejo de datos sensibles, otros dependen de callbacks, colas, webhooks o autenticación delegada. Si la arquitectura de integración no incorpora seguridad desde el diseño, el sistema termina acumulando vulnerabilidades en puntos difíciles de detectar.

<!--more-->
Un error frecuente es pensar que “usar HTTPS” resuelve la seguridad de la integración. En realidad, HTTPS solo protege el canal. La seguridad real depende de cómo se diseñan los contratos, cómo se gestionan secretos, cómo se validan respuestas, cómo se autorizan operaciones, cómo se aíslan procesos críticos y cómo se limita el impacto de fallos externos.

Por eso, hablar de secure integration patterns en Business Central significa hablar de arquitectura, no solo de llamadas HTTP.

## El problema
La mayoría de los problemas de seguridad en integraciones no aparecen porque el desarrollador haya querido construir algo inseguro, sino porque la integración fue tratada como un detalle operativo. Los síntomas más comunes incluyen:

- credenciales hardcodeadas en AL o almacenadas en tablas sin protección;
- APIs expuestas con más datos de los necesarios;
- tokens reutilizados sin control de expiración;
- respuestas externas aceptadas sin validación suficiente;
- ejecución de integraciones sensibles dentro de procesos críticos como posting;
- usuarios de integración con permisos excesivos;
- ausencia de auditoría sobre operaciones de alto impacto.

Uno de los anti-patterns más peligrosos es el de la “integración directa y confiada”. Business Central envía datos a un endpoint externo, recibe una respuesta y la asume válida si el status code es 200. Eso es insuficiente. Un response 200 no garantiza integridad semántica, estructura esperada ni autenticidad del origen final del dato procesado.

Otro problema importante es la mezcla de responsabilidades. Hay integraciones donde la misma codeunit maneja autenticación, transformación de payloads, lógica de negocio, retries, logging y actualización de documentos. Esa acumulación no solo degrada mantenibilidad; también dificulta establecer controles de seguridad consistentes y auditables.

También existe un problema estructural con el manejo de identidades técnicas. Muchas organizaciones crean usuarios de integración con privilegios amplios “para que todo funcione”. Eso simplifica el arranque, pero destruye el principio de mínimo privilegio. Si una integración de bajo riesgo usa una identidad con acceso amplio a datos financieros o posting, el sistema queda innecesariamente expuesto.

## Principios de diseño seguro
Implementar patrones de integración seguros en Business Central requiere construir la arquitectura alrededor de varios principios.

### 1. Principle of least privilege
Cada integración debe operar con el mínimo conjunto de permisos necesarios. Esto aplica tanto a usuarios técnicos como a APIs, permission sets, codeunits y tablas consumidas. Una integración que sincroniza clientes no debería tener permisos sobre pagos, ledger entries o posting de documentos.

### 2. Segregation of integration responsibilities
La seguridad mejora cuando se separan capas:

- autenticación y manejo de secretos;
- validación y normalización de payloads;
- lógica de negocio;
- persistencia;
- observabilidad.

Esto evita que una sola pieza concentre demasiada responsabilidad y reduce el riesgo de errores con impacto amplio.

### 3. Trust boundaries explícitos
Todo sistema externo debe ser tratado como un boundary de confianza distinto. Eso significa que Business Central no debe asumir que un payload recibido es válido solo porque proviene de una integración conocida. Todo dato externo debe ser validado antes de impactar el dominio.

### 4. Secure-by-default design
La opción por defecto debe ser la más segura:

- no exponer campos innecesarios;
- no permitir operaciones destructivas sin validación adicional;
- no almacenar secretos en tablas accesibles;
- no ejecutar integración síncrona dentro de procesos críticos.

### 5. Observabilidad y auditabilidad
Una integración segura debe dejar evidencia suficiente para reconstruir qué ocurrió, cuándo, con qué identidad, sobre qué entidad y con qué resultado. Sin auditoría, la seguridad se vuelve declarativa pero no verificable.

## Patrones de integración seguros
### Pattern 1: Outbound integration with isolated secret management
El primer patrón básico consiste en desacoplar la lógica de negocio del manejo de secretos. Business Central no debería almacenar credenciales sensibles en tablas normales ni repetir tokens por múltiples codeunits.

Un diseño razonable es encapsular la obtención de secretos en una capa dedicada. En escenarios simples, puede usarse almacenamiento aislado. En escenarios enterprise, lo correcto es externalizar secretos hacia Azure Key Vault o una capa .NET segura.

```al
codeunit 50500 "Secure Secret Provider"
{
    procedure GetApiToken(TokenName: Text): Text
    var
        IsolatedStorage: Codeunit "Isolated Storage";
        TokenValue: Text;
    begin
        if not IsolatedStorage.Get(TokenName, TokenValue) then
            Error('Token %1 not found in isolated storage.', TokenName);

        exit(TokenValue);
    end;
}
```

La ventaja de este patrón es que la integración consumidora no conoce dónde vive el secreto ni cómo se gestiona. Solo recibe un contrato.

### Pattern 2: Dedicated integration client codeunit
Cada integración externa debería encapsularse en un cliente especializado. Esto evita mezclar autenticación, business logic y transporte.

```al
codeunit 50501 "Customer Sync Api Client"
{
    procedure SendCustomerPayload(CustomerPayload: Text; CorrelationId: Guid)
    var
        Client: HttpClient;
        RequestHeaders: HttpHeaders;
        Content: HttpContent;
        Response: HttpResponseMessage;
        SecretProvider: Codeunit "Secure Secret Provider";
        AccessToken: Text;
    begin
        AccessToken := SecretProvider.GetApiToken('CUSTOMER_SYNC_TOKEN');

        Client.DefaultRequestHeaders().Add('Authorization', 'Bearer ' + AccessToken);
        Client.DefaultRequestHeaders().Add('X-Correlation-Id', Format(CorrelationId));

        Content.WriteFrom(CustomerPayload);

        Client.Timeout := 10000;

        Client.Post('https://api.contoso.com/customers', Content, Response);

        if not Response.IsSuccessStatusCode() then
            Error('Customer sync failed. HTTP status code: %1', Response.HttpStatusCode());
    end;
}
```

Este patrón mejora seguridad porque centraliza headers, timeouts y autenticación, y permite endurecer políticas fácilmente.

### Pattern 3: Validate before apply
Toda integración inbound o respuesta externa debe pasar por una capa de validación antes de impactar tablas del dominio.

```al
codeunit 50502 "Customer Sync Validator"
{
    procedure ValidateIncomingCustomerPayload(CustomerNo: Code[20]; ExternalStatus: Text; ExternalModifiedAt: DateTime)
    var
        Customer: Record Customer;
    begin
        if CustomerNo = '' then
            Error('Customer number is required.');

        if ExternalStatus = '' then
            Error('External status is required.');

        if not Customer.Get(CustomerNo) then
            Error('Customer %1 does not exist.', CustomerNo);

        if ExternalModifiedAt < Customer."Last Modified Date Time" then
            Error('Incoming payload is older than current Business Central data.');
    end;
}
```

La idea no es solo validar formato, sino también consistencia temporal, existencia de entidad y reglas de dominio.

### Pattern 4: Queue-based secure processing
Las integraciones de impacto alto no deberían ejecutarse dentro de procesos críticos. El patrón recomendado es registrar una operación en una cola interna y procesarla en background, con trazabilidad y reintentos controlados.

```al
table 50510 "Integration Queue"
{
    fields
    {
        field(1; "Entry No."; Integer) { AutoIncrement = true; }
        field(2; "Integration Type"; Code[30]) { }
        field(3; "Entity No."; Code[20]) { }
        field(4; "Payload"; Blob) { }
        field(5; "Status"; Option) { OptionMembers = Pending,Processing,Completed,Failed; }
        field(6; "Retry Count"; Integer) { }
        field(7; "Correlation Id"; Guid) { }
        field(8; "Created At"; DateTime) { }
    }
}
```

```al
codeunit 50511 "Integration Queue Dispatcher"
{
    procedure EnqueueCustomerSync(CustomerNo: Code[20]; PayloadText: Text)
    var
        Queue: Record "Integration Queue";
        OutStream: OutStream;
        CorrelationId: Guid;
    begin
        CorrelationId := CreateGuid();

        Queue.Init();
        Queue."Integration Type" := 'CUSTOMER_SYNC';
        Queue."Entity No." := CustomerNo;
        Queue."Correlation Id" := CorrelationId;
        Queue."Created At" := CurrentDateTime();
        Queue.Status := Queue.Status::Pending;
        Queue.Payload.CreateOutStream(OutStream);
        OutStream.WriteText(PayloadText);
        Queue.Insert();
    end;
}
```

Este patrón mejora seguridad porque reduce superficie de fallo en procesos críticos y permite observar cada operación.

### Pattern 5: API surface minimization
Cuando se exponen páginas tipo API, uno de los errores más comunes es publicar más campos de los necesarios. El patrón correcto es exponer DTOs mínimos, no tablas completas “porque ya están ahí”.

```al
page 50520 "Customer Integration API"
{
    PageType = API;
    APIPublisher = 'contoso';
    APIGroup = 'integration';
    APIVersion = 'v1.0';
    EntityName = 'integrationCustomer';
    EntitySetName = 'integrationCustomers';
    SourceTable = Customer;

    layout
    {
        area(Content)
        {
            field(No; Rec."No.") { }
            field(Name; Rec.Name) { }
            field(EMail; Rec."E-Mail") { }
            field(PhoneNo; Rec."Phone No.") { }
        }
    }

    trigger OnOpenPage()
    begin
        RequireCustomerIntegrationReadAccess();
    end;
}
```

```al
procedure RequireCustomerIntegrationReadAccess()
var
    Customer: Record Customer;
begin
    if not Customer.ReadPermission() then
        Error('The current identity is not authorized to read customer integration data.');
end;
```

La seguridad aquí no depende solo de OAuth. También depende de limitar el modelo expuesto.

## Seguridad en identidades técnicas
Una identidad de integración no debe ser una cuenta “comodín” con acceso amplio. Debe diseñarse como una identidad con scope funcional acotado. Eso implica:

- permission sets específicos para integración;
- sin acceso interactivo cuando no sea necesario;
- sin privilegios de posting salvo justificación explícita;
- sin acceso amplio a datos financieros si la integración no los requiere.

Ejemplo de permission set técnico para integración de clientes:

```al
permissionset 50530 "INT CUSTOMER SYNC"
{
    Assignable = true;
    Permissions =
        tabledata Customer = RIM,
        page "Customer Integration API" = X,
        codeunit "Customer Sync Api Client" = X,
        tabledata "Integration Queue" = RIMD;
}
```

Este rol no incluye acceso a ledger entries, posting ni procesos no relacionados.

## Protección de datos sensibles durante integración
La seguridad no termina en autenticación. También importa qué datos viajan, dónde se almacenan y cuánto duran.

### Minimización de payload
No enviar datos que el sistema externo no necesita. Si solo requiere nombre y correo, no enviar límites de crédito, posting groups o información fiscal.

### Sanitización de logs
Nunca registrar tokens, secretos, números completos de documentos sensibles o payloads completos si contienen datos regulados.

```al
procedure LogIntegrationFailure(IntegrationType: Code[30]; CorrelationId: Guid; ErrorMessage: Text)
var
    Log: Record "Integration Log";
begin
    Log.Init();
    Log."Integration Type" := IntegrationType;
    Log."Correlation Id" := CorrelationId;
    Log."Message" := CopyStr(ErrorMessage, 1, 250);
    Log.Insert();
end;
```

### Expiración y rotación
Los tokens de larga vida incrementan superficie de riesgo. Siempre que el patrón lo permita, se deben usar tokens con expiración y mecanismos de renovación controlados.

## Anti-patterns críticos
Existen varios anti-patterns que deben evitarse de forma explícita:

- Hardcodear tokens o API keys en código AL.
- Guardar secretos en tablas accesibles mediante UI o APIs.
- Exponer páginas API con campos innecesarios.
- Ejecutar llamadas HTTP dentro de posting o validaciones críticas.
- Reutilizar usuarios técnicos con permisos amplios.
- Aceptar respuestas externas sin validar estructura, contexto y estado.
- Registrar logs con datos sensibles o credenciales.
- Mezclar autenticación, lógica de negocio y persistencia en una sola codeunit.

## Buenas prácticas
- Diseñar integraciones por capas, no como llamadas directas dispersas.
- Centralizar manejo de secretos.
- Validar payloads entrantes y salientes.
- Limitar el modelo de datos expuesto.
- Usar colas y procesamiento asincrónico para operaciones sensibles.
- Diseñar permission sets específicos para identidades técnicas.
- Agregar correlation IDs y auditoría estructurada.
- Tratar cada sistema externo como un trust boundary distinto.

## Conclusiones
Diseñar patrones de integración seguros en Business Central SaaS exige mucho más que consumir APIs correctamente. Exige construir una arquitectura donde identidad, autorización, validación, trazabilidad, protección de datos y resiliencia trabajen juntas. Una integración puede funcionar perfectamente desde el punto de vista funcional y seguir siendo insegura. Esa es precisamente la razón por la que la seguridad debe formar parte del diseño desde el inicio.

Los equipos que abordan integraciones como una capa arquitectónica y no como una colección de llamadas HTTP construyen soluciones mucho más sostenibles. Reducen exposición, mejoran auditabilidad, facilitan gobernanza y limitan el impacto de fallos o compromisos externos. En entornos empresariales donde Business Central forma parte de un ecosistema de sistemas, ese nivel de disciplina no es una mejora opcional: es una condición básica para operar con seguridad.