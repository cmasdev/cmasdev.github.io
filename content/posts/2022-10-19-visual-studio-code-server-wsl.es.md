---
layout: post
title: "Visual Studio Code Server WSL"
author: Christian Amado
date: 2022-10-19 22:35:00 -0400
category: [Desarrollo de software]
tags: [WinDev, WSL, Windows 11, Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo corto, pero preciso, mostraré cómo utilizar **Visual Studio Code** como servidor de **WSL** para facilitarnos la vida en ciertas pruebas que tenemos como desarrolladores.

***Windows 11 Insider Preview Build 25227***

<!--more-->

**Visual Studio Code Server** es un servicio que se puede ejecutar en una máquina de desarrollo remota, como la PC de escritorio o una máquina virtual (VM). Permite conectar de forma segura a esa máquina remota desde cualquier lugar a través de un cliente local de **VS Code**, sin la necesidad de **SSH**. También se puede acceder al servidor a través del navegador usando **VS Code** para la Web (también conocido como **vscode.dev**).

La arquitectura del servicio lo expone Microsoft en su web:
![](https://code.visualstudio.com/assets/docs/remote/vscode-server/server-arch-latest.png)

## Configurar acceso
Para que esto funcione se debe enlazar con **GitHub** para que nos cree el **CodeSpace** necesario. 

1. Se accede al entorno de **WSL:Ubuntu** para hacer las gestiones:
![](/img/posts/2022/10/19/1.png)

2. Una vez allí se verifica que el Visual Studio Code corresponda a **Ubuntu**:  
![](/img/posts/2022/10/19/2.png)

3. Accedemos al menú contextual de "Turn on Remote Tunnel Access...":
![](/img/posts/2022/10/19/3.png)

4. Seguimos las instrucciones en pantalla para Iniciar sesión en **GitHub**.

5. Habilitar el Tunnel Remoto:
![](/img/posts/2022/10/19/4.png)

6. Copiar el enlace que se muestra en la ventana emergente:
![](/img/posts/2022/10/19/5.png)

7. Acceder al navegador de prefrencia y veremos nuestro Visual Studio remoto (que mantiene el enlace con nuestro Visual Studio WSL local):
![](/img/posts/2022/10/19/6.png)

¡Espero resulte útil!
