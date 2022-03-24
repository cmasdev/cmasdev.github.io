---
layout: post
title: "Business Central: Mis notificaciones"
author: Christian Amado
date: 2021-10-20 22:28:48 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo enviar y mostrar notificaciones (la campana que aparece en ángulo superior derecho de la pantalla) en Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

La ubicación de las notificaciones es esta:  
![](/img/posts/2021/10/20/Notificacion1.png)  

En el código debemos agregar algo como esto:
```
pageextension 50100 CustomerListExt extends "Customer List"
{
    trigger OnOpenPage()
    var
        MiNotificacion: Notification;
    begin
        MiNotificacion.Message := 'Esta es una notificación';
        MiNotificacion.Send();
    end;
}
```
Con estas lineas estamos enviando una notificación al sistema para que se lancen las alertas necesarias. Por defecto, utiliza el ámbito.  

Veremos, el indicador de notificaciones de la siguiente manera:  
![](/img/posts/2021/10/20/Notificacion2.png)  

Cambiamos el ámbito y nos sale el siguiente error en Microsoft Dynamics 365 Business Central:  
![](/img/posts/2021/10/20/Notificacion3.png)  

¡Espero resulte útil!