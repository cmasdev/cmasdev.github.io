---
layout: post
title: "Business Central: Publicar una extensión"
author: "Christian Amado"
date: 2019-01-02 22:19:10 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En una [entrada anterior](/2018/12/business-central-entorno-de-desarrollo-con-visual-studio-code/), vimos cómo preparar un entorno de desarrollo de extensiones con Visual Studio Code y hemos intentado mostrar un mensaje de bienvenida. En esta entrada, veremos como publicar dicha extensión desde el Visual Studio Code y desde el "Business Central Web Client".

Los pasos a seguir serían:

<!--more-->
1. Presionamos la combinación "Ctrl+Shift+P" para abrir "Command Palette" y escribimos "AL: Publish"  
![](/img/posts/migrated/2019/03/1-8.png)  

2. Si sale este error:
The request for path /DynamicsNAV130/dev/metadata failed with code InternalServerError. Reason: NetFx40\_LegacySecurityPolicy is enabled and must be turned off in the Microsoft.Dynamics.Nav.Server.exe.config file.

Debemos solucionarlos de la siguiente manera
4. Ir a "Business Central Administration", seleccionar la instancia, buscar la sección "Client Services" y completar el campo "Web Client Base URL":  
![](/img/posts/migrated/2019/03/2-8.png)  

Es la dirección del servidor + la instancia. En mi ejemplo: http://localhost:8080/dynamicsnav1303. 

Nos dirigimos a la ubicación del NAV Server, generalmente en "C:\\Program Files\\Microsoft Dynamics 365 Business Central\\130\\Service\\Microsoft.Dynamics.Nav.Server.exe.config" y procedemos a modificar la línea especificada en el error:  
![](/img/posts/migrated/2019/03/3-6.png)  

5. Reiniciamos el Business Central Server.

6. Al publicar, ejecutará el código que introducimos en la extensión:  
![](/img/posts/migrated/2019/03/4-7.png)  

Así hemos publicado nuestra extensión y hemos visto como funciona de manera nativa dentro de la aplicación. :P