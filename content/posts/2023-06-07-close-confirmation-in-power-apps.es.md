---
layout: post
title: "Confirmación de cierre en Power Apps"
author: "Christian Amado"
date: 2023-06-07 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En este artículo veremos cómo Confirmar una ventana en **Microsoft Power Apps** antes de cerrarla.

Como el título indica veremos cómo confirmar el cierre de uina ventana en **Power Apps** para permitir que el usuario decida qué acciones tomar y nuestra lógica permita realizar ciertas gestiones según sea necesario.

Esta función sólo sirve para aplicaciones orientadas a modelos.

<!--more-->

Luego, tendremos la opción de *Cancelar*, que evitará el cierre de la ventana:
```
If( Not Confirm("¿Seguro que deseas cerrar la aplicación?"), Remove( ThisItem ) )
```

Esto remueve el cuadro de confirmación y no realiza ninguna acción

Por otro lado, tendrá la opción de *Aceptar*, que procede con el cierre total de la aplicación:
```
If(Confirm("¿Seguro que deseas cerrar la aplicación?"), Exit(true) ,Remove( ThisItem ) )
```
Si acepta la confirmación, sale y cierra la sesión de la aplicación

De esta manera, confirmamos la acción a realizar sin demasiados pasos en **Microsoft Power Apps**

¡Espero resulte de utilidad!
