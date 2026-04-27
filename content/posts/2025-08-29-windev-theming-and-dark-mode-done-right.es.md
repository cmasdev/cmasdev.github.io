---
layout: post
title: Implementación correcta de theming y modo oscuro en WinUI 3 en aplicaciones reales
author: Christian Amado
date: 2025-08-29 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones modernas, el soporte para theming y modo oscuro no es un detalle opcional, sino una expectativa del usuario. WinUI 3 ofrece capacidades nativas para manejar temas, pero su implementación incorrecta genera inconsistencias visuales y problemas de mantenibilidad.

Cuando una aplicación no gestiona correctamente los temas, aparecen problemas como estilos duplicados, controles con apariencia incorrecta y falta de coherencia visual.
<!--more-->

Este artículo analiza cómo implementar correctamente theming y modo oscuro en WinUI 3 en escenarios reales.

## El problema

Un error común es aplicar estilos manuales sin aprovechar el sistema de theming de WinUI.

Errores frecuentes:

- Colores hardcodeados  
- Falta de soporte para modo oscuro  
- Estilos duplicados  
- Inconsistencias entre vistas  
- Dificultad para mantener apariencia  

### Ejemplo incorrecto

```xml
<TextBlock Foreground="Black" Text="Texto"/>
```

Problemas:

- No respeta el tema del sistema  
- No funciona en modo oscuro  
- Difícil de mantener  

## La solución

El theming debe:

1. Basarse en recursos  
2. Soportar temas claro/oscuro  
3. Centralizar estilos  
4. Evitar valores hardcodeados  

## Paso 1: Uso de ThemeResources

```xml
<TextBlock Foreground="{ThemeResource TextFillColorPrimaryBrush}" Text="Texto"/>
```

Esto permite adaptarse automáticamente al tema.

## Paso 2: Definir recursos globales

```xml
<Application.Resources>
    <ResourceDictionary>
        <Color x:Key="PrimaryColor">#0078D4</Color>
        <SolidColorBrush x:Key="PrimaryBrush" Color="{StaticResource PrimaryColor}"/>
    </ResourceDictionary>
</Application.Resources>
```

Esto centraliza la configuración.

## Paso 3: Soporte para múltiples temas

```xml
<ResourceDictionary.ThemeDictionaries>
    <ResourceDictionary x:Key="Light">
        <Color x:Key="BackgroundColor">White</Color>
    </ResourceDictionary>
    <ResourceDictionary x:Key="Dark">
        <Color x:Key="BackgroundColor">Black</Color>
    </ResourceDictionary>
</ResourceDictionary.ThemeDictionaries>
```

Esto permite cambiar automáticamente según el tema.

## Paso 4: Cambio dinámico de tema

```csharp
((FrameworkElement)Window.Current.Content).RequestedTheme = ElementTheme.Dark;
```

Esto permite modificar el tema en runtime.

## Paso 5: Evitar estilos duplicados

Centralizar estilos:

```xml
<Style TargetType="Button">
    <Setter Property="Background" Value="{ThemeResource PrimaryBrush}"/>
</Style>
```

Esto mejora consistencia.

## Paso 6: Testing visual

Validar:

- Tema claro  
- Tema oscuro  
- Diferentes resoluciones  

Esto asegura calidad visual.

## Paso 7: Problemas en producción

- Controles que no respetan el tema  
- Mezcla de estilos  
- UI inconsistente  
- Mantenimiento complejo  

Solución:

- Usar ThemeResource  
- Centralizar estilos  
- Evitar hardcoding  

## Buenas prácticas

- Utilizar ThemeResource en lugar de valores fijos  
- Centralizar recursos  
- Soportar modo oscuro desde el inicio  
- Validar consistencia visual  
- Evitar duplicación de estilos  

## Conclusión

El manejo correcto de theming en WinUI 3 permite construir aplicaciones modernas, consistentes y alineadas con las expectativas del usuario. Una implementación adecuada reduce problemas de mantenimiento y mejora la experiencia visual.

Ignorar estos principios conduce a interfaces inconsistentes y difíciles de adaptar a distintos entornos.