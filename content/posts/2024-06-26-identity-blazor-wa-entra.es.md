---
layout: post
title: "Autenticación y autorización en Blazor WebAssembly con Microsoft Entra ID"
author: Christian Amado
date: 2024-06-26 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Blazor,.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.png
---

**Blazor WebAssembly** es una tecnología poderosa dentro del ecosistema **.NET** que permite construir aplicaciones web interactivas completamente en C#. Para aplicaciones empresariales y seguras, la autenticación y autorización son aspectos fundamentales. **Microsoft Entra ID** (anteriormente Azure Active Directory) proporciona una solución confiable y escalable para la gestión de identidad. En este artículo, exploraremos cómo integrar autenticación y autorización en una aplicación **Blazor WebAssembly** utilizando **.NET 8** y **Microsoft Entra ID**.

<!--more-->

## Requisitos previos

Antes de comenzar, asegúrate de contar con lo siguiente:

- **.NET 8 SDK** instalado en tu sistema.
- **Cuenta de Azure** con acceso a Microsoft Entra ID.
- **Visual Studio 2022** o Visual Studio Code.
- **Azure CLI** instalado para la configuración de la identidad.

## Creación de la aplicación Blazor WebAssembly

Para iniciar, crearemos una nueva aplicación Blazor WebAssembly con soporte para autenticación de Microsoft Entra ID.

Ejecuta el siguiente comando en la terminal:

```
 dotnet new blazorwasm -o BlazorAuthApp --auth IndividualB2C
 cd BlazorAuthApp
```

Esto genera una aplicación Blazor WebAssembly con autenticación preconfigurada.

## Configuración de Microsoft Entra ID

### 1. Registrar la aplicación en Azure

1. Accede al portal de Azure.
2. Dirígete a **Microsoft Entra ID**.
3. Ve a **Registros de Aplicaciones** y selecciona **Nueva Aplicación**.
4. Ingresa un nombre y elige **Cuentas en cualquier directorio organizacional**.
5. Configura la URL de redirección como `https://localhost:5001/authentication/login-callback`.
6. Guarda la aplicación y copia el **Application (client) ID**.

### 2. Configurar los permisos de la API

1. Dentro del registro de la aplicación, ve a **Permisos de API**.
2. Agrega los siguientes permisos:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
3. Concede el consentimiento del administrador.

### 3. Configurar los secretos del cliente

1. Ve a **Certificados y secretos**.
2. Genera un nuevo secreto de cliente y copia su valor.

## Integración de la autenticación en Blazor WebAssembly

### Configurar appsettings.json

Modifica `wwwroot/appsettings.json` para agregar la configuración de Microsoft Entra ID:

```
{
  "AzureAd": {
    "Authority": "https://login.microsoftonline.com/{tenant_id}",
    "ClientId": "{client_id}",
    "ValidateAuthority": true
  }
}
```

Reemplaza `{tenant_id}` y `{client_id}` con los valores de tu aplicación en Azure.

### Configurar autenticación en Program.cs

Edita `Program.cs` para habilitar la autenticación:

```
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BlazorAuthApp;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.Services.AddAuthorizationCore();
builder.Services.AddMsalAuthentication(options =>
{
    builder.Configuration.Bind("AzureAd", options.ProviderOptions.Authentication);
});

await builder.Build().RunAsync();
```

Esto permite que Blazor WebAssembly use Microsoft Entra ID para autenticación.

### Agregar control de autenticación en la UI

Modifica `MainLayout.razor` para incluir botones de inicio de sesión y cierre de sesión:

```
<AuthorizeView>
    <Authorized>
        <p>Bienvenido, @context.User.Identity.Name!</p>
        <button @onclick="(() => Navigation.NavigateTo('authentication/logout'))">Cerrar sesión</button>
    </Authorized>
    <NotAuthorized>
        <button @onclick="(() => Navigation.NavigateTo('authentication/login'))">Iniciar sesión</button>
    </NotAuthorized>
</AuthorizeView>
```

Esto mostrará diferentes opciones dependiendo del estado de autenticación del usuario.

## Implementar Autorización basada en Roles

Para restringir el acceso a componentes específicos según roles, puedes modificar el componente Blazor de la siguiente manera:

```
<AuthorizeView Roles="Admin">
    <p>Contenido exclusivo para administradores.</p>
</AuthorizeView>
```

Esto garantiza que solo los usuarios con el rol "Admin" puedan ver el contenido.

## Conclusión

Hemos configurado una aplicación **Blazor WebAssembly** para autenticarse con **Microsoft Entra ID** y hemos implementado autorización basada en roles. Esta configuración permite construir aplicaciones seguras y escalables en el ecosistema Microsoft.

Con estos pasos, ahora puedes extender tu aplicación agregando más protecciones y permisos según las necesidades de tu proyecto.

