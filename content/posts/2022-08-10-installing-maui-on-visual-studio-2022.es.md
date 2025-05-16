---
layout: post
title: "Instalando .NET MAUI en Visual Studio 2022"
author: Christian Amado
date: 2022-08-10 19:19:00 -0400
category: [Desarrollo de software]
tags: [WinDev, MAUI, Android, Windows 11]
thumbnail-img: /img/posts/thumbnails/android.png
cover-img: /img/posts/cover/android.png
share_img: /img/posts/shared/android.jpg
---

En este artículo mostraré cómo instalar los componentes necesarios para el desarrollo en **.NET MAUI** para Windows 11 y Android.

***Windows 11 Insider Preview Build 25179***

<!--more-->

La instalación de componentes en Visual Studio siempre ha sido sencilla y esta no es la excepción.

## Desinstalar Visual Studio 2022 Preview
Ya estuvimos probando .NET MAUI desde hace rato así que es tiempo de eliminar la versión Preview e instalar la versión oficial. Para ellos debemos realizar dos pasos sencillos:
1. Ir a **Panel de control** > **Desinstalar programas**.
2. Seleccionar **Microsoft Visual Studio 2022 Preview** y listo.  

## Instalar Visual Studio 2022
Instalar Visual Studio 2022 es bien sencillo.
1. Descargar el instalador nuevo [aquí](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Professional&channel=Release&version=VS2022&source=VSLandingPage&cid=2030&passive=false)  
2. Ejecutar el instalador y seguir los pasos en pantalla hasta la selección de componente, allí debemos seleccionar la opción correspondiente a **.NET MAUI**:
![](/img/posts/2022/08/10/1.png)  
3. Aguardamos que finalice la instalación y listo.

**.NET MAUI** instalará la última API de Android disponible y preparará Windows 11 para que podamos ejecutar nuestra Applicación.

¡Espero resulte útil!
