---
layout: post
title: "Business Central: Descargar simbolos desde Sandbox"
author: Christian Amado
date: 2021-09-07 23:55:00 -0400
category: [Aplicaciones de negocio]
tag: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

El día de hoy intenté hacer la descarga de los símbolos de Microsoft Dynamics 365 Business Central pero me encontraba con errores y no lograba hacerlo funcionar. Primeramente, tuve errores para descargar los símbolos como tal y luego para poder depurar la aplicación.  

Para evitar que otras personas tengan ese problema, les comparto mi experiencia solucionando el inconveniente en este pequeño manual al estilo How To? que es mi costumbre escribir.  

<!--more-->

Manos a la obra...  

## ¿Cómo descargo los símbolos?
En Visual Studio, creamos un proyecto de tipo AL y luego procedemos a buscar el comando **AL: Download symbols** y hacemos clic sobre él:  

![](/img/posts/2021/09/07/1.png)  

En Visual Studio Code, nos aparecerá el registro de dispositivo. Por lo tanto, hacemos clic en el botón:  

![](/img/posts/2021/09/07/2.png)  

Seguimos los pasos, que se encuentran en pantalla hasta que aparezca la siguiente pantalla:  

![](/img/posts/2021/09/07/3.png) 


Ahora, veremos el siguiente error cuando intentamos compilarlo:  

![](/img/posts/2021/09/07/4.png)  

Tenemos dos posibles salidas para solucionar esto. Uno de ellos radica en utilizar el usuario y contraseña del administrador global, pero tendremos un problema posterior (no podremos depurar si el administrador global no posee una licencia activa de Business Central).  

De esta manera, la mejor solución es dar los permisos necesarios a un usuario para realizar las pruebas (aprovechando que estamos en un ambiente aislado). Así que, ingresamos al [Microsoft Dynamics 365 Business Central](https://businesscentral.dynamics.com) y procedemos a ingresar las credenciales de un usuario con licencia **Full**, nos dirigimos a Usuarios > Sección de Permisos:  

![](/img/posts/2021/09/07/5.png)  

En la primera sección agregamos el grupo **D365 Extension Management** y quitamos toda relación con empresa:  

![](/img/posts/2021/09/07/6.png)  

Repetimos el proceso para la siguiente sección, y seleccionamos el conjunto de permisos **D365 Extension Management ADMIN**:  

![](/img/posts/2021/09/07/7.png)  

De esta manera, volvemos a ejecutar el comando que debíamos ejecutar:  

![](/img/posts/2021/09/07/1.png)  

Ahora todo saldrá como esperamos:  

![](/img/posts/2021/09/07/8.png) 

Luego, podremos hacer F5 (Depurar) nuestra extensión y obtendremos, también, el resultado esperado:  

![](/img/posts/2021/09/07/9.png)  

![](/img/posts/2021/09/07/10.png)  

De esta manera hemos logrado descargar los símbolos de Business Central Cloud ;)