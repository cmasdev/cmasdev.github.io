---
layout: post
title: "WSL: Ejecutar aplicaciones con GUI Linux"
author: Christian Amado
date: 2022-06-01 18:32:00 -0400
category: [Windows]
tags: [WinDev, Windows 11, Windows Insider Preview, WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo utilizar aplicaciones Linux (con interfaz de usuario) gracias a **Windows Subsystem for Linux** .

***Windows 11 Insider Preview Build 22621***

<!--more-->

Es cierto que **Windows** posee muchas y muy buenas aplicaciones gráficas (de hecho está basado en eso), pero Ubuntu también tiene aplicaciones muy buenas y con performance mejorada.

## Instalar VLC
En este caso instalaremos el reproductor multimedia VLC:
1. Nos dirigimos a Ubuntu **Windows Subsystem for Linux**
![](/img/posts/2022/06/01/1.png)
2. Colocamos el comando que instala la aplicación con **apt**:
```
sudo apt install vlc -y
```
3. Procede a instalar y nos arroja el resultado:
![](/img/posts/2022/06/01/2.png)
4. Colocamos el comando que ejecuta la aplicación y...
```
vlc
```
5. Veremos la aplicación ejecutada:
![](/img/posts/2022/06/01/3.png)
6. Si buscamos la App desde el Menú Inicio de **Windows** la encontraremos:
![](/img/posts/2022/06/01/4.png)
7. La aplicación se ejecuta de manera nativa en **Windows**:
![](/img/posts/2022/06/01/5.png)

¡Espero resulte útil!
