---
layout: post
title: "Utilizando Visual Studio Code para modificar objetos Power Apps"
author: "Christian Amado"
date: 2023-09-27 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps, Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En este artículo veremos cómo desarrollar aplicaciones **Microsoft Power Apps** directamente en **Visual Studio Code** para realizar tareas mas complejas de diseño o de código mismo.

<!--more-->

El desarrollo de aplicaciones para **Power Apps** fácilmente puede ser desarrollada desde su propio diseñador y gestor, el **Power Apps Studio**, que es la herramienta base para el desarrollo de sus aplicaciones.

Pero cuando necesitamos introducir ciertas complejidades necesitamos un entorno más potente y versátil. Es ahí donde entra en juego el **Visual Studio Code** que nos permite modificar diseño y código de **Power Apps**.

# Trabajando en Visual Studio Code
1. Instalamos la extensión correspondiente **Power Platform Tools**:
![](https://i.ibb.co/Sfr7y6x/vscode-pa-1.png)

2. Buscamos nuestro **Dataverse URL** que se encuentra dentro de los detalles de nuestro **Entorno**:
![](https://i.ibb.co/2536SLN/vscode-pa-2.png)

3. Dentro de **Visual Studio Code**, abrimos la **Terminal** y nos autenticamos al tenant que utilizaremos:
```
pac auth create -u https://orgXXXXXXXX.crm.dynamics.com/
```
Debes cambiar las X por el nombre de tu propio Tenant.

4. Seguir los pasos en pantalla para el inicio de sesión. Saldrá un mensaje satisfactorio.

5. Listar las aplicaciones disponibles para descarga:
```
pac paportal list
```

6. Descargar la aplicación para poder utilizarla:
```
pac paportal download --path c:\PA\pac -id f46b70cc-XXXX-XXXX-XXXX-41deb48eb90d
```

7. Utilizar **Visual Studio Code** para modificar le código a placer.

8. Para subir los cambios, debemos escribir el siguiente comando:
```
pac paportal upload --path c:\PA\pac
```

De esta manera, hemos visto cómo utilizar **Visual Studio Code** para modificar aplicaciones en **Microsoft Power Apps**.

¡Espero resulte de utilidad!
