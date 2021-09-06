---
layout: post
title: "Filtros para la integración con D365 for Sales"
author: "Christian Amado"
date: 2019-12-17 21:25:40 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En una [entrada anterior](/2019/04/valores-predeterminados-para-integracion/), vimos cuáles eran los valores predeterminados de integración entre Dynamics 365 Business Central y Dynamics 365 for Sales. Dentro de nuestro ERP Dynamics 365 Business Central se pueden crear/editar filtros para la obtención de los datos desde y hacia el CRM de manera a saturar lo menos posible el ancho de banda de ambos servicios.

<!--more-->

En este caso, veremos cómo crear/editar ambos filtros.

Primeramente nos dirigimos a la página **Lista de asignaciones de tablas de integración**:  
![](/img/posts/migrated/2019/12/1-7.png)  

Luego, seleccionamos Editar lista y hacemos clic en los puntos suspensivos:  
![](/img/posts/migrated/2019/12/2-7.png)  

Modificamos los filtros necesarios:  
![](/img/posts/migrated/2019/12/3-7.png)  

Con los pasos anteriores logramos filtros los datos del ERP Dynamics 365. Ahora, veremos cómo filtrar los datos del **CRM**.

Seleccionamos **Editar lista** y hacemos clic en los puntos suspensivos:   
![](/img/posts/migrated/2019/12/4-6.png)  

Modificamos los filtros necesarios:  
![](/img/posts/migrated/2019/12/5-4.png)  

De est manera se aplican los filtros para la integración de tablas dentro de Dynamics 365 Business Central.