---
layout: post
title: "BC Tips: Editar documentos registrados"
author: Christian Amado
date: 2021-11-24 10:14:56 -0400
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo cambiar ciertos datos de un documento registrado en Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Los documentos registrados no pueden ser alterados, porque fiscalmente ya fueron procesados. En ocasiones debemos modificar algún que otro valor por algún tema. Evidentemente esto lo haremos por algún perfil de seguridad que pueda hacerlo para no perder la consistencia del sistema.  

Para el caso de una factura de venta (que ya fue registrada, es decir, fue ingresada a contabilidad) podremos modificar la forma de pago:  
![](/img/posts/2021/11/24/Registro1.png)  

Veremos el cuadro correspondiente y procedemos a modificar el valor (está vacío):  
![](/img/posts/2021/11/24/Registro2.png)  

![](/img/posts/2021/11/24/Registro3.png)  

Verificamos si se realizó el cambio:  
![](/img/posts/2021/11/24/Registro4.png)  

El cambio puede afectar nuevos asientos si es necesario. Todo depende del campo que estemos modificando. Recordemos que sólo algunos cambios se pueden modificar. Asientos ya creados no se pueden modificar.  

¡Espero resulte útil!