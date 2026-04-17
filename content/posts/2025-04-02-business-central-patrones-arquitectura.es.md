---
layout: post
title: "BC: Series de integración Parte 1: Patrones de Arquitectura SaaS"
author: Christian Amado
date: 2025-04-02 00:00:00 -0300
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En entornos empresariales modernos, integrar Business Central 26 en modalidad SaaS no consiste únicamente en exponer o consumir APIs. Implica diseñar una arquitectura desacoplada, segura, resiliente y preparada para evolucionar sin afectar el núcleo del ERP.

Cuando Business Central opera en SaaS, se deben considerar limitaciones y ventajas propias del modelo cloud: ausencia de acceso directo a la base de datos, ejecución controlada del código AL y dependencia de APIs estándar o personalizadas. Esto obliga a adoptar patrones arquitectónicos sólidos.

## 1. Patrón API-First
El primer principio en SaaS es diseñar integraciones bajo un enfoque API-First. Business Central expone APIs estándar y permite crear APIs personalizadas en AL.

Ejemplo de API personalizada en AL:

``` al
page 50100 "Customer Integration API"
{
    PageType = API;
    APIPublisher = 'cmas';
    APIGroup = 'integration';
    APIVersion = 'v1.0';
    EntityName = 'customer';
    EntitySetName = 'customers';
    SourceTable = Customer;

    layout
    {
        area(content)
        {
            field("No."; Rec."No.") { }
            field(Name; Rec.Name) { }
            field("Balance (LCY)"; Rec."Balance (LCY)") { }
        }
    }
}
```

Este diseño permite que sistemas externos consuman datos sin acceder directamente a la lógica interna del ERP.

## 2. Patrón Anti-Corrupción
Nunca se debe exponer directamente el modelo interno del ERP al backend externo. Es recomendable implementar una capa intermedia en .NET que actúe como Anti-Corruption Layer (ACL).

Ejemplo de consumo desde ASP.NET Core:
``` csharp
public class BusinessCentralClient
{
    private readonly HttpClient _httpClient;

    public BusinessCentralClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<CustomerDto>> GetCustomersAsync()
    {
        var response = await _httpClient.GetAsync("/api/cmas/integration/v1.0/companies({companyId})/customers");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<IEnumerable<CustomerDto>>(json);
    }
}
```

El backend traduce los datos al modelo interno del dominio, evitando que cambios en Business Central rompan la arquitectura.

## 3. Eventos y Desacoplamiento
Business Central permite publicar eventos internos que pueden ser suscritos por extensiones. En arquitecturas modernas, estos eventos pueden disparar llamadas HTTP hacia microservicios externos.

Ejemplo en AL:
``` al
[EventSubscriber(ObjectType::Table, Database::"Sales Header", 'OnAfterInsertEvent', '', false, false)]
local procedure OnAfterInsertSalesHeader(var Rec: Record "Sales Header")
var
    HttpClient: HttpClient;
    Content: HttpContent;
    Response: HttpResponseMessage;
begin
    Content.WriteFrom('{"DocumentNo": "' + Rec."No." + '"}');
    HttpClient.Post('https://api.midominio.com/sales', Content, Response);
end;
```

Este patrón habilita arquitecturas event-driven, aunque debe aplicarse con cuidado para evitar bloqueos transaccionales.

## 4. Seguridad en Integraciones SaaS
En entornos SaaS, la autenticación se realiza generalmente mediante OAuth2 con Azure AD. Nunca se deben usar credenciales embebidas en código.

Ejemplo simplificado de configuración en .NET:
``` csharp
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "https://login.microsoftonline.com/{tenantId}/v2.0";
        options.Audience = "api://mi-api-id";
    });
```
El backend valida tokens emitidos por Azure AD antes de procesar datos provenientes de Business Central.

## 5. Patrón de Orquestación Externa
En arquitecturas empresariales, Business Central no debe convertirse en motor de lógica compleja. En su lugar, el backend en .NET debe orquestar procesos y utilizar BC como sistema de registro (System of Record).

Ejemplo de flujo típico:
1.  El backend recibe solicitud.
2.  Valida reglas de negocio avanzadas.
3.  Consulta datos a Business Central vía API.
4.  Ejecuta lógica adicional (scoring, validaciones, AI si aplica).
5.  Registra resultado en BC.

Esto evita sobrecargar el ERP con lógica que no le corresponde.

## Conclusión
Integrar Business Central 26 en modalidad SaaS exige disciplina arquitectónica. Los patrones API-First, Anti-Corruption Layer, Event-Driven y Orquestación Externa permiten construir soluciones robustas y evolutivas.

El objetivo no es "conectar sistemas", sino diseñar una arquitectura donde Business Central forme parte de un ecosistema mayor, gobernado por un backend moderno en .NET y desplegado sobre infraestructura cloud.

En el próximo artículo se abordará el diseño de seguridad multiempresa y control de acceso avanzado en entornos SaaS.