---
layout: post
title: "Creando un menú contextual personalizado con WinUI 3 y XAML Islands"
author: Christian Amado
date: 2025-05-07 00:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---
En las aplicaciones modernas de **Windows**, los menús contextuales juegan un rol clave en mejorar la usabilidad y la productividad del usuario. En este artículo se mostrará cómo construir un menú contextual personalizado utilizando **WinUI 3** y, opcionalmente, aprovechar **XAML Islands** para integrar componentes enriquecidos si estás migrando desde un entorno **WPF** o **WinForms**.

<!--more-->

## Requisitos previos

- Visual Studio 2022 o superior.
- Windows App SDK 1.4+ (preferiblemente 1.5).
- SDK de Windows 10/11 instalado.
- Conocimiento básico de XAML y WinUI 3.

## Crear la base de la app en WinUI 3

```bash
dotnet new winui3 -n CustomContextMenuDemo
cd CustomContextMenuDemo
```

Asegurate de que el `.csproj` use Windows App SDK v1.4 o superior.

## Diseñar el menú contextual en XAML

### Ejemplo básico:

```xml
<MenuFlyout x:Key="CustomContextMenu">
    <MenuFlyoutItem Text="Copiar" Icon="Copy" Click="OnCopyClick"/>
    <MenuFlyoutItem Text="Pegar" Icon="Paste" Click="OnPasteClick"/>
    <MenuFlyoutSeparator />
    <MenuFlyoutItem Text="Opciones avanzadas" Icon="Setting" Click="OnSettingsClick"/>
</MenuFlyout>
```

En el `MainWindow.xaml`:

```xml
<Grid RightTapped="OnGridRightTapped">
    <TextBlock Text="Haz clic derecho en cualquier parte del área." />
</Grid>
```

## Lógica para mostrar el menú contextual

```csharp
private void OnGridRightTapped(object sender, RightTappedRoutedEventArgs e)
{
    var menu = (MenuFlyout)this.Resources["CustomContextMenu"];
    menu.ShowAt((FrameworkElement)sender, e.GetPosition((FrameworkElement)sender));
}
```

## Agregar accesibilidad y teclas rápidas

```xml
<MenuFlyoutItem Text="Copiar" Icon="Copy" Click="OnCopyClick" KeyboardAccelerators="{KeyboardAccelerator Key=C Modifiers=Control}"/>
```

También se pueden agregar `AutomationProperties.Name` para accesibilidad con narrador.

## Integración opcional con XAML Islands

Si migrás desde un entorno WinForms o WPF y querés mostrar un control legado (como un gráfico de WPF) dentro del menú:

- Usá un `Popup` + `WindowsXamlHost` en lugar de `MenuFlyout`.
- Embedí el contenido de WPF con lógica personalizada.

**Nota**: Esto aplica más a proyectos híbridos, no es necesario para apps puras en WinUI 3.

## Conclusión

Crear menús contextuales personalizados en **WinUI 3** permite brindar una experiencia moderna y rica al usuario final, sin sacrificar la integración nativa con el sistema operativo. A medida que evoluciona **Windows App SDK**, se pueden enriquecer aún más estos menús con animaciones, bindings MVVM y controles complejos.
