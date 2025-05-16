---
layout: post
title: "Hospedar Web App en UWP"
author: Christian Amado
date: 2022-07-20 23:01:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, UWP, ASP.NET Core]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo hospedar/mostrar una aplicación **ASP.NET Core** dentro de una aplicación **UWP** en Windows.

***Windows 11 Insider Preview Build 25126***

<!--more-->

Muchas veces ya tenemos una aplicación desarrollada utilizando todos los estándares posibles de su mundo (HTML, CSS, JavaScript, ASP.NET, etc.). Entonces, aquí veremos cómo reutilizar esto dentro de una app UWP (inclusive se podría publicar la app UWP con la URL publicada dentro).

## Aplicación ASP.NET Core
Primeramente, crearemos la aplicación **ASP.NET Core** básica y la ejecutaremos para verla en el navegador.

1. Creamos un nuevo proyecto **ASP.NET Core**:
![](/img/posts/2022/07/20/1.png)  
2. Colocamos un nombre al proyecto:
![](/img/posts/2022/07/20/2.png)  
3. Seleccionamos el Framework que se ajusta a nuestras necesidades:
![](/img/posts/2022/07/20/3.png)  
4. Ejecutamos la aplicación (presionando la tecla *F5*), veremos el servidor y la web funcionando:
![](/img/posts/2022/07/20/4.png)  

Listo, ya tenemos nuestra aplicación Web.

## Aplicación UWP (Univesal Windows Platform)
Crearemos la aplicación **UWP** apuntando a **Windows 11** como Sistema operativo.

1. Creamos un nuevo proyecto **Universal Windows**:
![](/img/posts/2022/07/20/5.png)  
2. Colocamos un nombre al proyecto:
![](/img/posts/2022/07/20/6.png)  
3. Seleccionamos las versiones para Windows que estarán disponibles:
![](/img/posts/2022/07/20/7.png)  
4. Escribimos el código necesario para que nuestra web app pueda verse:
```
<Page
    x:Class="UWP_Emb.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:UWP_Emb"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">

    <Grid>
        <WebView Source="https://localhost:7106/" />
    </Grid>
</Page>
```
5. Ejecutamos la aplicación (presionando la tecla *F5*), veremos... nada:
![](/img/posts/2022/07/20/8.png)  
Esto debido a que la librería no está soportada y necesita la nueva versión (acaba de ser lanzada [aquí](https://www.nuget.org/packages/Microsoft.UI.Xaml/2.8.0)).

6. Procedemos a cargar el nuevo paquete desde **Nuget**, para ellos vamos a **** > > :
![](/img/posts/2022/07/20/9.png)  
7. Colocamos el código nuevo para que esto nos funcione:
```
<Page
    x:Class="UWP_Emb.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:UWP_Emb"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    xmlns:controls="using:Microsoft.UI.Xaml.Controls"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">

    <Grid>
        <controls:WebView2 Source="https://localhost:7106/" />
    </Grid>
</Page>
```
7. Ejecutamos la aplicación (presionando la tecla *F5*), veremos nuestra web app funcionando:
![](/img/posts/2022/07/20/10.png)  

Parece algo muy sencillo, pero me tomó algunos días poder encontrar que el problema estaba en la actualización de la librería **Microsoft.UI**

¡Espero resulte útil!
