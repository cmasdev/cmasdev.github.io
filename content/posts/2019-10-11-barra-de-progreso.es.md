---
layout: post
title: "Barra de progreso"
author: "Christian Amado"
date: 2019-10-10 23:14:41 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

Otra herramienta que se utiliza mucho a la hora de desarrollar aplicaciones es la barra de progreso, para mostrar algún avance en el proceso. En Microsoft PowerApps no tenemos un control especializado para realizar esa tarea, por lo tanto debemos crear algo que simule esa tarea.

Para ello utilizaremos dos controles de tipo **Rectángulo** y un control **Slider** que permitirá mostrar el proceso deseado.

<!--more-->

Primero, creamos un rectángulo con bordes azules y sin relleno (relleno en blanco):  
![](/img/posts/migrated/2019/10/1-2.png)  

Creamos otro rectángulo con las mismas dimensiones que el primero:  
![](/img/posts/migrated/2019/10/2-2.png)  

Agregamos un control de tipo **Slider** que utilizaremos para cambiar los valores del segundo rectángulo:  
![](/img/posts/migrated/2019/10/3-2.png)  

Colocamos la fórmula que necesitamos para la barra de progreso en la propiedad Width del segundo rectángulo:  
![](/img/posts/migrated/2019/10/4-1.png)  

Ubicamos el segundo rectángulo sobre el primer rectángulo:  
![](/img/posts/migrated/2019/10/5-1.png)  

Agregamos una **etiqueta** para mostrar el valor del **Slider**:  
![](/img/posts/migrated/2019/10/6-1.png)  

Realizamos las pruebas con el **Slider**:  
![](/img/posts/migrated/2019/10/7.png)  

![](/img/posts/migrated/2019/10/8.png)  

De esta manera logramos simular una barra de progreso que podemos utilizar donde sea necesario.