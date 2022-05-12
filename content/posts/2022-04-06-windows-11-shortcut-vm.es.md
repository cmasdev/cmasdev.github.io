---
layout: post
title: "Crear acceso directo a máquina virtual"
author: Christian Amado
date: 2022-04-06 19:21:43 -0400
category: [Windows]
tags: [Windows 11, Windows Insider Preview, Hyper-V]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.png
---

Lo más práctico y útil para un usuario es encontrar lo que busca de manera rápida y sencilla. Es por eso que mostraré los pasos a seguir para crear un acceso directo a una máquina virtual en Hyper-V.  

***Windows 11 Insider Preview Build 22593***

<!--more-->

Primero debemos dirigirnos a nuestro gestor de máquinas virtuales de Hyper-V y obtener el nombre de la máquina virtual en cuestión (Ubuntu, en este caso):
![](/img/posts/2022/04/06/hyperv1.png)  

Nos dirigimos al escritorio de Windows, *clic derecho* > *Nuevo* > *Crear acceso directo*:
![](/img/posts/2022/04/06/hyperv2.png)  

Agregamos la siguiente ubicación de archivo:  
```
vmconnect.exe localhost "Ubuntu"
```
- El nombre de programa es **vmconnect.exe**  
- **localhost** porque se trata de nuestra máquina virtual local
- **Ubuntu** es el nombre de la máquina virtual

![](/img/posts/2022/04/06/hyperv3.png)  

Colocamos un nombre descriptivo a nuestro acceso directo:
![](/img/posts/2022/04/06/hyperv4.png)  

Veremos en el escritorio el acceso directo creado:
![](/img/posts/2022/04/06/hyperv5.png)  

Por último, hacemos la prueba del acceso directo:
![](/img/posts/2022/04/06/hyperv6.png)  

¡Espero resulte útil!