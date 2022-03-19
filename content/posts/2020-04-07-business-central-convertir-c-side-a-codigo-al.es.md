---
layout: post
title: "Business Central: Convertir C/SIDE a código AL"
author: Christian Amado
date: '2020-04-07 12:24:00 -0400'
category: Aplicaciones de negocio 
tags:
        - AL
        - 'C/SIDE'
        - 'Dynamics 365 Business Central'
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La semana pasada me tocó realizar migración de Dynamics NAV 2018 a Dynamics 365 Business Central Wave 2 y me encontré con que debía hacerlo tabla por tabla. Va ser un proceso muy largo, cuanto más objetos tengas más código escribiremos. Es por eso que el propio **Dynamics 365 Business Central** trae una herramienta que hace ese trabajo por nosotros. Se llama **Txt2AL.exe** y es muy útil.

Primeramente, debemos crear dos carpetas:

<!--more-->

1. _NAV_: Una carpeta donde colocaremos las exportaciones de Dynamics NAV. Todos como archivos .txt. En ese caso tengo en "**C:\\NAV**"
2. _Business Central_: Una carpeta donde recibiremos el código AL generado desde la carpeta anterior. En ese caso tengo en "**C:\\BC**"

Ahora debemos ir al **Símbolo del sistema** (**cmd**):
```
cd C:\\Program Files (x86)\\Microsoft Dynamics 365 Business Central\\150\\RoleTailored Client

Txt2al --Source="C:\\NAV" --Target="C:\\BC"
```
De esta manera logramos hacer la migración del código **C/SIDE** a código **AL**: ![](/img/posts/businesscentral/bc_nav_to_bc.png)

¡Espero resulte útil!
