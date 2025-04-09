---
layout: post
title: "Creación y gestión de accesos directos dinámicos en Start Menu y Taskbar"
author: Christian Amado
date: 2024-12-13 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Una de las capacidades distintivas de las apps modernas en **Windows** es la posibilidad de integrarse dinámicamente con la experiencia del sistema operativo. Esto incluye la creación de accesos directos personalizados en el menú de inicio (Start Menu), así como la integración con la barra de tareas (Taskbar), ofreciendo accesos rápidos a funciones internas de la aplicación.

Gracias a **Windows App SDK**, las apps desarrolladas con **WinUI 3** pueden programáticamente crear y administrar accesos directos sin depender de métodos antiguos como acceso directo manual o scripts externos. Este artículo explora cómo crear accesos dinámicos con metadatos enriquecidos y cómo extender su funcionalidad mediante Jump Lists y pinning automático.

<!--more-->

## Requisitos previos

- Windows 11
- Visual Studio 2022+
- Proyecto WinUI 3 empaquetado (MSIX) con Windows App SDK
- Conocimiento de archivos `.lnk`, URIs internos y asociaciones de comandos

## Escenario

Una app de escritorio moderna llamada "NoteBoard" permite a los usuarios crear notas rápidas. El objetivo es ofrecer:

- Un acceso directo al menú inicio con el icono de la app
- Una opción adicional para crear una nueva nota desde la Jump List
- Pin automático a la barra de tareas al primer lanzamiento

## Paso 1: Configuración de acceso directo en el manifiesto MSIX

Abrir el archivo `Package.appxmanifest` en modo de texto y agregar la siguiente declaración dentro de `<Applications>`:

```xml
<Extensions>
  <uap:Extension Category="windows.appExecutionAlias">
    <uap:AppExecutionAlias>
      <uap:ExecutionAlias Alias="noteboard.exe" />
    </uap:AppExecutionAlias>
  </uap:Extension>
</Extensions>
```

Esto crea un alias ejecutable que puede ser llamado desde consola (`noteboard.exe`) y ayuda en el pin dinámico.

## Paso 2: Crear URI handlers para acciones internas

Declarar un protocolo personalizado en el manifiesto:

```xml
<uap:Extension Category="windows.protocol">
  <uap:Protocol Name="noteboard">
    <uap:DisplayName>NoteBoard Protocol</uap:DisplayName>
  </uap:Protocol>
</uap:Extension>
```

Y en código (ej. en `App.xaml.cs`), capturar el URI:

```csharp
protected override void OnActivated(IActivatedEventArgs args)
{
    if (args is ProtocolActivatedEventArgs protocolArgs)
    {
        var uri = protocolArgs.Uri;
        if (uri.Host == "newnote")
        {
            // Abrir ventana para nueva nota
            new MainWindow().Activate();
        }
    }
}
```

Esto permite abrir la app con comandos como `noteboard://newnote`.

## Paso 3: Añadir accesos rápidos a la Jump List

Usar la clase `JumpList` para registrar tareas adicionales:

```csharp
using Windows.UI.StartScreen;

public async Task ConfigurarJumpListAsync()
{
    if (await JumpList.IsSupportedAsync())
    {
        var jumpList = await JumpList.LoadCurrentAsync();
        jumpList.Items.Clear();

        var item = JumpListItem.CreateWithArguments("noteboard://newnote", "Nueva Nota");
        item.Description = "Crear una nueva nota rápida";
        item.Logo = new Uri("ms-appx:///Assets/plus-icon.png");
        item.GroupName = "Accesos rápidos";

        jumpList.Items.Add(item);
        await jumpList.SaveAsync();
    }
}
```

Invocar `ConfigurarJumpListAsync()` en el primer inicio o durante la inicialización de la app.

## Paso 4: Pin a la barra de tareas (Taskbar)

Este paso es más delicado. El pinning automático no está oficialmente soportado por la API pública, pero se puede sugerir mediante atajos:

- Crear un archivo `.lnk` con destino a `noteboard.exe`
- Usar `ShellLink` con interop para crear el acceso
- Invitar al usuario a "Pin to taskbar" mediante UI o notificación

Ejemplo de creación del acceso directo vía `IShellLink` (requiere COM interop):

```csharp
// Usar Shell32 o empaquetar un ejecutable auxiliar que cree el pin
```

Alternativamente, al iniciar la app por primera vez, se puede mostrar una notificación:

```csharp
new ToastContentBuilder()
    .AddText("¿Usás NoteBoard frecuentemente?")
    .AddText("Anclala a la barra de tareas para acceder más rápido.")
    .AddButton(new ToastButton("Anclar", "pin-taskbar"))
    .Show();
```

En el manejador de activación, abrir el menú contextual del acceso directo.

## Paso 5: Verificar resultado en sistema

Después de correr la app:

- Presionar la tecla Windows y escribir "NoteBoard"
- El acceso directo aparecerá con el ícono personalizado
- Clic derecho mostrará la Jump List con "Nueva Nota"
- Ejecutar desde PowerShell: `Start-Process "noteboard://newnote"`

## Buenas prácticas

- Usar logos diferenciados para cada JumpListItem
- No exceder los 5 accesos rápidos recomendados por Microsoft
- Localizar títulos y descripciones si la app es multilenguaje
- Guardar estado de pinning para evitar duplicados o repeticiones

## Casos de uso

- Crear accesos directos para flujos frecuentes (crear nota, abrir calendario, iniciar reunión)
- Acciones rápidas en apps de productividad, CRM, helpdesk
- Activación de comandos por voz o scripts (via protocolo personalizado)
- Extensiones de UX sin necesidad de abrir UI completa

## Conclusión

Las apps modernas en **Windows** pueden integrarse profundamente con el sistema operativo a través de accesos directos dinámicos, Jump Lists, protocolos personalizados y atajos enriquecidos. Usando **Windows App SDK**, es posible ofrecer al usuario una experiencia nativa y fluida desde el inicio, mejorando la productividad y facilitando el acceso a las funcionalidades clave de la aplicación desde el menú de inicio o la barra de tareas.

Esta integración es una forma efectiva de mejorar la adopción y visibilidad de una app, ofreciendo puntos de entrada estratégicos que van más allá de la simple ejecución principal.
