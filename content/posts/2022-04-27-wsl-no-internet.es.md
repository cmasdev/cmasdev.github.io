---
layout: post
title: "WSL sin internet"
author: Christian Amado
date: 2022-04-27 12:26:00 -0400
category: [Windows]
tags: [WinDev, WSL, Windows 11, Windows Insider Preview]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo conectar a internet en **Windows Subsystem for Linux** para cualquier distro (pero aquí siempre con Ubuntu) utilizando **Windows Terminal**.

***Windows 11 Insider Preview Build 22598***

<!--more-->

Debemos seguir algunos pasos sencillos para poder habilitar internet de manera permanente en nuestra distro preferida.

## Conexión a internet en Windows Subsystem for Linux
Primero, hacemos ping a algún DNS (que tenga salida a internet):
![](/img/posts/2022/04/27/wsl1.png)  

Entonces, debemos abrirl el archivo **resolv.conf** que se encuentra en nuestro distro WSL:
```
nano /etc/resolv.conf
```
Abrirá el editor y procedemos a verificar el dato presente allí:
![](/img/posts/2022/04/27/wsl3.png)  

Esa IP es privada. ¡Quítala de allí! y usemos el DNS de Google:
![](/img/posts/2022/04/27/wsl4.png)  


Probemos nuestro comando **ping** a ver que ocurre:
![](/img/posts/2022/04/27/wsl5.png)  

## Configuración permanente para acceso a Internet
Como paso de prueba podemos salir de Ubuntu (emular el apagado de equipo desde **Windows Terminal**, no desde Ubuntu):
![](/img/posts/2022/04/27/wsl6.png)  

Iniciamos Ubuntu nuevamente y probamos **ping**:
![](/img/posts/2022/04/27/wsl1.png)  

¡BOOM!

Corregimos esto al estilo Ubuntu, con **Terminal**:
```
sudo bash -c 'echo -e "[network]
generateResolvConf = false" > /etc/wsl.conf
echo -e "options timeout:1 attempts:1 rotate
nameserver 8.8.8.8
nameserver 8.8.4.4" > /etc/resolv.conf
chattr -f +i /etc/resolv.conf'
```

Con esto, logramos que todo funcione correctamente>
![](/img/posts/2022/04/27/wsl5.png)  

¡Espero resulte útil!
