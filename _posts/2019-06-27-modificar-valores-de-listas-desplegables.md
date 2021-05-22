---
layout: post
title: "Modificar valores de listas desplegables"
author: "Christian Amado"
date: 2019-06-27 19:44:42 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
subtitle: En este artículo muestro cómo modificar valores en lista.
thumbnail-img: /assets/img/posts/thumbnails/nav.png
cover-img: /assets/img/posts/thumbnails/nav.png
---

El día de hoy tuve un pedido relacionado a cómo se visualizan los cambos en una lista desplegable dentro de una página en Dynamics NAV 2018. Básicamente, se debe hacer un cambio en la tabla de origen del elemento, pues es ahí donde se definen los campos de la lista desplegable.

<!--more-->

Primeramente, veamos cómo se ve actualmente la lista desplegable dentro de la página en cuestión:  
![](/assets/img/posts/migrated/2019/06/1-1.png)

Nos dirigimos a la tabla **Customer**, en este caso:  
![](/assets/img/posts/migrated/2019/06/2-1.png)

En el menú ver, del entorno de desarrollo de **Dynamics NAV**, seleccionamos **Field Groups**:  
![](/assets/img/posts/migrated/2019/06/3-1.png)

Buscamos la opción **DropDown** (si no existe lo agregamos):  
![](/assets/img/posts/migrated/2019/06/4-1.png)

En la lista de campos, podemos agregarlos o eliminarlos:  
![](/assets/img/posts/migrated/2019/06/5.png)

Guardamos y compilamos. Por último, volvemos a la página inicial y vemos el cambio:  
![](/assets/img/posts/migrated/2019/06/6.png)

De esta manera, eliminamos un campo de la lista desplegable. Se debe tener en cuenta, que este cambio afecta a todas las listas desplegables que tienen acceso a la tabla **Customer**.