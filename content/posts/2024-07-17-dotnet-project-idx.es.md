---
layout: post
title: ".NET Web API con Proyecto IDX"
author: Christian Amado
date: 2024-07-17 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, .NET, Google, IDX]
thumbnail-img: /img/posts/thumbnails/idx.png
cover-img: /img/posts/cover/idx.png
share_img: /img/posts/shared/idx.png
---

En este artículo veremos cómo crear una Web API básica con el nuevo **Proyecto IDX** de **Google**, totalmente desde el navegador sin la necesidad de instalar absolutamente nada en él.

El **Proyecto IDX**, según **Google** es:  
> Project IDX es un espacio de trabajo asistido por IA para el desarrollo de aplicaciones multiplataforma y de pila completa en la nube.
> Con soporte para una amplia gama de marcos, lenguajes y servicios, además de integraciones con sus productos favoritos de Google, IDX optimiza su flujo de trabajo de desarrollo para que pueda crear y enviar aplicaciones entre plataformas con velocidad, facilidad y calidad.  

Más info [aquí](https://idx.dev/)

<!--more-->

En este artículo veremos cómo crear una app backend con .NET, bien sencilla a modo de demostración. Para ello, seguiremos los siguientes pasos:

1. Ingresamos al IDE (web) [aquí](https://idx.google.com/?pli=1). Se necesita iniciar sesión con una cuenta **Google**. 

2. Buscamos más plantillas (la idea es encontrar a .NET):
![](https://i.ibb.co/ZWH4KVc/idx-1.png)

3. En la sección **Backend**, buscamos a **.NET** y la seleccionamos:
![](https://i.ibb.co/w0WTPFy/idx-2.png)

4. Colocamos un nombre descriptivo, seleccionamos el ambiente ideal y creamos el proyecto:
![](https://i.ibb.co/WcJ8hx2/idx-3.png)

5. Nos mostrará el indicador de creación del proyecto:
![](https://i.ibb.co/Stb8CYR/idx-4.png)

6. Nos abre el IDX (hasta ahora vi que es un Visual Studio Code en la nube, tal como GitHub Codespace) y miramos el código de ejemplo:
![](https://i.ibb.co/zQjNKYp/idx-5.png)

7. Procedemos a ejecutar al aplicación en cuestión:
![](https://i.ibb.co/r6CNSTQ/idx-6.png)

8. Nos ofrece opciones para abrir la web:
![](https://i.ibb.co/yFQkkGD/idx-7.png)

9. En una nueva pestaña, nos muestra la web App.
![](https://i.ibb.co/ngHNgCv/idx-8.png)

Algo que noté es que la plantilla figura en **Backend**, pero tranquilamente podemos crear una aplicación Full Stack con .NET de base para cubrir nuestras necesidades.

Al momento de escribir este artículo noto que **Proyecto IDX** = **GitHub Codespace**. La base es Visual Studio Code.

¡Espero resulte útil!