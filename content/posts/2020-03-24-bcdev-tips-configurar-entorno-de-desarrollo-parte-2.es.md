---
layout: post
title: "BCDEV Tips: Configurar entorno de desarrollo - Parte 2"
author: "Christian Amado"
date: 2020-03-24 12:41:47 -04:00
categories: [Aplicaciones de negocio]
tags: [AL,Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En la [entrada anterior](/2020/03/bcdev-tips-configurar-entorno-de-desarrollo-parte-1/), vimos cómo crear un repositorio con Azure DevOps Services y cómo instalar Git en nuestro Windows.  

Ahora procederemos a instalar Visual Studio Code en nuestro Windows.  

<!--more-->

[Aquí](/2018/12/business-central-entorno-de-desarrollo-con-visual-studio-code/) tenemos como instalar. Debemos descargarlo desde aquí, ejecutarlo y seguir las instrucciones en pantalla para su instalación. Una vez instalado lo abrimos:  
![](/img/posts/migrated/2020/03/1-6.png)  

Nos dirigimos a las extensiones y empezamos a agregarlas:  
![](/img/posts/migrated/2020/03/2-6.png)  

![](/img/posts/migrated/2020/03/3-5.png)  

En mi caso tengo agregadas sólo estas para el desarrollo de mis extensiones dentro Dynamics 365 Business Central.

## ¿Cómo crear un nuevo proyecto de tipo AL?
Presionamos las teclas **Ctrl + Shift + P** y colocamos la frase "**AL: Go!**"  
![](/img/posts/migrated/2020/03/4-5.png)  

Completamos el campo con la ubicación del proyecto:  
![](/img/posts/migrated/2020/03/5-4.png)  

Seleccionamos la versión de Business Central que utilizaremos:  
![](/img/posts/migrated/2020/03/6-4.png)  

(En Paraguay, no tenemos disponible aún la versión Cloud) elegimos el servidor propio:  
![](/img/posts/migrated/2020/03/7-3.png)  

El proyecto creado se ve de la siguiente manera:  
![](/img/posts/migrated/2020/03/8-2.png)  

Descargamos la aplicación base con este coando:  
![](/img/posts/migrated/2020/03/9-2.png)  

![](/img/posts/migrated/2020/03/10-2.png)  

En cuanto a la extensión **AL Object Designer** se utiliza para ver todos objetos que existen dentro de la aplicación base de **Dynamics 365 Business Central**:  
![](/img/posts/migrated/2020/03/11-1.png)  

![](/img/posts/migrated/2020/03/12-1.png)  

Esto nos permite visualizar de manera porecisa los objetos ya existentes dentro de Dynamics 365 Business Central Wave 2.  

¡No te piedas la última parte de este artículo!
