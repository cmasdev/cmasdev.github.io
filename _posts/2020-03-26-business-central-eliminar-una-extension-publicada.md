---
layout: post
title: "Business Central: Eliminar una extensión publicada"
author: "Christian Amado"
date: 2020-03-26 12:17:18 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
subtitle: En este artículo muestro cómo eliminar una extensión en Business Central.
thumbnail-img: /assets/img/posts/thumbnails/businesscentral.png
cover-img: /assets/img/posts/thumbnails/businesscentral.png
---

Dentro del producto Dynamics 365 Business Central se encuentra una sección donde podemos administrar las extensiones instaladas en el servidor.  

<!--more-->

De una manera muy sencilla se puede acceder a ella, desinstalar e inclusive anular una publicación:  
![](/assets/img/posts/migrated/2020/03/1-3.png)  

Uan vez instalados en la página lo podemos visualizar y hacer clic en el borde superior derecho de la extensión que deseamos desintalar:  
![](/assets/img/posts/migrated/2020/03/2-3.png)  
Procedemos a su Desinstalación:  
![](/assets/img/posts/migrated/2020/03/3-3.png)  

Nos muestra el mensaje correspondiente:  
![](/assets/img/posts/migrated/2020/03/4-3.png)  

En ese momento ya no tendremos acceso a las funcionalidades expuestan por la extensión y los datos se eliminan de la base de datos.  

Si deseamos anular la extensión, es decir, que ya no esté disponible en el servidor, lo hacemos así:  
![](/assets/img/posts/migrated/2020/03/5-2.png)  

Veremos que la extensión fue eliminada completamente del sistema:  
![](/assets/img/posts/migrated/2020/03/6-2.png)  

De esa manera, hemos quitado la extensión que no resultaba necesaria en nuestro servidor. Esta página no debería tener permisos de ejecución a usuarios que puedan comprometer la funcionalidad del sistema.  

¡Espero resulte útil!
