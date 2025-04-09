---
layout: post
title: "Empaquetado de apps modernas con MSIX y configuración avanzada del manifiesto"
author: Christian Amado
date: 2025-02-28 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**MSIX** es el formato de empaquetado moderno para aplicaciones **Windows**. Ofrece instalación limpia, actualización controlada, aislamiento seguro, y registro transparente de recursos y capacidades. Para aplicaciones desarrolladas con **Windows App SDK** y **WinUI 3**, el uso de **MSIX** no es opcional, es el estándar recomendado para integrarse completamente al ecosistema del sistema operativo moderno.

Este artículo aborda cómo empaquetar una app moderna con **MSIX** desde **Visual Studio**, y cómo configurar el manifiesto del paquete (`Package.appxmanifest`) para habilitar capacidades avanzadas como protocolos personalizados, extensiones del sistema, iconografía personalizada y más.

<!--more-->

## Requisitos

- Windows 11
- Visual Studio 2022 con workload “Desarrollo para escritorio con C++” y MSIX Packaging Tools
- Windows App SDK 1.3+
- Proyecto de tipo **Blank App, Packaged (WinUI 3 in Desktop)**

## Paso 1: Estructura básica de un paquete MSIX

El archivo clave es `Package.appxmanifest`, que contiene:

- Identidad de la app
- Declaraciones de capacidades
- Asociaciones de archivo, URI, tareas de fondo
- Iconos, entradas al menú inicio, y más

Ejemplo básico:

```xml
<Identity Name="com.empresa.miapp"
          Publisher="CN=Empresa"
          Version="1.0.0.0" />

<Properties>
  <DisplayName>MiApp</DisplayName>
  <PublisherDisplayName>Empresa S.A.</PublisherDisplayName>
  <Logo>Assets/StoreLogo.png</Logo>
</Properties>
```

## Paso 2: Configurar iconografía y recursos visuales

Se pueden establecer logos personalizados para:

- Barra de tareas
- Menú inicio
- App list (Start Menu)
- Notificaciones toast

```xml
<VisualElements
  DisplayName="MiApp"
  Square44x44Logo="Assets/Icon44.png"
  Square150x150Logo="Assets/Icon150.png"
  Description="Aplicación moderna con MSIX"
  BackgroundColor="transparent" />
```

Los iconos deben estar declarados en todos los tamaños requeridos por el sistema (44, 150, 310, etc.).

## Paso 3: Agregar protocolo personalizado

```xml
<uap:Extension Category="windows.protocol">
  <uap:Protocol Name="miapp">
    <uap:DisplayName>miapp Protocol</uap:DisplayName>
  </uap:Protocol>
</uap:Extension>
```

Permite que la app responda a enlaces como `miapp://abrir`.

## Paso 4: Asociar tipos de archivo

```xml
<uap:Extension Category="windows.fileTypeAssociation">
  <uap:FileTypeAssociation Name="MiExt">
    <uap:SupportedFileTypes>
      <uap:FileType>.miapp</uap:FileType>
    </uap:SupportedFileTypes>
    <uap:DisplayName>Archivo MiApp</uap:DisplayName>
  </uap:FileTypeAssociation>
</uap:Extension>
```

Ahora la app podrá abrir estos archivos con doble clic.

## Paso 5: Declarar capacidades del sistema

Para acceder a funcionalidades como ubicación, micrófono, red, etc.

```xml
<Capabilities>
  <Capability Name="internetClient" />
  <Capability Name="location" />
  <uap:Capability Name="userAccountInformation" />
</Capabilities>
```

Siempre declarar solo lo necesario. La declaración excesiva puede generar advertencias o problemas de distribución.

## Paso 6: Configurar AppExecutionAlias

Esto permite ejecutar la app desde consola:

```xml
<uap:Extension Category="windows.appExecutionAlias">
  <uap:AppExecutionAlias>
    <uap:ExecutionAlias Alias="miapp.exe" />
  </uap:AppExecutionAlias>
</uap:Extension>
```

Esto habilita `miapp.exe` en línea de comandos tras instalar la app.

## Paso 7: Configurar entrada al menú inicio

```xml
<Applications>
  <Application Id="App"
               Executable="MiApp.exe"
               EntryPoint="MiApp.App">
    <uap:VisualElements
      DisplayName="MiApp"
      Square150x150Logo="Assets/Logo.png"
      BackgroundColor="transparent">
    </uap:VisualElements>
  </Application>
</Applications>
```

Cada app (o extensión) debe tener su entrada bien declarada.

## Paso 8: Empaquetar desde Visual Studio

1. Clic derecho sobre el proyecto empaquetado
2. Publicar > Crear paquete de la aplicación
3. Elegir: "Sí, quiero firmar el paquete"
4. Crear certificado local o usar uno comercial
5. Elegir modo Sideloading (para pruebas) o Store

Esto generará archivos `.msix` o `.msixbundle` junto con `AppInstaller`.

## Paso 9: Instalar y probar el paquete

```powershell
Add-AppxPackage -Path ".\MiApp.msix"
```

Verificar en menú inicio, buscar `MiApp` y validar comportamiento completo.

## Buenas prácticas

- Usar GUID únicos para IDs internos si hay múltiples extensiones
- Revisar el manifiesto en modo XML y no solo visual
- Usar `capability declarations` mínimas y revisadas
- Probar el paquete con App Installer antes de distribución
- Mantener la versión del paquete actualizada en cada build

## Conclusión

El empaquetado con **MSIX** es esencial para garantizar instalación fiable, comportamiento predecible y compatibilidad con el ecosistema moderno de **Windows**. El manifiesto ofrece un alto nivel de control sobre cómo se comporta y se expone la aplicación al sistema, permitiendo personalización avanzada, integración con el shell y soporte para flujos de deep linking, archivos, protocolos y más.