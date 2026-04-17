---
layout: post
title: "BC: Gestión de la coherencia de los datos en todos los procesos empresariales"
author: Christian Amado
date: 2026-01-28 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La consistencia de datos en Microsoft Dynamics 365 Business Central SaaS no es un concepto abstracto reservado para teoría de bases de datos. Es una preocupación operativa diaria que impacta documentos, ledger entries, integraciones, procesos batch, colas, reportes y, en última instancia, la confianza que la organización deposita en el ERP. En un sistema empresarial real, la pregunta no es simplemente si un dato existe, sino si ese dato refleja correctamente el estado del negocio en todos los puntos donde debería reflejarse.

En Business Central, esta cuestión es especialmente delicada porque la plataforma combina procesos transaccionales muy estructurados con extensibilidad, eventos, integraciones externas, automatizaciones y múltiples capas de lógica custom. El sistema estándar protege muchos escenarios críticos, sobre todo alrededor de posting y entidades financieras principales. Sin embargo, cada extensión personalizada introduce nuevas posibilidades de inconsistencia si no se diseña con disciplina.

<!--more-->
La inconsistencia no siempre se manifiesta como corrupción evidente. A veces aparece como una diferencia pequeña pero costosa: un documento marcado como procesado aunque la integración falló, una tabla de control que no refleja el verdadero estado del journal, una entidad maestra que cambió en un sistema pero no en otro, una cola que reintenta operaciones ya completadas, o una regla de negocio que se aplicó en la UI pero no en la API. Ese tipo de problemas no suele verse en demos, pero en producción erosiona rápidamente la confiabilidad del sistema.

En SaaS, además, el desarrollador no controla directamente la base de datos subyacente ni puede corregir fácilmente desde abajo comportamientos inconsistentes. La consistencia debe diseñarse desde el modelo de datos, la orquestación de procesos, la estructura de transacciones, la idempotencia, la integración y la trazabilidad. En otras palabras, gestionar consistencia de datos en Business Central es una responsabilidad arquitectónica, no una simple validación puntual.

## El problema
Los problemas de consistencia suelen surgir cuando se asume que el sistema completo se comporta como una única transacción homogénea, incluso cuando la solución ya opera de forma distribuida. Mientras un proceso estándar de posting puede mantener atomicidad dentro de su contexto, una extensión que agrega colas, eventos, snapshots, APIs, microservicios o procesos batch ya no puede confiar en que todo se resolverá junto de forma implícita.

Uno de los anti-patterns más comunes es actualizar múltiples estructuras relacionadas sin una estrategia explícita de consistencia. Por ejemplo:

- se modifica un documento y luego se actualiza una tabla custom de tracking;
- se registra un evento de integración pero no se garantiza que coincida con el resultado real del proceso;
- se escribe en una tabla de staging y luego se intenta sincronizar con otra entidad sin modelar estados intermedios;
- se aplican validaciones en página, pero no en API ni en Job Queue.

El resultado es una solución donde cada componente parece correcto en aislamiento, pero el sistema global empieza a divergir.

Otro problema frecuente es asumir que toda inconsistencia debe resolverse con más commits o, en el extremo opuesto, intentar mantener una única transacción gigante para todo. Ambos enfoques son peligrosos. Transacciones largas generan locking y fragilidad operativa. Commits mal ubicados pueden dejar el sistema en estados parciales imposibles de explicar o recuperar fácilmente.

También existe un problema de semántica. Muchas implementaciones no distinguen entre consistencia estricta dentro del dominio central del ERP, consistencia eventual en procesos distribuidos, consistencia de lectura, consistencia de integración y consistencia de auditoría. Sin esa distinción, se terminan aplicando expectativas incorrectas a distintos tipos de proceso. Un ledger entry exige garantías diferentes a una cola de sincronización externa.

## Qué significa consistencia en Business Central
Hablar de consistencia en Business Central implica varias dimensiones distintas.

### Consistencia transaccional
Es la que aplica cuando una operación debe completarse como unidad indivisible. El ejemplo clásico es el posting. Si falla un paso crítico, no deberían quedar efectos parciales en el resultado contable.

### Consistencia de dominio
Significa que las reglas del negocio se mantienen válidas. Por ejemplo, no debería existir un documento liberado que no cumpla las reglas necesarias para liberación, ni una cabecera en estado final con líneas todavía inconsistentes.

### Consistencia entre estructuras relacionadas
Cuando una entidad principal y una estructura auxiliar deben reflejar el mismo hecho de negocio, debe existir una estrategia clara para mantenerlas alineadas. Por ejemplo:

- documento y tabla de control;
- registro financiero y snapshot de auditoría;
- entidad maestra y estado de sincronización.

### Consistencia eventual
En integraciones, colas y procesos distribuidos, muchas veces no se puede exigir consistencia inmediata. En esos casos, la solución debe definir cómo se alcanza consistencia eventual, cómo se detectan desvíos y cómo se reconcilian.

### Consistencia de lectura

Un usuario o sistema no debería obtener resultados contradictorios según el canal desde el cual consulta. Si la API y la UI muestran estados distintos porque aplican reglas diferentes, hay un problema de consistencia funcional.

## Principios de diseño
### Definir invariantes explícitos
Una solución mantenible sabe qué condiciones deben ser siempre ciertas. Ejemplos:

- una cabecera aprobada no puede tener líneas inválidas;
- una operación marcada como completada debe tener evidencia de su ejecución;
- una entidad sincronizada debe conocer qué versión o timestamp fue procesado;
- un documento registrado no puede volver a un estado editable.

Si esas invariantes no están definidas, no hay forma de diseñar consistencia alrededor de ellas.

### No mezclar consistencia fuerte con integración distribuida sin estrategia
Dentro del núcleo transaccional de BC, se puede y se debe exigir consistencia fuerte en muchos casos. Pero cuando un proceso involucra sistemas externos, colas o microservicios, la arquitectura debe pasar a un modelo de consistencia eventual con control explícito.

### Diseñar estados intermedios
Una gran fuente de inconsistencia aparece cuando el sistema solo conoce dos estados: no procesado y procesado. En realidad, muchos procesos necesitan estados intermedios:

- Pending
- Processing
- Completed
- Failed
- Rejected

Ese modelado permite entender qué ocurrió y evita ambigüedades.

### Usar idempotencia donde haya reintentos
Si una operación puede reintentarse, debe poder ejecutarse varias veces sin generar inconsistencias adicionales.

### Mantener la verdad de negocio en un solo lugar
Cuando varias tablas o varios sistemas parecen ser la fuente principal de verdad para la misma entidad, la consistencia se vuelve frágil. Debe existir un owner claro por cada hecho relevante.

## Patrones útiles
### Estado explícito en tablas operativas
Una tabla auxiliar de proceso debería modelar claramente el ciclo de vida de la operación.

```al
table 51300 "Sync Control Entry"
{
    DataClassification = SystemMetadata;

    fields
    {
        field(1; "Entry No."; BigInteger)
        {
            AutoIncrement = true;
        }
        field(2; "Entity Type"; Code[30])
        {
        }
        field(3; "Entity No."; Code[50])
        {
        }
        field(4; Status; Option)
        {
            OptionMembers = Pending,Processing,Completed,Failed;
        }
        field(5; "Last Attempt At"; DateTime)
        {
        }
        field(6; "Last Successful Version"; DateTime)
        {
        }
        field(7; "Retry Count"; Integer)
        {
        }
        field(8; "Correlation ID"; Guid)
        {
        }
    }

    keys
    {
        key(PK; "Entry No.")
        {
            Clustered = true;
        }

        key(K1; "Entity Type", "Entity No.")
        {
        }

        key(K2; Status, "Last Attempt At")
        {
        }
    }
}
```

Este patrón reduce ambigüedad. Una entidad no está simplemente sincronizada o no; está en un estado operativo explícito.

### Validación de invariantes en un servicio de dominio
```al
codeunit 51301 "Payment Control Consistency"
{
    procedure ValidateHeaderAndLines(var Header: Record "Payment Control Header")
    var
        Line: Record "Payment Control Line";
    begin
        if Header.Status = Header.Status::Released then begin
            Line.SetRange("Document No.", Header."No.");
            if not Line.FindFirst() then
                Error('Released payment controls must contain at least one line.');
        end;
    end;

    procedure ValidateLineBelongsToOpenHeader(var Line: Record "Payment Control Line")
    var
        Header: Record "Payment Control Header";
    begin
        if not Header.Get(Line."Document No.") then
            Error('Header %1 does not exist.', Line."Document No.");

        if Header.Status <> Header.Status::Open then
            Error('Lines can only be modified while header %1 is open.', Header."No.");
    end;
}
```

Aquí la consistencia del dominio no depende de una página específica. Vive en un servicio reusable.

### Aplicación controlada de estados en colas
```al
codeunit 51302 "Sync Processor"
{
    procedure ProcessNextPendingEntry()
    var
        SyncEntry: Record "Sync Control Entry";
    begin
        SyncEntry.SetRange(Status, SyncEntry.Status::Pending);

        if not SyncEntry.FindFirst() then
            exit;

        SyncEntry.Status := SyncEntry.Status::Processing;
        SyncEntry."Last Attempt At" := CurrentDateTime();
        SyncEntry.Modify(true);

        if TryExecuteSync(SyncEntry) then begin
            SyncEntry.Status := SyncEntry.Status::Completed;
            SyncEntry."Last Successful Version" := CurrentDateTime();
        end else begin
            SyncEntry.Status := SyncEntry.Status::Failed;
            SyncEntry."Retry Count" += 1;
        end;

        SyncEntry.Modify(true);
    end;

    local procedure TryExecuteSync(var SyncEntry: Record "Sync Control Entry"): Boolean
    begin
        exit(true);
    end;
}
```

Este diseño evita operaciones mágicamente exitosas. Todo queda modelado y rastreable.

### Snapshot de consistencia para auditoría o reconciliación
Cuando una operación crítica termina, puede ser útil guardar un snapshot resumido que sirva para reconciliar posteriormente el estado.

```al
procedure PersistConsistencySnapshot(EntityType: Code[30]; EntityNo: Code[50]; StatusText: Text; CorrelationId: Guid)
var
    Snapshot: Record "Document Snapshot";
    OutS: OutStream;
begin
    Snapshot.Init();
    Snapshot."Entity Type" := EntityType;
    Snapshot."Entity No." := EntityNo;
    Snapshot."Snapshot Type" := 'CONSISTENCY';
    Snapshot."Captured At" := CurrentDateTime();
    Snapshot."Correlation ID" := CorrelationId;
    Snapshot.Payload.CreateOutStream(OutS);
    OutS.WriteText(StatusText);
    Snapshot.Insert();
end;
```

Esto no reemplaza el dominio principal, pero ayuda a reconstruir o conciliar procesos.

## Consistencia en procesos de escritura
Una regla útil es distinguir entre:

- escritura del dominio principal;
- escritura auxiliar;
- escritura externa.

Si una operación impacta el dominio principal y además genera efectos secundarios, conviene decidir qué parte debe quedar dentro de la transacción principal y qué parte debe desacoplarse.

Ejemplo incorrecto:

- actualizar documento;
- llamar API externa;
- registrar cola;
- escribir auditoría;
- cambiar estado auxiliar;

todo dentro de una secuencia poco clara y dependiente de fallos externos.

Ejemplo mejor:

- consolidar primero la operación del dominio principal;
- luego registrar intención de efectos secundarios;
- procesar integración fuera del flujo crítico si la naturaleza del proceso lo permite.

Esto no elimina la necesidad de consistencia, pero la vuelve gobernable.

## Consistencia en integraciones
Una integración no debe asumir consistencia inmediata total salvo que el proceso esté diseñado para ello. En la mayoría de escenarios BC y sistemas externos, el modelo correcto es eventual consistency con mecanismos de control:

- idempotencia;
- control de versión o timestamp;
- estado de procesamiento;
- reconciliación;
- reintentos seguros.

Ejemplo de protección por versión:

```al
procedure ApplyExternalCustomerState(CustomerNo: Code[20]; ExternalModifiedAt: DateTime)
var
    Customer: Record Customer;
begin
    if not Customer.Get(CustomerNo) then
        Error('Customer %1 does not exist.', CustomerNo);

    if ExternalModifiedAt < Customer."Last Modified Date Time" then
        Error('Incoming state is older than current Business Central data.');

    // aplicar actualización segura
end;
```

El sistema protege su consistencia temporal en lugar de aceptar ciegamente cualquier input.

## Anti-patterns críticos
Hay varios errores que suelen destruir consistencia:

- usar commits sin una estrategia clara;
- asumir que una integración externa forma parte de la misma atomicidad que el dominio interno;
- no modelar estados intermedios;
- duplicar la verdad entre varias tablas o sistemas;
- dejar validaciones de consistencia en páginas y no en servicios reutilizables;
- permitir que APIs y batch usen reglas distintas a la UI;
- no registrar correlation ids ni metadata suficiente;
- usar tablas auxiliares sin relación clara con el proceso de negocio.

## Buenas prácticas
- Definir invariantes explícitas del dominio.
- Separar consistencia fuerte de consistencia eventual.
- Modelar estados operativos explícitos.
- Usar servicios de dominio para validaciones consistentes.
- Aplicar idempotencia en procesos reintentables.
- Diseñar ownership claro de los datos.
- Persistir evidencia cuando el proceso lo requiera.
- Construir reconciliación y observabilidad para procesos distribuidos.

## Conclusiones
Gestionar consistencia de datos en Business Central SaaS no significa intentar que todo ocurra dentro de una única gran transacción. Significa entender qué parte del sistema exige consistencia fuerte, qué parte puede operar con consistencia eventual y qué mecanismos deben introducirse para que el conjunto siga representando correctamente el estado del negocio.

Las soluciones que no modelan esta diferencia suelen terminar en estados ambiguos, integraciones frágiles, tablas auxiliares poco confiables y reglas inconsistentes entre canales. En cambio, cuando el dominio define sus invariantes, las estructuras operativas modelan sus estados y las integraciones aceptan explícitamente su naturaleza distribuida, la solución se vuelve mucho más confiable y sostenible.

En entornos empresariales reales, la consistencia no es una propiedad accidental. Es el resultado de decisiones de diseño repetidas y coherentes a lo largo de todo el sistema.