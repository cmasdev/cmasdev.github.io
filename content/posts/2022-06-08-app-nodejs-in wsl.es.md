---
layout: post
title: "Desarrollo de aplicaciones NodeJs en WSL"
author: Christian Amado
date: 2022-06-08 18:07:00 -0400
category: [Desarrollo de software]
tags: [WinDev, WSL, Windows 11, Windows Insider Preview, NodeJs]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré como instalar **Node.js** en **WSL**. También, veremos como escribir código, compilar y ejecutarlo en **WSL** desde **Visual Studio Code**.

***Windows 11 Insider Preview Build 25131***

<!--more-->

En Windows 11, especificamente gracias a **WSL - Windows Subssytem for Linux** podemos instalar y ejecutar aplicaciones desarrolladas con **Node.js** de manera bastante sencilla y rápida.

## Instalar Node.js en WSL
Preparamos WSL para la instalación de Node.js
1. Verificamos las versiones de Node.js y NVM que tenemos instaladas (se supone que no las tenemos):
![](/img/posts/2022/06/08/1.png)  
2. Procedemos a instalar NVM (Node Version Manager):
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
3. Ahora, instalamos la última versión de Node.js:
```
nvm install node
```
4. Verificamos las versiones y listo:
![](/img/posts/2022/06/08/2.png)  

## Aplicacion en Visual Studio Code
Dentro del Visual Studio Code creamos la aplicación y procedemos a ejecutarla normalmente.

1. Creamos un archivo **app.js**  
2. Escribimos las siguientes líneas de código:
```
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hola desde cmas.dev!');
}).listen(8080);
```
3. Presionamos la tecla *F5* y seleccionamos la opción **Node.js**:
![](/img/posts/2022/06/08/4.png)  
4. Veremos los controles de depuración y en la consola veremos que ha creado la aplicación:
![](/img/posts/2022/06/08/5.png)  
5. En el navegador de preferencia, colocamos la URL definida en el código y vermeos nuestro pequeña applicación:
![](/img/posts/2022/06/08/6.png)  

## Aplicacion en Visual Studio Code con WSL
Dentro del Visual Studio Code creamos la aplicación y procedemos a ejecutarla en WSL.

1. Descargar la extensión para desarrollo remoto [aquí](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)  
2. Abrimos una nueva ventana de Visual Studio Code y hacemos clicn en el icono de acceso remoto:
![](/img/posts/2022/06/08/7.png)  
3. Seleccionamos la opción de distro para WSL:
![](/img/posts/2022/06/08/8.png)  
4. Marcamos la opción Ubuntu:
![](/img/posts/2022/06/08/9.png)  
5. Abrimos la carpeta donde almacenaremos el proyecto (en Ubuntu):
![](/img/posts/2022/06/08/10.png)      
6. Escribimos las siguientes líneas de código (con algunas diferencias del código anterior):
```
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('¡Hola desde cmas.dev y WSL!');
}).listen(8081);
```
7. Ejecutamos la aplicación desde la Terminal de **Ubuntu**:
![](/img/posts/2022/06/08/12.png)  
8. Abrimos el navegador y colocamos la dirección que especificamos en el código:
![](/img/posts/2022/06/08/13.png)  

De esta manera hemos realizado una aplicación NodeJs en **Windows** directamente así como en **WSL**. Ambas opciones son válidas, nada más depende de la elección del desarrollador.

¡Espero resulte útil!
