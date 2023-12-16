---
layout: post
title: "XAML para cambio de orientación de pantalla"
author: Christian Amado
date: 2023-12-15 18:30:00 -04:00
category: [Desarrollo de software]
tags: [WinDev, MAUI, Windows 11, XAML]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/maui.svg
share_img: /img/posts/shared/dotnet.jpg
---

En este artículo veremos la posibilidad de crear un diseño que se adapte a la orientación de pantalla en **.NET MAUI**.

***Windows 11 Insider Preview Build 22635.2915***

<!--more-->

La idea central aquí es aprender a crear un diseño responsivo para brindar la mejor experiencia de usuario con controles que se adapten a la orientación de la pantalla (anteriormente se lograba esto haciendo cambios por plataforma), para ellos adaptaremos una solución presentada por un desarrollador experto en la materia.

## Bloquear orientación de pantalla
Primeramente, debemos mencionar que tenemos la opción de bloquear el cambio de orientación de pantalla. Esto se da cuando, por ejemplo, queremos que nuestro diseño sólo quede en posición vertical. Para ello, debemos preparar código para cada plataforma (aquí veremos **Android** y **Windows**):
### Windows
Se realiza mediante el gestor de manifiesto **Package.appxmanifest**:
![](https://i.ibb.co/0jQZXvN/Orientation1.png)

### Android
En la clase **MainActivity** de la plataforma **Android** se agrega el decorado:
```
ScreenOrientation = ScreenOrientation.Portrait
```

La clase quedaría así:
```
using Android.App;
using Android.Content.PM;

namespace MauiApp1
{
    [Activity(Theme = "@style/Maui.SplashTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize | ConfigChanges.Density, ScreenOrientation = ScreenOrientation.Portrait)]
    public class MainActivity : MauiAppCompatActivity
    {
    }
}
```

## Diseño responsivo
En **.NET MAUI** esto se logra utilziando de manera criteriosa alguno de los elementos (controles) **Layout** nativos que nos presenta la plataforma. En este caso nos enfocaremos en en control **Grid** (disculpen pero soy un fanático de este control).

### Opción 1
En esta opción adaptaremos los controles utilizando el Grid y utilizando código **C#** para reorientar los objetos (básicamente se cambian filas por columnas, por describirlo de una manera). Entonces, el XAML quedaría así:
```
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MauiApp1.MainPage">
    <ScrollView>
        <Grid x:Name="grillaCompleta">
            <Grid.RowDefinitions>
                <RowDefinition Height="*" />
            </Grid.RowDefinitions>
            <Grid x:Name="grillaInterna" Grid.Row="0" Padding="10">
                <Grid.RowDefinitions>
                    <RowDefinition Height="*" />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="*" />
                </Grid.ColumnDefinitions>
                <Image Source="dotnet_bot.png" Grid.Row="0" Grid.Column="0" HeightRequest="100" WidthRequest="100" />
                <Grid x:Name="grillaControles" Grid.Row="0" Grid.Column="1" >
                    <Grid.RowDefinitions>
                        <RowDefinition Height="Auto" />
                        <RowDefinition Height="Auto" />
                        <RowDefinition Height="Auto" />
                    </Grid.RowDefinitions>
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition Width="Auto" />
                        <ColumnDefinition Width="*" />
                    </Grid.ColumnDefinitions>
                    <Label Text="Nombre:" Grid.Row="0" Grid.Column="0" />
                    <Label Text="Fecha:" Grid.Row="1" Grid.Column="0" />
                    <Label Text="Etiquetas:" Grid.Row="2" Grid.Column="0" />
                    <Entry Grid.Row="0" Grid.Column="1" />
                    <Entry Grid.Row="1" Grid.Column="1" />
                    <Entry Grid.Row="2" Grid.Column="1" />
                </Grid>
            </Grid>
        </Grid>
    </ScrollView>
</ContentPage>
```
Sobre-escribimos el método **OnSizeAllocated** en el código C# que presta atención al cambio (de tamaño del contenedor de página, orientación, de alguna forma) quedaría así:
```
protected override void OnSizeAllocated(double width, double height)
{
    base.OnSizeAllocated(width, height);

    if (width != this.width || height != this.height)
    {
        this.width = width;
        this.height = height;
        if (width > height)
        {
            grillaInterna.RowDefinitions.Clear();
            grillaInterna.ColumnDefinitions.Clear();
            grillaInterna.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
            grillaInterna.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grillaInterna.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grillaInterna.Children.Remove(grillaControles);

            grillaInterna.Add(grillaControles, 1, 0);
        }
        else
        {
            grillaInterna.RowDefinitions.Clear();
            grillaInterna.ColumnDefinitions.Clear();
            grillaInterna.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grillaInterna.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Auto) });
            grillaInterna.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
            grillaInterna.Children.Remove(grillaControles);
            grillaInterna.Add(grillaControles, 0, 1);
        }
    }
}
```

El resultado Horizontal es:
![](https://i.ibb.co/bKnfKs6/Orientation2.png)

El resultado Vertical es:
![](https://i.ibb.co/3132hFy/Orientation3.png)

Me ha funcionado este método, pero hay algunos problemas reportados en GitHub sobre el tema [aquí](https://github.com/dotnet/maui/issues/9795)

### Opción 2 (extraída de otro Blog)
Definimos el **XAML** de la página agregando Manejadores de eventos visuales, en este caso, **OrientationStateTrigger**:
```
<ContentPage.Resources>
    <ResourceDictionary>
        <Style TargetType="Grid" x:Key="grillaInternaStyle">
            <Setter Property="VisualStateManager.VisualStateGroups">
                <VisualStateGroupList>
                    <VisualStateGroup>
                        <VisualState x:Name="Portrait">
                            <VisualState.StateTriggers>
                                <OrientationStateTrigger Orientation="Portrait" />
                            </VisualState.StateTriggers>
                            <VisualState.Setters>
                                <Setter Property="RowDefinitions" Value="*" />
                                <Setter Property="ColumnDefinitions" Value="*,*" />
                            </VisualState.Setters>
                        </VisualState>
                        <VisualState x:Name="Landscape">
                            <VisualState.StateTriggers>
                                <OrientationStateTrigger Orientation="Landscape" />
                            </VisualState.StateTriggers>
                            <VisualState.Setters>
                                <Setter Property="RowDefinitions" Value="Auto,*" />
                                <Setter Property="ColumnDefinitions" Value="*" />
                            </VisualState.Setters>
                        </VisualState>
                    </VisualStateGroup>
                </VisualStateGroupList>
            </Setter>
        </Style>
    </ResourceDictionary>
</ContentPage.Resources>
```

De esta manera, el código completo quedaría así:
```
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MauiApp1.MainPage">

    <ContentPage.Resources>
        <ResourceDictionary>
            <Style TargetType="Grid" x:Key="grillaInternaStyle">
                <Setter Property="VisualStateManager.VisualStateGroups">
                    <VisualStateGroupList>
                        <VisualStateGroup>
                            <VisualState x:Name="Portrait">
                                <VisualState.StateTriggers>
                                    <OrientationStateTrigger Orientation="Portrait" />
                                </VisualState.StateTriggers>
                                <VisualState.Setters>
                                    <Setter Property="RowDefinitions" Value="*" />
                                    <Setter Property="ColumnDefinitions" Value="*,*" />
                                </VisualState.Setters>
                            </VisualState>
                            <VisualState x:Name="Landscape">
                                <VisualState.StateTriggers>
                                    <OrientationStateTrigger Orientation="Landscape" />
                                </VisualState.StateTriggers>
                                <VisualState.Setters>
                                    <Setter Property="RowDefinitions" Value="Auto,*" />
                                    <Setter Property="ColumnDefinitions" Value="*" />
                                </VisualState.Setters>
                            </VisualState>
                        </VisualStateGroup>
                    </VisualStateGroupList>
                </Setter>
            </Style>
        </ResourceDictionary>
    </ContentPage.Resources>

    <Grid x:Name="grillaCompleta">
        <Grid.RowDefinitions>
            <RowDefinition Height="*" />
        </Grid.RowDefinitions>
        <Grid x:Name="grillaInterna" Grid.Row="0" Padding="10" Style="{StaticResource grillaInternaStyle}">                
            <Image Source="dotnet_bot.png" Grid.Row="0" Grid.Column="0" HeightRequest="100" WidthRequest="100" />
            <Grid x:Name="grillaControles" Grid.Row="0" Grid.Column="1" >
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="*" />
                </Grid.ColumnDefinitions>
                <Label Text="Nombre:" Grid.Row="0" Grid.Column="0" />
                <Label Text="Fecha:" Grid.Row="1" Grid.Column="0" />
                <Label Text="Etiquetas:" Grid.Row="2" Grid.Column="0" />
                <Entry Grid.Row="0" Grid.Column="1" />
                <Entry Grid.Row="1" Grid.Column="1" />
                <Entry Grid.Row="2" Grid.Column="1" />
            </Grid>
        </Grid>
    </Grid>
</ContentPage>
```

Logrando así el mismo efecto que la Opción 1 (con la diferencia que esta solución me funcionó en **Android** y **Windows**).

La opción 2 se encuentra perfectamente explicada en [este blog](https://blog.ewers-peters.de/add-responsive-layouts-to-your-maui-app) gracias a [Julian Ewers-Peters](https://github.com/ewerspej)

Recuerden que durante todo este mes de Diciembre estamos en el **[Calendario de Adviento .NET MAUI](https://elcamino.dev/calendario-adviento-net-maui-espanol-23)**

¡Espero resulte útil!
