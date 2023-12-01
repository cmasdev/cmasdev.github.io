---
layout: post
title: "Novedades en .NET MAUI con .NET 8"
author: Christian Amado
date: 2023-12-01 00:00:00 -04:00
category: [Desarrollo de software]
tags: [WinDev, MAUI, Windows 11, XAML]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/maui.svg
share_img: /img/posts/shared/dotnet.jpg
---

En este artículo mostraré algunas novedades de .NET 8 en **.NET MAUI**.

***Windows 11 Insider Preview Build 22635.2776***

<!--more-->

**.NET 8** se ha lanzado con muchas novedades y también han sufrido cambios (para bien) en la plataforma **.NET MAUI**. Es muy fácili dirigirnos al [sitio oficial](https://learn.microsoft.com/es-es/dotnet/maui/whats-new/dotnet-8?view=net-maui-8.0) y leer ahí las novedades pero me interesa probarlas novedades y contarles un poco lo que se viene, pero en mayor detalle lo que voy probando. ¡Así que manos a la obra!

## Novedades generales
1. **Diseño de derecha a izquierda**: Gracias a las mejoras de performance de .NET 8 se logra que los diseños para idiomas que van de derecha a izquierda ahora se vean correctamente además de responder en tiempo y forma.  

2. **Comportamiento de teclado**: Se han mejorado las disposiciones de teclado, que responden más rápidamente al ingreso de texto por parte del usuario, además el scroll responde más rápido ante la aparición/desaparición del teclado.  

3. **Gestión de memoria**: Esto viene atado a las mejoras introducidas en general dentro de .NET 8.

## ¿Cómo habilito .NET MAUI 8?
Primero, debemos descargar e instalar el **SDK** de **.NET 8**, eso lo encontramos [aquí](https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-8.0.100-windows-x64-installer).  

Luego, debemos actualizar **Visual Studio 2022** a su versión **17.8.0** o superior (acabo de ver disponible la versión **17.8.2**) que se puede descargar desde [aquí](https://visualstudio.microsoft.com/downloads/).

Iniciamos el instalador de **Visual Studio** e indicamos la opción de **.NET Multi-platform App UI development**:
![](https://i.ibb.co/7bnx4RQ/1.png)

## Creando un proyecto .NET MAUI 8
Al abrir **Visual Studio** procedemos a crear un nuevo proyecto y definimos el *Tipo* **MAUI** (en mi caso tengo [Telerik UI for .NET MAUI](https://www.telerik.com/maui-ui) instalado):
![](https://i.ibb.co/QDyvX8v/2.png)

Seleccionamos la versión de .NET (en este caso ya seleccionamos el 8):
![](https://i.ibb.co/LCZv5vc/3.png)

Nos dirigimos a las **Propiedades** del proyecto y verificamos que todo corresponda al **.NET 8**:
![](https://i.ibb.co/L0NYJSx/4.png)

Con estos pasos tenemos un nuevo proyecto creado en **.NET MAUI 8** ;)

## Cambio en MauiProgram.cs
En el archivo de arranque de un proyecto **.NET MAUI** se ingresa una línea de código nueva:
```
#if DEBUG
builder.Logging.AddDebug();
#endif
```
El código completo queda así:
```
using Microsoft.Extensions.Logging;

namespace MauiApp1;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

#if DEBUG
		builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
```
Básicamente, se registran los eventos y éstos se agregan a la ventana del depurar (pero sólo durante la depuración no así en Release).

## Keyboard Acelerator
Para dar una explicación rápida, podemos decir que son atajos de teclado que nos permiten realiar una acción dentro de la aplicación:
```
<ContentPage.MenuBarItems>
    <MenuBarItem Text="File">
        <MenuFlyoutItem Text="Exit"
                        Clicked="MenuFlyoutItem_Clicked"
                            />
    </MenuBarItem>
    <MenuBarItem Text="Locations">
        <MenuFlyoutSeparator />
        <MenuFlyoutItem Text="Add Location"
                        Clicked="MenuFlyoutItem_Clicked_1">
            <MenuFlyoutItem.KeyboardAccelerators>
                <KeyboardAccelerator Modifiers="Ctrl"
                    Key="L" />
            </MenuFlyoutItem.KeyboardAccelerators>
        </MenuFlyoutItem>
        <MenuFlyoutItem Text="Edit Location"
                            />
        <MenuFlyoutItem Text="Remove Location"
                            />
    </MenuBarItem>
</ContentPage.MenuBarItems>
```
Arrancamos la App y vemos el Menú:
![](https://i.ibb.co/FWRFggx/5.png)

Hacemos clic o bien utilizamos el atajo **Ctrl**+**L** y veremos:
![](https://i.ibb.co/dGNdZDc/6.png)

Estas son las novedades que quería compartir con ustedes en estas primeras pruebas que estoy realizando (de hecho estoy actualmente en un proyecto **.NET MAUI 8**). Iré avanzando en las novedades de **.NET MAUI** en todo este mes de Diciembre ya que nos encontramos en pleno **[Calendario de Adviento .NET MAUI](https://elcamino.dev/calendario-adviento-net-maui-espanol-23)**

¡Espero resulte útil!
