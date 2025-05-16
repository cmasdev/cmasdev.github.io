---
layout: post
title: "Business Central: Deshabilitar descarga de código fuente en Extensiones"
author: Christian Amado
date: 2020-04-14 19:06:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Mi equipo y yo nos encontramos desarrollando algunas funcionalidades extra para el **Microsoft Dynamics 365 Business Central**, luego de realizar las pruebas nos dirigimos a Extensiones y vimos que se podía descargar el código fuente de todo el proyecto (código AL, reportes, etc).

<!--more-->

1. Accedemos al menú de "Extensiones" dentro del **Microsoft Dynamics 365 Business Central**:  
![](/img/posts/migrated/2020/04/bc_disable_download_source_1.png)  

2. Hacemos clic en el mini menú de la extensión en cuestión y hacemos clic en "Descarga origen":  
![](/img/posts/migrated/2020/04/bc_disable_download_source_2.png)  

3. Verificamos la descarga (es un .zip), lo descomprimimos y veremos todo nuestro trabajo:  
![](/img/posts/migrated/2020/04/bc_disable_download_source_3.png)  

¿Cómo hacemos para no permitir la descarga?
-------------------------------------------
No hay mucho secreto, es muy sencillo y lo explico a continuación:

1. En el archivo app.json (dentro de **Visual Studio Code**, agregamos o modificamos el valor de la propiedad "ShowMyCode"):
```
"showMyCode": false, //"showMyCode": true,
"runtime": "4.0",
"target": "OnPrem"
```
2. Volvemos al paso 1 y 2 del punto anterior; veremos un cambio en el menú contextual:  
![](/img/posts/migrated/2020/04/bc_disable_download_source_4.png)  

De esta manera, hemos bloqueado la descarga del código fuente de nuestra extensión.

¡Espero resulte útil!