---
layout: post
title: "BC: Estrategias de control de versiones para extensiones SaaS"
author: Christian Amado
date: 2025-05-21 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Business Central SaaS, el versionado de extensiones no es únicamente
una práctica de orden, sino un componente crítico de la arquitectura del
producto, especialmente para ISVs que distribuyen soluciones a múltiples
clientes.

A diferencia de sistemas tradicionales donde las actualizaciones pueden
controlarse manualmente, en SaaS las extensiones evolucionan dentro de
un ecosistema donde conviven múltiples versiones del sistema base, otras
aplicaciones y dependencias externas. Esto obliga a definir estrategias
de versionado que permitan evolucionar el producto sin romper
instalaciones existentes.

<!--more-->
El archivo `app.json` define la versión de la extensión, pero el
verdadero desafío no es técnico, sino estratégico: cómo evolucionar la
aplicación manteniendo compatibilidad hacia atrás, evitando bloqueos en
despliegues y permitiendo actualizaciones progresivas.

## El problema
Uno de los errores más comunes es tratar el versionado como un simple
incremento numérico sin una estrategia clara. Esto genera varios
problemas en producción:

-   incompatibilidad entre extensiones relacionadas\
-   fallos al instalar nuevas versiones en clientes existentes\
-   dificultad para rollback en caso de error\
-   pérdida de control sobre cambios introducidos

Un problema crítico aparece cuando se introducen cambios incompatibles
(breaking changes) sin control. Por ejemplo:

-   eliminar campos usados por otras extensiones\
-   modificar firmas de eventos\
-   cambiar comportamiento de procesos sin versionado adecuado

En escenarios ISV, esto puede significar que una actualización deje
inoperativo el sistema de un cliente.

## Diseño de la solución
Una estrategia sólida de versionado debe basarse en **versionado
semántico (SemVer)**:

``` text
Major.Minor.Patch
```

-   **Major**: cambios incompatibles\
-   **Minor**: nuevas funcionalidades compatibles\
-   **Patch**: correcciones

Además, es clave diferenciar entre:

**Breaking changes vs Non-breaking changes**
Un cambio es breaking si requiere modificar código consumidor. Estos
deben planificarse cuidadosamente y, en muchos casos, evitarse.

Otra estrategia importante es el uso de **deprecación progresiva**:

-   marcar funcionalidades como obsoletas (`ObsoleteState`)
-   mantener compatibilidad temporal
-   eliminar en versiones futuras

Esto permite a los consumidores adaptarse gradualmente.

## Implementación en AL
Ejemplo de versionado en `app.json`:

``` json
{
  "version": "2.1.0.0"
}
```

Ejemplo de deprecación:

``` al
[Obsolete('Use NewMethod instead', '2.0')]
procedure OldMethod()
begin
end;
```

Nueva implementación:

``` al
procedure NewMethod()
begin
    // nueva lógica
end;
```

Este enfoque permite mantener compatibilidad mientras se guía a los
consumidores hacia la nueva API.

## Buenas prácticas
-   utilizar versionado semántico consistentemente\
-   evitar breaking changes innecesarios\
-   usar `Obsolete` para migraciones controladas\
-   documentar cambios en cada versión\
-   mantener compatibilidad entre versiones activas\
-   probar upgrades en entornos sandbox antes de producción

## Conclusiones
El versionado en Business Central SaaS es un problema de arquitectura,
no solo de configuración. Las extensiones que no siguen una estrategia
clara terminan generando sistemas frágiles y difíciles de mantener.

Para ISVs, una buena estrategia de versionado permite distribuir mejoras
sin afectar clientes existentes, gestionar múltiples versiones en
producción y mantener control sobre la evolución del producto.

En un entorno SaaS donde las actualizaciones son constantes, el
versionado correcto es uno de los pilares fundamentales para construir
soluciones estables, escalables y sostenibles a largo plazo.