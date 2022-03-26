---
layout: post
title: "BC Tips: Administrar tareas programadas"
author: Christian Amado
date: 2022-01-13 18:43:21 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo gestionar tareas programadas que pueden ser llamadas a CodeUnits y/o reportes en Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Primero, debemos acceder a la página en cuestión (**Movs. cola proyecto**):  
![](/img/posts/2022/01/13/Tarea1.png)  

En la lista, seleccionamos el botón **nuevo**:  
![](/img/posts/2022/01/13/Tarea2.png)  

Empezamos a crear la tarea, marcando el objeto que necesitamos (sólo pueden ser reportes y CodeUnits):  
![](/img/posts/2022/01/13/Tarea3.png)  

En este caso, seleccionamos un reporte:  
![](/img/posts/2022/01/13/Tarea4.png)  

Completamos los datos necesarios de la tarea:  
![](/img/posts/2022/01/13/Tarea5.png)  

Si deseamos hacer que el reporte se genere con una cierta periodicidad, lo hacemos aquí:  
![](/img/posts/2022/01/13/Tarea6.png)  

Veremos la lista de tareas que tenemos:  
![](/img/posts/2022/01/13/Tarea6.png)  

De esta manera, hemos realizado una tarea programada que se ejecutará según los criterios que hayamos seleccionado en la configuración de la misma.  

¡Espero resulte útil!