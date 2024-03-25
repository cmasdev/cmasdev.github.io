---
layout: post
title: "Disparar flujos de Power Automate desde Power Pages"
author: "Christian Amado"
date: 2023-12-06 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [Power Automate, Power Pages]
thumbnail-img: /img/posts/thumbnails/powerpages.avif
cover-img: /img/posts/cover/powerpages.svg
share_img: /img/posts/shared/power-pages.png
---

En esta oportunidad, quisiera compartir con ustedes conceptos básicos de Microsoft PowerApps. Esta herramienta ya se viene utilizando hace tiempo (sobre todo para aquellas personas que desarrollamos/personalizamos cosas dentro de Microsoft Dynamics 365/CRM), tiene sus facilidades y también sus complejidades.

Lo positivo de esta herramienta es que todo es visual y muy fácil de aprender para personas que no están sumergidas en el mundo de la programación pero quieren realizar tareas necesarias para cumplir con sus labores.

Estaré publicando una serie de 5 artículos para este mes de manera a compreder los conceptos más básicos de esta herramienta incluída en Microsoft Office 365.

<!--more-->

Empezaremos hablando de los formularios, que conceptualmente nos traslada a pensar en que es la unidad mas básica donde se colocarán todos los controles necesarios para el funcionamiento de nuestra aplicación. El concepto no es ese.

La unidad mas básica dentro de Microsoft PowerApps es un **lienzo**, el cual permite colocar todos los controles dentro de sí para la ejecución básica de un programa.

Entonces, ¿qué es un Formulario? Los formularios ofrecen la interfaz de usuario que emplean los usuarios para interactuar con los datos que necesitan para realizar su trabajo. Es decir, es la plantilla básica de representación de datos dentro de un lienzo.

Veamos cómo crear un liezo primero, luego veremos cómo agregar un formulario: Nos dirigimos a nuestro [Portal Office 365](https://portal.office.com) y seleccionamos la aplicación Microsoft PowerApps:  
![](/img/posts/migrated/2019/05/1.png)  

Marcamos la opción "Aplicación de lienzo en blanco", colocamos el nombre y hacemos clic en "Crear":  
![](/img/posts/migrated/2019/05/2.png)  

En la siguiente pantalla (que aparece en inglés) seleccionamos "Create a Form":  
![](/img/posts/migrated/2019/05/3.png)  

![](/img/posts/migrated/2019/05/4.png)  

![](/img/posts/migrated/2019/05/6.png)  

![](/img/posts/migrated/2019/05/5.png)  

Seleccionamos el "Origen de Datos (DataSource)", en este caso Oportunidades que provienen del "Dynamics 365 for Sales":  
![](/img/posts/migrated/2019/05/7.png)  

Nos muestra el formulario predeterminado:  
![](/img/posts/migrated/2019/05/8.png)  

Hacemos clic en ejecutar:  
![](/img/posts/migrated/2019/05/9.png)  

Veremos el formulario listo para ingresar datos:  
![](/img/posts/migrated/2019/05/9_1.png)  

De esta sencilla manera hemos creado un formulario que permite el ingreso de oportunidades dirigidas a Microsoft Dynamics 365 for Sales.