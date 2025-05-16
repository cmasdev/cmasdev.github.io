---
layout: post
title: "NAVDEV Tips: Elimina las variables globales o locales no utilizadas"
author: "Christian Amado"
date: 2019-08-28 12:10:56 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

En esta oportunidad, quiero exponerles un punto de vista que al final de cuentas resultará en un buen consejo de desarrollo.

<!--more-->

En Dynamics NAV declaramos variables globales y locales según el ámbito de ejecución:

1. **Variables Globales**: Se utilizan en todo el ámbito del objeto (Tablas, Páginas, etc.).
2. **Variables Locales**: Se utilizan en el ámbito local, dentro de una función únicamente.

Pero debemos tener cuidado de declarar miles de variables, sobre todo de tipo "**Record**", pues este involucra a la tabla completa y su contenido por cada declaración. Es por eso, que sólo deben declararse varaibales que se utilizarán dentro de la ejecución de la applicación.

¡Espero que este consejo les resulte útil!
