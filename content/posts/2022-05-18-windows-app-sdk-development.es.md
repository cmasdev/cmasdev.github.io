---
layout: post
title: "Desarrollo en Windows App SDK"
author: Christian Amado
date: 2022-05-18 21:56:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, Windows Insider Preview, .NET]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este articulo, mostraré cómo empezar con el desarrollo con Windows App SDK especialmente diseñado para Widnows 11 y ciertas versiones de Windows 10 (superior a la versión 1809).

***Windows 11 Insider Preview Build 22621***

<!--more-->

Entresacando un poco las definiciones desde la [página oficial de Microsoft](https://learn.microsoft.com/es-es/windows/apps/windows-app-sdk/) encontramos este resumen:  

> Windows App SDK es un conjunto de nuevas herramientas y componentes para desarrolladores que representa la próxima evolución en la plataforma de desarrollo de aplicaciones de Windows. Windows App SDK proporciona un conjunto unificado de API y herramientas que cualquier aplicación de escritorio puede usar de forma coherente en Windows 11 y niveles inferiores hasta Windows 10, versión 1809.  

> Windows App SDK complementa estas herramientas y tipos de aplicación existentes con un conjunto común de API que los desarrolladores pueden utilizar en estas plataformas.  

Con todo esto podemos ver las [**características de Windows App SDK**](https://learn.microsoft.com/es-es/windows/apps/windows-app-sdk/#windows-app-sdk-features).

# Creación de un proyecto WinUI
Para empezar a utilizar Windows App SDK, debemos crear una interfaz de usuario y eso se explica en el sitio oficial de Microsoft:  

> **WinUI 3** es el componente de la plataforma de interfaz de usuario nativa que se incluye con el SDK de Aplicaciones para Windows (completamente desacoplado de los SDK de Windows). El SDK de Aplicaciones para Windows proporciona un conjunto unificado de API y herramientas que se pueden usar para crear aplicaciones de escritorio de producción destinadas a Windows 10 y versiones posteriores que se pueden publicar en Microsoft Store.  

Para la creación del proyecto debemos  realizar los siguientes pasos:
1. Crear un proyecto de tipo **WinUI 3**
![](/img/posts/2022/05/18/1.png)
2. Se coloca un nombre descriptivo para el proyecto:
![](/img/posts/2022/05/18/2.png)
3. Se crea el proyecto con los siguientes archivos:
![](/img/posts/2022/05/18/3.png)
4. Procedemos a ejecutar la aplicación (y se ejecutará en nuestro **Windows 11** directamente):
![](/img/posts/2022/05/18/4.png)
5. Veremos la aplicación ejecutada:
![](/img/posts/2022/05/18/5.png)

Con esto logramos crear nuestra primera aplicación **WinUI 3**.

¡Espero resulte útil!
