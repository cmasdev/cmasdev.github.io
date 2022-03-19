---
type: post
title: "Business Central: Error descargando símbolos"
author: Christian Amado
date: 2021-04-01 15:15:35 -0400
category: [Aplicaciones de negocio]
tag: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Procedí a instalar un nuevo CU (Cumulative Update) para Microsoft Dynamics 365 Business Central 2020 Wave 2 y al crear un nuevo proyecto AL lanzó un error de descarga de símbolos. Es un problema muy común pero la solución muchas veces es simple.  

En este caso, debemos cambiar algo en el archivo de configuración y listo.

<!--more-->
*<span style="font-size: 8pt;">Versión: 2020 Wave 2 (KID: 5001735)</span>*  

Creamos el proyecto AL de manera estándar, el Visual Studio Code nos realiza las preguntas de rigor (para armar el archivo launch.json) y luego todo está listo para empezar a trabajar.  

El primer paso consiste en descargar los símbolos (básicamente descar todos los ejecutables nativos del sistema) pero en este caso nos lanza un error.  
![](/img/posts/2021/04/01/SymbolsProblems1.png)  

Verificamos que en la administración de la instancia de Business Central esté marcada la opción de **Servicios de desarrollo**  
![](/img/posts/2021/04/01/SymbolsProblems2.png)  

La corrección se realiza agregando el puerto que corresponde a los servicios de desarrollo (**predeterminado: 7049**) y con eso se soluciona el problema.  
![](/img/posts/2021/04/01/SymbolsProblems3.png) 

De esta manera, pudimos descargar los símbolos y podemos seguir con nuestro trabajo.