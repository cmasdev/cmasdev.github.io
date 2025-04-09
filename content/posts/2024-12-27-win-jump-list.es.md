---
layout: post
title: "Uso avanzado de la Jump List API para apps modernas"
author: Christian Amado
date: 2024-12-27 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Las *Jump Lists* en **Windows** son menús contextuales que aparecen cuando el usuario hace clic derecho sobre el icono de una aplicación anclada a la barra de tareas o en el menú de inicio. Estas listas permiten exponer accesos directos a tareas frecuentes o específicas dentro de la aplicación, mejorando la accesibilidad, productividad y personalización de la experiencia de usuario.

Con **Windows App SDK** y **WinUI 3**, las apps modernas pueden crear y actualizar Jump Lists de forma dinámica, segmentarlas por grupos, incluir acciones personalizadas y manejar parámetros que activen flujos específicos al iniciarse la app.

Este artículo describe paso a paso cómo implementar Jump Lists avanzadas con categorías, argumentos, iconos y comportamiento personalizado en apps **WinUI 3** empaquetadas.

<!--more-->

## Requisitos

- Windows 11
- Visual Studio 2022 o superior
- Proyecto WinUI 3 (packaged) con Windows App SDK
- SDK mínimo: Windows 10 1903 (10.0.18362) o superior
- Referencia a `Windows.UI.StartScreen` y `Windows.Foundation.Collections`

## Paso 1: Verificar soporte de Jump List

Antes de cualquier operación, se debe verificar si la funcionalidad está habilitada en el sistema del usuario:

```csharp
bool isSupported = await JumpList.IsSupportedAsync();
if (!isSupported)
{
    // Mostrar mensaje o fallback
}
```

## Paso 2: Crear una Jump List básica

```csharp
var jumpList = await JumpList.LoadCurrentAsync();
jumpList.Items.Clear();

var item = JumpListItem.CreateWithArguments("abrirPanel", "Panel de control");
item.Description = "Abrir el panel principal de la app";
item.Logo = new Uri("ms-appx:///Assets/panel.png");

jumpList.Items.Add(item);
await jumpList.SaveAsync();
```

Este ejemplo muestra cómo crear un acceso directo que aparecerá al hacer clic derecho en la app anclada.

## Paso 3: Crear múltiples categorías (grupos)

```csharp
jumpList.Items.Add(JumpListItem.CreateSeparator());

var item1 = JumpListItem.CreateWithArguments("modoLectura", "Abrir en modo lectura");
item1.GroupName = "Modos de inicio";

var item2 = JumpListItem.CreateWithArguments("modoEdicion", "Abrir en modo edición");
item2.GroupName = "Modos de inicio";

jumpList.Items.Add(item1);
jumpList.Items.Add(item2);

await jumpList.SaveAsync();
```

Los elementos con el mismo `GroupName` aparecerán agrupados bajo ese título.

## Paso 4: Manejar los argumentos en el arranque

En `App.xaml.cs`, sobrescribir `OnLaunched`:

```csharp
protected override void OnLaunched(Microsoft.UI.Xaml.LaunchActivatedEventArgs args)
{
    var arguments = args.Arguments;

    if (arguments == "modoLectura")
    {
        new ReaderWindow().Activate();
        return;
    }
    else if (arguments == "modoEdicion")
    {
        new EditorWindow().Activate();
        return;
    }
    else if (arguments == "abrirPanel")
    {
        new PanelWindow().Activate();
        return;
    }

    m_window = new MainWindow();
    m_window.Activate();
}
```

Esto permite que cada acceso directo ejecute una función distinta de la app.

## Paso 5: Añadir iconos personalizados

Los íconos de cada elemento deben estar en formato `.png` dentro del paquete MSIX (por ejemplo, en `/Assets`).

```csharp
item.Logo = new Uri("ms-appx:///Assets/lectura.png");
```

Tamaño recomendado: 32x32 o 64x64. Asegurarse de que estén incluidos en el proyecto como contenido con "Copy if newer".

## Paso 6: Añadir separadores visuales

Para mejorar la jerarquía, usar:

```csharp
jumpList.Items.Add(JumpListItem.CreateSeparator());
```

Esto crea una línea de separación visual entre grupos o categorías.

## Paso 7: Actualización dinámica de la Jump List

Las Jump Lists pueden ser actualizadas dinámicamente según el estado del usuario, datos recientes, documentos o permisos:

```csharp
if (usuarioEsAdmin)
{
    var adminItem = JumpListItem.CreateWithArguments("panelAdmin", "Panel de administración");
    adminItem.GroupName = "Herramientas";
    jumpList.Items.Add(adminItem);
}
```

Después de modificar, recordar guardar:

```csharp
await jumpList.SaveAsync();
```

## Paso 8: Limpiar o resetear la Jump List

En algunos escenarios (cerrar sesión, cambiar de perfil), es útil limpiar:

```csharp
var jumpList = await JumpList.LoadCurrentAsync();
jumpList.Items.Clear();
await jumpList.SaveAsync();
```

Esto garantiza que no haya entradas obsoletas.

## Buenas prácticas

- Usar textos cortos y descripciones claras
- Limitar la lista a 5–7 accesos para no sobrecargar
- Organizar por contexto (modos, herramientas, recientes)
- Evitar agregar funciones no disponibles para el usuario actual
- Actualizar en tiempo de ejecución si cambia el contexto del usuario

## Casos de uso reales

- Acceder directamente a secciones internas de una app (informes, configuración, contactos)
- Iniciar flujos especiales (cámara, escaneo, captura, conexión)
- Abrir documentos recientes o plantillas específicas
- Exponer acciones administrativas para perfiles con privilegios
- Soporte para herramientas multitarea sin cambiar ventana principal

## Conclusión

La *Jump List API* permite a las aplicaciones modernas **WinUI 3** integrarse profundamente con la experiencia del escritorio en **Windows**, ofreciendo accesos directos contextualizados, útiles y adaptables. Esta funcionalidad mejora la interacción del usuario con la aplicación y refuerza su presencia en el sistema operativo, permitiendo flujos más rápidos y naturales desde la barra de tareas o el menú inicio.

A través de argumentos, iconos, agrupaciones y lógica condicional, las Jump Lists pueden convertirse en una poderosa extensión de la experiencia del usuario para cualquier aplicación moderna en **Windows**.
