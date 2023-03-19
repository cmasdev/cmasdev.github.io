---
layout: post
title: "Django sobre WSL"
author: Christian Amado
date: 2022-12-21 19:39:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, WSL, Python, Django]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este corto artículo veremos cómo desarrollar sobre **WSL (Windows Subsystem for Linux)** con **Python** y **Django**. Ya hemos visto que lo podemos hacer con [Java](/posts/2022-06-29-java-with-wsl-part-2/)

***Windows 11 Insider Preview Build 25267***

<!--more-->

**WSL** nos ofrece demasiadas ventajas a la hora de desarrollar software sobre el sistema operativo Linux, en este caso **Ubuntu**. Hoy en día Python es un lenguaje demasiado difundido y muy utilizado en varios ámbitos, con sus ventajas y desventajas como todas las plataformas existentes. A eso le sumaron un Framework muy potente y completo "**Django**".

Aquí veremos como instalar y ejecutar una aplicación web **Django** utilizando **Visual Studio Code**.

## Instalar Django en **WSL:Ubuntu**
1. Abrimos **Windows Terminal** con el perfil **Ubuntu**:
![](/img/posts/2022/12/21/1.png)

2. Procedemos a instalar **Django** con el siguiente comando:
```
sudo apt install python3-django
```
3. Seguimos las instrucciones en pantalla y listo.

4. Verificamos la instalación con el siguiente comando:
```
django-admin --version
```
![](/img/posts/2022/12/21/2.png)

## Crear proyecto Django y empezar a trabajar
1. Ir a la carpeta donde debe estar nuestro proyecto:
![](/img/posts/2022/12/21/3.png)

2. Crear un ambiente virtual de **Python**:
```
$ python3 -m venv pythonTest
```

3. Activar el ambiente virtual:
```
$ source pythonTest/bin/activate
```

4. Instalar **Django** en el ambiente virtual:
```
(pythonTest) $ pip install django
```

5. Se crea el proyecto en la carpeta actual:
```
(pythonTest) $ django-admin startproject testproject .
```

6. Migramos la base de datos inicial:
```
(pythonTest) $ python manage.py migrate
```

7. Se crea la administracion de la Web:
```
(pythonTest) $ python manage.py createsuperuser
```

8. Completamos los datos y listo:
![](/img/posts/2022/12/21/4.png)

9. Abrimos la carpeta donde alojamos el proyecto y empezamos a desarrollar:
![](/img/posts/2022/12/21/5.png)

10. Activamos el ambiernte virtual de Python y ejecutamos el servidor de Django:
![](/img/posts/2022/12/21/6.png)

11. Veremos la página principal de Django:
![](/img/posts/2022/12/21/7.png)

12. Si accedemos a la URL con el contexto */admin* veremos lo siguiente:
![](/img/posts/2022/12/21/8.png)

![](/img/posts/2022/12/21/9.png)

Listo para desarrollar aplicaciones web con **Django** y **Python** sobre **Visual Studio Code** y **WSL**.

¡Espero resulte útil!
