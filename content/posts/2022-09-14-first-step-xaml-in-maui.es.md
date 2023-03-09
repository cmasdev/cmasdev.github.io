---
layout: post
title: "MAUI on WSA"
author: Christian Amado
date: 2022-07-27 19:16:00 -0400
category: [Windows]
tags: [WinDev, MAUI, Windows 11, Telerik]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/win11.jpg
---

En este artículo mostraré cómo iniciar los pasos con el lenguaje **XAML** en **.NET MAUI**.

***Windows 11 Insider Preview Build 25201***

<!--more-->

En este pequeño artículo vamos a utilizar controles de Telerik para **.NET MAUI**. En un [artículo anterior]() vimos cómo crear una aplicación **.NET MAUI** y aquí haremos otra basada en otra plantilla ([Telerik](https://www.telerik.com/support/whats-new/maui-ui/release-history/telerik-ui-for-net-maui-(version-3-0-0))).
![](/img/posts/2022/09/14/1.png)  

## Telerik SideDrawer
Este control (conocido como Menú Hamburguesa) se utiliza para hacer la navegación muy amigable debido a que el menú queda al costado de nuestro diseño y permite una visualización completa del mismo. En Windows 11 se refiere a [NavigationView](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview).  

La definición del control, en lenguaje **XAML**, sería:
```
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:telerik="http://schemas.telerik.com/2022/xaml/maui"
             x:Class="TelerikMauiApp1.MainPage">

    <ScrollView>
        <telerik:RadSideDrawer x:Name="drawer" 
                       DrawerLength="200">
            <telerik:RadSideDrawer.MainContent>
                <Grid>
                    <Label Text="Main content on CMASDEV BLOG" />
                </Grid>
            </telerik:RadSideDrawer.MainContent>
            <telerik:RadSideDrawer.DrawerContent>
                <VerticalStackLayout Spacing="10"
                             Padding="10, 10, 0, 0">
                    <VerticalStackLayout.Resources>
                        <Style x:Key="DefaultButtonStyle" TargetType="Button">
                            <Setter Property="WidthRequest" Value="180" />
                            <Setter Property="HeightRequest" Value="40" />
                            <Setter Property="BackgroundColor" Value="#b1b1b1" />
                            <Setter Property="TextColor" Value="Black" />
                        </Style>
                    </VerticalStackLayout.Resources>

                    <Button Text="Mail"
                    Style="{StaticResource DefaultButtonStyle}" />
                    <Button Text="Calendar"
                    Style="{StaticResource DefaultButtonStyle}" />
                    <Button Text="People"
                    Style="{StaticResource DefaultButtonStyle}" />
                    <Button Text="Tasks"
                    Style="{StaticResource DefaultButtonStyle}" />
                </VerticalStackLayout>
            </telerik:RadSideDrawer.DrawerContent>
        </telerik:RadSideDrawer>
    </ScrollView>

</ContentPage>
```
Con esta definición declarativa logramos que el control tenga todos los detalles necesarios para su funcionamiento.

Visualmente, el resultado del código XAML es:
![](/img/posts/2022/09/14/2.png)  
![](/img/posts/2022/09/14/3.png)  

Si realmente necesitas aprender **XAML**, la documentación de Microsft [aquí](https://learn.microsoft.com/es-es/dotnet/maui/xaml/fundamentals/get-started?view=net-maui-7.0) está muy completa.

¡Espero resulte útil!
