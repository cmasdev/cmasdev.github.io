---
layout: post
title: Manejo de múltiples ventanas en WinUI 3 en aplicaciones reales
author: Christian Amado
date: 2025-08-15 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En aplicaciones de escritorio modernas, el manejo de múltiples ventanas es un requerimiento frecuente, especialmente en herramientas empresariales o aplicaciones que gestionan múltiples contextos de usuario. WinUI 3 permite trabajar con múltiples ventanas, pero su implementación no es trivial y suele generar problemas cuando no se diseña correctamente.

A medida que la aplicación crece, una mala gestión de ventanas puede provocar fugas de memoria, pérdida de estado y experiencias inconsistentes para el usuario.
<!--more-->

Este artículo analiza cómo implementar correctamente el manejo de múltiples ventanas en WinUI 3 en escenarios reales.

## El problema

En muchos proyectos, la apertura de nuevas ventanas se realiza de forma directa sin control centralizado.

Errores comunes:

- Creación de ventanas sin referencia  
- Falta de control del ciclo de vida  
- Pérdida de estado entre ventanas  
- Dificultad para cerrar ventanas correctamente  
- Fugas de memoria  

### Ejemplo incorrecto

```csharp
var window = new Window();
window.Activate();
```

Problemas:

- No se mantiene referencia  
- No se controla el cierre  
- No se puede gestionar el estado  
- Difícil de escalar  

En aplicaciones reales, este enfoque genera comportamientos impredecibles.

## La solución

El manejo de ventanas debe:

1. Centralizarse en un servicio  
2. Mantener referencias activas  
3. Controlar el ciclo de vida  
4. Permitir compartir estado  

## Paso 1: Crear un servicio de ventanas

```csharp
public interface IWindowService
{
    Window CreateWindow();
}

public class WindowService : IWindowService
{
    private readonly List<Window> _windows = new();

    public Window CreateWindow()
    {
        var window = new Window();

        _windows.Add(window);

        window.Closed += (s, e) =>
        {
            _windows.Remove(window);
        };

        window.Activate();

        return window;
    }
}
```

Esto permite gestionar múltiples instancias.

## Paso 2: Mantener referencias

El servicio mantiene una lista de ventanas activas.

Ventajas:

- Control del ciclo de vida  
- Evitar pérdidas de referencia  
- Posibilidad de interactuar con ventanas existentes  

## Paso 3: Compartir estado entre ventanas

```csharp
public class AppState
{
    public string CurrentUser { get; set; }
}
```

```csharp
public class SecondaryViewModel
{
    private readonly AppState _state;

    public SecondaryViewModel(AppState state)
    {
        _state = state;
    }

    public string User => _state.CurrentUser;
}
```

Esto permite sincronizar información.

## Paso 4: Abrir ventanas con contexto

```csharp
public void OpenDetails()
{
    var window = _windowService.CreateWindow();

    var viewModel = new DetailsViewModel();
    window.Content = new DetailsPage { DataContext = viewModel };
}
```

Esto permite inicializar correctamente cada ventana.

## Paso 5: Control del cierre

```csharp
window.Closed += (s, e) =>
{
    // Liberar recursos si es necesario
};
```

Esto evita fugas de memoria.

## Paso 6: Escenarios comunes

- Ventanas secundarias de detalle  
- Herramientas flotantes  
- Dashboards independientes  
- Múltiples documentos abiertos  

Cada caso requiere control explícito.

## Paso 7: Problemas en producción

- Ventanas duplicadas innecesarias  
- Estado inconsistente  
- Recursos no liberados  
- UI desincronizada  

Solución:

- Controlar creación  
- Validar instancias  
- Centralizar lógica  

## Buenas prácticas

- Centralizar gestión de ventanas  
- Mantener referencias activas  
- Compartir estado cuando sea necesario  
- Controlar eventos de cierre  
- Evitar creación indiscriminada  

## Conclusión

El manejo de múltiples ventanas en WinUI 3 es un aspecto avanzado que requiere diseño consciente. Una implementación adecuada permite construir aplicaciones más flexibles y alineadas con escenarios reales.

Ignorar estos principios conduce a problemas de mantenimiento, fugas de memoria y experiencias inconsistentes para el usuario.
