---
layout: post
title: "NAVDEV Tips: Esconder DataItem en Request Page"
author: "Christian Amado"
date: 2018-12-19 02:51:18 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

De manera nativa, nos encontramos con la ventana de parámetros en Microsoft Dynamics NAV 2018. Muchas veces necesitamos esconder esa ventana de parámetros y ese es el tema central de esta entrada

En esta entrada, mostraré cómo vamos a esconder ese filtro según la necesidad.

<!--more-->

1. El requerimiento consiste en esconder la ventana de parámetros del "Histórico facturas venta":
![](/img/posts/migrated/2019/03/1-6.png)  

3. Nos dirigimos al "Dynamics NAV 2018 Development" y dentro del "Object Designer" filtramos por el reporte "Factura de venta o Sale Invoice" y hacemos clic en "Design":  
![](/img/posts/migrated/2019/03/2-6.png)  

5. Seleccionamos el DataItem "Sales Invoice Header":  
![](/img/posts/migrated/2019/03/3-4.png)  

7. Hacemos clic en "Propiedades":  
![](/img/posts/migrated/2019/03/4-5.png)  

9. Hacemos clic en el botón "..." en la propiedad "ReqFilterFields":  
![](/img/posts/migrated/2019/03/5-5.png)  

11. Marcamos todos los campos y hacemos clic derecho para poder elegir "Delete":  
![](/img/posts/migrated/2019/03/6-5.png)  

13. Guardamos y ejecutamos el reporte. Ahí tendremos la siguiente ventana:  
![](/img/posts/migrated/2019/03/7-3.png)  

Con estos sencillos pasos, podemos esconder la sección de la ventana de parámetros de un reporte en particular.