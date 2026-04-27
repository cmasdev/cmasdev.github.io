---
layout: post
title: Manejo de estado y ciclo de vida en aplicaciones WinUI 3 en escenarios reales
author: Christian Amado
date: 2025-07-11 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones de escritorio modernas, el manejo de estado y el entendimiento del ciclo de vida de la aplicación son factores determinantes para garantizar consistencia, estabilidad y una buena experiencia de usuario. En WinUI 3, estos aspectos no siempre son evidentes, lo que lleva a implementaciones frágiles en escenarios reales.

A medida que la aplicación crece, la falta de control sobre el estado genera comportamientos inconsistentes: datos que se pierden, vistas que no reflejan cambios y flujos difíciles de seguir.
<!--more-->

Este artículo analiza cómo manejar correctamente el estado y el ciclo de vida en aplicaciones WinUI 3, evitando errores comunes y estableciendo una base sólida para aplicaciones escalables.

## El problema

Muchos desarrolladores no consideran explícitamente el estado de la aplicación ni su ciclo de vida.

Errores comunes:

- Estado almacenado directamente en la vista  
- Falta de persistencia de datos  
- Inicialización duplicada  
- Pérdida de contexto al navegar  
- Falta de control sobre eventos del ciclo de vida  

### Ejemplo incorrecto

```csharp
private void Page_Loaded(object sender, RoutedEventArgs e)
{
    LoadData();
}
```

Problemas:

- Se ejecuta múltiples veces  
- No hay control del estado  
- Puede generar duplicación de datos  
- Difícil de mantener  

En producción, esto provoca errores difíciles de rastrear.

## La solución

El manejo correcto requiere:

1. Centralizar el estado  
2. Controlar el ciclo de vida  
3. Evitar duplicaciones  
4. Persistir información relevante  

## Paso 1: Definir un estado centralizado

```csharp
public class AppState
{
    public string CurrentUser { get; set; }
    public bool IsInitialized { get; set; }
}
```

Este objeto representa el estado global.

## Paso 2: Registrar el estado como servicio

```csharp
services.AddSingleton<AppState>();
```

Esto permite compartir el estado en toda la aplicación.

## Paso 3: Evitar inicializaciones múltiples

```csharp
public class MainViewModel
{
    private readonly AppState _state;

    public MainViewModel(AppState state)
    {
        _state = state;
    }

    public void Initialize()
    {
        if (_state.IsInitialized)
            return;

        // lógica de inicialización
        _state.IsInitialized = true;
    }
}
```

Esto evita ejecuciones duplicadas.

## Paso 4: Manejo del ciclo de vida

WinUI 3 expone eventos importantes en la aplicación.

```csharp
public partial class App : Application
{
    protected override void OnLaunched(Microsoft.UI.Xaml.LaunchActivatedEventArgs args)
    {
        // Inicialización principal
    }
}
```

Se debe centralizar la lógica en este punto.

## Paso 5: Persistencia de estado

En aplicaciones reales, el estado debe persistirse.

```csharp
public class StateService
{
    public void Save(string data)
    {
        // Guardar en almacenamiento local
    }

    public string Load()
    {
        return "data";
    }
}
```

Esto permite recuperar información entre sesiones.

## Paso 6: Estado por vista

No todo el estado debe ser global.

```csharp
public class DetailsViewModel
{
    public string SelectedItem { get; set; }
}
```

Se debe diferenciar entre estado global y local.

## Paso 7: Sincronización con la UI

El estado debe reflejarse mediante binding.

```xml
<TextBlock Text="{x:Bind ViewModel.CurrentUser}" />
```

Esto mantiene la UI consistente.

## Buenas prácticas

- Centralizar el estado crítico  
- Evitar lógica en eventos de UI  
- Controlar inicialización  
- Persistir información relevante  
- Separar estado global y local  

## Conclusión

El manejo de estado y el control del ciclo de vida en WinUI 3 son elementos fundamentales para construir aplicaciones robustas. Una implementación adecuada evita errores sutiles, mejora la experiencia del usuario y permite escalar el sistema sin inconsistencias.

Ignorar estos aspectos conduce a aplicaciones impredecibles y difíciles de mantener.
