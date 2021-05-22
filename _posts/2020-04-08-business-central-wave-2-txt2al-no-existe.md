---
layout: post
title: "Business Central: Wave 2 Txt2AL no existe"
author: Christian Amado
date: 2020-04-08 17:06:00 -0400
category: [Aplicaciones de negocio]
tag: [AL, C/SIDE, Dynamics 365 Business Central]
subtitle: En este artículo verás cómo solucionar un problema que se presenta con la herramienta Txt2Al...
thumbnail: businesscentral.png
---

En la [entrada anterior](/2020/04/business-central-convertir-c-side-a-codigo-al/) hemos visto cómo convertir código **C/SIDE** y código **AL**. Ahora veremos cómo disponibilizar esta herramienta en **Dynamics 365 Business Central Wave 2**, pues ya no está disponible directamente como antes.

<!--more-->

Primeramente necesitamos tener a mano la carpeta desde donde se instala el software Dynamics 365 Business Central y copiar archivos de un lugar a otro: ![](/assets/img/posts/businesscentral/bc_fix_txt2al_1.png)

Procedemos a **Pegar** los archivos en la ubicación donde tenemos instalado Dynamics 365 Business Central: ![](/assets/img/posts/businesscentral/bc_fix_txt2al_2.png)

No olvidemos de marcar la opción "Omitir estos archivos", caso contrario, dañaremos nuestra instalación (la idea es agregar los archivos que faltan únicamente): ![](/assets/img/posts/businesscentral/bc_fix_txt2al_3.png)

De esta manera, tenemos el problema resuelto.

¡Espero resulte útil!
