---
layout: post
title: "BC: Estrategias de protección de datos"
author: Christian Amado
date: 2025-11-05 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La protección de datos en Microsoft Dynamics 365 Business Central SaaS es un pilar fundamental en cualquier implementación empresarial moderna. No se trata únicamente de cumplir con normativas como GDPR, sino de garantizar la integridad, confidencialidad y disponibilidad de la información en un entorno multi-tenant altamente distribuido.

<!--more-->
En Business Central, los datos sensibles incluyen:

- información financiera  
- datos personales (clientes, empleados)  
- credenciales e identificadores  
- información fiscal  
- datos de transacciones  

El desafío no es solo proteger estos datos en almacenamiento, sino también durante:

- procesamiento  
- transmisión  
- exposición a través de APIs  
- acceso desde extensiones personalizadas  

El desarrollador tiene un rol crítico en este proceso, ya que muchas vulnerabilidades surgen en la capa de aplicación (AL) y no en la infraestructura.

## Problema
Los errores más comunes en protección de datos incluyen:

- almacenamiento de datos sensibles en texto plano  
- exposición innecesaria en APIs  
- logs con información confidencial  
- falta de control de acceso en código  
- uso incorrecto de tablas temporales  
- no limpiar datos en memoria  

Un caso típico:

- guardar tokens o contraseñas en tablas personalizadas sin cifrado  
- exponer campos sensibles en una API sin filtrado  

Resultado:

- riesgo de fuga de información  
- incumplimiento normativo  
- vulnerabilidades explotables  

## Principios de protección de datos
### 1. Minimización de datos
Solo almacenar lo estrictamente necesario.

Evitar:

- duplicación de datos sensibles  
- almacenamiento redundante  

### 2. Principio de menor exposición
No exponer datos si no es necesario.

### 3. Protección en tránsito
Toda comunicación externa debe usar HTTPS.

### 4. Protección en reposo
Evitar almacenar información sensible sin protección.

### 5. Control de acceso
Validar permisos en cada operación crítica.

## Estrategias en AL
### Evitar almacenar datos sensibles en texto plano
Incorrecto:

```al
table 50100 UserSecrets
{
    fields
    {
        field(1; Password; Text[100]) { }
    }
}
```

Correcto: usar hashing o almacenamiento externo.

### Uso de Isolated Storage
```al
var
    IsolatedStorage: Codeunit "Isolated Storage";
    Key: Text;
    Value: Text;
begin
    Key := 'API_KEY';
    Value := 'secure-token';

    IsolatedStorage.Set(Key, Value);
end;
```

Esto evita exponer datos directamente en tablas.

### Lectura segura
```al
var
    Value: Text;
begin
    if IsolatedStorage.Get('API_KEY', Value) then
        // usar valor
end;
```

### Protección de APIs
Evitar exponer campos sensibles:

```al
page 50100 CustomerAPI
{
    PageType = API;
    SourceTable = Customer;

    layout
    {
        area(Content)
        {
            field(Name; Name) { }
            field("E-Mail"; "E-Mail") { }
        }
    }
}
```

No incluir campos como:

- crédito  
- datos fiscales sensibles  

### Validación de permisos
```al
if not Customer.ReadPermission() then
    Error('Access denied');
```

### Enmascaramiento de datos
```al
procedure MaskEmail(Email: Text): Text
begin
    exit(CopyStr(Email, 1, 3) + '***');
end;
```

### Logs seguros
Evitar:

```al
Message('User token: %1', Token);
```

Usar:

```al
Message('Operation completed');
```

## Manejo de datos en memoria
Evitar mantener datos sensibles en variables globales.

Limpiar después de uso:

```al
Clear(Token);
```

## Uso de Azure Key Vault
Para escenarios avanzados:

- almacenar secretos fuera de BC  
- acceder mediante servicios externos  

## Protección en integraciones
Nunca enviar:

- credenciales en texto plano  
- tokens sin cifrado  

Ejemplo:

```al
HttpClient.DefaultRequestHeaders.Add('Authorization', 'Bearer ' + Token);
```

Asegurar:

- uso de HTTPS  
- expiración de tokens  

## Anti-patterns críticos
- guardar contraseñas en tablas  
- exponer APIs sin validación  
- logs con datos sensibles  
- no limpiar variables  
- permisos excesivos  

## Estrategias avanzadas
### Data classification
Usar clasificación de datos en campos:

```al
field(1; Email; Text[100])
{
    DataClassification = CustomerContent;
}
```

Esto ayuda en cumplimiento normativo.

### Auditoría
Registrar accesos a datos críticos.

### Segregación de datos
Separar datos sensibles en tablas específicas.

## Buenas prácticas
- cifrar o externalizar datos sensibles  
- validar acceso siempre  
- minimizar exposición  
- usar clasificación de datos  
- auditar accesos  
- evitar logs sensibles  

## Conclusiones
La protección de datos en Business Central no es opcional. Es un requisito fundamental para cualquier solución empresarial.

El desarrollador debe asumir responsabilidad activa en:

- cómo se almacenan los datos  
- cómo se procesan  
- cómo se exponen  

Un diseño correcto permite:

- seguridad  
- cumplimiento  
- confianza  

Mientras que un diseño incorrecto puede comprometer todo el sistema.

La protección de datos no es una funcionalidad, es una disciplina.