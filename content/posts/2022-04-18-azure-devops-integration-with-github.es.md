---
layout: post
title: "Integración de Azure DevOps con GitHub"
author: Christian Amado
date: 2022-04-18 23:24:00 -0400
category: [Desarrollo de software]
tags: [DevOps, Azure, WinDev, GitHub]
thumbnail-img: /img/posts/thumbnails/github.png
cover-img: /img/posts/cover/github.svg
share_img: /img/posts/shared/github.png
---

En este artículo mostraré cómo integrar un repositorio GitHub, que lo hemos visto en [este artículo](/posts/2022-04-04-create-repository-github), con Azure DevOps que lo hemos visto [aquí](/posts/2022-04-11-create-project-azure-devops/).

***Windows 11 Insider Preview Build 22598***

<!--more-->

Primeramente, debemos ingresar a la configuración del proyecto:
![](/img/posts/2022/04/18/1.png)  

Nos dirigmos a la sección **Boards** > **GitHub connections** y hacemos clic en el botón correspondiente:
![](/img/posts/2022/04/18/2.png)  

Como toda aplicación tercerizada, debemos autorizar su uso:
![](/img/posts/2022/04/18/3.png)  

Agregamos los repositorios necesarios:
![](/img/posts/2022/04/18/4.png)  

Autorizamos a Azure Boards para el acceso a GitHub:
![](/img/posts/2022/04/18/5.png)  

Verificamos que la conexión esté activa y funcional:
![](/img/posts/2022/04/18/6.png)  

Tenemos lista la integración entre Azure DevOps y GitHub para proceder con la automatización de procesos. En artículos posteriores iremos avanzando con el CI/CD para sacarle el jugo a esta configuración.

¡Espero resulte útil!
