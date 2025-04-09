---
layout: post
title: "Creación de ventanas flotantes estilo Widget con posicionamiento persistente en pantalla"
author: Christian Amado
date: 2024-02-21 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Las ventanas flotantes (overlay) son una técnica poderosa para presentar información contextual o utilitaria en una aplicación de escritorio. En el ecosistema moderno de **Windows**, se pueden implementar como “ventanas tipo Widget” que permanecen siempre visibles, no aparecen en la barra de tareas y mantienen su posición de forma persistente. Este tipo de UI es ideal para herramientas de monitoreo, asistentes, controles rápidos o paneles interactivos.

Este artículo explica cómo crear este tipo de ventana en una app moderna usando **WinUI 3** y **Windows App SDK**, controlando su estilo, posición y comportamiento sin interferir con el foco de otras ventanas del sistema.

<!--more-->

## Requisitos

- Windows 11
- Visual Studio 2022
- Windows App SDK 1.3 o superior
- Proyecto WinUI 3 (Packaged)

## Paso 1: Crear una nueva ventana tipo overlay

Definir una nueva clase de ventana:

```csharp
public sealed partial class WidgetWindow : Window
{
    public WidgetWindow()
    {
        this.InitializeComponent();
        this.ExtendsContentIntoTitleBar = false;
        this.SetWidgetStyle();
    }

    private void SetWidgetStyle()
    {
        var hwnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
        var hwndId = Microsoft.UI.Win32Interop.GetWindowIdFromWindow(hwnd);
        var appWindow = Microsoft.UI.Windowing.AppWindow.GetFromWindowId(hwndId);

        appWindow.SetPresenter(AppWindowPresenterKind.CompactOverlay); // modo PiP
        appWindow.IsShownInSwitchers = false;
    }
}
```

Esto crea una ventana pequeña, sin ícono en barra de tareas ni Alt+Tab.

## Paso 2: Configurar tamaño, posición y transparencia

En el constructor:

```csharp
appWindow.Resize(new Windows.Graphics.SizeInt32 { Width = 320, Height = 200 });
appWindow.Move(new Windows.Graphics.PointInt32 { X = 1000, Y = 60 });
appWindow.Changed += AppWindow_Changed;
```

Persistir posición en `AppWindow_Changed`:

```csharp
private void AppWindow_Changed(AppWindow sender, object args)
{
    var bounds = sender.Position;
    Settings.Default.WidgetX = bounds.X;
    Settings.Default.WidgetY = bounds.Y;
    Settings.Default.Save();
}
```

Leer posición previa al iniciar:

```csharp
int posX = Settings.Default.WidgetX;
int posY = Settings.Default.WidgetY;
appWindow.Move(new Windows.Graphics.PointInt32 { X = posX, Y = posY });
```

## Paso 3: Eliminar marco y ajustar diseño

En XAML:

```xml
<Border Background="White" CornerRadius="10" Padding="10" BorderBrush="Gray" BorderThickness="1">
  <StackPanel>
    <TextBlock Text="Estado del sistema"/>
    <ProgressBar Value="70" Width="200"/>
  </StackPanel>
</Border>
```

Eliminar barra de título:

```csharp
appWindow.TitleBar.ExtendsContentIntoTitleBar = true;
appWindow.TitleBar.SetPreferredHeight(0);
```

## Paso 4: Mostrar la ventana desde la app principal

```csharp
private void MostrarWidget_Click(object sender, RoutedEventArgs e)
{
    var widget = new WidgetWindow();
    widget.Activate();
}
```

## Paso 5: Mantener siempre visible (topmost)

Windows App SDK no expone directamente `Topmost`. Usar Win32 interop:

```csharp
[DllImport("user32.dll")]
static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

const int SWP_NOSIZE = 0x0001;
const int SWP_NOMOVE = 0x0002;
const uint TOPMOST_FLAGS = SWP_NOMOVE | SWP_NOSIZE;

SetWindowPos(hwnd, new IntPtr(-1), 0, 0, 0, 0, TOPMOST_FLAGS); // HWND_TOPMOST
```

Esto asegura que el widget flote sobre el resto.

## Casos de uso reales

- Visualizadores de estado de sistema o recursos
- Paneles de control rápido (audio, energía, VPN)
- Asistentes flotantes de accesibilidad o IA
- Lectores de transcripción, traductores o anotadores
- Herramientas para streamers o grabación de pantalla

## Buenas prácticas

- Permitir al usuario mover y cerrar la ventana fácilmente
- Guardar posición y tamaño de forma persistente
- No interferir con el foco de otras apps
- Proveer configuración de visibilidad (autoocultar, minimizar)
- No mostrar por defecto sin consentimiento del usuario

## Conclusión

Con **WinUI 3** y **Windows App SDK** es posible crear ventanas flotantes al estilo Widget que extienden la funcionalidad de la app más allá de la ventana principal. Este patrón de UI permite construir experiencias utilitarias, persistentes y altamente accesibles para los usuarios de **Windows 11**, aprovechando al máximo las capacidades del sistema operativo moderno.
