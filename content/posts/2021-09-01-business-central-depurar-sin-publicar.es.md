---
layout: post
title: "Business Central: Depurar sin publicar"
author: Christian Amado
date: 2021-09-01 15:50:23 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo depurar en Microsoft Dynamics 365 Business Central sin la necesidad de publicar la extensión en cuestión.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Esto es muy útil a la hora de hacer pruebas para no afectar a los usuarios conectados, sea el ambiente que sea. Debemos tener en cuenta que con esta opción de igual manera se depurará la última versión publicada.  
![](/img/posts/2021/09/01/Debug1.png) 

Para que esto funcione debemos tener esta propiedad en el archivo **launch.json**:
```
"breakOnError": true,
```
Y esta en el archivo **app.json**:
```
"showMyCode": true,
```

De esta manera, lograremos depurar el código sin la necesidad de publicar.

¡Espero resulte útil!