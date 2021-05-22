---
layout: post
title: "Business Central: Integración Flow"
author: "Christian Amado"
date: 2018-12-05 21:46:13 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Flow]
subtitle: En este artículo muestro cómo integrar BC con Microsoft Flow.
thumbnail: businesscentral.png
---

En esta entrada, veremos como integrar Microsoft Flow con Dynamics 365 Business Central. De manera muy sencilla y rápida se puede lograr el objetivo. Si deseamos tener la versión On-Premise, necesitamos tener salida de Internet desde el servidor donde tenemos instalado el Dynamics 365 Business Central.

Estos pasos deben seguirse para lograr la integración:

<!--more-->
1. Ingresamos al portal de Microsoft Flow y seleccionamos "Nuevo":
![](/assets/img/posts/migrated/2018/08/1-7.png)  

2. Elegimos la opción "Crear desde cero":
![](/assets/img/posts/migrated/2018/08/2-7.png)  

3. Nos dirigimos al buscador y hacemos clic allí:
![](/assets/img/posts/migrated/2018/08/3-7.png)  

4. Veremos un buscador similar al siguiente:
![](/assets/img/posts/migrated/2018/08/4-6.png)  

5. Escribimos la palabra "central" y aplicará el filtro:
![](/assets/img/posts/migrated/2018/08/5-7.png)

Si seleccionamos la opción 1 (hablamos de la versión Cloud - Nube) y debemos seguir estos pasos:

- Nos posicionamos en la pestaña "Desencadenadores" y seleccionamos la opción deseada:  
![](/assets/img/posts/migrated/2019/03/61.png)  

- En la pestaña "Acciones" tenemos todas las opciones habilitadas para Dynamics NAV 2018:  
![](/assets/img/posts/migrated/2019/03/71.png)  

Si seleccionamos la opción 2 (hablamos de la versión On-Premise) y debemos seguir estos pasos:

- Nos posicionamos en la pestaña "Desencadenadores" pero no encontraremos nada allí :( (en otra entrada explicaré cómo hacer que aparezcan):  
![](/assets/img/posts/migrated/2019/03/6-7.png)  

- En la pestaña "Acciones" tenemos todas las opciones habilitadas para Dynamics 365 Business Central:  
![](/assets/img/posts/migrated/2019/03/7-5.png)  

En este producto tenemos dos opciones para utilizarlo con Microsoft Flow.

Con estos pasos hemos logrado aprender cómo configurar Microsoft Flow con Dynamics 365 Business Central.