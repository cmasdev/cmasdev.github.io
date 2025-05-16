---
layout: post
title: "BC Tips: Gestionar redondeos"
author: Christian Amado
date: 2021-11-23 21:41:08 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo se gestionan los redondeos en Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

*Ojo: * Una vez configurado el tema de los redondeos no se puede cambiar al tener registrado un movimiento contable, logicámente porque ya se realizaron transacciones en el sistema.  

La advertencia inicial obedece a que en Paraguay, por ejemplo, no manejamos decimales entonces no tendría sentido hacerlo en el sistema. En ese caso, quitamos todos los valores.

Los redondeos se configuran así:  
![](/img/posts/2021/11/23/Redondeo1.png)  

Una vez en Configuración de contabilidad, cambiamos los valores necesarios:  
![](/img/posts/2021/11/23/Redondeo2.png)  

En este ejemplo, intento poner todos los decimales en cero y redondear al valor más cercano:  
![](/img/posts/2021/11/23/Redondeo3.png)  

Queda a criterio de la empresa y la contabilidad cómo dejará configurado el redondeo.  

¡Espero resulte útil!