---
layout: post
title: "BC: Patrones de arquitectura multiempresa"
author: Christian Amado
date: 2025-04-30 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Dynamics 365 Business Central SaaS, el soporte nativo para
múltiples empresas dentro de un mismo entorno es una de las
características más poderosas del sistema. Muchas organizaciones operan
bajo estructuras complejas que incluyen múltiples entidades legales,
unidades de negocio o subsidiarias distribuidas en distintos países.
Business Central permite gestionar estas estructuras dentro de un único
tenant, manteniendo separación lógica entre compañías.

Sin embargo, esta capacidad introduce desafíos importantes desde el
punto de vista arquitectónico. A diferencia de sistemas diseñados
específicamente como multi-tenant a nivel de aplicación, Business
Central implementa un modelo donde cada compañía tiene su propio
conjunto de datos, pero comparte la misma aplicación y extensiones.

<!--more-->
Para los desarrolladores, esto implica diseñar extensiones que sean
conscientes del contexto de empresa en el que se ejecutan, evitando
suposiciones incorrectas sobre los datos o el comportamiento del
sistema. Además, en escenarios empresariales reales, es común que exista
la necesidad de sincronizar información entre compañías o consolidar
datos a nivel corporativo.

Comprender los patrones de arquitectura multiempresa es fundamental para
construir soluciones que funcionen correctamente en este tipo de
escenarios.

## El problema
Uno de los errores más frecuentes en implementaciones multiempresa es
asumir que la lógica desarrollada para una sola compañía funcionará sin
cambios en un entorno con múltiples empresas. Esto rara vez es cierto.

Los problemas típicos incluyen:

-   duplicación de datos entre compañías\
-   inconsistencias en la lógica de negocio\
-   integraciones que no respetan el contexto de empresa\
-   errores al utilizar registros sin considerar el Company context

Un caso común ocurre cuando una extensión intenta acceder a datos de
otra empresa sin utilizar correctamente los mecanismos del sistema. Esto
puede generar resultados incorrectos o incluso fallos en ejecución.

Otro problema frecuente es la sincronización de datos. Muchas
organizaciones necesitan compartir información entre empresas (por
ejemplo, catálogos de productos o clientes), pero Business Central no
sincroniza estos datos automáticamente fuera de los mecanismos
intercompany estándar.

Si no se define una estrategia clara, los desarrolladores terminan
implementando soluciones ad-hoc que son difíciles de mantener.

## Diseño de la solución
El diseño de soluciones multiempresa en Business Central debe basarse en
tres enfoques principales:

**1. Context awareness**\
Toda extensión debe ser consciente de la empresa en la que se está
ejecutando. Esto implica evitar asumir que los datos son globales y
siempre trabajar con el contexto actual.

**2. Acceso controlado entre compañías**\
Cuando sea necesario acceder a datos de otra empresa, debe utilizarse el
método `CHANGECOMPANY`, que permite operar sobre registros en otro
contexto de forma controlada.

**3. Estrategias de sincronización**\
Para compartir datos entre compañías, es necesario implementar
mecanismos explícitos como procesos batch, integraciones o tablas de
replicación.

En escenarios más avanzados, puede ser útil implementar una capa de
orquestación que gestione la comunicación entre compañías, evitando que
la lógica de negocio dependa directamente de múltiples contextos.

## Implementación en AL
``` al
var
    Customer: Record Customer;
begin
    Customer.ChangeCompany('Company B');

    if Customer.FindFirst() then
        Message('Cliente en Company B: %1', Customer."No.");
end;
```

Este patrón permite consultar información de otra empresa sin cambiar el
contexto global de ejecución.

Sin embargo, debe utilizarse con cuidado, ya que puede impactar el
rendimiento si se utiliza en loops o procesos masivos.

## Buenas prácticas
-   evitar asumir que los datos son compartidos entre compañías\
-   usar CHANGECOMPANY solo cuando sea necesario\
-   diseñar procesos de sincronización explícitos\
-   separar lógica multiempresa de la lógica de dominio\
-   considerar performance en accesos cross-company

## Conclusiones
El soporte multiempresa de Business Central es una herramienta poderosa,
pero requiere un enfoque arquitectónico cuidadoso. Las extensiones deben
diseñarse teniendo en cuenta el contexto de empresa y las limitaciones
del modelo de datos.

Implementar correctamente patrones como acceso controlado entre
compañías y sincronización explícita permite construir soluciones
robustas para organizaciones complejas. En entornos SaaS, donde la
escalabilidad y la mantenibilidad son fundamentales, una arquitectura
multiempresa bien diseñada es clave para evitar problemas a largo plazo.