---
layout: post
title: Fundamentos de WinUI 3 aplicados a aplicaciones reales
author: Christian Amado
date: 2025-05-16 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK,WInUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En el desarrollo moderno de aplicaciones de escritorio en Windows, WinUI 3 representa la capa de presentación recomendada para construir interfaces nativas, modernas y desacopladas del sistema operativo. Sin embargo, su adopción suele comenzar con ejemplos simples que no reflejan la complejidad de escenarios reales.

Cuando una aplicación comienza a crecer, decisiones aparentemente pequeñas en la UI pueden generar problemas estructurales: acoplamiento, baja mantenibilidad y dificultades para escalar funcionalidades.
<!--more-->

Este artículo aborda los fundamentos de WinUI 3 desde una perspectiva práctica, enfocándose en cómo se debe utilizar en aplicaciones reales y qué errores evitar desde el inicio.

## El problema

Uno de los errores más comunes al trabajar con WinUI 3 es tratar la UI como un elemento aislado, sin considerar su impacto en la arquitectura general.

Esto se manifiesta en:

- Code-behind excesivo  
- Lógica de negocio dentro de la vista  
- Uso incorrecto de bindings  
- Falta de separación entre estado y presentación  

### Ejemplo incorrecto

```csharp
private void Button_Click(object sender, RoutedEventArgs e)
{
    var items = new List<string> { "A", "B", "C" };

    foreach (var item in items)
    {
        MyListView.Items.Add(item);
    }
}
```

Problemas:

- No reutilizable  
- Difícil de testear  
- UI dependiente de la lógica  
- Difícil de mantener  

En aplicaciones reales, este enfoque genera deuda técnica desde el primer momento.

## La solución

WinUI 3 debe utilizarse como parte de una arquitectura estructurada, donde la UI es únicamente responsable de la representación.

El patrón recomendado es MVVM.

## Paso 1: Separar responsabilidades

El objetivo es eliminar lógica de la vista.

```csharp
public class MainViewModel
{
    public ObservableCollection<string> Items { get; } = new();

    public void LoadData()
    {
        Items.Clear();

        Items.Add("A");
        Items.Add("B");
        Items.Add("C");
    }
}
```

## Paso 2: Binding correcto

```xml
<ListView ItemsSource="{x:Bind ViewModel.Items, Mode=OneWay}" />
```

Esto permite que la UI reaccione automáticamente a cambios en los datos.

## Paso 3: Evitar lógica en la vista

```csharp
public sealed partial class MainWindow : Window
{
    public MainViewModel ViewModel { get; }

    public MainWindow()
    {
        this.InitializeComponent();

        ViewModel = new MainViewModel();
        this.DataContext = this;
    }

    private void Load_Click(object sender, RoutedEventArgs e)
    {
        ViewModel.LoadData();
    }
}
```

La vista delega completamente la lógica al ViewModel.

## Paso 4: Manejo de estado

En aplicaciones reales, el estado cambia constantemente.

```csharp
public class MainViewModel
{
    public ObservableCollection<string> Items { get; } = new();

    private bool _isLoading;
    public bool IsLoading
    {
        get => _isLoading;
        set
        {
            _isLoading = value;
        }
    }
}
```

Este tipo de propiedades permite reflejar estado en la UI.

## Paso 5: Escalabilidad

Una aplicación WinUI debe diseñarse para crecer.

Esto implica:

- ViewModels pequeños y especializados  
- Servicios externos para lógica  
- Componentización de UI  

## Buenas prácticas

- Evitar code-behind innecesario  
- Usar binding en lugar de manipulación directa  
- Diseñar UI desacoplada  
- Preparar la aplicación para crecimiento  

## Conclusión

WinUI 3 no es simplemente una herramienta para construir interfaces, sino una capa crítica dentro de la arquitectura de aplicaciones modernas en Windows.

Su uso correcto permite construir aplicaciones mantenibles, escalables y alineadas con prácticas profesionales. Ignorar estos principios lleva a aplicaciones frágiles que requieren reescritura temprana.

Adoptar estos fundamentos desde el inicio marca la diferencia entre una aplicación demostrativa y un sistema preparado para producción.
