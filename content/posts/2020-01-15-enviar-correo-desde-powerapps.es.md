---
layout: post
title: "Enviar correo desde PowerApps"
author: "Christian Amado"
date: 2020-01-15 22:31:59 -04:00
categories: [Aplicaciones de negocio]
tags: [Power Automate,PowerApps]
thumbnail-img: /img/posts/thumbnails/powerautomate.png
cover-img: /img/posts/cover/powerautomate.svg
---

En esta oportunidad me gustaría mostrar la integración entre dos aplicaciones disponibles en Office 365, en este caso, PowerApps y Power Automate (Flow).  

PowerApps nos permite crear una aplicación en segundos y Power Automate (Flow) nos permite utilizar muchos servicios para integrarlos a nuestra aplicación.  

<!--more-->

En este caso crearemos un flujo que permita enviar correo y lo integraremos al PowerApps para que desde allí podamos enviar un correo.  

## Microsoft PowerApps
Creamos una aplicación en blanco y colocamos los controles básicos de ingreso de datos y un botón "Enviar correo" ([aquí puedes aprender a agregar controles](/2019/05/controles/)):  

![](/img/posts/migrated/2020/01/1-1.png)  

Marcamos el botón "Enviar correo". Dentro de la aplicación, PowerApps, nos dirigimos a la pestaña **Action** y hacemos clic en el botón **Power automate**:  

![](/img/posts/migrated/2020/01/2.png)  

En el nuevo cuadro de diálogo, hacemos clic en el boton **Create a new flow**:  

![](/img/posts/migrated/2020/01/3.png)  

Ahora, nos redirige al sitio de Power Automate:  

![](/img/posts/migrated/2020/01/4.png)  

Debemos seleccionar la plantilla **Click a button in PowerApps to send an email**:  

![](/img/posts/migrated/2020/01/5.png)  

![](/img/posts/migrated/2020/01/6.png)  

Agregamos la cuenta de correo de la cuenta que enviará el correo al hacer clic en el botón:  

![](/img/posts/migrated/2020/01/7.png)  

Hacemos clic en **Continuar**:  

![](/img/posts/migrated/2020/01/8.png)  

Guardamos los cambios en Power Automate y luego seleccionamos nuestra plantilla en PowerApps:  

![](/img/posts/migrated/2020/01/9.png)  

Completamos la barra de fórmula:  

![](/img/posts/migrated/2020/01/10.png)  

Ejecutamos la aplicación y completamos los datos:  

![](/img/posts/migrated/2020/01/11.png)  

Verificamos la bandeja de Entrada (o correo no deseado) del correo colocado en el punto anterior:  

![](/img/posts/migrated/2020/01/12.png)  

Leemos el correo y listo:  

![](/img/posts/migrated/2020/01/13.png)  

De esta manera hemos integrado una funcionalidad demasiado útil a nuestra aplicación creada en menos de 2 minutos.
