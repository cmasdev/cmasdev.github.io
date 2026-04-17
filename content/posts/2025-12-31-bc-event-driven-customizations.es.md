---
layout: post
title: "BC: Personalizaciones basadas en eventos"
author: Christian Amado
date: 2025-12-31 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

El modelo de extensibilidad de Microsoft Dynamics 365 Business Central SaaS gira alrededor de un principio arquitectónico que lo diferencia claramente de enfoques heredados de personalización en ERP: la personalización no debe hacerse modificando el núcleo, sino reaccionando a eventos y extendiendo el comportamiento del sistema desde fuera. Esta idea parece sencilla, pero sus implicancias son profundas. No se trata solo de usar `EventSubscriber` porque “es la manera recomendada”. Se trata de diseñar soluciones desacopladas, mantenibles y resistentes a cambios del producto a lo largo del tiempo.

En versiones antiguas o en mentalidades heredadas de entornos on-premise, era común pensar en customización como alteración directa del flujo estándar. En Business Central SaaS, ese paradigma está roto por diseño. Microsoft controla el core, las actualizaciones son frecuentes y la única forma sostenible de extender comportamiento es mediante eventos, interfaces, APIs y patrones complementarios. Por eso, comprender el enfoque event-driven no es una cuestión sintáctica del lenguaje AL, sino una capacidad arquitectónica.

<!--more-->
Los eventos en Business Central permiten insertar comportamiento antes, durante o después de procesos relevantes del sistema sin reescribir la lógica estándar. Ese desacoplamiento aporta ventajas evidentes: menor fragilidad frente a upgrades, separación más clara entre dominio estándar y dominio extendido, menor necesidad de duplicar procesos y mayor capacidad para modularizar extensiones. Sin embargo, también introduce riesgos si se usa sin criterio. Una arquitectura supuestamente event-driven puede terminar siendo más opaca y difícil de mantener si cada evento dispara lógica difusa, duplicada o con side effects no controlados.

En soluciones empresariales reales, las customizaciones orientadas a eventos suelen participar en procesos de alto impacto: liberación y posting de documentos, auditoría, integración, colas, validaciones de negocio, enriquecimiento de datos, reglas de aprobación o automatizaciones en background. Por eso, su diseño exige pensar en orden de ejecución, idempotencia, observabilidad, aislamiento de responsabilidades y tolerancia a cambios en el ecosistema estándar.

## El problema
El error más común al trabajar con eventos en Business Central es tratarlos como simples puntos donde “inyectar código”. Bajo esa lógica, cada nueva necesidad se resuelve agregando un `EventSubscriber` más, sin preguntarse si el evento elegido es el correcto, si la lógica debería vivir allí, si se están generando dependencias ocultas o si se está creando una red de side effects difíciles de rastrear.

Eso produce varios anti-patterns.

El primero es la **suscripción caótica**. La solución termina con múltiples subscribers sobre distintos eventos del mismo proceso, a veces en varias codeunits, sin un modelo claro de responsabilidad. Cuando ocurre un comportamiento inesperado, nadie sabe con facilidad qué subscriber intervino, en qué orden y con qué impacto.

El segundo es la **lógica pesada dentro de eventos críticos**. Por ejemplo, colocar cálculos complejos, lecturas masivas o llamadas externas dentro de eventos relacionados con posting puede degradar rendimiento, aumentar locking y volver frágil una operación central del ERP.

El tercero es la **duplicación semántica**. Dos eventos distintos del sistema pueden parecer útiles para una misma necesidad, y el equipo termina utilizando varios al mismo tiempo. Con el tiempo aparecen registros duplicados, doble integración o validaciones repetidas.

El cuarto problema es la **falta de intención de diseño**. Muchas veces el subscriber no expresa si su propósito es validar, enriquecer, auditar, integrar o disparar un proceso asincrónico. Sin esa distinción, la arquitectura pierde claridad.

Otro punto delicado es que no todo debe resolverse con eventos. A veces el uso indiscriminado de subscribers esconde una arquitectura pasiva donde el sistema reacciona a todo, pero no modela explícitamente los casos de uso. Eso hace difícil razonar sobre el flujo del negocio y complica pruebas.

## Qué significa realmente una customización event-driven
Una customización event-driven bien diseñada tiene varias características:

- reacciona a hechos de negocio o técnicos claramente identificables;
- desacopla la extensión del núcleo estándar;
- mantiene una responsabilidad clara por subscriber o conjunto de subscribers;
- minimiza side effects en procesos críticos;
- usa eventos para extender, no para deformar el flujo base;
- complementa, y no reemplaza ciegamente, otros patrones como servicios de dominio, colas, interfaces o procesos batch.

La clave está en entender que el evento es un **punto de extensión**, no el lugar donde debe vivir toda la solución. El evento dispara o articula comportamiento, pero la lógica relevante debería estar encapsulada en servicios o codeunits con responsabilidad clara.

## Tipos de eventos y criterio de uso
Business Central expone distintos tipos de eventos, y no deberían usarse de la misma manera.

### Eventos de negocio estándar
Son eventos publicados por Microsoft en procesos funcionales relevantes. Suelen ser los más valiosos para extender comportamiento sin romper el modelo estándar.

Ejemplos típicos:

- después de registrar un documento;
- después de insertar una entidad;
- antes de validar o modificar cierta estructura;
- después de ejecutar una rutina contable o documental.

Estos eventos son ideales para:

- auditoría;
- generación de colas de integración;
- enriquecimiento posterior;
- validaciones complementarias cuando el punto sea adecuado.

### Eventos de integración personalizados
Cuando una extensión propia necesita abrir puntos de extensión internos, conviene publicar `IntegrationEvent` para desacoplar módulos entre sí.

```al
codeunit 50900 "Sales Extension Events"
{
    [IntegrationEvent(false, false)]
    procedure OnAfterSalesOrderReleased(DocumentNo: Code[20]; CorrelationId: Guid)
    begin
    end;
}
```

Esto permite que otra extensión o módulo reaccione sin depender directamente de la implementación interna.

### Eventos de negocio internos de la solución
En arquitecturas maduras, no todos los eventos importantes vienen del estándar. Muchas veces conviene definir eventos propios alrededor de hechos relevantes del dominio extendido.

Por ejemplo:

- regla de scoring recalculada;
- validación custom completada;
- lote de importación validado;
- instrucción de pago preparada.

Estos eventos ayudan a mantener cohesión dentro de la solución.

## Diseño de la solución
### 1. Separar subscriber y lógica real
Un subscriber debería ser, en general, delgado. Su función es recibir el evento, validar que corresponde actuar y delegar en una codeunit o servicio especializado.

Mal patrón:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 'OnAfterPostSalesDoc', '', false, false)]
local procedure HandleAfterPostSalesDoc(...)
begin
    // lógica extensa
    // consultas masivas
    // integración
    // auditoría
    // notificaciones
end;
```

Mejor patrón:

```al
codeunit 50901 "Posted Sales Subscriber"
{
    [EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 'OnAfterPostSalesDoc', '', false, false)]
    local procedure HandleAfterPostSalesDoc(
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
        PostedSalesEventHandler: Codeunit "Posted Sales Event Handler";
    begin
        PostedSalesEventHandler.HandlePostedSalesDocument(SalesHeader, SalesInvHdrNo, SalesCrMemoHdrNo, PreviewMode);
    end;
}
```

Y la lógica principal vive separada:

```al
codeunit 50902 "Posted Sales Event Handler"
{
    procedure HandlePostedSalesDocument(var SalesHeader: Record "Sales Header"; SalesInvHdrNo: Code[20]; SalesCrMemoHdrNo: Code[20]; PreviewMode: Boolean)
    var
        AuditMgt: Codeunit "Financial Audit Mgt.";
        IntegrationDispatcher: Codeunit "Integration Queue Dispatcher";
        CorrelationId: Guid;
    begin
        if PreviewMode then
            exit;

        CorrelationId := AuditMgt.StartFinancialOperation('SALES_POSTED', 'SalesHeader', SalesHeader."No.", 0);

        IntegrationDispatcher.EnqueuePostedSalesDocument(SalesHeader."No.", CorrelationId);

        AuditMgt.CompleteFinancialOperation(
            CorrelationId,
            StrSubstNo('Posted sales document handled. Invoice=%1 CreditMemo=%2', SalesInvHdrNo, SalesCrMemoHdrNo));
    end;
}
```

Esto mejora mantenibilidad, testabilidad y claridad.

### 2. Usar eventos para desacoplar procesos costosos
Eventos muy cercanos a posting o validación deben usarse con cuidado. Si la operación adicional es costosa, el patrón correcto no es ejecutarla inline, sino registrar una intención o encolar trabajo.

```al
codeunit 50903 "Integration Queue Dispatcher"
{
    procedure EnqueuePostedSalesDocument(DocumentNo: Code[20]; CorrelationId: Guid)
    var
        Queue: Record "Integration Queue Entry";
    begin
        Queue.Init();
        Queue."Integration Type" := 'POSTED_SALES_SYNC';
        Queue."Entity Type" := 'SalesHeader';
        Queue."Entity No." := DocumentNo;
        Queue.Status := Queue.Status::Pending;
        Queue."Correlation ID" := CorrelationId;
        Queue.Insert();
    end;
}
```

El evento no carga con la integración. Solo deja preparado el trabajo para background processing.

### 3. Diseñar eventos propios con semántica de negocio
Si una extensión tiene procesos internos relevantes, conviene publicar eventos semánticos propios en lugar de forzar acoplamiento entre codeunits.

```al
codeunit 50904 "Credit Control Events"
{
    [IntegrationEvent(false, false)]
    procedure OnCreditLimitExceeded(CustomerNo: Code[20]; DocumentNo: Code[20]; CurrentExposure: Decimal; CreditLimit: Decimal)
    begin
    end;
}
```

Luego, distintos módulos pueden reaccionar:

- auditoría;
- notificación;
- bloqueo de proceso;
- integración con sistema externo.

Subscriber de auditoría:

```al
codeunit 50905 "Credit Audit Subscriber"
{
    [EventSubscriber(ObjectType::Codeunit, Codeunit::"Credit Control Events", 'OnCreditLimitExceeded', '', false, false)]
    local procedure HandleCreditLimitExceeded(CustomerNo: Code[20]; DocumentNo: Code[20]; CurrentExposure: Decimal; CreditLimit: Decimal)
    var
        AuditTrail: Record "Financial Audit Trail";
    begin
        AuditTrail.Init();
        AuditTrail."Occurred At" := CurrentDateTime();
        AuditTrail."User ID" := UserId();
        AuditTrail."Company Name" := CompanyName();
        AuditTrail."Operation Type" := 'CREDIT_LIMIT_EXCEEDED';
        AuditTrail."Entity Type" := 'SalesDocument';
        AuditTrail."Entity No." := DocumentNo;
        AuditTrail.Status := AuditTrail.Status::Succeeded;
        AuditTrail."Message" := CopyStr(
            StrSubstNo('Customer %1 exceeded credit limit. Exposure=%2 Limit=%3', CustomerNo, Format(CurrentExposure), Format(CreditLimit)),
            1,
            MaxStrLen(AuditTrail."Message"));
        AuditTrail.Insert();
    end;
}
```

Este diseño es mucho más claro que acoplar todo directamente a la lógica principal.

## Idempotencia y side effects
Una de las preguntas más importantes al trabajar con eventos es: ¿qué pasa si el subscriber se ejecuta más de una vez o si el proceso se reintenta? En integraciones, colas, auditoría y operaciones sensibles, conviene diseñar los handlers con mentalidad idempotente.

Ejemplo de control simple para evitar doble registro de una misma operación:

```al
procedure EnsureAuditNotAlreadyCreated(OperationType: Code[50]; EntityNo: Code[50]; CorrelationId: Guid)
var
    AuditTrail: Record "Financial Audit Trail";
begin
    AuditTrail.SetRange("Operation Type", OperationType);
    AuditTrail.SetRange("Entity No.", EntityNo);
    AuditTrail.SetRange("Correlation ID", CorrelationId);

    if AuditTrail.FindFirst() then
        Error('An audit record for this operation already exists.');
end;
```

No siempre hará falta bloquear, pero sí pensar explícitamente en duplicación y side effects.

## Cuándo NO usar eventos
Uno de los signos de madurez técnica es saber cuándo evitar el patrón. No todo debe ser event-driven.

Conviene no usar eventos cuando:

- el proceso es una orquestación explícita y secuencial que debe leerse claramente de punta a punta;
- la lógica requiere retorno fuerte e inmediato de resultado dentro del caso de uso;
- el evento sería solo un salto artificial para esconder una llamada directa necesaria;
- la complejidad de debugging sería mayor que el beneficio de desacoplar.

Por ejemplo, si una codeunit de aplicación necesita llamar a un servicio de dominio que forma parte esencial del mismo caso de uso, una llamada explícita suele ser más clara que publicar un evento solo “para desacoplar”.

## Observabilidad y trazabilidad
Las arquitecturas event-driven fallan rápido cuando nadie puede explicar qué subscriber reaccionó, con qué datos y en qué orden. Por eso, la observabilidad es esencial.

Prácticas recomendables:

- correlation ids para operaciones relevantes;
- logging o auditoría estructurada para subscribers críticos;
- separación clara entre handlers interactivos y asincrónicos;
- nombres de codeunits y procedimientos que expresen intención.

Ejemplo de log de evento procesado:

```al
procedure LogEventHandled(EventName: Code[50]; EntityNo: Code[50]; CorrelationId: Guid)
var
    Log: Record "Integration Log";
begin
    Log.Init();
    Log."Integration Type" := EventName;
    Log."Entity No." := EntityNo;
    Log."Correlation ID" := CorrelationId;
    Log."Created At" := CurrentDateTime();
    Log."Message" := 'Event handled successfully';
    Log.Insert();
end;
```

## Anti-patterns críticos
Hay varios errores que conviene evitar explícitamente:

- subscribers con lógica extensa y múltiples responsabilidades;
- uso de eventos como reemplazo indiscriminado de llamadas explícitas;
- integración síncrona costosa dentro de eventos de posting;
- subscribers duplicados sobre el mismo hecho de negocio sin coordinación;
- publicación de eventos propios sin semántica clara;
- ausencia de idempotencia donde puede haber reintentos o duplicación;
- arquitectura donde nadie puede seguir el flujo porque “todo pasa por eventos”.

## Buenas prácticas
- Diseñar subscribers delgados y delegar la lógica real.
- Usar eventos para desacoplar, no para esconder complejidad.
- Publicar eventos propios cuando exista un hecho de negocio claro.
- Mantener semántica fuerte en nombres y responsabilidades.
- Encolar procesos costosos en lugar de ejecutarlos inline.
- Diseñar con idempotencia y observabilidad.
- Elegir eventos estándar con criterio, no por proximidad superficial.
- Documentar eventos propios importantes como parte del contrato interno de la extensión.

## Conclusiones
Las customizaciones orientadas a eventos son uno de los pilares de extensibilidad en Business Central SaaS, pero solo generan valor real cuando se usan con intención arquitectónica. Un sistema event-driven bien diseñado desacopla, facilita evolución y reduce dependencia del núcleo estándar. Un sistema event-driven mal diseñado crea opacidad, side effects impredecibles y dificultad de soporte.

La diferencia está en cómo se usan los eventos: como puntos de extensión semánticamente claros, con handlers pequeños, responsabilidades separadas, procesos costosos desacoplados y observabilidad suficiente para entender el comportamiento en producción. En soluciones empresariales reales, dominar esta forma de diseñar no es un detalle técnico más. Es una de las competencias que más claramente distinguen a quien simplemente suscribe eventos de quien realmente construye extensiones sostenibles sobre Business Central.