---
layout: post
title: "NAVDEV Tips: Guardar archivo de código sin compilar"
author: "Christian Amado"
date: 2019-08-27 13:41:31 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

A muchos amigos desarrolladores de C/SIDE les habrá pasado que crearon variables globales, locales, modificar acciones y funciones, luego, al Guardar el archivo de código y seleccionar la opción compilar... BOOOM

El Dynamics NAV Development Environment se cierra con el famoso mensaje "se ha cerrado inesperadamente". Luego de tanto esfuerzo escribiendo código se pierden los cambios.

<!--more-->

**Recomendación**: Cuando hagas cambios al código guarda los archivos de código pero no selecciones la opción "Compilar", de ese modo se guardará el código escrito sin cerrarse inesperadamente.

Acto seguido, se debe cerrar y volver a abrir el archivo en cuestión y seleccionar la opción "Compilar". En caso, que se cierre el entorno de desarrollo no se perderá el código escrito.

¡Espero resulte de utilidad!
