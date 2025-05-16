---
layout: post
title: "Mi primera aplicación con Windows App SDK"
author: Christian Amado
date: 2022-09-07 19:14:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, React]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/win11.jpg
---

En este artículo mostraré cómo crear una aplicación con **Windows App SDK** en **React**. _Ojo_: Es mi primera prueba con React (nunca lo he usado).

***Windows 11 Insider Preview Build 25188***

<!--more-->

Existen algunas opciones válidas para crear aplicaciones para Windows 11, entre ellas, las siguientes:
* WinUI (más adelante entraremos en detalle en esto).
* .NET MAUI (que me agrada bastante)
* PWA (Progressive WEb Applications)
* React para Windows (que usaremos en este artículo)

Como es la primera vez que trabaremos con React, debemos preparar el entorno. 

## Instalación de React Native for Windows
1. Creamos la carpeta en el directorio de preferencia.
2. Accedemos a él desde Power Shell:
```
cd C:\Users\chris\source\repos\LocalOnly\ReactNativeWin
npx react-native init TestApp --template react-native@^0.70.0
```
3. La instalación quedará algo así:
![](/img/posts/2022/09/07/1.png)  
4. Ir a la carpeta creada:
```
cd TestApp
```
5. Instalar la extensión de Windows:
```
npx react-native-windows-init --overwrite
```
6. Creamos el enlace con las dependencias:
```
npx react-native autolink-windows
```
7. Fin de la instalación

## Creación de aplicación
1. Abrir un proyecto existente desde Visual studoo 2022:
![](/img/posts/2022/09/07/2.png)  
2. En Power Shell, escribir lo siguiente (para arrancar el servidorcillo):
```
npm start
```
3. Ejecutamos la aplicación desde Visual Studio 2022 (la compilación demora un poco dependiendo de la capacidad del equipo de desarrollo):
![](/img/posts/2022/09/07/3.png)  

Y con esto tenemos nuestra primera aplciación **Windows App SDK** con **React**.

¡Espero resulte útil!
