---
layout: post
title: "Deep linking entre apps modernas y el sistema"
author: Christian Amado
date: 2025-02-07 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Una de las características más poderosas de **Windows App SDK** es su capacidad para integrar aplicaciones modernas con el sistema operativo a través de mecanismos como **URI scheme handlers** y **asociaciones de tipos de archivo**. Esta integración permite a las apps **WinUI 3** ser invocadas desde otras apps, scripts, accesos directos o enlaces web, facilitando flujos interconectados, automatización y mejores experiencias de usuario.

En este artículo se aborda cómo habilitar el deep linking en aplicaciones modernas, tanto desde URI personalizados como desde archivos con extensiones registradas. Se incluyen ejemplos prácticos, manejo de activación, y recomendaciones de seguridad y diseño.

<!--more-->

## Requisitos

- Proyecto WinUI 3 empaquetado (MSIX) con Windows App SDK
- SDK mínimo: Windows 10 build 19041
- Acceso a `Package.appxmanifest` en modo texto
- Conocimientos de activación y flujo de arranque en WinUI 3

## Paso 1: Registrar esquema URI personalizado

Abrir `Package.appxmanifest` y agregar:

```xml
<Extensions>
  <uap:Extension Category="windows.protocol">
    <uap:Protocol Name="miapp">
      <uap:DisplayName>Mi App URI Handler</uap:DisplayName>
    </uap:Protocol>
  </uap:Extension>
</Extensions>
```

Esto permite que el sistema asocie `miapp://` con tu aplicación.

## Paso 2: Manejar la activación URI

En `App.xaml.cs`, implementar `OnActivated`:

```csharp
protected override void OnActivated(IActivatedEventArgs args)
{
    if (args is ProtocolActivatedEventArgs protocolArgs)
    {
        var uri = protocolArgs.Uri;
        var action = uri.Host;

        if (action == "abrirpanel")
        {
            new PanelWindow().Activate();
        }
        else if (action == "detalle")
        {
            var id = uri.QueryParsed.GetFirstValueByName("id");
            new DetalleWindow(id).Activate();
        }
    }
}
```

Ejemplo de enlace que abriría la app:

```text
miapp://abrirpanel
miapp://detalle?id=456
```

Estos enlaces pueden usarse desde PowerShell, scripts, HTML o accesos directos.

## Paso 3: Crear acceso directo con URI

Crear `.url` o acceso directo con destino:

```text
miapp://abrirpanel
```

También es posible crear enlaces desde otras apps:

```html
<a href="miapp://abrirpanel">Abrir Panel</a>
```

## Paso 4: Registrar tipo de archivo personalizado

En el manifiesto:

```xml
<uap:Extension Category="windows.fileTypeAssociation">
  <uap:FileTypeAssociation Name="miformato">
    <uap:SupportedFileTypes>
      <uap:FileType>.mif</uap:FileType>
    </uap:SupportedFileTypes>
    <uap:DisplayName>Archivo personalizado</uap:DisplayName>
  </uap:FileTypeAssociation>
</uap:Extension>
```

Esto indica al sistema que tu app puede manejar archivos `.mif`.

## Paso 5: Manejar apertura de archivos

Modificar `OnFileActivated` en `App.xaml.cs`:

```csharp
protected override void OnFileActivated(FileActivatedEventArgs args)
{
    var file = args.Files[0] as StorageFile;
    new FileViewerWindow(file).Activate();
}
```

Esto permite que el usuario abra el archivo `.mif` con doble clic desde el Explorador de Windows o desde línea de comandos.

## Paso 6: Probar invocación desde sistema

En PowerShell:

```powershell
Start-Process "miapp://detalle?id=123"
```

Para probar apertura de archivo:

```powershell
Start-Process "C:\archivos\ejemplo.mif"
```

Verificar que se abra tu app con la UI adecuada.

## Casos de uso reales

- Invocar flujos internos de la app desde navegador o email
- Procesar archivos personalizados desde el explorador
- Integración entre apps de escritorio (ej. app CRM que abre visor externo)
- Automatización de tareas con URI para accesos rápidos
- Generar archivos `.mif` desde otra app para abrirlos con tu app

## Buenas prácticas

- Validar todos los parámetros recibidos vía URI para evitar inyección o ejecución no deseada
- No ejecutar automáticamente acciones peligrosas sin confirmación
- Documentar los URI soportados si se espera que otros sistemas los usen
- Mostrar mensajes útiles si la invocación está incompleta
- Versionar los esquemas y mantener compatibilidad hacia atrás si evolucionan

## Conclusión

El soporte para esquemas URI personalizados y asociaciones de tipos de archivo en **Windows App SDK** permite construir aplicaciones modernas que se integran profundamente con el sistema operativo, ofreciendo flujos más naturales y funcionales. Esta capacidad amplía el alcance y conectividad de una app, facilitando su uso en entornos automatizados, interoperables o colaborativos.
