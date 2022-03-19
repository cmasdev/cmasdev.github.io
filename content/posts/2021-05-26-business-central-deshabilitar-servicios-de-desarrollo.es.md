---
layout: post
title: "BC Tip: Deshabilitar servicios de desarrollo"
author: Christian Amado
date: 2021-05-26 12:54:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este sencillo artículo explico cómo deshabilitar los servicios de desarrollo, normalmente en un ambiente **PROD** o **QA**.

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

Para poder realizar esta tarea debemos abrir la consola de administración de Microsoft Dynamics 365 Business Central:  
![](/img/posts/2021/05/26/DevService1.png)  

Nos dirigimos a la sección de **Development** y procedemos a deshabilitar la opción:  
![](/img/posts/2021/05/26/DevService2.png)  

Reiniciamos el servicio y se habrá deshabilitado el servicio de desarrollo evitando cualquier cambio en la estructura de nuestro ERP.

¡Espero resulte útil!