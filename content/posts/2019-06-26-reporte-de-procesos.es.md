---
layout: post
title: "Reporte de procesos"
author: "Christian Amado"
date: 2019-06-26 19:06:12 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

En el mundo de Dynamics NAV el reporte tiene dos funciones:
1. Mostrar un reporte como tal con muchos datos ordenados según requerimientos estándares.
2. Procesar información sin mostrar resultado alguno

En este caso tomaremos la opción 2 de la situación.

<!--more-->

Básicamente, lo único que se debe hacer es cambiar la propiedad de un reporte, guardarlo y compilarlo.

En este ejemplo, tenemos un reporte que genera el [Hechauka Ventas](/2019/06/creando-csv-con-xmlport/) (que lo vimos como un XMLPort):  
![](/img/posts/migrated/2019/06/1-2.png)  

Una vez terminado el proceso, el reporte hará lo que hayamos indicado. tal vez, llamar a otro reporte (visual) o bien mostrar un mensaje.