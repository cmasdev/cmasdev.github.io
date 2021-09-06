---
layout: post
title: "Business Central: Depurar AL con Visual Studio Code"
author: "Christian Amado"
date: 2019-01-09 20:48:33 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En la entrada anterior, vimos cómo publicar el desarrollo de extensiones con Visual Studio Code y mostramos un mensaje de bienvenida. En esta entrada, veremos como depurar dicha extensión desde el Visual Studio Code.

Los pasos a seguir serían:

<!--more-->
1. Vamos al código donde necesitamos colocar el punto de interrupción y presionamos la tecla F9:  
![](/img/posts/migrated/2019/03/1-9.png)  

2. Presionamos la combinación "Ctrl+Shift+P" para abrir "Command Palette" y escribimos "AL:  Publish"
![](/img/posts/migrated/2019/03/1-8.png)  

3. Visual Studio Code se detiene en la línea indicada:  
![](/img/posts/migrated/2019/03/2-9.png)  

Así de fácil logramos depurar. Resumen: Resulta más sencillo depurar en Business Central que [en Dynamics NAV](/2018/11/navdev-tips-depuracion-en-dynamics-nav-2018/).
