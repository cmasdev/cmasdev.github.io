---
layout: post
title: "NAV: Conexión con base de datos externa - Parte 1"
author: "Christian Amado"
date: 2019-12-11 19:33:55 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Los desarrolladores de Dynamics NAV sabemos que tenemos limitaciones a nivel de tablas (normalmente con una licencia vienen 10 tablas) por eso tenemos esta oportunidad de integrar o crear tablas externas. Estas tablas externas permiten ser accedidas desde fuera de Dynamics NAV y poder trabajar con ellas sin mayores problemas.

Divido esta entrada en dos partes para que se entiendan bien los pasos que debemos realizar para que todo esto funcione como esperamos que lo haga. En la primera parte, veremos lo relacionado a una base de datos externa a Dynamics NAV y cómo crear la misma tabla dentro de Dynamics NAV. No te preocupes, las tablas externas NO consumen licencias de tablas. En la segunda parte, veremos lo relacionado a Dynamics NAV para crear una página que lea los datos de esa tabla externa.

<!--more-->

Empecemos creando una tabla dentro de la misma base de datos de nuestro entorno de prueba (tacho el nombre porque corresponde a un cliente de mi empresa):  
![](/img/posts/migrated/2019/12/1-1.png)  

Cargamos datos en SQL Server y probamos los datos que se encuentran en nuestra tabla:  
![](/img/posts/migrated/2019/12/2-1.png)  

Ahora, nos dirigimos al entorno de desarrollo de Dynamics NAV y creamos la tabla externa (con el mismo nombre que el objeto de SQL Server):  
![](/img/posts/migrated/2019/12/3-1.png)  

En las propiedades de la tabla nueva debemos colocar lo siguiente:  
![](/img/posts/migrated/2019/12/4-1.png)  

Compilamos el objeto y no deberíamos tener problemas.

De esa manera hemos creado una tabla externa que nos permite trabajar con datos fuera de la base de datos de Dynamics NAV.