---
layout: post
title: "Windows Terminal en Windows 11"
author: Christian Amado
date: 2022-10-26 13:01:14 -0400
category: [Windows]
tags: [WinDev, Windows 11]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo explicaré detalles sobre **Windows Terminal** (que forma parte del sistema operativo **Windows 11**).

***Windows 11 Insider Preview Build 25227***

<!--more-->

**Windows Terminal** es una nueva aplicación de terminal moderna, rápida, eficiente y productiva para usuarios de herramientas y shells de línea de comandos como el **símbolo del sistema**, **PowerShell** y **WSL**. Tiene múltiples pestañas, soporte para caracteres *Unicode* y *UTF-8*, un motor de renderizado de texto acelerado por *GPU* y temas personalizados.

## Beneficios
**Windows Terminal** tiene muchos beneficios para los usuarios de **línea de comandos** y **WSL**. Algunos de ellos son:

* Modo de pantalla completa.
* Interfaz con pestañas para abrir múltiples instancias de las herramientas.
* Teclas de acceso rápido para abrir nuevas pestañas.
* Zoom con el ratón.
* Soporte para caracteres *Unicode* y *UTF-8*, como emoji y caracteres de diferentes idiomas.
* Motor de renderizado de texto acelerado por *GPU*.
* Temas y estilos personalizados.
* Soporte para stylus.
* Acceso a sistemas remotos o ejecución de scripts en ellos.

**Windows Terminal** también tiene algunas desventajas que debes tener en cuenta antes de instalarlo. Algunas de ellas son:

* Limitaciones en la reproducción de vídeo HD a través del terminal.
* Falta de soporte para dispositivos USB como cámaras y almacenamiento externo.
* No es ideal para requerimientos gráficos pesados.

## ¿Cómo instalarlo?
A partir de windows 11 22H2 no es necesario instalarlo, pues ya forma parte del sistema operativo. Aquí es donde se puede ver eso:
![](/img/posts/2022/10/26/1.png)

Pero, para versiones anteriores a la mencionada debemos seguir los siguientes pasos:
* Abrir **Microsoft Store* y buscar **Windows Terminal**.
* Seleccionar **Obtener** o **Instalar** para descargar e instalar la aplicación.
* Una vez instalada, se puede abrir **Windows Terminal** desde el menú Inicio o la barra de tareas.
* También se puede configurar la terminal predeterminada en **Configuración** > **Privacidad y seguridad** > **Para desarrolladores** > **Terminal**.

## Funciones

### Perfiles
Los perfiles en **Windows Terminal** son configuraciones que determinan la apariencia y el comportamiento de cada shell o aplicación que se ejecuta en el terminal. Se pueden personalizar los perfiles para cambiar el color, la fuente, el icono y otras opciones de cada shell. También se pueden ocultar o deshabilitar los perfiles que se no quieran ver en el menú desplegable del terminal. Además, puedes agregar perfiles de terceros como **Git Bash** o **Azure Cloud Shell** (como tengo instalados los compnentede de desarrollo Azure de Visual Studio viene activado de manera predeterminada). 

En mi máquina se ve así:
![](/img/posts/2022/10/26/2.png)

### Pestañas y paneles
Las pestañas y los paneles son formas de organizar las diferentes shells o aplicaciones que se ejecutan en el terminal. Se pueden abrir varias pestañas con diferentes perfiles y cambiar entre ellas con **Ctrl** + **Tab** o haciendo clic en el nombre de la pestaña. También se puede dividir una pestaña en varios paneles para ver varias shells al mismo tiempo. Se pueden crear, mover, cambiar el tamaño y cerrar los paneles con el teclado o el ratón.

Aquí vemos detalles de lo que explicamos más arriba:
1. Apertura de pestañas del mismo perfil o de otro perfil necesario (Todo desde el mimso terminal):
{{< raw >}}    
<video width=100% controls autoplay>
<source src="/img/posts/2022/10/26/3.mp4" type="video/mp4">
Your browser does not support the video tag.  
</video> 
{{< /raw >}}
![]()

2. Apertura de paneles (en la misma pestaña) utilizando las teclas **Alt**+ hacer clic en el icono "+":
{{< raw >}}    
<video width=100% controls autoplay>
    <source src="/img/posts/2022/10/26/4.mp4" type="video/mp4">
    Your browser does not support the video tag.  
</video>  
{{< /raw >}}

### Paleta de comandos
La paleta de comandos permite visualizar y ejecutar las acciones que se puede hacer dentro de **Windows Terminal**. Se puede invocar la paleta de comandos con **Ctrl** + **Shift** + **P** o personalizar el atajo de teclado. También  se puede usar el modo de línea de comandos para escribir un comando ***wt*** directamente en la paleta. Además, se pueden agregar iconos, comandos anidados, comandos iterables y ocultar los comandos que no se quiera ver.

Una vez presionadas las teclas mencionadas arriba veremos lo siguiente:
![](/img/posts/2022/10/26/5.png)

### Personalización
**Windows Terminal** permite personalizar muchos aspectos de su apariencia y funcionamiento. Se puede acceder a la configuración de **Windows Terminal** desde el menú desplegable o con **Ctrl** + **,**. Algunas de las opciones de personalización que se pueden encontrar son:
* **Idioma**: se puede cambiar el idioma preferido de la aplicación.
* **Tema**: se puede elegir entre un tema claro, oscuro o basado en el sistema.
* **Posición de las pestañas**: se puede decidir si las nuevas pestañas se abren al principio o al final.
* **Barra de título**: se puede ocultar la barra de título para ahorrar espacio.
* **Acrílico**: se puede activar o desactivar el efecto acrílico en la fila de pestañas.
* **Título de la aplicación**: se puede usar el título del terminal activo como título de la aplicación.
* **Siempre visible**: se puede hacer que Windows Terminal permanezca siempre encima de otras ventanas.
* **Modo de ancho de las pestañas**: se puede ajustar el ancho de las pestañas según tu preferencia.

![](/img/posts/2022/10/26/6.png)

¡Espero resulte útil!
