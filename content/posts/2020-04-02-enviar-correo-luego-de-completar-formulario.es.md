---
layout: post
title: "Enviar correo luego de completar formulario"
author: Christian Amado
date: '2020-04-02 17:00:00 -0400'
category: Aplicaciones de negocio 
tags:
        - Flow
        - 'Power Automate'
thumbnail-img: /img/posts/thumbnails/powerautomate.png
cover-img: /img/posts/cover/powerautomate.svg
---

En esta ocasión, quiero compartir con ustedes una funcionalidad muy buena de Power Automate. Imaginemos que necesitamos completar un formulario y que la respuesta sea enviada por correo electrónica a dicho usuario.

<!--more-->

## Microsoft Forms

Primero, debemos ingresar a la aplicación en cuestión: ![](/img/posts/powerautomate/1.png)

Cerramos la ventana de bienvenida: ![](/img/posts/powerautomate/2.png)

Empezamos a crear el formulario colando un título y descripción (opcional): ![](/img/posts/powerautomate/3.png)

Agregamos el primer campo, en este caso, de tipo **Opción**: ![](/img/posts/powerautomate/4.png)

![](/img/posts/powerautomate/5.png)

Adicionamos un campo **Texto** (que será el Correo): ![](/img/posts/powerautomate/6.png)

![](/img/posts/powerautomate/7.png)

Compartimos el formulario para que todos lo completen: ![](/img/posts/powerautomate/8.png)

El formulario funcionando se encuentra [AQUÍ](https://forms.office.com/Pages/ResponsePage.aspx?id=oyz5wYqX-k2vzGA7tMRPtifqEP96lF1FjwTx_PmlcGZUMlVJOE1TNzczVlNBRkxON0pITVM2OFdFQy4u).

## Microsoft Power Automate

Aquí es donde manejaremos el flujo de envío de correo. Debemos de tener en cuenta que Power Automate maneja Desencadenadores y Acciones, es decir, a cada desencadenador una o varias acciones asociadas a él.

Ingresam a la aplicación en cuestión: ![](/img/posts/powerautomate/9.png)

Se crea un nuevo flujo y se elige una plantilla vacía: ![](/img/posts/powerautomate/10.png)

![](/img/posts/powerautomate/11.png)

Se completan los datos descriptivos y se selecciona la plantilla predeterminada para nuestra acción: ![](/img/posts/powerautomate/12.png)

Armamos el flujo siguiendo los siguientes pasos: ![](/img/posts/powerautomate/13.png)

![](/img/posts/powerautomate/14.png)

![](/img/posts/powerautomate/15.png)

![](/img/posts/powerautomate/16.png)

![](/img/posts/powerautomate/17.png)

![](/img/posts/powerautomate/18.png)

![](/img/posts/powerautomate/19.png)

![](/img/posts/powerautomate/20.png)

![](/img/posts/powerautomate/21.png)

¡Hemos terminado las tareas! Es hora de completar el formulario y ver si nos llega el correo:

![](/img/posts/powerautomate/22.png)

![](/img/posts/powerautomate/23.png)

De esta manera hemos automatizado una tarea que no es muy sencilla en el día a día, pero con esta herramienta logramos que sí lo sea.

¡Espero les resulte de utilidad!
