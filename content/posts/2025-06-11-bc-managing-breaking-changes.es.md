---
layout: post
title: "BC: Gestión de cambios importantes en distintas versiones"
author: Christian Amado
date: 2025-06-11 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Business Central SaaS, uno de los mayores desafíos para ISVs y
equipos de desarrollo no es simplemente agregar nuevas funcionalidades,
sino gestionar correctamente la evolución del sistema sin romper lo que
ya funciona. A diferencia de aplicaciones internas donde los cambios
pueden controlarse completamente, en SaaS las extensiones conviven con
múltiples versiones del sistema base y, en muchos casos, con otras
extensiones de terceros.

Microsoft introduce cambios frecuentes en cada release: nuevos campos,
eventos, modificaciones en objetos estándar e incluso eliminación de
comportamientos antiguos. Esto obliga a los desarrolladores a diseñar
extensiones que no solo funcionen hoy, sino que puedan evolucionar sin
generar fallos en producción.

<!--more-->
En este contexto, los **breaking changes** se convierten en un problema
central de arquitectura. Un breaking change no es solo un cambio
técnico: es un cambio que rompe contratos existentes, afecta
integraciones o invalida lógica previamente implementada.

## El problema
El problema más crítico ocurre cuando se introducen cambios
incompatibles sin una estrategia clara. Algunos ejemplos reales
incluyen:

-   eliminación de campos utilizados por otras extensiones\
-   cambio en firmas de métodos o eventos\
-   modificación del comportamiento de procesos críticos\
-   cambios en estructuras de tablas sin migración de datos

Estos cambios pueden provocar:

-   errores en runtime difíciles de detectar\
-   fallos en integraciones externas\
-   pérdida de datos\
-   imposibilidad de actualizar clientes existentes

En escenarios ISV, el impacto es aún mayor. Un cambio incorrecto puede
afectar a múltiples clientes simultáneamente, generando incidentes en
producción y pérdida de confianza en el producto.

## Diseño de la solución
Gestionar breaking changes correctamente requiere una estrategia basada
en tres pilares:

**1. Backward compatibility**
Siempre que sea posible, los cambios deben ser compatibles hacia atrás.
Esto implica:

-   mantener interfaces existentes\
-   evitar eliminar funcionalidades directamente\
-   introducir nuevas versiones de métodos en lugar de modificar los
    existentes

**2. Deprecación progresiva**
Antes de eliminar una funcionalidad, debe marcarse como obsoleta:

-   informar a los consumidores\
-   mantener compatibilidad temporal\
-   eliminar en versiones futuras

Esto permite migraciones controladas.

**3. Migración de datos y schema evolution**
Cuando los cambios afectan estructuras de datos, es necesario
implementar procesos de migración. Esto incluye:

-   trasladar datos entre campos\
-   mantener consistencia histórica\
-   evitar pérdida de información

Además, es importante versionar correctamente estos cambios para poder
gestionarlos en distintos clientes.

## Implementación en AL
Ejemplo de deprecación:

``` al
[Obsolete('Use NewCalculate method', '2.0')]
procedure OldCalculate()
begin
end;
```

Nueva implementación:

``` al
procedure NewCalculate()
begin
    // nueva lógica
end;
```

Ejemplo de migración de datos en upgrade codeunit:

``` al
codeunit 50150 UpgradeHandler
{
    Subtype = Upgrade;

    trigger OnUpgradePerCompany()
    var
        OldRec: Record Customer;
    begin
        if OldRec.FindSet() then
            repeat
                // lógica de migración
            until OldRec.Next() = 0;
    end;
}
```

Este patrón permite adaptar datos existentes a nuevas estructuras.

## Buenas prácticas
-   evitar eliminar funcionalidades directamente\
-   usar `Obsolete` antes de remover código\
-   mantener compatibilidad hacia atrás\
-   implementar upgrade codeunits para migraciones\
-   probar upgrades en sandbox con datos reales\
-   documentar breaking changes claramente

## Conclusiones
Gestionar breaking changes en Business Central SaaS es uno de los
desafíos más complejos del desarrollo de extensiones. No se trata solo
de escribir código nuevo, sino de garantizar que el sistema pueda
evolucionar sin romper lo existente.

Las soluciones que ignoran este aspecto terminan generando sistemas
inestables, difíciles de actualizar y con alto riesgo en producción. Por
el contrario, una estrategia basada en backward compatibility,
deprecación progresiva y migración controlada permite construir
aplicaciones robustas y sostenibles.

Para ISVs, dominar este aspecto es clave: es la diferencia entre un
producto que escala correctamente y uno que se vuelve inmanejable con el
tiempo.