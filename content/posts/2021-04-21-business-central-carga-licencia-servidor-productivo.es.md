---
layout: post
title: "Business Central: Cargar licencia en servidor productivo"
author: Christian Amado
date: 2021-04-21 16:03:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Este proceso es sencillo y necesitamos la línea de comandos para poder ejecutarla. Una vez realizado procedemos a reiniciar el servicio de Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*  

Primeramente, descargamos el archivo de licencias proveído por nuestro partner. Debe tener la extensión **.flf** y procedemos a cargarla en el servidor.  

Nos dirigimos a la línea de comando pero ingresando a **Business Central Administration Shell** como Administrador y ejecutamos la sigueinte línea (con los parámetros que necesitamos):  
```
Import-NAVServerLicense -ServerInstance <server instance> -LicenseFile "<path to the license>"
```
En mi caso, lo hice así:
```
Import-NAVServerLicense -ServerInstance BC170 -LicenseFile "C:\Users\chris\Evoxys.flf"
```
*Evoxys es la empresa donde trabajo ;)*  
![](/img/posts/2021/04/21/License2.png) 

De esta forma, luego de reiniciar el servicio de Microsoft Dynamics 365 Business Central, veremos la nueva licencia:
```
Export-NAVServerLicenseInformation BC170
```
![](/img/posts/2021/04/21/License3.png)

Listo, ya tenemos nuestra licencia procesada y funcionando como debe ser.