---
layout: post
title: "Campos ocultos"
author: "Christian Amado"
date: 2019-10-08 21:03:18 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

Este último fin de semana me han preguntado cómo puedo manejar campos ocultos en Microsoft PowerApps. La respuesta corta es No se puede. ¿Por qué no se puede?

Porque no existe un control o campo oculto como tal. En HTML, por ejemplo, tenemos un control de ese tipo que lo podemos utilizar como un campo auxiliar para almacenar algo que necesitamos utilizar. Más información [aquí](https://developer.mozilla.org/es/docs/Web/HTML/Elemento/input/hidden).

<!--more-->

Mientras tanto, en Microsoft PowerApps, se puede crear un campo **label** y aplicarle **false** en la propiedad **Visible**. De esa manera se puede ocultar el control y utilizarlo con el mismo fin que el campo de HTML (con la diferencia que éste no será visible de ninguna manera).
