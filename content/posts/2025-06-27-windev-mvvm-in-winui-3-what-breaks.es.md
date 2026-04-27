---
layout: post
title: MVVM en WinUI 3 en escenarios reales y problemas comunes en producción
author: Christian Amado
date: 2025-06-27 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En el desarrollo de aplicaciones modernas con WinUI 3, el patrón MVVM se presenta como una solución estándar para desacoplar la lógica de negocio de la interfaz de usuario. Sin embargo, su implementación superficial suele generar más problemas que beneficios.

En escenarios reales, MVVM mal aplicado conduce a código difícil de mantener, dependencias ocultas y ViewModels que crecen sin control.
<!--more-->

Este artículo analiza cómo implementar MVVM correctamente en WinUI 3 y qué errores aparecen cuando se utiliza sin un enfoque profesional.

## El problema

Muchos proyectos adoptan MVVM únicamente como una convención estructural, pero no respetan sus principios.

Errores comunes:

- ViewModels con lógica de UI  
- Servicios acoplados directamente a la vista  
- Uso incorrecto de comandos  
- Falta de separación de responsabilidades  
- Dependencias no controladas  

### Ejemplo incorrecto

```csharp
public class MainViewModel
{
    public void LoadData(ListView listView)
    {
        listView.Items.Add("Item 1");
    }
}
```

Problemas:

- Acoplamiento directo con la UI  
- No testable  
- Rompe el patrón MVVM  
- Difícil de escalar  

En producción, este tipo de implementación genera deuda técnica significativa.

## La solución

Una implementación correcta de MVVM debe cumplir:

1. ViewModels sin conocimiento de la vista  
2. Uso de servicios para lógica externa  
3. Manejo claro de estado  
4. Comunicación mediante binding y comandos  

## Paso 1: ViewModel desacoplado

```csharp
using System.Collections.ObjectModel;

public class MainViewModel
{
    private readonly IDataService _service;

    public ObservableCollection<string> Items { get; } = new();

    public MainViewModel(IDataService service)
    {
        _service = service;
    }

    public async Task LoadAsync()
    {
        var data = await _service.GetItemsAsync();

        Items.Clear();

        foreach (var item in data)
        {
            Items.Add(item);
        }
    }
}
```

Este ViewModel no depende de controles.

## Paso 2: Uso correcto de comandos

```csharp
using System.Windows.Input;

public class RelayCommand : ICommand
{
    private readonly Action _execute;

    public RelayCommand(Action execute)
    {
        _execute = execute;
    }

    public event EventHandler CanExecuteChanged;

    public bool CanExecute(object parameter) => true;

    public void Execute(object parameter)
    {
        _execute();
    }
}
```

Uso en ViewModel:

```csharp
public ICommand LoadCommand { get; }

public MainViewModel(IDataService service)
{
    _service = service;
    LoadCommand = new RelayCommand(async () => await LoadAsync());
}
```

## Paso 3: Binding desde la vista

```xml
<Button Content="Cargar"
        Command="{x:Bind ViewModel.LoadCommand}" />

<ListView ItemsSource="{x:Bind ViewModel.Items, Mode=OneWay}" />
```

La vista no contiene lógica.

## Paso 4: Separación de servicios

```csharp
public interface IDataService
{
    Task<List<string>> GetItemsAsync();
}
```

Esto permite reemplazar implementaciones sin afectar la UI.

## Paso 5: Manejo de estado

```csharp
private bool _isLoading;

public bool IsLoading
{
    get => _isLoading;
    set
    {
        _isLoading = value;
        OnPropertyChanged();
    }
}
```

Esto permite reflejar estados en la UI.

## Paso 6: Problemas en producción

Incluso con MVVM, aparecen errores:

- ViewModels demasiado grandes  
- Lógica duplicada  
- Dependencias múltiples  
- Falta de modularización  

Solución:

- Dividir ViewModels  
- Usar servicios especializados  
- Aplicar arquitectura modular  

## Buenas prácticas

- Mantener ViewModels pequeños  
- Evitar referencias a la UI  
- Usar comandos en lugar de eventos  
- Separar lógica en servicios  
- Preparar el sistema para testing  

## Conclusión

MVVM es un patrón fundamental en WinUI 3, pero su implementación incorrecta puede generar más problemas que soluciones. Aplicarlo correctamente implica disciplina en la separación de responsabilidades y diseño consciente desde el inicio.

Un MVVM bien implementado permite construir aplicaciones mantenibles, escalables y alineadas con prácticas profesionales.
