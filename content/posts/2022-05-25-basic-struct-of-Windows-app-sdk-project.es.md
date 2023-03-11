---
layout: post
title: "Estructura básica de un proyecto con Windows App SDK"
author: Christian Amado
date: 2022-05-25 18:45:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo intentaré explicar lo que entiendo es la estructura básica de **Windows App SDK**, pues resulta algo nuevo para mí (en el pasado desarrollaba con WPF y después con UWP en sus inicios). En un [artículo anterior](/posts/2022-05-18-windows-app-sdk-development/) hemos visto los primeros pasos en esta plataforma.

***Windows 11 Insider Preview Build 25126***

<!--more-->

Según la definición tenemos que esta definición:  
> Windows App SDK es un conjunto de nuevos componentes y herramientas para desarrolladores que representan la próxima evolución en la plataforma de desarrollo de aplicaciones de Windows. Windows App SDK proporciona un conjunto unificado de API y herramientas que se pueden usar de manera consistente por cualquier aplicación de escritorio en Windows 11 y versiones anteriores hasta Windows 10, versión 1809  

Rápidamente podemos entender que su estructura básica se compone de:  

1. **Foundation**: es la capa que ofrece las *API* básicas para acceder a las características y servicios de *Windows*, como la configuración del sistema, el almacenamiento de datos, la red y la seguridad.

2. **UI**: es la capa que ofrece los controles y componentes de interfaz de usuario para crear aplicaciones modernas y atractivas en *Windows*, como *XAML Islands*, *WinUI 3* y *WebView2*.

3. **Frameworks**: es la capa que ofrece los marcos de trabajo y patrones para facilitar el desarrollo de aplicaciones en *Windows*, como *App Lifecycle*, *Push Notifications* y *Reunion Windowing*.

4. **Tools**: es la capa que ofrece las extensiones y plantillas para Visual Studio 2022 que permiten usar los componentes de **Windows App SDK** en proyectos nuevos o existentes. También incluye un paquete *NuGet* que contiene las bibliotecas de Windows App SDK.

## Diferencias entre Win32 APIs y UWP APIs
* **Win32 APIs**: son las API de *Windows* que se usan para crear aplicaciones de escritorio tradicionales en C++ o C#. Algunas de estas *API* son: *CreateWindowEx*, *MessageBox*, *ShellExecute*, etc.

* **UWP APIs**: son las API de *Windows* que se usan para crear aplicaciones universales que pueden ejecutarse en diferentes dispositivos con **Windows 11**. Algunas de estas API son: *Windows.UI.Xaml.Controls*, *Windows.Media.Capture*, *Windows.Storage*, etc.  

**Windows App SDK** permite usar ambas API en una misma aplicación, lo que ofrece más flexibilidad y compatibilidad a los desarrolladores1.

Esta es una pequeña introducción (con sabor a trabajo práctico) sobre Windows App SDK. A partir de esto se vienen muchos artículos sobre este *SDK*.

¡Espero resulte útil!
