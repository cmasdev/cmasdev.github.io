---
layout: post
title: "BC: Patrones de diseño de tablas avanzados en AL"
author: Christian Amado
date: 2025-12-17 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, el diseño de tablas no es una tarea mecánica ni una decisión menor de modelado. La estructura de una tabla define no solo cómo se almacenan los datos, sino también cómo se comportan la integridad del sistema, el rendimiento bajo carga, la mantenibilidad del código AL, la capacidad de evolución de la extensión y la coherencia del dominio funcional. En soluciones empresariales reales, una tabla mal diseñada puede convertirse en el origen de problemas de locking, duplicación de datos, crecimiento descontrolado, dificultad de integración y lógica de negocio inconsistente.

A diferencia de otros entornos donde el equipo puede intervenir directamente sobre SQL Server, crear índices manuales complejos o ajustar almacenamiento desde infraestructura, en Business Central SaaS la mayoría de las decisiones de persistencia debe resolverse desde el modelo AL. Eso significa que la definición de claves, la elección entre tablas normales, temporales o de staging, la segmentación de entidades, la clasificación de datos y el modelado de relaciones tiene un peso arquitectónico mucho mayor que en otros stacks.

<!--more-->
Además, Business Central no es un framework genérico de persistencia. Está construido alrededor de procesos empresariales fuertemente estructurados. Por ello, una tabla no debe diseñarse solo para guardar datos, sino para soportar un caso de uso operacional claro, integrarse con posting, reportes, APIs, auditoría y procesos batch sin distorsionar el modelo funcional del sistema. Ese es precisamente el punto en el que los patrones avanzados de diseño de tablas comienzan a marcar diferencia.

## El problema
El error más común en extensiones de Business Central es diseñar tablas pensando únicamente en la necesidad inmediata. Se crean estructuras que funcionan para la primera pantalla, el primer reporte o la primera integración, pero no para el crecimiento del dominio. Ese enfoque produce varios anti-patterns recurrentes.

El primero es la tabla “cajón de sastre”: una sola tabla donde se mezclan estados, parámetros, datos transaccionales, flags de integración y campos auxiliares que en realidad pertenecen a bounded contexts distintos. Este diseño reduce claridad, complica validaciones y vuelve impredecible la evolución funcional.

El segundo es el abuso de tablas planas sin modelo explícito de cabecera y líneas. Esto suele aparecer cuando una entidad compleja se guarda como una colección desestructurada de registros sin separación entre encabezado, detalle y tracking operativo. Inicialmente parece simple, pero luego dificulta reportes, filtros, procesos de aprobación y trazabilidad.

El tercero es diseñar claves deficientes. Muchas tablas personalizadas terminan con una sola primary key artificial y sin claves secundarias alineadas a los patrones reales de lectura. En volúmenes bajos puede no notarse. En producción, bajo filtros frecuentes y procesamiento batch, el costo aparece de inmediato.

También es muy común usar tablas productivas para staging, logs, colas y datos de negocio al mismo tiempo. Esto contamina el dominio, complica seguridad y degrada performance. Cada tipo de tabla debería tener un propósito bien definido.

Finalmente, muchas extensiones ignoran aspectos de evolución. Se diseñan tablas sin considerar versionado funcional, crecimiento de cardinalidad, archivado, exposición por API, multi-company behavior o soporte para integración. El resultado es una estructura rígida que se vuelve costosa de modificar a medida que el producto madura.

## Principios de diseño avanzado
### Diseñar por intención de negocio
Toda tabla debe responder una pregunta clara: qué representa en el dominio. Una tabla no debería existir solo porque hacía falta guardar algo. Debe tener una responsabilidad explícita.

Ejemplos de intención correcta:

- representar un documento interno de control;
- registrar una cola de integración;
- almacenar snapshots de auditoría;
- persistir reglas configurables de pricing;
- mantener estado de procesamiento de una entidad.

Cuando la intención no está clara, la tabla suele terminar acumulando responsabilidades incompatibles.

### Separar tablas transaccionales, de configuración y operativas
Un patrón muy útil es distinguir explícitamente entre:

- tablas de configuración;
- tablas de negocio;
- tablas de staging;
- tablas de cola;
- tablas de auditoría.

Cada una tiene patrones de acceso, crecimiento y seguridad distintos.

Por ejemplo, una tabla de configuración suele tener pocos registros, lecturas frecuentes y cambios raros. Una tabla de cola tiene crecimiento rápido, alto churn y necesidades de cleanup. Una tabla transaccional puede requerir relaciones con cabecera y líneas, integridad funcional y soporte de reporting. Mezclar estas necesidades en una sola estructura es casi siempre un error.

### Modelar cabecera y línea cuando la entidad lo exige
Si una entidad tiene identidad documental, agrupación lógica, estado general y detalle repetible, normalmente debería modelarse con patrón header/line.

Ejemplo de cabecera:

```al
table 50700 "Payment Control Header"
{
    DataClassification = CustomerContent;

    fields
    {
        field(1; "No."; Code[20])
        {
            DataClassification = CustomerContent;
        }
        field(2; "Document Date"; Date)
        {
            DataClassification = CustomerContent;
        }
        field(3; Status; Enum "Payment Control Status")
        {
            DataClassification = CustomerContent;
        }
        field(4; "Created By"; Code[50])
        {
            DataClassification = SystemMetadata;
        }
        field(5; "Created At"; DateTime)
        {
            DataClassification = SystemMetadata;
        }
    }

    keys
    {
        key(PK; "No.")
        {
            Clustered = true;
        }

        key(K1; Status, "Document Date")
        {
        }
    }
}
```

Ejemplo de líneas:

```al
table 50701 "Payment Control Line"
{
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Document No."; Code[20])
        {
            DataClassification = CustomerContent;
            TableRelation = "Payment Control Header"."No.";
        }
        field(2; "Line No."; Integer)
        {
            DataClassification = SystemMetadata;
        }
        field(3; "Vendor No."; Code[20])
        {
            DataClassification = CustomerContent;
            TableRelation = Vendor."No.";
        }
        field(4; Amount; Decimal)
        {
            DataClassification = CustomerContent;
        }
        field(5; "Due Date"; Date)
        {
            DataClassification = CustomerContent;
        }
    }

    keys
    {
        key(PK; "Document No.", "Line No.")
        {
            Clustered = true;
        }

        key(K1; "Vendor No.", "Due Date")
        {
        }
    }
}
```

Este patrón facilita estado global en cabecera y granularidad operativa en líneas.

### Elegir claves según patrones reales de lectura
Una tabla bien diseñada no solo necesita primary key. Necesita claves secundarias que reflejen cómo se va a consultar en producción.

Si una cola se procesa por estado y fecha, una clave útil puede ser:

```al
key(K1; Status, "Created At")
{
}
```

Si una entidad se busca recurrentemente por identificador externo, ese campo debe aparecer en una key específica. El objetivo no es agregar claves indiscriminadamente, sino construir las necesarias para los patrones dominantes de acceso.

### Introducir identificadores técnicos solo cuando agregan valor
No toda tabla necesita SystemId visible, Entry No. autoincremental y No. Series simultáneamente. Cada identificador debe tener propósito.

- `No.` suele ser útil cuando la entidad es documental o visible al usuario.
- `Entry No.` suele ser adecuado para logs, colas, staging y auditoría.
- identificadores externos deben usarse cuando la integración lo exige.
- SystemId ya existe, pero no siempre debe ser la identidad de negocio principal.

Un mal patrón es mezclar múltiples identificadores sin definir cuál gobierna la relación funcional.

## Patrones avanzados de tabla
### Staging table pattern
Las tablas de staging son fundamentales cuando se reciben datos externos o se procesan lotes complejos. No deben confundirse con tablas finales de negocio.

```al
table 50710 "Customer Import Staging"
{
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Entry No."; Integer)
        {
            AutoIncrement = true;
        }
        field(2; "External Customer Id"; Code[50])
        {
        }
        field(3; Payload; Blob)
        {
        }
        field(4; Status; Option)
        {
            OptionMembers = Pending,Validated,Processed,Failed;
        }
        field(5; "Error Message"; Text[250])
        {
        }
        field(6; "Created At"; DateTime)
        {
        }
    }

    keys
    {
        key(PK; "Entry No.")
        {
            Clustered = true;
        }

        key(K1; Status, "Created At")
        {
        }

        key(K2; "External Customer Id")
        {
        }
    }
}
```

Ventajas de este patrón:

- desacopla recepción de procesamiento;
- mejora observabilidad;
- facilita retries;
- evita contaminar tablas de negocio con datos incompletos.

### Queue table pattern
Una cola no debe modelarse como una tabla de negocio general. Debe incluir estado, reintentos, correlation id y metadata operativa.

```al
table 50720 "Integration Queue Entry"
{
    DataClassification = SystemMetadata;

    fields
    {
        field(1; "Entry No."; BigInteger)
        {
            AutoIncrement = true;
        }
        field(2; "Integration Type"; Code[30])
        {
        }
        field(3; "Entity Type"; Code[30])
        {
        }
        field(4; "Entity No."; Code[50])
        {
        }
        field(5; Status; Option)
        {
            OptionMembers = Pending,Processing,Completed,Failed;
        }
        field(6; "Retry Count"; Integer)
        {
        }
        field(7; "Next Attempt At"; DateTime)
        {
        }
        field(8; "Correlation ID"; Guid)
        {
        }
        field(9; Payload; Blob)
        {
        }
    }

    keys
    {
        key(PK; "Entry No.")
        {
            Clustered = true;
        }

        key(K1; Status, "Next Attempt At")
        {
        }

        key(K2; "Correlation ID")
        {
        }
    }
}
```

Este patrón permite background processing seguro y observable.

### Snapshot table pattern
Cuando se necesita trazabilidad o auditoría avanzada, conviene persistir snapshots resumidos en una tabla separada.

```al
table 50730 "Document Snapshot"
{
    DataClassification = CustomerContent;

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
        field(4; "Snapshot Type"; Code[30])
        {
        }
        field(5; "Captured At"; DateTime)
        {
        }
        field(6; Payload; Blob)
        {
        }
        field(7; "Correlation ID"; Guid)
        {
        }
    }

    keys
    {
        key(PK; "Entry No.")
        {
            Clustered = true;
        }

        key(K1; "Entity Type", "Entity No.", "Captured At")
        {
        }
    }
}
```

Esto evita sobrecargar tablas transaccionales con información histórica o semiestructurada.

### Configuration header/detail pattern
Cuando una configuración tiene complejidad real, no conviene meter todo en una sola tabla de setup con decenas de campos. Si el dominio incluye reglas múltiples, prioridades, tipos y vigencias, es mejor modelarlo como cabecera y detalle o como conjuntos configurables.

Ejemplo: reglas de descuento, asignación por canal, mapeos de integración, matrices de validación.

## Decisiones de DataClassification
Un aspecto frecuentemente ignorado es el DataClassification. En extensiones maduras, esto no debería dejarse genérico o sin definir.

```al
field(10; "Customer E-Mail"; Text[100])
{
    DataClassification = CustomerContent;
}
```

```al
field(20; "Created By"; Code[50])
{
    DataClassification = SystemMetadata;
}
```

```al
field(30; "API Secret Name"; Text[100])
{
    DataClassification = SystemMetadata;
}
```

Clasificar correctamente no resuelve toda la seguridad, pero ayuda a gobernanza, cumplimiento y análisis posterior.

## Triggers y lógica de tabla
Un patrón avanzado importante es mantener la tabla como guardián de invariantes básicos, no como contenedor de procesos complejos. Los triggers OnInsert, OnModify, OnDelete y OnRename deben proteger consistencia local, no convertirse en motores de negocio descontrolados.

Ejemplo válido:

```al
trigger OnInsert()
begin
    if "Created At" = 0DT then
        "Created At" := CurrentDateTime();

    if "Created By" = '' then
        "Created By" := UserId();
end;
```

Ejemplo riesgoso:

- llamar APIs externas;
- recorrer grandes volúmenes;
- disparar procesos batch completos;
- modificar múltiples entidades no relacionadas.

La tabla debe validar su integridad, no orquestar el sistema completo.

## Integridad y TableRelation
Las relaciones explícitas ayudan a consistencia, experiencia de usuario y mantenibilidad. No deben omitirse sin razón.

```al
field(3; "Customer No."; Code[20])
{
    TableRelation = Customer."No.";
}
```

Pero también hay que usarlas con criterio. Si una relación depende de contexto, tipo o subtipo, a veces conviene usar validación adicional en código.

## Anti-patterns críticos
Hay varios errores recurrentes que conviene evitar:

- usar una sola tabla para configuración, negocio, staging y logging;
- crear tablas sin claves secundarias alineadas a patrones de lectura;
- llenar tablas transaccionales con campos operativos temporales;
- abusar de BLOBs cuando el dato debería estar normalizado;
- poner demasiada lógica de proceso en triggers de tabla;
- no definir DataClassification;
- usar Entry No. como reemplazo de una identidad de negocio visible cuando la entidad sí requiere `No.`;
- modelar entidades documentales complejas como una tabla plana sin líneas.

## Buenas prácticas
- Definir el propósito de la tabla antes de definir campos.
- Separar tipos de tabla por responsabilidad.
- Diseñar claves según acceso real, no por intuición.
- Mantener triggers enfocados en invariantes locales.
- Usar tablas de staging y cola para procesos operativos.
- Modelar header/line cuando el dominio lo requiere.
- Revisar crecimiento esperado y volumen antes de cerrar el diseño.
- Pensar en integración, reporting, seguridad y auditoría desde la estructura.

## Conclusiones
El diseño avanzado de tablas en Business Central SaaS es una disciplina de arquitectura, no un paso mecánico de desarrollo. Una tabla bien diseñada facilita performance, integridad, evolución funcional, seguridad y observabilidad. Una tabla mal diseñada, en cambio, obliga a compensar con código, procesos batch, workarounds y estructuras paralelas que terminan encareciendo toda la solución.

Los mejores diseños suelen compartir una característica: cada tabla tiene una responsabilidad clara, una identidad coherente, claves alineadas a sus patrones de uso y un papel explícito dentro del modelo del dominio. Cuando eso ocurre, el resto de la arquitectura se vuelve más simple, más estable y más sostenible.

En soluciones empresariales reales, dominar estos patrones es una de las habilidades que más claramente separan a quien solo agrega campos de quien realmente diseña sistemas sobre Business Central.