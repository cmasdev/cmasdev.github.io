---
layout: post
title: "NAVDEV Tips: Comparación de registros modificados"
author: "Christian Amado"
date: 2018-11-28 21:42:18 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Muchas veces necesitamos hacer comparaciones entre los valores nuevos y los valores anteriores para realizar ciertas acciones.

En Dynamics NAV 2018 tenemos dos variables globales implícitas (variables propias del NAV) las cuales son "Rec" para el registro nuevo y "xRec" para el registro anterior.

<!--more-->

1. En este caso vemos el valor del RUC:  
![](/img/posts/migrated/2019/03/1-5.png)  

3. En la validación del "VAT Registration No." procedemos a imprimir el mensaje:
```
MESSAGE('El valor actual es: ' + Rec."VAT Registration No." +
    '. El valor anterior era: ' + xRec."VAT Registration No." + '.');
```
5. El mensaje nos muestran ambos valores:  
![](/img/posts/migrated/2019/03/2-5.png)  

Dynamics NAV 2018 nos permite tener el registro completo del nuevo campo así como el registro completo de todo el registro anterior.