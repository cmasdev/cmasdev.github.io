---
layout: post
title: "Desarrollo con Python sobre WSL"
author: Christian Amado
date: 2022-12-14 21:12:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, WSL, Python]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este corto artículo veremos cómo desarrollar sobre **WSL (Windows Subsystem for Linux)** con **Python**. Ya hemos visto que lo podemos hacer con [Java](/posts/2022-06-29-java-with-wsl-part-2/)

***Windows 11 Insider Preview Build 25267***

<!--more-->

**WSL** nos ofrece demasiadas ventajas a la hora de desarrollar software sobre el sistema operativo Linux, en este caso **Ubuntu**. Hoy en día Python es un lenguaje demasiado difundido y muy utilizado en varios ámbitos, con sus ventajas y desventajas como todas las plataformas existentes.

Aquí veremos como instalar y ejecutar un pequeño código utilizando **Visual Studio Code**.

## Python en WSL
1. Abrimos Visual Studio Code (pero en WSL):
![](/img/posts/2022/12/14/1.png)

2. En extensiones, buscamos "python" y lo instalamos (el fabricante debe ser Microsoft):
![](/img/posts/2022/12/14/2.png)

3. Luego de la instalación, procedemos a crear un nuevo archivo:
![](/img/posts/2022/12/14/3.png)

4. Seleccionamos el archivo de tipo Python, colocamos en el lugar de preferencia (dentro del WSL):
![](/img/posts/2022/12/14/4.png)

5. Crear un archivo nuevo **pythonTest.py** (en mi caso) y escribir el siguiente código.
```
print("Hello, World from VS Code and WSL")
```

6. Casi hacemos *F5* pero notamos que falta algo:
![](/img/posts/2022/12/14/5.png)

7. Seleccionamos el Intérprete recomendado:
![](/img/posts/2022/12/14/6.png)

8. Seleccionamos la configuración del depurador (porque es un archivo suelto):
![](/img/posts/2022/12/14/7.png)

9. Ejecutamos nuestro archivo **.py** y listo:
![](/img/posts/2022/12/14/8.png)

¡Espero resulte útil!
