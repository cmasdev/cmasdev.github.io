---
layout: post
title: "NAVDEV Tips: Modificar valores en Factura de Ventas"
author: "Christian Amado"
date: 2019-06-25 21:06:19 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Microsoft Dynamics NAV es un sistema muy consistente y seguro cuando hablamos de transacciones. En ocasiones, podemos equivocarnos, como operadores, y olvidarnos de cargar ciertos datos o bien equivocarnos en cosas mínimas como olvidar colocar el vendedor, algún dato secundario que precisamos para tener toda la información relacionada con una factura.

En esta entrada, menciono exclusivamente el ejemplo de Factura de Ventas, pero esto sería útil para cualquier tabla relacionada con Históricos de documentos (facturas, movimientos, etc).

<!--more-->

Cuando trabajamos con históricos no se pueden guardar cambios en dicha tabla, no importa que coloquemos todos los permisos dentro del objeto, de todos modos no se podrán modificar los datos históricos. Entonces, ¿Qué tiene de especial el título?

Que las modificaciones se pueden realizar únicamente en los CodeUnits correspondientes al objeto que deseamos modificar, en este caso, el CodeUnit Sales-Post (80).

Primeramente, observemos los permisos del CodeUnit:  
![](/img/posts/migrated/2020/03/1.png)  

Creamos una función, externa, que modifique la tabla en cuestión (en este caso SalesInvoiceHeader):  
![](/img/posts/migrated/2020/03/2.png)  

![](/img/posts/migrated/2020/03/3.png)  

![](/img/posts/migrated/2020/03/4.png)  

Agregamos el contenido de la función (en este caso modificación):
```
[External] CmasDevSalesHeader(SIH : Record "Sales Invoice Header")
SIH.LOCKTABLE;
SIH.MODIFY;
COMMIT;
```
Espero resulte útil esta funcionalidad de Microsoft Dynamics NAV.
