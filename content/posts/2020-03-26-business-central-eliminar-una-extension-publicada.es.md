---
layout: post
title: "Business Central: Eliminar una extensión publicada"
author: "Christian Amado"
date: 2020-03-26 12:17:18 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Dentro del producto Dynamics 365 Business Central se encuentra una sección donde podemos administrar las extensiones instaladas en el servidor.  

<!--more-->

De una manera muy sencilla se puede acceder a ella, desinstalar e inclusive anular una publicación:  
![](/img/posts/migrated/2020/03/1-3.png)  

Uan vez instalados en la página lo podemos visualizar y hacer clic en el borde superior derecho de la extensión que deseamos desintalar:  
![](/img/posts/migrated/2020/03/2-3.png)  
Procedemos a su Desinstalación:  
![](/img/posts/migrated/2020/03/3-3.png)  

Nos muestra el mensaje correspondiente:  
![](/img/posts/migrated/2020/03/4-3.png)  

En ese momento ya no tendremos acceso a las funcionalidades expuestan por la extensión y los datos se eliminan de la base de datos.  

Si deseamos anular la extensión, es decir, que ya no esté disponible en el servidor, lo hacemos así:  
![](/img/posts/migrated/2020/03/5-2.png)  

Veremos que la extensión fue eliminada completamente del sistema:  
![](/img/posts/migrated/2020/03/6-2.png)  

De esa manera, hemos quitado la extensión que no resultaba necesaria en nuestro servidor. Esta página no debería tener permisos de ejecución a usuarios que puedan comprometer la funcionalidad del sistema.  

¡Espero resulte útil!
