---
layout: post
title: "NAV: DataItem Temporal en Reporte"
author: "Christian Amado"
date: 2019-06-12 22:44:30 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Dentro del mundo de desarrollo de Microsoft Dynamics NAV 2018 existen limitaciones, por ejemplo, sólo se pueden crear hasta 10 tablas (luego se deben comprar más tablas si se desea seguir desarrollando). Es por eso, que muchas veces necesitamos procesar el resultado de una tabla existente dentro de la misma tabla, pero haciéndola temporal sólo para emitir un reporte.

En ese caso, debemos procesar lo necesario en un paso previo y pasar los datos temporales al reporte que posee como DataItem una tabla temporal. En este ejemplo intentaremos hacer un "análisis de saldo por proveedor".

<!--more-->

Para lograr el objetivo de esta entrada, debemos seguir los siguientes pasos: Creamos un reporte cuyo DataItem debería ser de tipo **Vendor** (Proveedor):  
![](/img/posts/migrated/2019/06/1.png)  

En las propiedades, colocamos lo siguiente:  
![](/img/posts/migrated/2019/06/2.png)  

Ahora, es momento de crear el **DataItem** para el recorrido de la tabla temporal:  
![](/img/posts/migrated/2019/06/3.png)  

Las mismas variables utilizadas en el primer DataItem **Vendor**, pueden usarse dentro del DataItem **Integer**. La diferencia está en que los campos dentro del DataItem **Integer** corresponden a datos de la tabla temporal.

En las propiedades del DataItem **Integer**, colocamos los siguiente:  
![](/img/posts/migrated/2019/06/4.png)  

En lo que refiere al diseño, está listo. En el código debemos tener en cuenta una cosa en la función **Integer - OnAfterGetRecord()**, donde se coloca el siguiente código:
```
IF Number = 1 THEN
  //Esto hace que recorra los elementos de la tabla temporal
  TURECORD.FIND('-')
ELSE
  IF TURECORD.NEXT = 0 THEN
    //Esto hace que se detenga la ejecución del reporte porque llegó al final de la tabla temporal
    CurrReport.BREAK;
```
Debemos tener en cuenta, que se asume que el **Record** que se está pasando al reporte es una tabla temporal. Para este caso, la tabla ya viene procesada con los datos filtrados según nuestras necesidades.

¡Espero resulte útil!