---
layout: post
title: "Validaciones"
author: "Christian Amado"
date: 2019-10-03 20:11:49 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

Esta entrada tiene relación con el trabajo con datos, en la entrada anterior vimos cómo ordenar y filtrar datos. Aquí veremos otro punto importante que se basa en las validaciones. Aquí me centraré en validar datos en la pantalla donde se insertan elementos.

De esta manera, los datos validados terminarán en el Dynamics 365 for Sales. Vamos a ver cómo podemos hacerlo.

<!--more-->

Primero, necesitamos posicionarnos en la pantalla correspondiente a la inserción de objetos (cuentas, en este caso) y desbloquear el diseño de controles:  
![](/img/posts/migrated/2019/10/1-1.png)  

Posteriormente, procedemos a marcar como requerido (cambiamos **false** por **true**) el campo deseado (en este caso el nombre de la cuenta):  
![](/img/posts/migrated/2019/10/2-1.png)  

Tenemos en cuenta los siguientes controles, que ya existen en nuestra plantilla:  
![](/img/posts/migrated/2019/10/3-1.png)  

En el control **ErrorMessage5**, colocamos el texto que deseamos mostrar cuando se produzca el error:  
![](/img/posts/migrated/2019/10/3_1.png)  

Seguidamente aplicamos la fórmula necesaria en la propiedad **Visible** del control **ErrorMessage5**:  ![](/img/posts/migrated/2019/10/4.png)  
```
If(IsNumeric(DataCardValue14.Text),true,false)
```
Ejecutamos la aplicación y verificamos los resultados (primero el erróneo):  
![](/img/posts/migrated/2019/10/5.png)  

![](/img/posts/migrated/2019/10/6.png)  

De esta manera, hemos procedido a validar el control según la necesidad planteada.
