---
layout: post
title: "Configuración de Búsqueda en Power Pages"
author: "Christian Amado"
date: 2023-11-15 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [Power Pages]
thumbnail-img: /img/posts/thumbnails/powerpages.avif
cover-img: /img/posts/cover/powerpages.svg
share_img: /img/posts/shared/power-pages.png
---

En este artículo explicaré cómo habilitar búsquedas en **Power Pages**, por ende, en **Dataverse** para todos sus registros.

<!--more-->

# Habilitar funcionalidad en Dataverse
Para habilitar la búsqueda en **Power Pages**, primero, debemos habilitarlo para todo el **Dataverse**. Para eso debemos seguir estos pasos:

1. Ir al sitio de [Microsoft Power Platform Admin Center](https://admin.powerplatform.microsoft.com/home), seleccionar el *Entorno* que deseamos cambiar y seleccionar el menú *Configuración*:
![](https://i.ibb.co/86CB1bz/multilanguaje-1.png)  

![](https://i.ibb.co/gVNjhhv/multilanguaje-2.png) 

2. Luego, se debe ir al apartado *Producto* > *Funcionalidades*:
![](https://i.ibb.co/dcfgv5c/pp-search-1.png)

3. Por último, habilitamos la opción de búsqueda:
![](https://i.ibb.co/W0k4JKL/pp-search-2.png)

# Búsqueda en Power Pages
Con la búsqueda habilitada para el **Dataverese** ya estamos listos para poder utilizar la funcionalidad de búsqueda dentro de la base de datos.

La indexación de todos los registros puede tardar un tiempo (dependiendo del tamaño de la base de datos y cantidad de registros), pero una vez finalizada ya se puede utilizar.

En este ejemplo, ya está indexado pero no tengo ninguna tabla entonces aparece un mensaje similar a este:
![](https://i.ibb.co/r0FqrRH/pp-search-3.png)

De esta manera hemos habilitado la funcionalidad de búsqueda en un sitio **Microsoft Power Pages**.

¡Espero resulte útil!