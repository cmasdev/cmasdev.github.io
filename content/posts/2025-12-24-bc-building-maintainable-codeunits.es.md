---
layout: post
title: "BC: Creación de unidades de código mantenibles para una lógica empresarial compleja"
author: Christian Amado
date: 2025-12-24 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, las codeunits son uno de los objetos más importantes para estructurar lógica de negocio, encapsular procesos, coordinar operaciones técnicas y separar responsabilidades dentro de una extensión. Bien diseñadas, permiten construir soluciones legibles, reutilizables, testeables y evolutivas. Mal diseñadas, se convierten en el punto exacto donde la extensión empieza a degradarse: lógica mezclada, dependencias implícitas, reglas duplicadas, side effects inesperados y dificultad creciente para mantener o extender el sistema.

Esto ocurre con frecuencia porque AL facilita escribir lógica rápidamente. Es tentador resolver un requerimiento agregando procedimientos a una codeunit ya existente, reutilizando variables globales y conectando el nuevo proceso con otros a través de llamadas directas. A corto plazo parece eficiente. A mediano plazo, el resultado suele ser una codeunit de cientos o miles de líneas con múltiples responsabilidades, difícil de testear y extremadamente sensible a cualquier cambio.

<!--more-->
En soluciones empresariales reales, las codeunits suelen terminar concentrando lógica crítica: validaciones de documentos, cálculo de reglas, orquestación de integraciones, procesamiento batch, aplicación de permisos funcionales, auditoría o coordinación entre tablas. Por eso, diseñarlas con criterio no es una cuestión estética. Es una decisión de arquitectura que impacta directamente en mantenibilidad, performance, seguridad y velocidad de evolución del sistema.

El problema no es solo “tener código limpio”. El problema es poder agregar funcionalidad nueva sin romper comportamiento existente, permitir que varios desarrolladores trabajen sobre el mismo dominio sin colisiones y soportar cambios de negocio sin convertir cada modificación en una refactorización traumática. Una codeunit mantenible es, en última instancia, un contenedor de intención clara, dependencias controladas y fronteras explícitas.

## El problema
El anti-pattern más común es la codeunit monolítica. Es una codeunit que comenzó resolviendo una necesidad concreta y terminó absorbiendo todo lo relacionado con ese proceso: lectura de setup, validaciones, cálculos, acceso a tablas, logging, integración externa, notificaciones y manejo de errores. El resultado es una unidad de código que ya no representa una responsabilidad clara, sino una acumulación histórica de decisiones.

Los síntomas de una codeunit mal diseñada suelen ser evidentes:

- procedimientos demasiado largos;
- variables globales reutilizadas por múltiples métodos;
- dependencias a múltiples tablas, páginas, reportes e integraciones;
- lógica de negocio mezclada con detalles técnicos;
- procedimientos que llaman a muchos otros en secuencias difíciles de seguir;
- side effects no documentados;
- imposibilidad práctica de escribir tests unitarios útiles.

Otro problema frecuente es la falta de distinción entre tipos de codeunits. En muchas extensiones se usa la misma codeunit para todo: servicio de dominio, utilidad técnica, dispatcher de integración y proceso batch. Esa ambigüedad estructural destruye la cohesión del objeto. Una codeunit mantenible necesita un rol claro dentro de la arquitectura.

También es común encontrar codeunits diseñadas alrededor de “qué tablas tocan” en lugar de “qué responsabilidad cumplen”. Por ejemplo, una codeunit llamada Customer Management puede terminar haciendo validaciones funcionales, integración con CRM, exportación de datos, score crediticio y limpieza de staging. Ese tipo de diseño genera alto acoplamiento y hace que cualquier cambio de negocio tenga impacto desproporcionado.

Finalmente, hay un problema de evolución. Muchas codeunits no están diseñadas para crecer. No exponen contratos claros, no separan invariantes del dominio, no usan interfaces cuando deberían y no delimitan correctamente puntos de extensión. Cuando la solución madura, el costo de mantenerlas crece más rápido que el valor que entregan.

## Principios de diseño mantenible
### 1. Una responsabilidad dominante por codeunit
La regla más importante es que una codeunit debe tener una razón principal para cambiar. No significa que deba tener un solo procedimiento, pero sí que sus procedimientos deben alinearse con una misma responsabilidad conceptual.

Ejemplos de responsabilidades válidas:

- cálculo de una regla de negocio;
- orquestación de un proceso específico;
- acceso encapsulado a una integración externa;
- construcción de snapshots para auditoría;
- validación de un caso de uso concreto.

Ejemplos de responsabilidades mezcladas que conviene evitar:

- lógica de negocio más llamadas HTTP más logging más escritura de staging en la misma codeunit;
- setup, posting y exportación en un mismo objeto;
- validación funcional y UI behavior juntos.

Cuando la responsabilidad dominante es clara, la codeunit se vuelve más predecible.

### 2. Separar dominio, aplicación e infraestructura
Una forma muy útil de pensar codeunits mantenibles es distinguir al menos tres capas lógicas:

- **dominio**: reglas de negocio puras, invariantes, validaciones funcionales;
- **aplicación**: orquestación de casos de uso;
- **infraestructura**: integración, logging, colas, secretos, APIs, persistencia auxiliar.

Una codeunit de dominio no debería saber cómo se llama un endpoint externo. Una codeunit de integración no debería decidir reglas financieras. Una codeunit de aplicación puede coordinar ambas, pero sin absorber toda la lógica internamente.

### 3. Procedimientos pequeños y con intención clara
Un procedimiento largo casi siempre indica mezcla de responsabilidades. En AL, es preferible tener una secuencia de métodos con nombres explícitos que documenten intención.

Malo:

- un solo procedimiento `ProcessEverything()` de 300 líneas.

Mejor:

- `ValidateRequest`
- `LoadConfiguration`
- `CalculateResults`
- `PersistState`
- `EnqueueIntegrationEvent`

Esa separación no solo mejora lectura. También facilita testeo y localización de errores.

### 4. Dependencias explícitas
Una codeunit mantenible no debería esconder dependencias críticas en variables globales opacas o side effects. Si un procedimiento necesita un documento, una configuración o un contexto de ejecución, debe quedar claro en la firma o en el flujo.

### 5. Evitar estado global innecesario
Las variables globales en codeunits son una fuente muy común de fragilidad. Si varios procedimientos dependen de estado compartido implícito, el comportamiento del objeto se vuelve mucho más difícil de predecir y probar.

## Patrones útiles para codeunits mantenibles
### Pattern 1: Codeunit de servicio de dominio
Una codeunit de dominio encapsula una regla o cálculo del negocio. No debería depender de infraestructura externa.

```al
codeunit 50800 "Credit Limit Evaluator"
{
    procedure CanReleaseSalesOrder(var SalesHeader: Record "Sales Header"): Boolean
    var
        Customer: Record Customer;
    begin
        if not Customer.Get(SalesHeader."Sell-to Customer No.") then
            Error('Customer %1 does not exist.', SalesHeader."Sell-to Customer No.");

        Customer.CalcFields("Balance (LCY)");

        exit((Customer."Balance (LCY)" + SalesHeader."Amount Including VAT") <= Customer."Credit Limit (LCY)");
    end;
}
```

Esta codeunit hace una cosa clara: evaluar si el documento puede liberarse según el límite de crédito.

### Pattern 2: Codeunit de aplicación u orquestación
La codeunit de aplicación coordina pasos del caso de uso, pero delega las reglas específicas a otros servicios.

```al
codeunit 50801 "Sales Release Orchestrator"
{
    procedure ReleaseSalesOrder(var SalesHeader: Record "Sales Header")
    var
        CreditLimitEvaluator: Codeunit "Credit Limit Evaluator";
        AuditMgt: Codeunit "Financial Audit Mgt.";
        CorrelationId: Guid;
    begin
        CorrelationId := AuditMgt.StartFinancialOperation('SALES_RELEASE', 'SalesHeader', SalesHeader."No.", 0);

        ValidateSalesHeader(SalesHeader);

        if not CreditLimitEvaluator.CanReleaseSalesOrder(SalesHeader) then begin
            AuditMgt.FailFinancialOperation(CorrelationId, 'Credit limit validation failed.');
            Error('Sales order %1 exceeds customer credit limit.', SalesHeader."No.");
        end;

        PerformRelease(SalesHeader);

        AuditMgt.CompleteFinancialOperation(CorrelationId, 'Sales order released successfully.');
    end;

    local procedure ValidateSalesHeader(var SalesHeader: Record "Sales Header")
    begin
        if SalesHeader.Status <> SalesHeader.Status::Open then
            Error('Only open sales orders can be released.');
    end;

    local procedure PerformRelease(var SalesHeader: Record "Sales Header")
    begin
        SalesHeader.Status := SalesHeader.Status::Released;
        SalesHeader.Modify(true);
    end;
}
```

Aquí la codeunit orquesta, pero no intenta resolver internamente todas las preocupaciones del dominio y la auditoría.

### Pattern 3: Codeunit de infraestructura para integración
```al
codeunit 50802 "Payment Provider Client"
{
    procedure SendPaymentInstruction(Payload: Text; CorrelationId: Guid)
    var
        Client: HttpClient;
        Response: HttpResponseMessage;
        Content: HttpContent;
        SecretProvider: Codeunit "Secure Secret Provider";
        Token: Text;
    begin
        Token := SecretProvider.GetApiToken('PAYMENT_API_TOKEN');

        Client.DefaultRequestHeaders().Add('Authorization', 'Bearer ' + Token);
        Client.DefaultRequestHeaders().Add('X-Correlation-Id', Format(CorrelationId));

        Content.WriteFrom(Payload);
        Client.Timeout := 10000;

        Client.Post('https://payments.contoso.com/api/instructions', Content, Response);

        if not Response.IsSuccessStatusCode() then
            Error('Payment provider returned HTTP %1.', Response.HttpStatusCode());
    end;
}
```

La codeunit se concentra en hablar con un sistema externo, no en decidir reglas financieras.

### Pattern 4: Codeunit de construcción de payload o transformación
Separar transformación de transporte mejora claridad.

```al
codeunit 50803 "Payment Payload Builder"
{
    procedure BuildPaymentInstruction(var PaymentHeader: Record "Payment Header"): Text
    var
        Json: JsonObject;
    begin
        Json.Add('paymentNo', PaymentHeader."No.");
        Json.Add('postingDate', Format(PaymentHeader."Posting Date"));
        Json.Add('amount', PaymentHeader.Amount);
        Json.Add('currencyCode', PaymentHeader."Currency Code");

        exit(Format(Json));
    end;
}
```

Esto evita que la codeunit HTTP tenga también lógica de modelado de payloads.

## Uso de interfaces para reducir acoplamiento
Cuando una extensión puede requerir múltiples implementaciones para la misma capacidad, una interfaz mejora muchísimo la mantenibilidad.

```al
interface 50810 "IPaymentDispatchService"
{
    procedure DispatchPayment(Payload: Text; CorrelationId: Guid);
}
```

Implementación concreta:

```al
codeunit 50811 "External Payment Dispatch" implements "IPaymentDispatchService"
{
    procedure DispatchPayment(Payload: Text; CorrelationId: Guid)
    var
        PaymentProviderClient: Codeunit "Payment Provider Client";
    begin
        PaymentProviderClient.SendPaymentInstruction(Payload, CorrelationId);
    end;
}
```

Esto permite cambiar implementación sin romper el código consumidor. También facilita test doubles.

## Errores y manejo de excepciones
Una codeunit mantenible no solo separa lógica; también maneja errores de forma explícita. El objetivo no es capturar todo silenciosamente, sino distinguir entre:

- validaciones funcionales;
- errores técnicos;
- errores transitorios;
- errores definitivos.

Ejemplo de tratamiento explícito:

```al
codeunit 50812 "Customer Sync Processor"
{
    procedure ProcessCustomerSync(CustomerNo: Code[20])
    var
        Customer: Record Customer;
    begin
        if not Customer.Get(CustomerNo) then
            Error('Customer %1 does not exist.', CustomerNo);

        if Customer.Blocked <> Customer.Blocked::" " then
            Error('Blocked customers cannot be synchronized.');

        ExecuteSync(Customer);
    end;

    local procedure ExecuteSync(var Customer: Record Customer)
    begin
        // lógica controlada de sincronización
    end;
}
```

La separación entre validación y ejecución mejora claridad y testabilidad.

## Qué no debería hacer una codeunit mantenible
Hay varios patrones que conviene evitar explícitamente:

### 1. God codeunit
Una sola codeunit que:

- lee setup;
- valida negocio;
- llama APIs;
- registra logs;
- maneja colas;
- calcula importes;
- actualiza múltiples tablas.

Ese objeto se vuelve inmantenible rápidamente.

### 2. Procedimientos con side effects ocultos
Si `CalculatePrice()` además modifica staging, escribe auditoría y dispara integración, el nombre ya no refleja el comportamiento.

### 3. Uso intensivo de variables globales
Una codeunit donde muchos métodos dependen de estado interno mutable se vuelve difícil de razonar y probar.

### 4. Reutilización indiscriminada
No toda lógica común debe ir a una “utility codeunit”. Muchas veces eso genera un repositorio caótico de helpers sin cohesión. La reutilización debe respetar contexto de dominio.

## Organización y naming
Los nombres de las codeunits importan. Deberían expresar rol, no solo tema genérico.

Peor:

- `GeneralManagement`
- `CommonFunctions`
- `CustomerOperations`

Mejor:

- `Credit Limit Evaluator`
- `Sales Release Orchestrator`
- `Payment Payload Builder`
- `Customer Sync Validator`

El nombre correcto ayuda a mantener fronteras.

## Buenas prácticas para testabilidad
Si una codeunit es mantenible, normalmente también es más fácil de testear. Algunas reglas útiles:

- mantener procedimientos pequeños;
- separar cálculo de persistencia;
- separar transformación de transporte;
- preferir dependencias explícitas;
- encapsular infraestructura en codeunits específicas;
- usar interfaces donde haya variantes.

Una codeunit imposible de testear suele estar mal diseñada incluso si “funciona”.

## Anti-patterns críticos
- codeunits monolíticas con múltiples responsabilidades;
- mezcla de negocio, integración y logging en el mismo procedimiento;
- variables globales compartidas por toda la lógica;
- procedimientos largos con múltiples side effects;
- servicios “utility” sin cohesión;
- ausencia de interfaces donde hay múltiples implementaciones posibles;
- nombres genéricos sin intención arquitectónica;
- acoplamiento fuerte entre codeunits por llamadas directas en cascada.

## Buenas prácticas
- Diseñar cada codeunit alrededor de una responsabilidad dominante.
- Separar dominio, aplicación e infraestructura.
- Mantener procedimientos pequeños y con intención clara.
- Reducir estado global y side effects implícitos.
- Encapsular integración, payload building y auditoría en objetos distintos.
- Usar interfaces cuando la capacidad pueda variar.
- Nombrar las codeunits según lo que realmente hacen.
- Pensar en evolución y testabilidad desde el inicio.

## Conclusiones
Construir codeunits mantenibles en Business Central SaaS no consiste en escribir menos código, sino en diseñar mejores fronteras. Una codeunit mantenible es aquella cuya responsabilidad se entiende rápido, cuyas dependencias son controladas, cuyo comportamiento es predecible y cuya evolución no exige reescribir media extensión cada vez que cambia el negocio.

En soluciones empresariales reales, donde el tiempo no se pierde escribiendo la primera versión sino manteniendo la décima, esta diferencia es decisiva. Las extensiones que escalan bien suelen compartir un patrón común: el código está organizado alrededor de responsabilidades claras y no de urgencias acumuladas. Dominar ese principio en codeunits es una de las señales más claras de madurez técnica dentro del ecosistema Business Central.