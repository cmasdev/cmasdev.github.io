---
layout: post
title: "Blazor y Microsoft Entra ID: Implementación de autenticación"
author: Christian Amado
date: 2024-12-18 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Blazor,Azure]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.png
---

La integración de **Microsoft Entra ID (anteriormente Azure AD)** con **Blazor** permite implementar autenticación segura en aplicaciones web y mejorar la gestión de identidades. En este artículo, exploraremos cómo integrar **Microsoft Entra ID** en una aplicación **Blazor**, proporcionando un flujo de autenticación robusto y seguro.

<!--more-->

## 1. Introducción a Microsoft Entra ID y Blazor

### **¿Qué es Microsoft Entra ID?**
Microsoft Entra ID es una plataforma de administración de identidad basada en la nube que permite el inicio de sesión único (SSO), autenticación multifactor (MFA) y gestión de usuarios y roles en aplicaciones corporativas.

### **¿Por qué usar Blazor con Entra ID?**
Blazor es un framework de desarrollo web de Microsoft basado en C# y Razor, que permite construir aplicaciones interactivas sin depender de JavaScript. Integrarlo con Microsoft Entra ID ofrece beneficios como:
- **Autenticación segura basada en estándares OAuth 2.0 y OpenID Connect**.
- **SSO (Inicio de Sesión Único) en entornos empresariales**.
- **Compatibilidad con MFA (Autenticación Multifactor)**.
- **Gestión de permisos y roles con Microsoft Graph API**.

## 2. Configuración de Microsoft Entra ID

Antes de integrar Entra ID con Blazor, necesitamos configurar una aplicación en el portal de Azure.

### **Paso 1: Crear una aplicación en Microsoft Entra ID**
1. Accede a [Azure Portal](https://portal.azure.com/).
2. Dirígete a **Microsoft Entra ID** > **App Registrations**.
3. Haz clic en **New Registration** y configura:
   - **Nombre**: `BlazorAuthApp`
   - **Tipo de cuenta**: "Cualquier organización de directorios" o "Cuentas personales y organizativas".
   - **Redirección**: `https://localhost:5001/authentication/login-callback`
4. Guarda los cambios y copia:
   - **Application (client) ID**.
   - **Directory (tenant) ID**.

### **Paso 2: Configurar permisos de API**
1. En la sección **API Permissions**, añade permisos para `User.Read` (Microsoft Graph).
2. **Grant Admin Consent** para aplicar los permisos a todos los usuarios.

### **Paso 3: Crear un Cliente Secreto**
1. Ve a **Certificates & Secrets**.
2. Genera un nuevo secreto y copia el valor.

## 3. Configuración de Blazor con Entra ID

Ahora que tenemos configurada la aplicación en Entra ID, podemos integrar la autenticación en Blazor.

### **Paso 1: Crear un Proyecto Blazor WebAssembly**
Ejecuta el siguiente comando en la terminal:

```
 dotnet new blazorwasm -o BlazorAuthApp --auth IndividualB2C
 cd BlazorAuthApp
```

### **Paso 2: Instalar Paquetes Necesarios**

```
 dotnet add package Microsoft.AspNetCore.Authentication.AzureADB2C.UI
```

### **Paso 3: Configurar `appsettings.json`**

Edita el archivo `appsettings.json` con la información de Entra ID:

```
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "yourdomain.onmicrosoft.com",
    "TenantId": "your-tenant-id",
    "ClientId": "your-client-id",
    "CallbackPath": "/authentication/login-callback",
    "SignedOutCallbackPath": "/authentication/logout-callback"
  }
}
```

### **Paso 4: Configurar Autenticación en `Program.cs`**

```
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.Authority = "https://login.microsoftonline.com/{your-tenant-id}";
    options.ClientId = "your-client-id";
    options.ResponseType = "code";
    options.SaveTokens = true;
});

builder.Services.AddAuthorizationCore();

await builder.Build().RunAsync();
```

## 4. Protección de Rutas y Gestión de Roles

### **Paso 1: Crear una Página Protegida**
Modifica `Pages/Protected.razor` para permitir el acceso solo a usuarios autenticados:

```
@page "/protected"
@using Microsoft.AspNetCore.Components.Authorization

<AuthorizeView>
    <Authorized>
        <h3>Bienvenido, usuario autenticado</h3>
        <button @onclick="Logout">Cerrar Sesión</button>
    </Authorized>
    <NotAuthorized>
        <h3>Acceso Restringido</h3>
    </NotAuthorized>
</AuthorizeView>

@code {
    [Inject] NavigationManager Navigation { get; set; }
    
    private async Task Logout()
    {
        Navigation.NavigateTo("authentication/logout");
    }
}
```

### **Paso 2: Configurar el `RouteView` en `App.razor`**

```
<CascadingAuthenticationState>
    <AuthorizeRouteView RouteData="@routeData" DefaultLayout="typeof(MainLayout)" />
</CascadingAuthenticationState>
```

### **Paso 3: Agregar un Componente de Login**

```
<AuthorizeView>
    <Authorized>
        <button @onclick="Logout">Cerrar Sesión</button>
    </Authorized>
    <NotAuthorized>
        <button @onclick="Login">Iniciar Sesión</button>
    </NotAuthorized>
</AuthorizeView>

@code {
    private void Login() => Navigation.NavigateTo("authentication/login");
    private void Logout() => Navigation.NavigateTo("authentication/logout");
}
```

## 5. Conclusión

La integración de **Blazor con Microsoft Entra ID** proporciona una solución robusta para la autenticación de usuarios, garantizando seguridad y facilidad de administración. Gracias a OpenID Connect y OAuth 2.0, podemos ofrecer inicio de sesión seguro y control de acceso basado en roles.

### **Resumen:**
✅ Configuración de **Microsoft Entra ID** en Azure.
✅ Integración de **Blazor WebAssembly** con Entra ID.
✅ Protección de rutas y gestión de autenticación.
✅ Implementación de un flujo de inicio y cierre de sesión seguro.

¡Ahora puedes implementar autenticación avanzada en tus aplicaciones Blazor con Entra ID! 🚀