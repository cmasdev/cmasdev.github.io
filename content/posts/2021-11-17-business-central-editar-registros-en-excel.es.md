---
layout: post
title: "BC Tips: Editar registros en Microsoft Excel"
author: Christian Amado
date: 2021-11-17 20:26:09 -0400
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo editar en Microsoft Excel desde Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Básicamente debemos lograr editar en Excel desde Microsoft Dynamics 365 Business Central. Para el ejemplo, editaremos la grilla de **Clientes**:  
![](/img/posts/2021/11/17/Excel1.png)  

Para que todo funcione como esperamos, debemos configurar los permisos en **Usuarios**:  
![](/img/posts/2021/11/17/Excel2.png)  

Seleccionamos el código **EXCEL EXPORT ACTION** para la instancia en cuestión:  
![](/img/posts/2021/11/17/Excel3.png)  

Volvemos a la grilla de **Clientes** y seleccionamos el botón Compartir:  
![](/img/posts/2021/11/17/Excel4.png)  

La versión On-Premise, no posee esa funcionalidad :(  Para continuar ocn este artículo, utilizo lo siguiente en una instancia Cloud, de un cliente :)  

Procedemos a hacer clic en el botón **Editar en Excel**:  
![](/img/posts/2021/11/17/Excel5.png)  

Dentro del Excel se habilita el panel de Microsofot Dynamics Add-In e iniciamos sesión:  
![](/img/posts/2021/11/17/Excel6.png)  

Veremos el panel con lo siguiente:  
![](/img/posts/2021/11/17/Excel7.png)  

Y la vista de la grilla sería:  
![](/img/posts/2021/11/17/Excel8.png)  

De esta manera, podemos modificar los datos en excel y sincronizarlos con la instancia directamente.  

¡Espero resulte útil!