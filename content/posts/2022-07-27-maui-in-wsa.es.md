---
layout: post
title: "MAUI on WSA"
author: Christian Amado
date: 2022-07-27 19:16:00 -0400
category: [Windows]
tags: [WinDev, MAUI, Android, WSA]
thumbnail-img: /img/posts/thumbnails/android.png
cover-img: /img/posts/cover/android.png
share_img: /img/posts/shared/android.jpg
---

En este artículo mostraré cómo ejecutar una aplicación **.NET MAUI** sobre **Windows Subsystem for Android**.

***Windows 11 Insider Preview Build 22621***

<!--more-->

Normalmente, utilizamos un emulador de Android para poder ejecutar y depurar nuestas aplicaciones para esta plataforma. En este caso, ejecutaremos nuestra aplicación en **WSA (Windows Subsystem for Android)**.

## Preparar el proyecto
Primeramente, debemos crear el poryecto **.NET MAUI** y tenerlo listo para la plataforma **Android**:
1. Creamos el proyecto en Visual Studio 2022:
![](/img/posts/2022/07/27/1.png)  
2. Colocamos un nombre descriptivo al proyecto nuevo:
![](/img/posts/2022/07/27/2.png)  
3. Seleccionamos el .NET Core que deseamos utilizar:
![](/img/posts/2022/07/27/3.png)  
4. Verificamos las opciones habilitadas (nos interesa Android):
![](/img/posts/2022/07/27/4.png)  

## Configurar WSA
Procedemos a configurar la máquina virtual para poder utilizarla
1. En la configuración de **WSA**, verificamos la IP y puerto para conectarnos:
![](/img/posts/2022/07/27/5.png)  
2. Ejecutamos la consola de Android desde Visual Studio:
![](/img/posts/2022/07/27/6.png)
3. Ejecutamos el siguiente comando:
```
adb connect 127.0.0.1:58526
```
4. Verificamos la conexión realizada:
![](/img/posts/2022/07/27/7.png)  
5. En visual Studio, veremos el nuevo dispositivo:
![](/img/posts/2022/07/27/8.png)  
6. Ejecutamos la aplicación y la veremos en **WSA**:
![](/img/posts/2022/07/27/9.png)  

¡Espero resulte útil!
