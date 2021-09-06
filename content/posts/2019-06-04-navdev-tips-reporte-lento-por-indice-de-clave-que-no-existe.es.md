---
layout: post
title: "NAVDEV Tips: Reporte lento por índice de clave que no existe"
author: "Christian Amado"
date: 2019-06-04 23:32:29 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Dependiendo de la cantidad de datos y de la manera en que se ha desarrollado un reporte éste puede ser lento en su carga. Para este caso consideremos culpable al equipo de desarrollo.

Normalmente las tablas de Dynamics NAV tiene sus claves (Keys) generadas y agrupadas según conceptos genéricos. Ej: No, Fecha. Pero en ocasiones necesitamos agrupar los registros por un agrupador que no está presente en neustro origen de datos.

<!--more-->

Es ahí donde recurrimos a un método que no suele fallar con páginas y otros objetos. Generalmente utilizamos la función **OnPreDataItem**:
```
SETCURRENTKEY(DueDate);
SETASCENDING(DueDate, TRUE);
```
En el ejemplo, definimos la fecha de vencimiento (de una factura por ejemplo), suponiendo que ésta no está dentro del grupo de Claves, generará un cálculo extra que incrementará los trabajos para obtener los datos necesarios y eso hará que sea muy lento.

La forma más rápida de corregir esto sería agregando el campo necesario entre las Claves dentro de la tabla, como un nuevo agrupador.

¡Espero resulte útil!