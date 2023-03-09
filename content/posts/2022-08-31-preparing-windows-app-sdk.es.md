---
layout: post
title: "Preparando entorno para desarrollo con Windows App SDK"
author: Christian Amado
date: 2022-08-31 22:36:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/win11.jpg
---

En este artículo mostraré cómo preparar el entorno para el desarrollo de aplicaciones con **Windows App SDK**.

***Windows 11 Insider Preview Build 25188***

<!--more-->

La preparación del entorno es simple para este caso, sólo debemos instalar el SDK como tal y la extensión para Visual Studio 2022 (para C# en este caso).

## Pasos para la instalación
Primeramente, debemos instalar el SDK desde el sitio oficial de Microsoft:
1. Descargamos el SDK (la versión actual es 1.1.5) desde [aquí](https://aka.ms/windowsappsdk/1.1/1.1.5/windowsappruntimeinstall-x64.exe)  
2. Descargamos la extensión de C# para Visual Studio 2022 desde [aquí](https://aka.ms/windowsappsdk/1.1/1.1.5/WindowsAppSDK.Cs.Extension.Dev17.Standalone.vsix)  

Con estos pasos hemos cumplido el objetivo, pero para asegurarnos debemos ir al instalador de Visual Studio 2022 y verificar que esté seleccionada la opción de .NET Desktop Applications:
![](/img/posts/2022/08/31/1.png)  

Con esta opción podemos empezar a desarrollar aplicaciones para Windows 11 (10 también pero ya es obsoleto jaja)  

¡Espero resulte útil!
