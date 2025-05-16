---
layout: post
title: "Configurando mi ambiente WSL"
author: Christian Amado
date: 2022-04-26 20:41:00 -0400
category: [Windows]
tags: [WinDev, Windows 11, Windows Insider Preview, WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo configurar un ambiente de desarrollo WSL (Windows Subsystem Linux) dentro de Windows para el desarrollo de aplicaciones en múltiples plataformas (que en el futuro iré asociando a este artículo). Para este artículo ya tenemos disponible la nueva distro de Ubuntu 22.04 (recientemente lanzada).

***Windows 11 Insider Preview Build 22598***

<!--more-->

Debemos seguir algunos pasos para poder habilitar el WSL (Windows Subsystem for Linux) en Windows 11. Es excelente esto para probar todo tipo de aplicaciones sin salir de Windows. Especialmente preparado para .NET Core :)

## Preparar Windows Subsystem for Linux
Para preparar la plataforma debemos seguir estos pasos:
1. Nos dirigimos a **Panel de Control** > **Programas** > **Habilitar funcionalidades de Windows**.
2. Buscar la opción **Windows Subsystem for Linux**, marcamos la opción y hacemos clic en **Aceptar**:
![](/img/posts/2022/04/26/Wsl1.png)
3. Cuando termine la instalación debemos reiniciar el sistema operativo y veremos este nuevo enlace en el **Explorador de archivos**:
![](/img/posts/2022/04/26/Wsl2.png)

## Instalamos la distro de preferencia
En mi caso selecciono Ubuntu, pero existen otras que se encuentran disponibles para su instalación. Aquí procedemos a instalar desde **Microsoft Store**:
![](/img/posts/2022/04/26/Wsl3.png)  

Una vez que haya culminado la instalación, procedemos a abrir la nueva App (sí, se encuentra como una App):
![](/img/posts/2022/04/26/Wsl4.png)  

## Windows Terminal
Aquí es donde empezamos a disfrutar de nuestra distro de Linux favorita para empezar a jugar con ella.  

Creamos un usuario para nuestro sistema operativo Ubuntu (puede o no ser igual al usuario de Windows):
![](/img/posts/2022/04/26/Wsl5.png)  

Por último, accedemos a la terminal de Ubuntu y realizamos las tareas que queramos dentro de Ubuntu, que está dentro de Windows 11.
![](/img/posts/2022/04/26/Wsl6.png)  

Podemos verificar que distro estamos ejecutando:
![](/img/posts/2022/04/26/Wsl7.png)  

¡Espero resulte útil!
