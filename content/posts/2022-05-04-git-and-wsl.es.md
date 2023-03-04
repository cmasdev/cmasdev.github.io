---
layout: post
title: "Git y WSL"
author: Christian Amado
date: 2022-05-04 13:48:00 -0400
category: [Desarrollo de software]
tags: [WSL, WinDev, GitHub, Git, Ubuntu]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo instalar o actualizar git dentro de **Windows Subsystem for Linux** de modo a poder clonar repositorio desde y hacia **GitHub**. En un [artículo anterior](/posts/2022-04-26-configuring-my-wsl-environment/) hemos visto cómo habilitar la plataforma **Windows Subsystem for Linux**.

***Windows 11 Insider Preview Build 22610***

<!--more-->

Debemos seguir algunos pasos para poder isntalar/actualizar *Git* dentro de **WSL** en *Windows 11*.

## Instalar Git en WSL
Realmente, resulta muy complicado que **WSL** no traiga instalado **Git** (lo considera una herramienta indispensable para los desarrolladores), pero si es el caso debemos seguir estos pasos:
1. Iniciar la aplicación **Windows Subsystem for Linux (Ubuntu)**.
2. Verificamos la versión de Git instalada:
```
git --version
```
3. Asumimos que no tenemos instalado **Git** (aunque es difícil), entonces procedemos a instalarlo con el comenado **apt-get**:
```
sudo apt install git
```
3. Veremos la versión actual instalada(Ojo: no es lo mismo Git en Windows que Git en WSL, pueden ser versiones distintas):
![](/img/posts/2022/05/04/1.png)  

## Actualizar Git en WSL
Debemos seguir algunos pasos sencillos para lograrlos. Estos serían:

1. Verificamos la versión de Git instalada:
```
git --version
```
2. Actualizamos Git utilizando el mismo comando de instalación:
```
sudo apt install git
```
3. Luego de actualizar tendremos la última versión disponible

¡Espero resulte útil!
