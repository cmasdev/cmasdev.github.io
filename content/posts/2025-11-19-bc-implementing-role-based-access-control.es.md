---
layout: post
title: "BC: Implementación del control de acceso basado en roles en AL"
author: Christian Amado
date: 2025-11-19 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La implementación de Role-Based Access Control, o RBAC, en Microsoft Dynamics 365 Business Central SaaS no debe entenderse como una simple asignación de permission sets a usuarios. En entornos empresariales reales, RBAC forma parte de la arquitectura de seguridad de la solución y determina cómo se gobierna el acceso a procesos críticos, datos sensibles y capacidades operativas distribuidas entre distintas áreas de la organización.

Business Central ya ofrece un modelo base de seguridad apoyado en Permission Sets, Permission Set Extensions, perfiles, empresas y permisos a nivel de objeto. Sin embargo, ese modelo por sí solo no resuelve automáticamente un diseño RBAC correcto. El verdadero desafío está en traducir funciones de negocio a roles técnicos sostenibles, auditables y resistentes a cambios en el tiempo.

<!--more-->
En organizaciones medianas o grandes, el acceso no depende únicamente de si un usuario puede leer o modificar una tabla. También depende de si ese usuario puede aprobar pagos, registrar facturas, visualizar balances consolidados, invocar APIs de integración, ejecutar procesos batch o actuar sobre múltiples empresas dentro del mismo entorno. Por eso, un RBAC bien implementado debe modelar operaciones de negocio, no solo objetos técnicos.

Un diseño superficial suele terminar en dos extremos igualmente peligrosos. El primero es el exceso de privilegios, donde muchos usuarios terminan con permisos amplios o incluso equivalentes a SUPER. El segundo es la fragmentación caótica, donde se crean múltiples permission sets sin una estrategia clara, generando dependencia operativa y dificultad de mantenimiento. El objetivo del RBAC no es solo restringir acceso, sino organizarlo de forma coherente con la estructura organizativa, la segregación de funciones y los requisitos de auditoría.

En Business Central SaaS, donde las extensiones, APIs y automatizaciones agregan nuevas superficies de acceso, implementar RBAC correctamente es una necesidad arquitectónica, no una configuración secundaria.

## El problema
El error más común al implementar RBAC en Business Central es comenzar desde los objetos técnicos en lugar de comenzar desde las responsabilidades del negocio. Esto lleva a permission sets construidos a partir de tablas y páginas sueltas, sin reflejar realmente qué puede y qué no puede hacer cada rol dentro del proceso operativo.

Por ejemplo, una organización puede tener usuarios de cuentas por cobrar, tesorería, auditoría interna, integración y administración funcional. Si el diseño de permisos se construye objeto por objeto, es frecuente que varias de esas funciones terminen compartiendo permisos incompatibles entre sí. El caso típico es un usuario que debería poder consultar documentos y preparar operaciones, pero no registrar ni aprobar. Si el modelo no está bien diseñado, ese usuario termina heredando permisos de posting simplemente porque necesita acceder a una codeunit o a una página relacionada.

Otro problema frecuente es la ausencia de segregación de funciones. Un mismo usuario puede terminar con capacidad para crear, aprobar y registrar una operación financiera, lo que incrementa riesgo operativo y de fraude. Este tipo de situación no siempre se detecta durante pruebas funcionales, porque desde el punto de vista del proceso “todo funciona”. El problema aparece luego en auditoría, cumplimiento o incidentes de negocio.

También existe una fuente importante de errores en extensiones personalizadas. Muchos desarrolladores crean tablas, páginas y codeunits nuevas, pero no diseñan un modelo de permisos coherente para esas extensiones. Como consecuencia, la funcionalidad custom queda sobreprotegida y nadie puede usarla, o subprotegida y termina accesible para roles que no deberían tener visibilidad sobre ella.

En escenarios multi-company, el problema se agrava. Un usuario puede requerir acceso operativo a una empresa, acceso de consulta a otra y ningún acceso a una tercera. Si el RBAC no considera explícitamente el contexto organizacional, el sistema termina exponiendo más información de la necesaria o bloqueando procesos legítimos.

Finalmente, otro anti-pattern muy peligroso es resolver problemas de permisos asignando privilegios superiores “temporalmente”. Ese temporal suele volverse permanente. La acumulación progresiva de accesos termina destruyendo por completo la lógica del modelo RBAC.

## Diseño de la solución
Implementar RBAC correctamente en Business Central requiere separar el problema en varias capas.

### 1. Partir de roles de negocio, no de objetos
El punto de partida debe ser una matriz de responsabilidades. Antes de escribir un solo permission set, se debe responder:

- qué procesos ejecuta cada rol
- qué datos necesita consultar
- qué operaciones puede modificar
- qué acciones debe tener explícitamente prohibidas
- en qué empresas aplica cada alcance

Por ejemplo, “Accounts Receivable Clerk” no es simplemente “usuario que accede a Customer y Sales Header”. Es un rol que puede crear y corregir documentos de venta, consultar historial de clientes y preparar operaciones, pero quizás no registrar ni aprobar documentos contables. Esa diferencia funcional debe convertirse en una diferencia técnica.

### 2. Separar permisos por capacidad
Un modelo RBAC sostenible no agrupa todo en un solo permission set por usuario. Conviene separar capacidades:

- lectura operativa
- mantenimiento de maestros
- posting
- aprobación
- auditoría
- integración
- administración funcional

Esto permite combinar roles sin duplicar lógica de seguridad y evita que un cambio puntual obligue a redefinir toda la estructura.

### 3. Diseñar segregación de funciones
No basta con definir quién accede. También hay que definir qué combinaciones son peligrosas. Por ejemplo:

- crear proveedor + aprobar pago
- mantener maestro de cliente + modificar límites de crédito + registrar ventas
- crear usuario de integración + gestionar credenciales

El modelo RBAC debe dificultar o impedir estas combinaciones, o al menos volverlas auditables y excepcionales.

### 4. Incluir extensiones en el modelo
Toda extensión nueva debe venir acompañada de:

- permission sets propios
- permission set extensions cuando corresponda
- validaciones funcionales en código
- documentación de impacto en seguridad

Esto evita que la seguridad estándar y la seguridad custom evolucionen por caminos distintos.

### 5. Diseñar por proceso, no solo por tabla
Un usuario puede tener permiso de lectura sobre una tabla, pero eso no significa que deba ejecutar cualquier codeunit que la modifique o cualquier API que la exponga. RBAC bien implementado exige pensar en:

- procesos interactivos
- procesos batch
- APIs
- integraciones
- reportes y consultas

La seguridad debe cubrir la experiencia completa, no solo el almacenamiento subyacente.

## Implementación en AL
Una implementación seria de RBAC en Business Central suele combinar objetos de seguridad con validaciones en runtime.

### Permission Set base
```al
permissionset 50400 "AR CLERK BASE"
{
    Assignable = true;
    Permissions =
        tabledata Customer = R,
        tabledata "Sales Header" = RIMD,
        tabledata "Sales Line" = RIMD,
        page "Customer List" = X,
        page "Sales Order" = X,
        report "Customer - List" = X;
}
```

Este permission set no incluye posting ni acceso administrativo. Solo cubre operación básica.

### Permission Set separado para posting
```al
permissionset 50401 "AR POSTING"
{
    Assignable = true;
    Permissions =
        codeunit "Sales-Post" = X,
        codeunit "Sales-Post + Print" = X,
        tabledata "Cust. Ledger Entry" = R,
        tabledata "Detailed Cust. Ledg. Entry" = R,
        tabledata "G/L Entry" = R;
}
```

Separar posting de operación diaria permite aplicar segregación de funciones.

### Permission Set para auditoría financiera
```al
permissionset 50402 "FIN AUDIT READ"
{
    Assignable = true;
    Permissions =
        tabledata "G/L Entry" = R,
        tabledata "Cust. Ledger Entry" = R,
        tabledata "Vendor Ledger Entry" = R,
        report "Trial Balance" = X,
        report "Detail Trial Balance" = X,
        query "Analysis View Entries" = X;
}
```

Este rol tiene lectura amplia, pero sin modificación ni ejecución de procesos de posting.

### Permission Set Extension para funcionalidad custom
```al
permissionsetextension 50410 "AR CLERK BASE EXT" extends "AR CLERK BASE"
{
    Permissions =
        tabledata "Custom Sales Validation" = RIMD,
        page "Custom Sales Validation List" = X,
        codeunit "Custom Sales Validation Mgt." = X;
}
```

Esto permite extender capacidades sin redefinir el rol completo.

### Validación defensiva en código
Aunque el permission model es la primera barrera, en procesos sensibles conviene validar explícitamente acceso y contexto.

```al
procedure RequireFinancialApprovalAccess()
var
    ApprovalEntry: Record "Approval Entry";
begin
    if not ApprovalEntry.ReadPermission() then
        Error('The current user does not have permission to access approval data.');

    if not HasRequiredApprovalRole() then
        Error('The current user is not allowed to execute this approval process.');
end;
```

### Función de validación por rol funcional
En algunos escenarios, sobre todo con extensiones complejas, conviene encapsular lógica de autorización funcional.

```al
procedure HasRequiredApprovalRole(): Boolean
var
    UserSetup: Record "User Setup";
begin
    if not UserSetup.Get(UserId()) then
        exit(false);

    exit(UserSetup."Can Approve High Value Docs");
end;
```

Esto no reemplaza permission sets, pero agrega una segunda capa alineada al proceso.

### Protección de APIs custom
```al
page 50420 "Custom Payment API"
{
    PageType = API;
    APIPublisher = 'contoso';
    APIGroup = 'finance';
    APIVersion = 'v1.0';
    EntityName = 'paymentcontrol';
    EntitySetName = 'paymentcontrols';
    SourceTable = "Payment Control Header";

    trigger OnOpenPage()
    begin
        RequirePaymentIntegrationAccess();
    end;
}
```

```al
procedure RequirePaymentIntegrationAccess()
var
    PaymentControl: Record "Payment Control Header";
begin
    if not PaymentControl.ReadPermission() then
        Error('Access denied.');

    if not IsIntegrationUserAllowed() then
        Error('This API is restricted to approved integration identities.');
end;
```

### Control de posting por proceso
```al
procedure ValidatePostingAuthorization(DocumentType: Enum "Sales Document Type")
begin
    if DocumentType = DocumentType::Invoice then
        if not HasSalesInvoicePostingRole() then
            Error('The current user is not authorized to post sales invoices.');
end;
```

Este tipo de validación es especialmente útil cuando una misma tabla participa en múltiples procesos con distintos niveles de sensibilidad.

## Patrones avanzados
### RBAC compuesto
En lugar de crear un permission set único por puesto, conviene construir roles por agregación de capacidades. Por ejemplo:

- AR CLERK BASE
- AR POSTING
- FIN AUDIT READ
- CUSTOM SALES EXT

Esto permite combinar permisos sin duplicar estructura y facilita mantenimiento.

### Roles de integración separados
Los usuarios o aplicaciones de integración nunca deberían reutilizar roles interactivos. Deben tener permission sets propios, limitados a:

- tablas estrictamente necesarias
- codeunits o APIs específicas
- sin acceso a páginas innecesarias
- sin privilegios amplios de consulta

### RBAC por entorno operativo
Una cosa es acceso en sandbox y otra en producción. Aunque la lógica funcional sea la misma, la gobernanza debe diferenciar claramente ambos entornos.

### Aprobación como capacidad separada
Aprobar no es lo mismo que registrar ni que crear. En muchas organizaciones, esa separación es un requisito de auditoría. El RBAC debe reflejarlo explícitamente.

## Anti-patterns críticos
- Usar SUPER para resolver problemas de acceso.
- Diseñar permission sets directamente desde tablas, sin mapa de procesos.
- Mezclar lectura, mantenimiento, posting y aprobación en el mismo rol.
- Reutilizar cuentas de integración con permisos interactivos.
- Crear extensiones sin permission sets propios.
- Asumir que el modelo estándar cubre automáticamente la seguridad custom.
- Resolver conflictos de permisos agregando privilegios cada vez más altos.

## Buenas prácticas
- Diseñar RBAC desde el proceso de negocio y no desde los objetos.
- Separar capacidades críticas en permission sets independientes.
- Revisar segregación de funciones antes de salir a producción.
- Instrumentar validaciones funcionales en código para procesos sensibles.
- Diseñar roles específicos para integraciones, auditoría y administración.
- Revisar permisos de extensiones en cada release.
- Documentar qué rol puede hacer qué y por qué.

## Conclusiones
Implementar Role-Based Access Control en Business Central SaaS no consiste en asignar permission sets de forma reactiva, sino en diseñar un modelo de seguridad coherente con la organización, los procesos y la criticidad de los datos. Un RBAC bien construido reduce riesgo, mejora auditabilidad y evita que la operación dependa de privilegios excesivos o configuraciones improvisadas.

La clave está en pensar en roles como capacidades de negocio traducidas a estructuras técnicas sostenibles. Eso implica separar lectura, mantenimiento, posting, aprobación, integración y auditoría; incorporar extensiones al modelo de seguridad; y agregar validaciones funcionales cuando el riesgo del proceso lo justifica.

En soluciones empresariales reales, el RBAC bien implementado no es un detalle administrativo. Es una de las bases que sostienen la seguridad, la gobernanza y la confiabilidad operativa del sistema.