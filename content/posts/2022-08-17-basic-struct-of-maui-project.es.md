---
layout: post
title: "Estructura básica de un proyecto MAUI"
author: Christian Amado
date: 2022-08-17 18:07:00 -0400
category: [Desarrollo de software]
tags: [WinDev, MAUI, Android, Windows 11]
thumbnail-img: /img/posts/thumbnails/android.png
cover-img: /img/posts/cover/android.png
share_img: /img/posts/shared/android.jpg
---

En este artículo mostraré cómo es la estructura básica de un proyecto **.NET MAUI** .

***Windows 11 Insider Preview Build 25179***

<!--more-->

Primeramente, debemos conocer la estructura en sí de **.NET MAUI** que se encuentra en el sitio oficial de Microsoft. La documentación oficial se encuentra [aquí](https://learn.microsoft.com/es-es/dotnet/maui/what-is-maui?view=net-maui-7.0)  

Funcionalmente, .NET MAUI opera de la siguiente manera:
![](/img/posts/2022/08/17/1.png)  

## Estructura del proyecto .NET MAUI
El proyecto que se crea en **.NET MAUI** posee la siguiente estructura:
![](/img/posts/2022/08/17/2.png)  

### Dependencias (Dependencies)
Las dependencias son los paquetes (librerías) disponibles para cada plataforma soportada en **.NET MAUI**.  

En este caso serían:
* Android.
* iOS.
* Mac Catalyst.
* Windows 10 (pues tiene en cuenta la versión mínima soportada).

### Plataformas (Platforms)
Esta carpeta indica las configuraciones específicas de cada plataforma. Cada una de ellas posee su propia configuración dependiendo de las necesidades de la aplicación.  

### Recursos (Resources)
Son los recursos compartidos entre las plataformas, de esta manera se pueden reutilizar elementos en todas las plataformas sin repetirlos.)  

Con esta estructura definida, creamos y desarrollamos las aplicaciones en **.NET MAUI**

¡Espero resulte útil!
