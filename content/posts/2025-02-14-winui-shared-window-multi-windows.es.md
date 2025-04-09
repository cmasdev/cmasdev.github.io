---
layout: post
title: "Uso de la nueva API de Shared Window Mode para apps multi-ventana en Windows 11"
author: Christian Amado
date: 2025-02-14 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**Windows 11** introduce nuevas capacidades para la gestión de ventanas, entre ellas el **Shared Window Mode**, que permite que las aplicaciones modernas compartan múltiples ventanas como parte de una misma experiencia multitarea. Esta característica mejora el soporte nativo para escenarios como edición paralela, múltiples vistas, comparaciones en paralelo y workflows de aplicaciones productivas.

En este artículo se explora cómo utilizar esta API desde una aplicación moderna WinUI 3 utilizando **Windows App SDK**, gestionando múltiples ventanas, compartiéndolas dentro de un contexto común y habilitando integración visual con Snap Layouts y Alt+Tab de forma coherente.

<!--more-->

## Requisitos

- Windows 11 build 22621 o superior
- Visual Studio 2022
- Windows App SDK 1.3+ (preferido 1.4+)
- Proyecto empaquetado (MSIX) con soporte multi-ventana

## Fundamento: ¿qué es Shared Window Mode?

Es un modo de presentación que permite agrupar múltiples ventanas dentro del mismo conjunto lógico del sistema operativo. A efectos del usuario, todas las ventanas se tratan como una única aplicación, tanto visualmente como en el sistema de tareas, Snap Layouts y la barra de tareas.

## Paso 1: Crear una ventana secundaria en WinUI 3

```csharp
public sealed partial class EditorWindow : Window
{
    public EditorWindow()
    {
        this.InitializeComponent();
        this.Title = "Editor Avanzado";
    }
}
```

Desde `MainWindow.xaml.cs`:

```csharp
private void AbrirNuevaVentana_Click(object sender, RoutedEventArgs e)
{
    var ventana = new EditorWindow();
    ventana.Activate();
}
```

Esto crea una segunda ventana independiente.

## Paso 2: Declarar el grupo de presentación compartida

Importar:

```csharp
using Microsoft.UI.Windowing;
using Windows.UI.WindowManagement;
```

Crear el grupo de ventana compartida:

```csharp
var presenter = AppWindowPresenter.CreateForContext("edicion");
presenter.GroupMode = AppWindowGroupMode.Shared;
```

A partir de Windows App SDK 1.4, se puede usar:

```csharp
AppWindowGroup group = await AppWindowGroup.TryCreateAsync();
group.AddWindow(AppWindow.GetFromWindowId(windowId));
```

Esto agrupa ambas ventanas visualmente.

## Paso 3: Activar Snap Layouts compartidos

El sistema operativo permite agrupar estas ventanas en Snap Layouts como si fueran parte de una sola app.

```csharp
var mainAppWindow = AppWindow.GetFromWindowId(GetWindowIdForWindow(MainWindow));
var secondaryAppWindow = AppWindow.GetFromWindowId(GetWindowIdForWindow(EditorWindow));

await AppWindowGroup.CreateFromAppWindowsAsync(new[] { mainAppWindow, secondaryAppWindow });
```

Esto las unifica para minimizar, cerrar, agrupar en la barra de tareas y cambiar con Alt+Tab.

## Paso 4: Controlar comportamiento individual

Cada ventana puede mantener sus controles independientes. Por ejemplo:

```csharp
EditorWindow editor = new EditorWindow();
editor.ExtendsContentIntoTitleBar = true;
editor.AppWindow.SetIcon("Assets/editor.png");
editor.AppWindow.Resize(new Windows.Graphics.SizeInt32 { Width = 800, Height = 600 });
editor.Activate();
```

## Paso 5: Comunicación entre ventanas

Usar `static` o eventos para intercambio de datos:

```csharp
public static Action<string>? OnGuardarNota;

private void Guardar_Click(object sender, RoutedEventArgs e)
{
    OnGuardarNota?.Invoke(txtNota.Text);
}
```

En `MainWindow`, suscribirse:

```csharp
EditorWindow.OnGuardarNota = (nota) => NotasList.Items.Add(nota);
```

## Casos de uso reales

- Aplicaciones con vista de edición y vista previa paralela
- Múltiples documentos (MDI) con organización automática
- Comparación de versiones, código o texto
- Edición por secciones o pestañas separadas

## Buenas prácticas

- No sobrecargar al usuario con muchas ventanas simultáneas
- Dar control claro para cerrar o reabrir ventanas
- Persistir tamaño y posición si es relevante
- Usar iconos y títulos descriptivos para distinguir roles
- Evitar bloquear el hilo principal con la creación de ventanas

## Conclusión

El **Shared Window Mode** en **Windows 11** permite ofrecer una experiencia de usuario verdaderamente multitarea y flexible en apps modernas. Esta capacidad, combinada con **WinUI 3** y **Windows App SDK**, habilita escenarios productivos, colaborativos y visuales que antes requerían soluciones complejas. Gracias a su integración con *AppWindowGroup* y *Snap Layouts*, las apps modernas pueden comportarse como verdaderos entornos profesionales de trabajo múltiple.