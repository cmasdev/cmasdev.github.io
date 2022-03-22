---
layout: post
title: "Business Central: Cómo ver todos los objetos"
author: Christian Amado
date: 2021-05-05 18:34:00 -0400
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo quiero hacer mención a una extensión demasiado importante a la hora de desarrollar sobre la plataforma de Microsoft Dynamics 365 Business Central. Básicamente es una herramienta que nos permite ver todos los objetos AL en Visual Studio Code.

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

La herramienta en cuestión se llama **AL Object Designer** y se encuentra disponible entre las extensiones de Visual Studio Code, el autor es [Márton Sági](https://marketplace.visualstudio.com/publishers/martonsagi) y básicamente nos permite ver todos los objetos. Más abajo un pantallazo de lo que hace.  

Primero, podemos ver la lista de todos los objetos. Voy a centrarme en la tabla **Customer**:  
![](/img/posts/2021/05/05/AllObjects1.png)  

Al hacer clic en el objeto podemos realizar varias tareas, pero considero más importantes las siguientes:
1. View
2. Events

En el primer caso, nos permite ver el código fuente de la tabla:  
![](/img/posts/2021/05/05/AllObjects2.png)  

En el segundo caso, nos permite ver todas los eventos que podemos extender como lo vimos [aquí](https://cmas.dev/posts/2020-04-21-business-central-utilizar-manejador-de-eventos/)  
![](/img/posts/2021/05/05/AllObjects3.png)  

¡Espero resulte útil!