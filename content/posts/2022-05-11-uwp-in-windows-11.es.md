---
layout: post
title: "UWP en Windows 11"
author: Christian Amado
date: 2022-05-11 19:53:00 -0400
category: [Desarrollo de software]
tags: [WinDev, UWP, Windows 11, Windows Insider Preview]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo crear una aplicación UWP (Universal Windows Platform) en Windows 11 (aunque ya debemos ir dejándola ;)).

***Windows 11 Insider Preview Build 22621***

<!--more-->

Los prerrequisitos para poder crear son:
1. Visual Studio 2022.
2. UWP habilitado para el desarrollo sobre Windows 11.
3. Windows 11 ;)

## Crear una aplicación UWP
Para la creación del proyecto debemos seguir los siguientes pasos:
1. Crear una nueva aplicación en Visual Studio:
![](/img/posts/2022/05/11/1.png)
2. Colocamos el nombre descriptivo para el nuevo proyecto:
![](/img/posts/2022/05/11/2.png)
3. Seleccionamos la versión del destino (En Windows 11):
![](/img/posts/2022/05/11/3.png)
4. Verificamos que el proyecto se haya creado correctamente:
![](/img/posts/2022/05/11/4.png)
5. Agregamos un control de prueba para poder ejecutarlo:
```
<Page
    x:Class="UWP_Blog.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:UWP_Blog"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">

    <Grid>
        <TextBlock Text="Hola mundo, desde UWP y el Blog de Christian" />
    </Grid>
</Page>
```
6. Ejecutamos la aplicación:
![](/img/posts/2022/05/11/5.png)
7. Voilá, tenemos nuestra primera app UWP para Windows 11:
![](/img/posts/2022/05/11/6.png)  

Si bien es cierto, se recomienda que las aplicaciones para Windows sean creadas con WinUI, aún es posible desarrollarlas con UWP (pero es recomendable hacer la migración correspondiente).  

¡Espero resulte útil!
