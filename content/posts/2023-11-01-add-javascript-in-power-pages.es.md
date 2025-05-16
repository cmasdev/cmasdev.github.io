---
layout: post
title: "Agregar JavaScript en Power Pages"
author: "Christian Amado"
date: 2023-11-01 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [Power Pages]
thumbnail-img: /img/posts/thumbnails/powerpages.avif
cover-img: /img/posts/cover/powerpages.svg
share_img: /img/posts/shared/power-pages.png
---

En estos días me habían solicitado agregar un poco de **Javascript** a un sitio desarrollado en **Power Pages**, pero el generador de sitios no lo permite por seguridad. El único ámbito donde se puede utilizar **Javascript** es dentro de un formulario, es una funcionalidad limitada de la herramienta para evitar ataques desde código **Javascript**.

<!--more-->

En este caso, modificaremos la página *Contacto* para realizar algunos cambios en el formulario y agregar código **Javascript** personalizado.

Debemos seguir los siguientes pasos:
1. En el *Design Studio* nos dirigimos a *Administración de Power Pages*:
![](https://i.ibb.co/MDJjY77/multilanguaje-6.png) 

2. Seleccionamos en el menú de la izquierda *Formularios Básicos*:
![](https://i.ibb.co/7p6mLXq/JS-1.png)

3. Ir a la página en cuestión (en este caso, *Contacto*):
![](https://i.ibb.co/dBGjCmf/JS-2.png)

4. Buscamos el sub menú *Configuración Adicional* y nos bajamos hasta la ubicación de *Javascript personalizado*:
![](https://i.ibb.co/NNGNR19/JS-3.png)

5. Agregamos el código *Javascript* que necesitamos y listo:
```
$(document).ready(function() {
   alert('Hola desde Power Pages!');
});
```

6. Debería verse algo así:
![](https://i.ibb.co/kD7Qd7c/JS-4.png)

De esta sencilla manera hemos código **Javascript** a un formulario en **Microsoft Power Pages**.

¡Espero resulte útil!