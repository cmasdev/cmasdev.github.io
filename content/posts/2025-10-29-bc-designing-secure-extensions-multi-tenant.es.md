---
layout: post
title: "BC: Diseño de extensiones seguras para entornos multi-tenant"
author: Christian Amado
date: 2025-10-29 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Microsoft Dynamics 365 Business Central SaaS es, por naturaleza, una plataforma multi-tenant. Esto implica que múltiples organizaciones (tenants) comparten la misma infraestructura física y lógica, pero deben permanecer completamente aisladas en términos de datos, ejecución y seguridad.

Cuando se desarrollan extensiones, especialmente en contextos ISV o soluciones reutilizables, el desafío ya no es solo implementar funcionalidad, sino garantizar que dicha funcionalidad sea segura en un entorno multi-tenant.

El riesgo no es teórico. Un diseño incorrecto puede provocar:

- exposición de datos entre empresas o tenants  
- ejecución de lógica en contextos incorrectos  
- escalamiento de privilegios no intencional  
- vulnerabilidades en APIs expuestas  

En este contexto, la seguridad no es un componente adicional, sino un requisito arquitectónico fundamental.

## El problema

El error más común es desarrollar extensiones como si el sistema fuera single-tenant. Esto se refleja en:

- asumir que los datos pertenecen a un único contexto  
- no validar Company o contexto de ejecución  
- reutilizar variables globales sin aislamiento  
- exponer APIs sin control de acceso adecuado  
- no considerar usuarios de integración  

Un caso crítico ocurre cuando una extensión utiliza datos sin filtrar por empresa o contexto. Aunque Business Central maneja aislamiento a nivel de tenant, una mala implementación puede generar inconsistencias o accesos indebidos dentro del mismo tenant multi-company.

<!--more-->
Otro problema frecuente es no considerar que múltiples clientes utilizarán la misma extensión, lo que implica que cualquier error de seguridad se replica en todos los tenants donde se despliega.

## Modelo de aislamiento en Business Central
Business Central proporciona aislamiento en varios niveles:

- Tenant isolation  
- Company isolation  
- User permissions  
- Session context  

Sin embargo, este aislamiento no reemplaza las responsabilidades del desarrollador. La extensión debe respetar y reforzar estos límites.

## Principios de diseño seguro
### Aislamiento por empresa
Cada operación debe ejecutarse dentro del contexto correcto de empresa.

Nunca asumir que el contexto es implícito. Validar siempre cuando se trabaja con múltiples compañías.

### Principio de mínimo privilegio
Las extensiones deben operar con los permisos mínimos necesarios.

Evitar:

- uso de permisos amplios  
- ejecución con privilegios elevados innecesarios  

### Validación de contexto
Antes de ejecutar lógica crítica:

- validar usuario  
- validar permisos  
- validar empresa  

Esto es especialmente importante en APIs y procesos batch.

### No confiar en el cliente
Toda validación debe realizarse en el servidor (AL), no en el cliente o consumidor de API.

## Seguridad en APIs
Las extensiones modernas suelen exponer APIs.

Riesgos comunes:

- exposición de datos sensibles  
- falta de control de permisos  
- acceso no autenticado o mal autenticado  

Buenas prácticas:

- validar permisos explícitamente  
- filtrar datos por contexto  
- no exponer campos innecesarios  

Ejemplo:

```al
if not Customer.ReadPermission() then
    Error('Access denied');
```

## Manejo de datos sensibles
Evitar almacenar o exponer:

- credenciales  
- tokens  
- información crítica sin protección  

Usar:

- Azure Key Vault (cuando aplica)  
- configuración segura  

## Control de ejecución
Las extensiones deben considerar que:

- múltiples sesiones pueden ejecutarse en paralelo  
- múltiples tenants usan el mismo código  
- los procesos pueden ser concurrentes  

Diseñar para:

- evitar estado global  
- evitar dependencias implícitas  
- garantizar consistencia  

## Patrones avanzados
### Context-aware design
Cada operación debe ser consciente de:

- empresa  
- usuario  
- permisos  

### Segregación de datos
Diseñar tablas y procesos evitando mezcla de datos entre contextos.

### Seguridad en integraciones
Usuarios de integración deben tener:

- permisos mínimos  
- acceso limitado  
- sin acceso interactivo  

### Logging seguro
Registrar eventos sin exponer información sensible.

## Anti-patterns críticos
- asumir contexto único  
- no validar permisos en código  
- exponer APIs sin control  
- usar variables globales compartidas  
- almacenar datos sensibles sin protección  
- ejecutar lógica con privilegios elevados  

## Trade-offs
Diseñar extensiones seguras implica:

- mayor complejidad  
- más validaciones  
- más diseño  

Pero permite:

- protección de datos  
- cumplimiento regulatorio  
- confianza del cliente  
- escalabilidad en múltiples tenants  

## Buenas prácticas avanzadas
- validar contexto siempre  
- diseñar para multi-company desde el inicio  
- limitar permisos  
- auditar accesos  
- revisar seguridad periódicamente  
- documentar modelo de seguridad  

## Conclusiones
Diseñar extensiones seguras en un entorno multi-tenant no es opcional. Es una responsabilidad fundamental del desarrollador.

Las soluciones que ignoran este aspecto pueden funcionar técnicamente, pero representan un riesgo significativo en producción.

Un enfoque basado en aislamiento, validación, control de permisos y diseño consciente del contexto permite construir extensiones robustas, seguras y escalables.

El dominio de estos principios es esencial para cualquier desarrollador o arquitecto que trabaje en soluciones SaaS modernas con Business Central.