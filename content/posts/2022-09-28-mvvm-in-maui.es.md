---
layout: post
title: "Aplicando modelo MVVM con MAUI"
author: Christian Amado
date: 2022-09-28 21:06:00 -0400
category: [Desarrollo de software]
tags: [WinDev, MAUI, Windows 11]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo aplicar el modelo MVVM en **.NET MAUI** sobre **Windows 11**.

***Windows 11 Insider Preview Build 25206***

<!--more-->

**MVVM** en **.NET MAUI** para **Windows** es un patrón que permite crear aplicaciones de escritorio con una interfaz de usuario basada en **XAML** y una lógica de negocio separada en el modelo de vista. **MVVM** es un patrón bien establecido en **.NET** y hay muchos marcos que facilitan su desarrollo. Uno de ellos es el **MVVM Toolkit**, que es parte del **.NET Community Toolkit**.

Así que me puse a leer la documentación oficial (deberías hacer lo mismo) que se encuentra [aquí](https://learn.microsoft.com/es-es/dotnet/architecture/maui/mvvm).

Para el ejemplo, crearemos una lista de "Alumnos" (Nombre y Apellido con fotos) que aplicaremos en un modelo *MVVM*.

## Creando el código
1. Descargamos el paquete **NuGet** para *MVVM* que se encuentra [aquí](https://www.nuget.org/packages/CommunityToolkit.Mvvm/)(obviamente es mejor hacerlo desde Visual Studio 2022) y lo instalamos.

2. Agregamos una nueva clase con el nombre **Alumno.cs** y lo colocamos en la raiz del proyecto con el siguiente código:
```
namespace MauiMvvm
{
    public class Alumno
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
    }
}
```

3. Agregamos una nueva clase con el nombre **AlumnoViewModel.cs** y lo colocamos en la raiz del proyecto con el siguiente código:
```
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiMvvm
{
    [INotifyPropertyChanged]
    public partial class AlumnoViewModel
    {
        [ObservableProperty]
        public List<Alumno> alumnos = new List<Alumno>();

        public AlumnoViewModel() 
        {
            alumnos.Add(new Alumno() { FirstName = "Eliseo", LastName = "Ortega", ImageUrl = "mugpy.jpg" });
            alumnos.Add(new Alumno() { FirstName = "Dulce", LastName = "Barrios", ImageUrl = "profile.jpg" });
            alumnos.Add(new Alumno() { FirstName = "Microsoft", LastName = "DotNet", ImageUrl = "dotnet_bot.png" });
            alumnos.Add(new Alumno() { FirstName = "Christian", LastName = "Amado", ImageUrl = "amado.jpg" });
        }
    }
}
```

4. En la página principal **MainPage.xaml** generamos una lista:
```
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MauiMvvm.MainPage">

    <ListView ItemsSource="{Binding Alumnos}">
        <ListView.ItemTemplate>
            <DataTemplate>
                <ViewCell>
                    <Grid Padding="10">
                        <Grid.RowDefinitions>
                            <RowDefinition Height="Auto" />
                            <RowDefinition Height="Auto" />
                        </Grid.RowDefinitions>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="Auto" />
                            <ColumnDefinition Width="Auto" />
                        </Grid.ColumnDefinitions>
                        <Image Grid.RowSpan="2"
                           Source="{Binding ImageUrl}"
                           Aspect="AspectFill"
                           HeightRequest="60"
                           WidthRequest="60" />
                        <Label Grid.Column="1"
                           Text="{Binding FirstName}"
                           FontAttributes="Bold" />
                        <Label Grid.Row="1"
                           Grid.Column="1"
                           Text="{Binding LastName}"
                           FontAttributes="Italic"
                           VerticalOptions="End" />
                    </Grid>
                </ViewCell>
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>

</ContentPage>
```

5. El código **C#** que se encuentra en **MainPage.xaml.cs** se encuentra aquí:
```
namespace MauiMvvm;

public partial class MainPage : ContentPage
{
	int count = 0;

	public MainPage()
	{
		InitializeComponent();

		BindingContext = new AlumnoViewModel();
    }
}
```

6. Ejecutamos el código con *F5* y...
![](/img/posts/2022/09/28/1.png)  

De esta manera implementamos el modelo MVVM de manera muy rápida y sencilla gracias al paquete **MVVM Toolkit**.

¡Espero resulte útil!
