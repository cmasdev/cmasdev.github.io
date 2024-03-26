---
layout: post
title: "Opciones de filtros en Power Apps"
author: "Christian Amado"
date: 2023-06-14 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En este artículo veremos cómo implementar algunas opciones de filtros en **Microsoft Power Apps** con el objetivo de econtrar rápidamente ciertos valores según la necesidad que surga en el momento.

<!--more-->

Cuando hablamos de filtros encontramos varias opciones y conceptos sobre el mismo, pero aquí me enfocaré en tres funciones que son las más utilizadas (y las he utilizado en estos días) para facilitar las tareas de búsqueda.

# Filter
Esta función busca registros en una tabla que satisfacen una fórmula. Se utiliza esta función para buscar un conjunto de registros que coincidan con uno o varios criterios y descartar los que no lo hagan.

```
Filter(Accounts, 'Relationship Type' = ComboBox1.Selected.'Relationship Type')
```
En este caso se filtrarán las *Cuentas* pro el campo Tipo de relación que se seleccione en el filtro.

# Search
Esta función busca registros en una tabla que contienen una cadena en una de sus columnas. La cadena puede aparecer en cualquier lugar dentro de la columna en cuestión.
```
Search(Accounts, SearchInput.Text, "Account Name")
```
En este caso buscará los valores dentro de la columna "Account Name" para verificar que se cumple con una parte del criterio.

# LookUp
Esta función busca el primer registro de una tabla que satisface una fórmula. Se utiliza esta función para buscar un único registro que coincida con uno o varios criterios.
```
LookUp(Accounts, 'Relationship Type' = "Customer", "Account Number")
```
En este caso retorna el primer elemento (Número de cuenta) que cumple con la condición

De esta manera, hemos visto algunas opciones de filtros de registros en **Microsoft Power Apps**

¡Espero resulte de utilidad!



