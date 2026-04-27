---
layout: post
title: Patrones de navegación en WinUI 3 para aplicaciones escalables
author: Christian Amado
date: 2025-07-04 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones de escritorio modernas, la navegación deja de ser un detalle de implementación y pasa a ser un componente estructural que define la experiencia del usuario y la organización interna del sistema. En WinUI 3, existen múltiples formas de implementar navegación, pero no todas son adecuadas para aplicaciones reales.

A medida que la aplicación crece, una navegación mal diseñada genera acoplamiento, duplicación de lógica y dificultades para mantener el flujo de la aplicación.
<!--more-->

Este artículo analiza los patrones de navegación en WinUI 3 desde una perspectiva profesional, enfocándose en escalabilidad y mantenibilidad.

## El problema

En muchos proyectos, la navegación se implementa de forma directa utilizando instancias de páginas sin una estrategia clara.

Errores comunes:

- Navegación directa desde code-behind  
- Creación manual de páginas sin control  
- Falta de estado en navegación  
- Dependencias entre vistas  
- Dificultad para testear flujos  

### Ejemplo incorrecto

```csharp
private void Navigate_Click(object sender, RoutedEventArgs e)
{
    Frame.Navigate(typeof(DetailsPage));
}
```

Problemas:

- Lógica de navegación en la vista  
- No existe abstracción  
- Difícil de mantener  
- No reutilizable  

En aplicaciones reales, este enfoque no escala.

## La solución

La navegación debe abstraerse como un servicio, desacoplado de la UI.

Principios:

1. Centralizar navegación  
2. Evitar dependencias directas entre vistas  
3. Permitir control del estado  
4. Facilitar testing  

## Paso 1: Crear un servicio de navegación

```csharp
public interface INavigationService
{
    void Navigate(Type pageType, object parameter = null);
}

public class NavigationService : INavigationService
{
    private readonly Frame _frame;

    public NavigationService(Frame frame)
    {
        _frame = frame;
    }

    public void Navigate(Type pageType, object parameter = null)
    {
        _frame.Navigate(pageType, parameter);
    }
}
```

Esto encapsula la navegación.

## Paso 2: Usar navegación desde ViewModel

```csharp
public class MainViewModel
{
    private readonly INavigationService _navigation;

    public MainViewModel(INavigationService navigation)
    {
        _navigation = navigation;
    }

    public void GoToDetails()
    {
        _navigation.Navigate(typeof(DetailsPage));
    }
}
```

El ViewModel controla el flujo.

## Paso 3: Integración con comandos

```csharp
public ICommand NavigateCommand { get; }

public MainViewModel(INavigationService navigation)
{
    _navigation = navigation;

    NavigateCommand = new RelayCommand(GoToDetails);
}
```

Vista:

```xml
<Button Content="Ir a detalles"
        Command="{x:Bind ViewModel.NavigateCommand}" />
```

## Paso 4: Manejo de parámetros

```csharp
_navigation.Navigate(typeof(DetailsPage), selectedItem);
```

En la página:

```csharp
protected override void OnNavigatedTo(NavigationEventArgs e)
{
    var item = e.Parameter;
}
```

Esto permite pasar contexto.

## Paso 5: Control del historial

El Frame mantiene historial automáticamente.

```csharp
if (_frame.CanGoBack)
{
    _frame.GoBack();
}
```

Se puede encapsular en el servicio.

## Paso 6: Escalabilidad

En aplicaciones grandes, se recomienda:

- Definir rutas lógicas  
- Evitar referencias directas a tipos  
- Usar identificadores de navegación  

Ejemplo:

```csharp
public enum PageKey
{
    Main,
    Details
}
```

Esto desacopla aún más la navegación.

## Buenas prácticas

- Centralizar navegación en un servicio  
- Evitar navegación directa desde la vista  
- Usar comandos para ejecutar acciones  
- Manejar parámetros explícitamente  
- Preparar el sistema para crecimiento  

## Conclusión

La navegación en WinUI 3 es un componente arquitectónico que debe diseñarse cuidadosamente. Un enfoque estructurado permite construir aplicaciones escalables, mantenibles y con flujos claros.

Ignorar estos principios conduce a sistemas difíciles de evolucionar y con alto acoplamiento entre componentes.
