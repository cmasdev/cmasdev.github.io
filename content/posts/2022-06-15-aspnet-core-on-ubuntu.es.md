---
layout: post
title: "ASP.NET Core en Ubuntu"
author: Christian Amado
date: 2022-06-15 12:08:00 -0400
category: [Desarrollo de software]
tags: [WinDev, ASP.NET Core, WSL, Ubuntu]
thumbnail-img: /img/posts/thumbnails/android.png
cover-img: /img/posts/cover/android.png
share_img: /img/posts/shared/android.jpg
---

En este artículo mostraré cómo ejecutar una aplicación **ASP.NET Core** sobre **Windows Subsystem for Linux**, es decir, alojar un servidor web en Ubuntu para ejecutar nuestra aplicación web.

***Windows 11 Insider Preview Build 22621***

<!--more-->

Se habla mucho respecto a que .NET Core puede ejecutar aplicaciones nativamente en Linux (Ubuntu, en este caso) y es hora de hacer la prueba. En este caso, alojaremos la aplicación en un "servidor" Ubuntu para verificar su funcionamiento. 

## Preparar el proyecto
Primeramente, debemos crear el poryecto **ASP.NET Core**:
1. Creamos el proyecto en Visual Studio 2022:
![](/img/posts/2022/06/15/1.png)  
2. Colocamos un nombre descriptivo al proyecto nuevo:
![](/img/posts/2022/06/15/2.png)  
3. Seleccionamos el .NET Core que deseamos utilizar:
![](/img/posts/2022/06/15/3.png)  
4. Verificamos las opciones habilitadas para la ejecución (nos interesa **WSL**):
![](/img/posts/2022/06/15/4.png)  

## Ejecución para WSL
Empezamos a realizar las tareas relacionadas con la ejecución
1. Hacemos clic en el botón de ejecución o presionamos la tecla *F5*, saldrá un mensaje de error como este (si es que no tenemos instalado el dotnet en WSL):
![](/img/posts/2022/06/15/5.png)  
2. SEguimos los pasos en la consola de WSL (para que se instale el motor de ejecución) y en Visual Studio aceptamos el mensaje:
![](/img/posts/2022/06/15/6.png)  
3. Volvemos a ejecutar la aplicación (en este punto funciona):
![](/img/posts/2022/06/15/7.png)  
4. Debemos agregar un poco de código para identificar en qué plataforma estamos (en la página index.cshtml agregamos la siguiente línea de código):
```
<h2>@Environment.OsVersion</h2>
```
5. Ejecutamos de nuevo la aplicación, pero seleccionamos la opción que tiene el nombre de nuestro proyecto, para poder usar el Web Server de Windows:
![](/img/posts/2022/06/15/8.png)  
6. Cambiamos la configuración a **WSL** nuevamente y ejecutamos para ver el cambio:
![](/img/posts/2022/06/15/9.png)  

De esta manera hemos montado el servidor web directamente en **Ubuntu** con **WSL**.

¡Espero resulte útil!
