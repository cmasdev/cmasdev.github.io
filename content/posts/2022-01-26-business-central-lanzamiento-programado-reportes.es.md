---
layout: post
title: "BC Tips: Lanzamiento programado de reportes "
author: Christian Amado
date: 2022-01-26 22:06:41 -0400
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo lanzar un reporte de manera programada en Microsoft Dynamics 365 Business Central para que se almacene como archivo PDF, Word o Excel.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Para esto debemos buscar el reporte que queramos lanzar programadamente:  
![](/img/posts/2022/01/26/Reporte1.png)  

Completamos los parámetros del reporte, como normalmente se hace y hacemos clic en el botón **Enviar a...**:  
![](/img/posts/2022/01/26/Reporte2.png)  

Seleccionamos el tipo de archivo:  
![](/img/posts/2022/01/26/Reporte3.png)  

Cambiamos los detalles de la programación del reporte:  
![](/img/posts/2022/01/26/Reporte4.png)  

Cargamos el horario de ejecución:  
![](/img/posts/2022/01/26/Reporte5.png)  

Al salir, veremos el mensaje siguiente:  
![](/img/posts/2022/01/26/Reporte6.png)  

¡Listo!
 
## ¿Cómo veo la ejecución?
Nos dirigimos a la **Bandeja de entrada de informes**:  
![](/img/posts/2022/01/26/Reporte7.png)  

Buscamos el reporte que deseamos:  
![](/img/posts/2022/01/26/Reporte7.png)  

Hacemos clic en el Nombre informe y nos abrirá el archivo generedo (en este caso está vacío porque no tengo datos en la fecha que indiqué como parámetro):  
![](/img/posts/2022/01/26/Reporte8.png)  

¡Espero resulte útil!