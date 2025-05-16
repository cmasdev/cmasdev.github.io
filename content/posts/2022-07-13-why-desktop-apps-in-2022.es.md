---
layout: post
title: "¿Por qué elegir aplicaciones de escritorio en 2022?"
author: Christian Amado
date: 2022-07-13 23:16:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
noComment: true
disableComments: true
---

En este corto artículo intentaré convencerlos de por qué sigue siendo bueno y rentable crear aplicaciones de escritorio en 2022.

***Windows 11 Insider Preview Build 25158***

<!--more-->

Pueden existir muchas razones por las cuales ya no es necesario desarrollar aplicaciones de escritorio en pleno siglo XXI, pero creo que es interesante por las siguientes razones:
1. Las aplicaciones de escritorio interactúan mejor con el equipo del usuario.
2. El rendimiento de las aplicaciones de escritorio para cálculos complejos es mucho mayor que el de las aplicaciones web.
3. La ejecución de lógica personalizada en el lado cliente es posible, pero mucho más difícil, con una aplicación web.

Existen diferentes marcos y kits de herramientas para desarrollar aplicaciones de escritorio, dependiendo de tus preferencias y necesidades. Algunos de los más populares son:

* **Electronjs**: un marco que usa **HTML**, **JavaScript** y **CSS** para crear aplicaciones nativas multiplataforma.
* **Tauri**: una opción ligera y segura que usa **Rust** y webview para crear aplicaciones de escritorio para todos los principales sistemas operativos.
* **Windows Forms**, **WPF**, **UWP** y **WinUI3**: las tecnologías más populares para crear aplicaciones de escritorio de *Windows* con **C#** o **Visual Basic**.

## ¿Qué es WinUI 3?
**WinUI 3** es la plataforma de interfaz de usuario nativa que se envía con el **Windows App SDK**. **Windows App SDK** proporciona un conjunto de **API** y herramientas que se pueden usar para crear aplicaciones de escritorio que se ejecutan en *Windows 10* o posterior. **WinUI 3** ofrece un rendimiento óptimo, una larga duración de la batería y una interactividad receptiva.

## ¿Cuál debería elegir?
Eso depende del público objetivo y de los requisitos de la aplicación. Si se desea crear una aplicación que funcione en diferentes sistemas operativos, se puede optar por **Electronjs** o **Tauri**. Si se quiere crear una aplicación que se integre con **Windows** y se publique en **Microsoft Store**, se puede optar por **UWP** o **WinUI 3**.

En mi caso quiero desarrollar una aplicación de escritorio para Windows 11, entonces puedo usar las mismas tecnologías que en **Windows 10**: **Windows Forms**, **WPF**, **UWP** o **WinUI 3**. Estas aplicaciones se pueden adaptar al nuevo diseño y funcionalidades de **Windows 11**. También se pueden usar los escritorios virtuales para organizar tus aplicaciones en diferentes contextos (como con **WSL**).

¡Espero resulte útil!
