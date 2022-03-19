---
layout: post
title: "Business Central: Wave 2 Txt2AL no existe"
author: Christian Amado
date: 2020-04-08 17:06:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, C/SIDE, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En la [entrada anterior](/2020/04/business-central-convertir-c-side-a-codigo-al/) hemos visto cómo convertir código **C/SIDE** y código **AL**. Ahora veremos cómo disponibilizar esta herramienta en **Dynamics 365 Business Central Wave 2**, pues ya no está disponible directamente como antes.

<!--more-->

Primeramente necesitamos tener a mano la carpeta desde donde se instala el software Dynamics 365 Business Central y copiar archivos de un lugar a otro: ![](/img/posts/migrated/2020/04/bc_fix_txt2al_1.png)

Procedemos a **Pegar** los archivos en la ubicación donde tenemos instalado Dynamics 365 Business Central: ![](/img/posts/migrated/2020/04/bc_fix_txt2al_2.png)

No olvidemos de marcar la opción "Omitir estos archivos", caso contrario, dañaremos nuestra instalación (la idea es agregar los archivos que faltan únicamente): ![](/img/posts/migrated/2020/04/bc_fix_txt2al_3.png)

De esta manera, tenemos el problema resuelto.

¡Espero resulte útil!
