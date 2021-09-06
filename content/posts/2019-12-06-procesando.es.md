---
layout: post
title: "Procesando…"
author: "Christian Amado"
date: 2019-12-05 23:11:50 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En una entrada anterior, habíamos visto cómo crear una barra de progreso dentro de PowerApps. Vimos que no existe un control como tal pero que podemos adaptar uno a las necesidades que vamos teniendo.

Aquí veremos cómo mostrar un control "Procesando..." (loading) mientras se procesa algo, tomando como ejemplo el origen de datos **Cuentas** desde Dynamics 365 for Sales.

<!--more-->

Lo primero que tenemos que hacer es descargarnos una imagen .gif con fondo transparente que tenga la animación deseada. Por ejemplo:  
![](/img/posts/migrated/2019/12/loading.gif)  

Luego colocamos dicho elemento en nuestra aplicación:  
![](/img/posts/migrated/2019/12/1-4.png)  

![](/img/posts/migrated/2019/12/2-4.png)  

![](/img/posts/migrated/2019/12/3-4.png)  

Ahora, nos dirigimos a la accion **OnVisible** del objeto **Screen** donde agregaremos una variable:  
![](/img/posts/migrated/2019/12/4-3.png)   

Al agregar a la funcion **UpdateContext**, la variable se crea automáticamente, en este caso con el valor **false**.

A continuación, hacemos uso de la variable en la propiedad **Visible** de la imagen:  
![](/img/posts/migrated/2019/12/5-1.png)  

Por último, cambiamos el valor de la variable en alguna acción deseada. En este caso lo quiero hacer en el botón que actualiza el conjunto de datos:  
![](/img/posts/migrated/2019/12/6-1.png)  
```
UpdateContext({imagen:true});Refresh(\[@Cuentas\]);UpdateContext({imagen:false});
```
De esta manera tenemos disponible la opción de mostrar una imagen de proceso para que no se quede congelada la aplicación.

¡Espero resulte útil!