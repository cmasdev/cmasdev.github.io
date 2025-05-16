---
layout: post
title: "Invocar servicios REST API desde Power Automate"
author: "Christian Amado"
date: 2024-02-07 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [Power Automate]
thumbnail-img: /img/posts/thumbnails/powerautomate.png
cover-img: /img/posts/cover/powerautomate.svg
share_img: /img/posts/cover/powerautomate.svg
---

En este artículo mostraré cómo invocar a un servicio REST API con **Microsoft Power Automate**.

<!--more-->

Para cubrir el objetivo del artículo debemos seguir los siguientes pasos:

1. Crear un flujo de nbe instantáneo:
![](https://i.ibb.co/4pt831R/pa-rest-1.png)

2. Agregar la acción que corresponde a **HTTP**:
![](https://i.ibb.co/WpYZMZL/pa-rest-2.png)

3. Adicionamos los parámetros necesarios para el funcionamiento de la *API REST*:
![](https://i.ibb.co/c3jgSgJ/pa-rest-3.png)

4. En este caso, agregamos laopción de *Envío de correo electrónico*:
![](https://i.ibb.co/CwVFvcG/pa-rest-4.png)

5. Probamos la ejecución:
![](https://i.ibb.co/0FvQvTY/pa-rest-5.png)

6. Revisamos el correo para verificar cómo llega el resultado de la consulta a la *API*:
![](https://i.ibb.co/4Vq9Bvj/pa-rest-6.png)

De esta manera sencilla hemos podido invocar servicios REST API desde **Microsoft Power Automate**.

¡Espero resulte útil!