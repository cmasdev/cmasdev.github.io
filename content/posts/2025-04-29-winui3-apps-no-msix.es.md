---
layout: post
title: "Desarrollo de aplicaciones WinUI 3 sin empaquetado MSIX: Uso del bootstrapper API"
author: Christian Amado
date: 2025-04-29 00:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Uno de los retos más comunes al desarrollar aplicaciones modernas con **WinUI 3** (**Windows App SDK**) es la necesidad de empaquetarlas como **MSIX** para poder ejecutarlas. Si bien **MSIX** ofrece ventajas como actualización automática y mayor seguridad, no siempre es la opción ideal —especialmente para herramientas internas, entornos empresariales controlados o aplicaciones distribuidas manualmente.

Con la evolución del **Windows App SDK**, **Microsoft** introdujo la posibilidad de ejecutar aplicaciones **WinUI 3* `unpackaged` (sin MSIX), utilizando un enfoque conocido como bootstrapper API. Este artículo explora cómo implementar este enfoque, cuáles son sus ventajas y limitaciones, y cómo configurarlo correctamente.

<!--more-->

## ¿Qué significa una app WinUI 3 sin empaquetar?

Una aplicación **unpackaged** es aquella que:
- No requiere instalación con MSIX.
- No se registra en el sistema con capacidades como actualizaciones automáticas o integración con URI handlers.
- Puede ejecutarse directamente desde un `.exe` como cualquier aplicación tradicional Win32.
- Requiere inicialización manual del entorno Windows App SDK.

Esta opción resulta ideal para desarrolladores que buscan control absoluto sobre el despliegue y ejecución.

## ¿Qué es el bootstrapper API?

El **bootstrapper API** es una librería que permite inicializar manualmente el entorno de ejecución del Windows App SDK en tiempo de ejecución, sin necesidad de empaquetado MSIX. Es el corazón del soporte **"unpackaged apps"** en WinUI 3.

Permite:

- Iniciar el runtime del Windows App SDK desde el ejecutable.
- Validar e instalar automáticamente las dependencias necesarias.
- Acceder a la funcionalidad de WinUI 3 desde un entorno nativo (sin empaquetar).

## Requisitos previos

- **Visual Studio 2022** (v17.8+) con workloads para Desktop Development (C++) y .NET Desktop.
- **Windows App SDK 1.3 o superior**.
- SDK de Windows 11 (recomendado).
- Runtime de Windows App SDK preinstalado en la máquina destino.

## Crear una app WinUI 3 sin MSIX paso a paso

### Paso 1: Crear el proyecto

En Visual Studio:

1. Crear un nuevo proyecto del tipo **"Blank App, Unpackaged (WinUI 3 in Desktop)"**.
2. Seleccionar el target framework `net8.0-windows10.0.19041.0` o superior.

Esto generará una estructura básica con soporte para ejecución sin MSIX.

### Paso 2: Verificar el uso del bootstrapper

```csharp
using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.Windows.AppLifecycle;
using Microsoft.Windows.AppNotifications;
using Microsoft.Windows.ApplicationModel.DynamicDependency;

class Program
{
    [STAThread]
    static void Main(string[] args)
    {
        Bootstrap.Initialize();
        var app = new App();
        app.Run();
    }
}
```

### Paso 3: Agregar referencia al SDK

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows10.0.19041.0</TargetFramework>
    <UseWinUI>true</UseWinUI>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.WindowsAppSDK" Version="1.5.240316000" />
  </ItemGroup>

</Project>
```

### Paso 4: Generar el ejecutable sin MSIX

```bash
dotnet publish -c Release -r win-x64 --self-contained true
```

### Paso 5: Verificación del entorno en tiempo de ejecución

```csharp
try
{
    Bootstrap.Initialize();
}
catch (Exception ex)
{
    MessageBox.Show("El entorno de ejecución requerido (Windows App SDK) no está disponible. Por favor, instale la versión correcta.", "Error");
    Environment.Exit(1);
}
```

## Ventajas del enfoque sin empaquetado

- **Distribución simple**: basta con copiar el `.exe` y sus dependencias.
- **Integración con flujos CI/CD existentes** sin necesidad de firmar o empaquetar.
- **Ideal para herramientas internas**, utilidades empresariales o entornos sin Store.
- Compatible con **instaladores tradicionales** como InnoSetup, NSIS o scripts personalizados.

## Limitaciones

- No tiene acceso a funciones específicas del manifiesto MSIX (por ejemplo, alias de terminal, protocol handlers).
- El usuario final debe tener el runtime del Windows App SDK instalado.
- No se puede publicar en Microsoft Store sin MSIX.

## Buenas prácticas

- Incluir en el instalador un chequeo del runtime del Windows App SDK.
- Usar `InvariantGlobalization=true` para mejorar compatibilidad y reducir tamaño.
- Documentar claramente que la app no requiere instalación formal.

## Escenarios ideales

- Aplicaciones de línea de comandos con interfaz gráfica ligera.
- Herramientas internas para técnicos de soporte o administradores.
- Desarrollos experimentales o MVPs donde se requiere rapidez de entrega.
- Sustitución de aplicaciones WPF o WinForms clásicas por tecnologías modernas sin imponer fricción en la distribución.

## Conclusión

Desarrollar aplicaciones **WinUI 3** sin empaquetado **MSIX** es completamente viable gracias al bootstrapper API del **Windows App SDK**. Este enfoque ofrece flexibilidad total en despliegue, una experiencia de desarrollo más cercana a las apps **Win32** tradicionales, y la potencia de una interfaz moderna con XAML.

Para equipos que buscan adoptar **WinUI 3** sin complicaciones de distribución, esta alternativa representa un camino realista, moderno y alineado con las necesidades empresariales del escritorio de hoy.