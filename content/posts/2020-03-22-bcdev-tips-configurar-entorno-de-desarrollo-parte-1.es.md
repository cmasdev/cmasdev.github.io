---
layout: post
title: "BCDEV Tips: Configurar entorno de desarrollo - Parte 1"
author: "Christian Amado"
date: 2020-03-22 10:39:53 -04:00
categories: [Aplicaciones de negocio]
tags: [AL,Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En esta serie de entradas quisiera detallar el proceso de configuración del entorno de desarrollo Visual Studio Code para Dynamics 365 Business Central. Las tres partes de esta serie contemplan:  

1. Parte 1 - Configuración de Azure DevOps e instalación de Git: Como estos proyectos involucran a muchas personas es ideal tener un repositorio de archivos con control de código fuente para fácil manejo y adminsitración de los mismos.
2. Parte 2 - Instalación de Visual Studio Code y extensiones básicas para AL: Esta entrada se refiere más a recomendaciones que doy para la instalación y para las extensiones más básicas para el trabajo en equipo.
3. Parte 3 - Configuración de Azure Repos y publicación de una extensión: Aquí explicaré cómo terminar de configurar el entorno y dejarlo listo para la primera publicación de nuestra extensión de prueba.

<!--more-->

Empecemos con las configuraciones generales.  

Primero, debemos crear una cuenta de Azure DevOps (es gratuita) y creamos una organización (CmasBlog):  
![](/img/posts/migrated/2020/03/1-5.png)  

![](/img/posts/migrated/2020/03/2-5.png)  

Una vez cumplidos los pasos anteriores, debemos crear un proyecto que llamaremos Blog\_Test:  
![](/img/posts/migrated/2020/03/3-4.png)  

![](/img/posts/migrated/2020/03/4-4.png)  
Hay que tener en cuenta que en la opción **Version control** debe estar en **Git**.  

Nos dirigimos a la sección **Repos** > **Files** e inicializamos con el archivo **README**:  
![](/img/posts/migrated/2020/03/5-3.png)   

![](/img/posts/migrated/2020/03/6-3.png)  

De esa manera, hemos terminado de configurar el Azure DevOps Services para que sea nuestro repositorio de datos.  

En vista de que Visual Studio Code no administra ni gestiona herramientas debemos instalar Visual Studio 2019, por lo menos en su versión **Community** (lo puedes descargar [aquí](https://visualstudio.microsoft.com/es/thank-you-downloading-visual-studio/?sku=Community&rel=16)) para poder utilizar la herramienta **TF.exe**, este archivo es el ejecutable que manipula los controles de versión en Visual Studio y será utilizado por Visual Studio Code para hacer la misma tarea. Por favor, instala lo mínimo de Visual Studio (por ejemplo, .NET Desktop y listo).  

Una vez realizada la instalación de Visual Studio, nos dirigimos a la ubicación "**C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\TeamFoundation\\Team Explorer**" y realiza dos tareas:  

1. Renombra la carpeta **es** a **\_es**.
2. Copia la dirección completa porque la utilizaremos en la Parte 3 de este artículo.

Se deben instalar dos herramientas de Git y terminaremos esta parte.  

Descargamos Git desde [aquí](https://git-scm.com/download/win), luego ejecutamos el instalador y seguimos las indicaciones en pantalla.  

Una vez terminado el proceso nos dirigimos al **cmd.exe** de Windows (buscar Símbolo de sistema en Windows), escribimos **git** y presionamos **Enter**:  
![](/img/posts/migrated/2020/03/7-2.png)  

Por último debemos instalar una extensión de Git para el manejo de credenciales que se llama "**Microsoft Git Credential Manager for Windows**" y lo puedes descargar desde [aquí](https://github.com/Microsoft/Git-Credential-Manager-for-Windows/releases/latest).  

Luego de ejecutarlo e instalarlo el sistema estará listo para utilizar Git sin inconvenientes.  

¡No te piedas la Parte 2 de este artículo!
