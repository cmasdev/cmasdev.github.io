---
layout: post
title: "Creando csv con XMLPort"
author: "Christian Amado"
date: 2019-05-01 23:13:56 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Hace tiempo veía una opción que se llamaba **XMLPort** y surgió el interés en saber a qué se refería. Pero entre el trabajo y otras actividades no tuve tiempo de darle una miradita.

Ahora que surgió la necesidad de exportación de una tabla a un archivo **.txt** es útil escribir esta entrada. **XMLPort** realiza la exportación a un archivo **XML** o **csv** según la necesidad. Es por eso que decidí plasmarlo en esta entrada.

<!--more-->

Primero, debemos crear el objeto de tipo **XMLPort** y enlazarlo a uno o varios **DataItems** (como si fuera un reporte):  
![](/img/posts/migrated/2019/05/1-5.png)  

En las propiedades del objeto principal hacemos las modificaciones correspondientes:  
![](/img/posts/migrated/2019/05/2-4.png)  

Cada elemento tiene dos métodos asociados (uno para importación de datos y otro para exportación):
```
TipoReporte - Import::OnAfterAssignVariable()

TipoReporte - Export::OnBeforePassVariable()
//Aquí forzamos a esta variable que debe ser 1 para la exportación.
TipoReporte := '1'
```
Compilamos el **XMLPort** y lo ejecutamos:  
![](/img/posts/migrated/2019/05/3-4.png)  

Si quieren ver el resultado real [aquí lo tienen](/img/posts/migrated/2019/05/Hechauka-Ventas.txt).

¡Espero les resulte útil!
