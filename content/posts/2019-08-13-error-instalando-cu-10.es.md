---
layout: post
title: "Error instalando CU 10"
author: "Christian Amado"
date: 2019-08-13 18:10:11 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Desde ayer intento instalar el CU 10 de Dynamics 365 Business Central y no encuentro la manera. De hecho busqué mucha información y no la encontré.

Para que no les pase como a mí debe corregir un pequeño tema...

<!--more-->

En las configuraciones del servidor y del cliente cambié el tipo de autenticación de **Windows** a **NavUserPassword**. Al instalar el CU 10 no tenía en cuenta esta configuración y se perdía en los detalles.

**Solución**: Modifiqué el tipo de autenticación de **NAVUserPassword** a **Windows**, reinicié y volví a ejecutar el instalador que funcionó de maravillas.

[Aquí se puede descargar el CU 10 desde Microsoft](https://support.microsoft.com/es-es/help/4514619/cumulative-update-10-for-microsoft-dynamics-365-business-central-on-pr).
