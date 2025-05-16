---
layout: post
title: "Business Central: Consumir servicios REST API con POSTMAN"
author: Christian Amado
date: 2021-09-08 20:04:39 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo consumir servicios ODATA desde Microsoft Dynamics 365 Business Central en POSTMAN.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Primeramente, necesitamos descargar e instalar POSTMAN desde [aquí](https://dl.pstmn.io/download/latest/win64).  

## Habilitar APIs en BC
Ahora, debemos habilitar las APIs configurándolas en el sistema:  
![](/img/posts/2021/09/08/API1.png)

Hacemos clic en el botón **Integrar las APIS**:  
![](/img/posts/2021/09/08/API2.png)

Aceptamos el mensaje:  
![](/img/posts/2021/09/08/API3.png)

En nuestro navegar podemos probar la API acceciendo a:
```
https://<base URL>:<port>/<serverInstance>/api/<API version>/

//en mi caso
https://cmasdev:7048/BC180/api/v2.0/
```
![](/img/posts/2021/09/08/API4.png)

¡Listo!

## Llamar al servicio desde POSTMAN

En POSTMAN, hacemos un Request del tipo GET y lo probamos:  
![](/img/posts/2021/09/08/API5.png)  

Completamos los datos de la autorización:  
![](/img/posts/2021/09/08/API6.png)  

EL resultado queda de la siguiente manera:  
![](/img/posts/2021/09/08/API7.png)  

Y así tenemos funcionando nuestra API desde Microsoft Dynamics 365 Business Central.

¡Espero resulte útil!