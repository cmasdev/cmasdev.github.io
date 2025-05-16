---
layout: post
title: "NAV: Conexión con base de datos externa - Parte 2"
author: "Christian Amado"
date: 2019-12-18 22:36:06 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

En la entrada anterior, vimos cómo crear una tabla en SQL Server y agregarla en Dynamics NAV (sin consumir licencias). en esta ocasión veremos cómo utilizarla dentro de una página de Dynamics NAV para verificar si los datos son correctos.

Para ello, debemos seguir estos pasos...

<!--more-->

Primero, se debe crear la página enlazándola con la tabla externa que hemos creado en Dynamics NAV:  
![](/img/posts/migrated/2019/12/1-2.png)  

![](/img/posts/migrated/2019/12/2-2.png)  

Ahora debe escribir este código en la función OnInit() de la página:
```
OnInit()
//CADENA DE CONEXION
IF HASTABLECONNECTION(TABLECONNECTIONTYPE::ExternalSQL,'CMASBLOG') THEN
    UNREGISTERTABLECONNECTION(TABLECONNECTIONTYPE::ExternalSQL,'CMASBLOG');

REGISTERTABLECONNECTION(TABLECONNECTIONTYPE::ExternalSQL,'CMASBLOG','Server=TU\_SERVIDOR\\TU\_INSTANCIA;Initial Catalog=TU\_BASE\_DE\_DATOS;Integrated Security=SSPI;');
SETDEFAULTTABLECONNECTION(TABLECONNECTIONTYPE::ExternalSQL,'CMASBLOG')
```
Con este código, la página está lsita para la verificación de los datos:  
![](/img/posts/migrated/2019/12/3-2.png)  

Con estos simples pasos logramos integrar una base de datos externa (de cualquier proveedor) con Microsoft Dynamics NAV 2018.