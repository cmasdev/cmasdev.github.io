---
layout: post
title: "Invocar servicios SOAP desde Power Automate Desktop"
author: "Christian Amado"
date: 2024-01-24 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [Power Automate, Power Automate Desktop]
thumbnail-img: /img/posts/thumbnails/powerautomate.png
cover-img: /img/posts/cover/powerautomate.svg
share_img: /img/posts/cover/powerautomate.svg
---

En este artículo mostraré cómo consumir un Servicio Web SOAP desde **Microsoft Power Automate Desktop**.

<!--more-->

En el [artículo anterior](/posts/2024-01-17-first-steps-in-power-automate-desktop/), hemos visto los primeros pasos para utilizar **Microsoft Power Automate Desktop**

Para cubrir el objetivo del artículo debemos seguir los siguientes pasos:

1. Verificar el servicio web que se va utilizar (en este caso, utilizaremos servicios gratuitos de POSTMAN):
[Postman Web Services](https://documenter.getpostman.com/view/8854915/Szf26WHn#b10f59a4-1b0e-4883-bbda-9a9aac7bd81a)

2. En **Power Automate Desktop**, crear un nuevo flujo:
![](https://i.ibb.co/SX3nPTW/desktop-pa-6.png)

3. Buscar la opción de *Invocar servicio web SOAP*:
![](https://i.ibb.co/6F0Cf6N/pad-soap-1.png)

4. Completamos los detalles del servicio web SOAP:
![](https://i.ibb.co/TbLnPqS/pad-soap-2.png)

5. Ejecutamos la acción:
![](https://i.ibb.co/pwzwDB4/pad-soap-3.png)

6. Verificamos las variables retornadas por el flujo:
![](https://i.ibb.co/6rwDdHp/pad-soap-4.png)

7. Doble clic en la variable *SoapServiceResponse* y veremos el resultado del servicio web:
![](https://i.ibb.co/8bDtsPn/pad-soap-5.png)

De esta manera sencilla hemos podido invocar a un servicio web SOAP desde **Microsoft Power Automate Desktop**.

¡Espero resulte útil!