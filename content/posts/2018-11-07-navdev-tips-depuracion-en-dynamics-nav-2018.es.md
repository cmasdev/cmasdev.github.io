---
layout: post
title: "NAVDEV Tips: Depuración en Dynamics NAV 2018"
author: "Christian Amado"
date: 2018-11-07 03:17:28 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

NAV, como cualquier herramienta de desarrollo ofrece la posibilidad de depurar el programa, y lo permite de manera remota, sí, de manera remota depurando la sesión de cualquier usuario para poder realizar las pruebas necesarias.

Esto es muy interesante y útil a la hora de encontrar cosas, que debido a la complejidad de la aplciación de negocio, están encapsuladas en Code Units o bien dentro de la misma tabla.

<!--more-->

Aquí enumero los pasos para habilitar dicha funcionalidad (seguimos con la tabla modificada en la entrada anterior):
1. Marcamos el punto de interrupción (haciendo clic en la parte gris de la izquierda o bien presionando la tecla F9):  
![](/img/posts/migrated/2019/03/1-3.png)  

2. En el menú, nos dirigimos a Tools > Debugger > Debug Session...:  
![](/img/posts/migrated/2019/03/2-3.png)  

3. Nos abre el depurar y vemos que tenemos la lista de todas las sesiones activas. Aquí hacemos clic en "Depurar":  
![](/img/posts/migrated/2019/03/3-2.png)  

4. Habilitado! Procedemos a abrir nuestra aplicación NAV:  
![](/img/posts/migrated/2019/03/4-3.png)  

5. Modificamos el RUC (en este ejemplo):  
![](/img/posts/migrated/2019/03/5-3.png)  

6. Y vemos como el depurador se detiene donde hemos marcado. Además vemos que arriba están los botones necesarios para la depuración. A la derecha vemos la "Pila de llamadas" para saber desde donde se realizó la llamada. Y en el título tenemos el objeto donde nos encontramos:  
![](/img/posts/migrated/2019/03/6-3.png)  

De esta manera hemos visto como se realiza la depuración con el Dynamics NAV 2018 Development Environment.