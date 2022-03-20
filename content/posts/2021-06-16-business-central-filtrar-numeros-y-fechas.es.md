---
layout: post
title: "BC Tip: Filtrar números y fechas"
author: "Christian Amado"
date: 2021-06-16 08:22:00 -04:00
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo quiero mostrar cómo se filtran números y fechas dentro de un campo en particular. De esa manera, el mismo usuario puede buscar información necesaria sin necesidad de buscar un desarrollador (programador).

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

Para este artículo utilizaremos la página *Movimiento de clientes*.

## Filtrar números
Primeramente, intentaremos filtrar todos los clientes que tengan importes pendientes entre $5.000 (como es méxico hablamos de pesos mexicanos) y $10.000 únicamente. Para ello utilziaremos el siguiente filtro:
```
Importe pendiente: >=5000&<=10000
```
Entonces, obtendremos el resultado siguiente:  
![](/img/posts/2021/06/16/NumbreFilter1.png)  

## Filtrar fechas
De la misma manera podemos realizar los filtros para fecha:
```
Fecha registro: >=01/01/2021&<=31/12/2021
```
De esta manera se aplicará el filtro por fecha.

Ambos filtros pueden mezclarse y poder sacar la información necesaria. Muchas veces el usuario también debe ser crativo a la hora de obtener la información, pues el sistema tiene todo lo necesario.

¡Espero resulte útil!