---
layout: post
title: "Ordenamiento y filtrado de columnas"
author: "Christian Amado"
date: 2019-10-01 18:54:23 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

Luego de algunos meses, con otros temas, aquí continúo con Microsoft PowerApps. En la [última entrada referente al tema](/2019/05/trabajando-con-tablas/) hemos vimos cómo crear una aplicación completa con datos de una manera sencilla. Me han preguntado ¿Cómo puedo ordenar y/o filtrar los datos? Para el caso del ejemplo, ya estaba ordenado y filtrado. Pero, me interesa explicar cómo hacerlo y que ustedes puedan aplicar según su necesidad.

<!--more-->

## Ordenamiento
Simplemente colocamos la función dentro de Microsoft PowerApps y este toma los datos necesarios y los ordena según los parámetros:  
![](/img/posts/migrated/2019/10/1.png)  
```
UpdateContext({SortDescending1: !SortDescending1})
```
## Filtrado
En este caso tenemos un cuadro de texto (con la imagen de la lupa) que servirá como filtro(**TextSearchBox1**):  
![](/img/posts/migrated/2019/10/2.png)  

En el elemento que contiene los datos, colocaremos la fórmula necesaria para realizar el filtro según el punto anterior(**TextSearchBox1**):  
![](/img/posts/migrated/2019/10/3.png)  
```
SortByColumns(Search(\[@Cuentas\], TextSearchBox1.Text, "emailaddress1","address1\_city","name"), "emailaddress1", If(SortDescending1, Descending, Ascending))
```
De esta manera logramos ordenar y filtrar datos de nuestros elementos de datos.
