---
layout: post
title: "MAUI ¿Qué? ¿Por qué? ¿Para qué?"
author: Christian Amado
date: 2022-08-03 22:12:00 -0400
category: [Desarrollo de software]
tags: [WinDev, MAUI, Windows 11, Android]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo intentaré explicar o dar a entender que es **.NET MAUI** y otras cuestiones relacionada a esta plaforma que básicamente reemplaza al viejo conocido de **Xamarin.Forms**.

***Windows 11 Insider Preview Build 25174***

<!--more-->

## ¿Qué es .NET MAUI? Flutter es mejor...
**.NET MAUI** es un marco de trabajo multiplataforma para crear aplicaciones nativas móviles y de escritorio con C# y XAML. Con **.NET MAUI**, se puede desarrollar aplicaciones que pueden ejecutarse en ***Android***, ***iOS***, ***macOS*** y ***Windows*** desde un solo código compartido. Es la evolución de *Xamarin.Forms* que amplía las capacidades más allá de los dispositivos móviles.  

**.NET MAUI** es para desarrolladores que quieren: 
1. Escribir aplicaciones multiplataforma en XAML y C#, desde un solo código compartido en Visual Studio.  
2. Compartir el diseño y la disposición de la interfaz de usuario entre plataformas.  
3. Compartir código, pruebas y lógica de negocio entre plataformas.  

**.NET MAUI** proporciona una colección de controles que se pueden usar para mostrar datos, iniciar acciones, indicar actividad, mostrar colecciones, elegir datos y más. Además de una colección de controles, **.NET MAUI** también ofrece: Un motor de diseño elaborado para diseñar páginas. Un proyecto único compartido que puede apuntar a ***Android***, ***iOS***, ***macOS*** y ***Windows***. Una selección simplificada del objetivo de depuración para ejecutar las aplicaciones **.NET MAUI**.

Ya escuché comentarios sobre ¡*Flutter* es mucho mejor!. Pero ¿Es realmente así?

No hay una respuesta definitiva a esta pregunta, ya que depende de las preferencias y necesidades de cada desarrollador y proyecto. Sin embargo, se pueden mencionar algunas diferencias y ventajas de cada plataforma:

1. **Flutter** usa **Dart**, un lenguaje desarrollado por *Google*, mientras que **.NET MAUI** usa **C#**, un lenguaje ampliamente usado en el ecosistema **.NET**.
2. **Flutter** ofrece una interfaz de usuario más rápida y fluida, gracias a su compilación anticipada que reduce el tamaño del código compilado. Además, **Flutter** soporta *Material Design* para ***Android*** y *Cupertino* para ***iOS***, lo que permite crear aplicaciones con aspecto nativo para cada plataforma.
3. **.NET MAUI** es una buena opción para los desarrolladores que ya están familiarizados con la plataforma **.NET** y quieren crear aplicaciones multiplataforma usando **C#**. También ofrece una mayor integración con *Visual Studio* y otras herramientas de desarrollo.
4. **Flutter** soporta el desarrollo web y *Linux*, mientras que **.NET MAUI** no. Sin embargo, los desarrolladores de **.NET MAUI** pueden utilizar el marco ***Blazor*** para proporcionar un puente para usar recursos de **MAUI**.

En conclusión, ambas plataformas tienen sus pros y contras, y la elección dependerá de factores como el lenguaje de programación preferido, el tipo de aplicación que se quiere crear, el público objetivo y el presupuesto disponible.

## ¿Qué puedo hacer con esto?
Con **.NET MAUI** se puede desarrollar aplicaciones nativas para **Windows**, *macOS*, *iOS* y **Android**, usando un solo código compartido en **C#** y **XAML**. Se puede crear aplicaciones que se adapten al aspecto y la funcionalidad de cada plataforma, aprovechando las últimas tecnologías de desarrollo.

Algunos ejemplos de tipos de aplicaciones que se pueden crear con **.NET MAUI** son:

* Aplicaciones de productividad que permitan gestionar tareas, calendarios, correos electrónicos, etc.  
* Aplicaciones de entretenimiento que ofrezcan juegos, música, vídeos, etc.  
* Aplicaciones de educación que faciliten el aprendizaje interactivo y el acceso a recursos didácticos.  
* Aplicaciones de negocios que integren servicios web, bases de datos, análisis de datos, etc.  

## Un poco de código
Primero, veamos el código **XAML** que se utiliza para la visual:
```
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="ButtonSample.MainPage">
    <StackLayout>
        <Button Text="Click Me!"
                Clicked="OnCounterClicked" />
        <Label x:Name="CounterLabel"
               Text="Welcome to .NET MAUI!"
               HorizontalOptions="Center"
               VerticalOptions="CenterAndExpand" />
    </StackLayout>
</ContentPage>
```

Luego, vemos el código **C#** para poder realizar las acciones necesarias:
```
using Microsoft.Maui;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Essentials;

namespace ButtonSample
{
    public partial class MainPage : ContentPage
    {
        int count = 0;

        public MainPage()
        {
            InitializeComponent();
        }

        void OnCounterClicked(object sender, EventArgs e)
        {
            count++;
            CounterLabel.Text = $"Contador actual: {count}";
            CounterLabel.FontSize = Device.GetNamedSize(NamedSize.Large, typeof(Label));
            CounterLabel.TextColor = Color.FromHex("#FF0000");
        }
    }
}
```
## Conclusión
**.NET MAUI** es una plataforma multiplataforma que ofrece muchas ventajas para los desarrolladores que quieren crear aplicaciones nativas con un solo código compartido en **C#** y **XAML**. Sin embargo, también tiene algunos inconvenientes y limitaciones que se debe tener en cuenta.

En este contexto, se recomienda **.NET MAUI** si:

* Ya se tiene experiencia con la plataforma **.NET** y el lenguaje **C#**.
* Se quiere crear aplicaciones para **Windows**, *macOS*, *iOS* y **Android** con una interfaz de usuario consistente y personalizable.
* Se quiere aprovechar las herramientas de desarrollo de *Visual Studio* y otras librerías del ecosistema **.NET**.

No se recomienda **.NET MAUI** si:

* Se prefiere usar otro lenguaje de programación como *Dart* o *JavaScript*.
* Se quiere crear aplicaciones web o para *Linux* sin usar **Blazor**.
* Se quiere usar las últimas características y tecnologías de cada plataforma nativa.

¡Espero resulte útil!
