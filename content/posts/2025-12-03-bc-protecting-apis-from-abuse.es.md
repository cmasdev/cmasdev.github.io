---
layout: post
title: "BC: Cómo proteger las API del abuso"
author: Christian Amado
date: 2025-12-03 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, exponer APIs propias o consumir APIs estándar del sistema forma parte natural de arquitecturas modernas. Sin embargo, cada endpoint publicado amplía la superficie de ataque y de abuso operacional del entorno. No es necesario que exista un atacante sofisticado para generar daño. Muchas veces el abuso proviene de consumidores legítimos mal diseñados: integraciones que hacen polling agresivo, procesos que reintentan sin control, clientes que envían payloads enormes, aplicaciones que no respetan límites de concurrencia o usuarios técnicos con permisos excesivos.

Proteger APIs contra abuso no significa únicamente bloquear ataques maliciosos. Significa diseñar la integración de forma que el sistema siga siendo estable, observable y gobernable cuando recibe tráfico defectuoso, inesperado o excesivo. En un entorno como Business Central SaaS, donde el desarrollador no controla directamente la infraestructura subyacente, esta responsabilidad se desplaza completamente hacia la arquitectura de integración, la seguridad de aplicación y el diseño de contratos.

<!--more-->
El problema se vuelve más relevante cuando Business Central expone páginas tipo API para consumidores externos o cuando se integra a través de gateways, servicios intermedios o plataformas B2B. Sin controles adecuados, un único consumidor puede saturar la solución, forzar transacciones costosas, provocar degradación en otros usuarios e incluso generar inconsistencias por repetición de operaciones. En escenarios financieros, ese riesgo no es meramente técnico: puede convertirse en un problema operativo o regulatorio.

Por eso, proteger APIs de abuso en Business Central debe entenderse como una combinación de seguridad, arquitectura de resiliencia y gobierno del tráfico.

## El problema
El primer error común consiste en pensar que, si el endpoint requiere autenticación, entonces ya está “protegido”. La autenticación resuelve identidad, pero no controla volumen, frecuencia, forma de acceso ni costo de operación. Un consumidor autenticado puede seguir siendo abusivo si ejecuta miles de requests por minuto, si reintenta indefinidamente ante errores 429 o 500, si consulta grandes datasets sin filtros o si intenta modificar la misma entidad repetidas veces.

Los patrones de abuso más frecuentes incluyen:

- polling excesivo sobre endpoints de lectura;
- requests concurrentes sin control sobre la misma entidad;
- reintentos agresivos tras errores temporales;
- operaciones no idempotentes ejecutadas múltiples veces;
- payloads desproporcionados respecto del caso de uso;
- consultas sin filtros o con filtros demasiado amplios;
- uso de usuarios técnicos compartidos por múltiples integraciones;
- exposición de endpoints demasiado expresivos, capaces de devolver más información de la necesaria.

En Business Central esto tiene efectos especialmente delicados. Las APIs no viven aisladas: detrás de ellas existen tablas, triggers, permission checks, validaciones, eventos y, muchas veces, extensiones custom. Una llamada mal diseñada puede provocar lecturas costosas, cálculos de FlowFields, ejecución de lógica adicional o interacción con procesos batch. Si varias integraciones defectuosas operan al mismo tiempo, el sistema comienza a degradarse de forma difícil de diagnosticar.

También existe el riesgo de abuso lógico. No todo abuso es volumétrico. Un cliente puede invocar un endpoint de creación repetidas veces con payloads casi idénticos y terminar generando documentos duplicados, colas saturadas o asientos inconsistentes si la API no fue diseñada con idempotencia y validación contextual.

## Diseño de la solución
Proteger APIs contra abuso requiere varios niveles de defensa. Ninguno por sí solo es suficiente.

### 1. Rate limiting y throttling fuera de Business Central
La primera línea de defensa no debería vivir dentro de AL, sino delante de Business Central, mediante un API Gateway o una capa intermedia como Azure API Management, un gateway en .NET o una plataforma de integración. Ahí es donde conviene aplicar:

- límites de requests por minuto;
- quotas por consumidor o aplicación;
- control de bursts;
- bloqueo temporal ante comportamiento anómalo.

El objetivo es que Business Central no reciba tráfico que ya debería haber sido frenado antes. El ERP no debe ser el primer lugar donde se detecta el abuso.

### 2. Contratos API mínimos y defensivos
El segundo nivel consiste en reducir lo que la API permite hacer y devolver. Un endpoint seguro no es solo uno autenticado, sino uno cuya superficie es deliberadamente limitada.

Eso implica:

- exponer solo los campos necesarios;
- requerir filtros obligatorios en ciertos endpoints;
- evitar operaciones masivas no justificadas;
- limitar payloads conceptualmente, aunque la plataforma no exponga un límite configurable directo.

Una API demasiado genérica suele ser una API difícil de proteger.

### 3. Idempotencia para operaciones de escritura
Toda operación que cree o modifique entidades relevantes debería poder protegerse contra duplicación. En escenarios de integración, la forma más sana de hacerlo es usar claves idempotentes o identificadores externos únicos.

De ese modo, si un cliente repite una operación por error o por retry automático, el sistema no crea duplicados ni reprocesa innecesariamente.

### 4. Validación semántica, no solo estructural
No alcanza con verificar que el JSON sea válido o que el status code sea correcto. También hay que validar si la operación tiene sentido en el contexto actual.

Ejemplos:

- no permitir actualización si el documento ya fue registrado;
- no permitir crear dos veces una entidad con el mismo identificador externo;
- no permitir leer conjuntos masivos sin restricciones.

### 5. Observabilidad y correlación
Una API protegida debe poder responder preguntas operativas como:

- quién llamó;
- cuándo llamó;
- cuántas veces llamó;
- sobre qué entidad;
- con qué correlation id;
- cuál fue el resultado;
- qué patrón de tráfico está generando.

Sin esta visibilidad, el abuso puede ocurrir silenciosamente durante mucho tiempo.

## Implementación en AL
Aunque los controles volumétricos más fuertes deberían ubicarse delante de Business Central, desde AL sí se pueden implementar varias defensas importantes.

### Validación de identificador externo único
```al
procedure EnsureExternalRequestUniqueness(ExternalRequestId: Code[50])
var
    ApiRequestLog: Record "API Request Log";
begin
    ApiRequestLog.SetRange("External Request Id", ExternalRequestId);
    if ApiRequestLog.FindFirst() then
        Error('The request with external id %1 has already been processed.', ExternalRequestId);
end;
```

Este patrón evita que una integración repita una operación de creación sin control.

### Registro de requests procesados
```al
table 50560 "API Request Log"
{
    fields
    {
        field(1; "Entry No."; Integer) { AutoIncrement = true; }
        field(2; "External Request Id"; Code[50]) { }
        field(3; "Consumer Id"; Code[50]) { }
        field(4; "Endpoint Name"; Code[50]) { }
        field(5; "Correlation Id"; Guid) { }
        field(6; "Processed At"; DateTime) { }
        field(7; "Result"; Option) { OptionMembers = Success,Rejected,Failed; }
    }
}
```

```al
procedure RegisterProcessedRequest(ExternalRequestId: Code[50]; ConsumerId: Code[50]; EndpointName: Code[50]; CorrelationId: Guid)
var
    ApiRequestLog: Record "API Request Log";
begin
    ApiRequestLog.Init();
    ApiRequestLog."External Request Id" := ExternalRequestId;
    ApiRequestLog."Consumer Id" := ConsumerId;
    ApiRequestLog."Endpoint Name" := EndpointName;
    ApiRequestLog."Correlation Id" := CorrelationId;
    ApiRequestLog."Processed At" := CurrentDateTime();
    ApiRequestLog.Result := ApiRequestLog.Result::Success;
    ApiRequestLog.Insert();
end;
```

### Protección de operaciones sobre documentos ya registrados
```al
procedure ValidateSalesDocumentIsStillEditable(SalesHeader: Record "Sales Header")
begin
    if SalesHeader.Status = SalesHeader.Status::Released then
        Error('Released sales documents cannot be modified through this API.');

    if SalesHeader."Completely Shipped" then
        Error('Completely shipped sales documents cannot be modified through this API.');
end;
```

### Requerir filtros obligatorios en endpoints de consulta
Si se expone una API custom sobre tablas grandes, conviene rechazar lecturas demasiado abiertas.

```al
procedure RequireRestrictedCustomerQuery(CustomerNoFilter: Code[20]; ModifiedAfterFilter: DateTime)
begin
    if (CustomerNoFilter = '') and (ModifiedAfterFilter = 0DT) then
        Error('At least one restrictive filter must be provided.');
end;
```

### Auditoría de acceso por consumidor
```al
procedure LogApiAccess(ConsumerId: Code[50]; EndpointName: Code[50]; CorrelationId: Guid; ResultText: Text)
var
    AccessLog: Record "Integration Log";
begin
    AccessLog.Init();
    AccessLog."Integration Type" := EndpointName;
    AccessLog."Source System" := ConsumerId;
    AccessLog."Correlation Id" := CorrelationId;
    AccessLog."Message" := CopyStr(ResultText, 1, 250);
    AccessLog."Created At" := CurrentDateTime();
    AccessLog.Insert();
end;
```

### Protección de endpoints API custom
```al
page 50561 "Customer Abuse Protected API"
{
    PageType = API;
    APIPublisher = 'contoso';
    APIGroup = 'secure';
    APIVersion = 'v1.0';
    EntityName = 'protectedCustomer';
    EntitySetName = 'protectedCustomers';
    SourceTable = Customer;

    layout
    {
        area(Content)
        {
            field(No; Rec."No.") { }
            field(Name; Rec.Name) { }
            field(EMail; Rec."E-Mail") { }
        }
    }

    trigger OnOpenPage()
    begin
        RequireCustomerApiReadAccess();
    end;
}
```

```al
procedure RequireCustomerApiReadAccess()
var
    Customer: Record Customer;
begin
    if not Customer.ReadPermission() then
        Error('The current identity is not authorized to consume this API.');
end;
```

### Encolado de operaciones costosas en lugar de ejecución inmediata
Si una API dispara una operación pesada, es preferible registrar la solicitud y procesarla en background.

```al
procedure EnqueueApiOperation(ExternalRequestId: Code[50]; EntityNo: Code[20]; PayloadText: Text)
var
    Queue: Record "Integration Queue";
    OutS: OutStream;
begin
    Queue.Init();
    Queue."Integration Type" := 'API_OPERATION';
    Queue."Entity No." := EntityNo;
    Queue.Status := Queue.Status::Pending;
    Queue.Payload.CreateOutStream(OutS);
    OutS.WriteText(PayloadText);
    Queue.Insert();
end;
```

Esto reduce el riesgo de que un consumidor fuerce operaciones costosas en tiempo real.

## Patrones arquitectónicos recomendados
### Gateway-first protection
Toda integración externa debería pasar por una capa con políticas de seguridad y gobierno del tráfico antes de llegar a Business Central. El gateway debe encargarse de:

- validar identidad;
- aplicar rate limiting;
- imponer quotas;
- agregar correlation ids;
- bloquear consumidores abusivos;
- versionar endpoints.

### Consumer-specific contracts
No todos los consumidores deberían usar el mismo endpoint. Si un portal B2B necesita un modelo y una integración EDI necesita otro, conviene separar contratos. Esto reduce superficie y evita exponer funcionalidades innecesarias a cada consumidor.

### Queue-backed write APIs
Las operaciones de escritura de alto costo o alto riesgo deben desacoplarse del request-response inmediato cuando sea posible. Una API puede aceptar la solicitud, registrarla y devolver un identificador de seguimiento en lugar de ejecutar todo de forma síncrona.

### Operational abuse detection
La protección no termina cuando se publica la API. También hay que detectar patrones de abuso:

- spikes de requests;
- reintentos excesivos;
- requests duplicados;
- consultas masivas repetitivas;
- consumidores con tasa de error anormal.

Esto normalmente se resuelve con telemetría, dashboards y alertas.

## Anti-patterns críticos
- Exponer Business Central directamente a múltiples consumidores sin gateway.
- Permitir operaciones de escritura sin claves idempotentes o identificadores externos.
- Exponer endpoints demasiado genéricos sobre tablas grandes.
- Aceptar requests sin filtros mínimos.
- Ejecutar operaciones costosas o integraciones externas dentro del request principal sin desacoplar.
- Reutilizar un mismo usuario técnico para múltiples consumidores.
- No registrar correlation ids ni logs de acceso.
- Asumir que autenticación equivale a protección contra abuso.

## Buenas prácticas
- Diseñar las APIs desde el principio con límites conceptuales claros.
- Usar gateways o capas intermedias para controlar tráfico.
- Requerir filtros restrictivos en endpoints de lectura sobre entidades grandes.
- Implementar idempotencia en operaciones de creación y actualización.
- Registrar requests procesados y consumidores.
- Separar identidades técnicas por integración.
- Desacoplar operaciones costosas mediante colas y background processing.
- Definir alertas sobre patrones anómalos de consumo.

## Conclusiones
Proteger APIs de abuso en Business Central SaaS exige tratar la integración como una superficie crítica de seguridad y operación. No basta con autenticar consumidores ni con exponer endpoints técnicamente correctos. Es necesario controlar volumen, limitar superficie, validar contexto, desacoplar operaciones costosas y registrar evidencia suficiente para detectar comportamientos anómalos.

Una arquitectura robusta entiende que el abuso puede venir tanto de atacantes como de integraciones legítimas mal diseñadas. Por eso, la defensa debe ser múltiple: gateway, contratos mínimos, idempotencia, validación, colas y observabilidad. En entornos empresariales donde Business Central participa como sistema de registro, este enfoque no es un refinamiento opcional. Es una condición necesaria para preservar estabilidad, seguridad y gobernanza a largo plazo.