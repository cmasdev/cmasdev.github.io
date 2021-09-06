---
layout: post
title: "NAVDEV Tips: Filtrar campos del diseñador de objetos"
author: "Christian Amado"
date: 2018-11-21 23:34:36 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Cuando desarrollamos dentro de Dynamics NAV 2018 nos encontramos con miles de objetos (tablas, páginas, reportes, consultas, XML Port) y muchas veces necesitamos encontrar los desarrollos que ya se han modificado y/o la fecha de modificación de los mismos.

Como desventaja encontramos que en NAV 2018 no existe el control de versiones ni podemos saber que usuario realizó las modificaciones.

<!--more-->

Pero si necesitamos filtrar objetos dentro del Dynamics NAV 2018 Development debemos seguir los siguientes pasos:
1. Este es el golpe de vista inicial, donde tendremos en cuenta las columnas "Modified", "Date" y "Time":  
![](/img/posts/migrated/2018/11/1.png)  

2. En el menú, vamos a "View" > "Table Filter...":  
![](/img/posts/migrated/2018/11/2.png)  

3. Aquí aplicaremos los filtros:  
![](/img/posts/migrated/2018/11/3.png)  

4. Para nuestro ejemplo, seleccionamos el campo "Modified" y hacemos clic en "OK":  
![](/img/posts/migrated/2018/11/4.png)  

5. Colocamos el valor necesarios, "yes" en este caso:  
![](/img/posts/migrated/2018/11/5.png)  

6. También agregamos el filtro de fecha:  
![](/img/posts/migrated/2018/11/6.png)  

7. Vemos como en nuestro "Object Designer" se aplicaron los filtros.  
![](/img/posts/migrated/2018/11/7.png)

De esta manera, logramos ser más ordenados en el desarrollo dentro de Dynamics NAV 2018. Esto teniendo en cuenta que NO tenemos control de versiones en Dynamics NAV 2018.