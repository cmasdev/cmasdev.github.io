---
layout: post
title: "Trabajando con tablas"
author: "Christian Amado"
date: 2019-05-30 20:59:02 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En una [entrada anterior](/2019/05/formularios/), dimos un adelanto sobre este tema debido a que trabajamos con formulario. En este caso mostraré las operaciones CRUD (Create, Read, Update y Delete) que se pueden realizar en una base de datos. Sin dar demasiadas vueltas, empecemos con las operaciones.

En cualquier otra herramienta tomaría muchos pasos hacer esta tarea, pero con Microsoft PowerApps no es el caso pues con algunos clics ya tenemos todas las operaciones necesarias, utilizando cualquier conector disponible.

<!--more-->

## Creando la aplicación
Primero, creamos una nueva aplicación utilizando la plantilla de datos:  
![](/img/posts/migrated/2019/05/1-4.png)  

Seleccionamos el conector que utilizaremos (en este caso, el conector de Dynamics 365 for Sales):  
![](/img/posts/migrated/2019/05/2-3.png)  

¡Listo! Esperamos unos segundos a que se creen las plantillas necesarias:  
![](/img/posts/migrated/2019/05/3-3.png)  

A la izquierda, podemos verificar los objetos creados para la aplicación:  
![](/img/posts/migrated/2019/05/4-2.png)  

## Utilizando la aplicación
### Pantalla principal
Aquí nos muestra los datos en forma de grilla (tal como lo hace el Microsoft Excel):  
![](/img/posts/migrated/2019/05/5-2.png)  

Al hacer clic, navega hacia el detalle de la cuenta seleccionada:  
![](/img/posts/migrated/2019/05/6-2.png)  

### Editar
En esta pantalla podemos editar los datos ya existentes:  
![](/img/posts/migrated/2019/05/7-1.png)  

### Eliminar
En la misma pantalla podemos eliminar los datos del registro seleccionado:  
![](/img/posts/migrated/2019/05/8-1.png)  

### Nuevo
Agregamos los datos necesarios en la pantalla actual:  
![](/img/posts/migrated/2019/05/9-1.png)  

Por último, para verificar que todo fuera correcto lo verifiqué en Dynamics 365 for Sales y el resultado es:  
![](/img/posts/migrated/2019/05/10.png)  

De esta manera, hemos creado una aplicación completa que involucra todas las operaciones que puede tener la administración de datos.
