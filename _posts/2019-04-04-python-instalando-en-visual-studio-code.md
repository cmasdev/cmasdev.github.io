---
layout: post
title: "Python: Instalando en Visual Studio Code"
author: "Christian Amado"
date: 2019-04-04 20:19:30 -04:00
categories: [Desarrollo de software]
tags: [Python,Visual Studio Code]
thumbnail-img: /assets/img/posts/thumbnails/python.png
cover-img: /assets/img/posts/cover/python.svg
---

En esta entrada veremos cómo instalar Python para utilizarlo con nuestro IDE favorito, el Visual Studio Code. En una [entrada anterior](/2019/04/python-instalacion/), hemos visto cómo instalar Python en uestro Windows.

<!--more-->

# Instalación de Python
Para la instalación de Python debemos realizar las siguientes tareas:
1. Luego de abrir Visual Studio Code, debemos hacer clic en "Open Folder":  
![](/assets/img/posts/migrated/2019/04/1-1.png)  

3. Seleccionamos la carpeta donde generaremos los archivos necesarios (VS en este caso):  
![](/assets/img/posts/migrated/2019/04/2-1.png)  

5. Nos dirigimos al área de **Extensiones** y nos posicionamos en el cuadro de búsqueda:  
![](/assets/img/posts/migrated/2019/04/3-1.png)  

7. Buscamos "python" y hacemos clic en "Instalar":  
![](/assets/img/posts/migrated/2019/04/4-1.png)  

9. Nos mostrará el mensaje de "Instalando":  
![](/assets/img/posts/migrated/2019/04/5-1.png)  

11. Si todo va bien, mostrará que ya está "Instalado":  
![](/assets/img/posts/migrated/2019/04/6-1.png)  

13. En el menú "Ver" buscamos la "Paleta de comando":  
![](/assets/img/posts/migrated/2019/04/7-1.png)  

15. Buscamos la opción "Python: Seleccionar intérprete":  
![](/assets/img/posts/migrated/2019/04/8-1.png)  

17. Hacemos clic en le botón correspondiente:  
![](/assets/img/posts/migrated/2019/04/9.png)  

19. Seleccionamos el intérprete instalado:  
![](/assets/img/posts/migrated/2019/04/10.png)  

21. En la "Paleta de comando" seleccionamos "Python: Seleccionar Linker"  

22. Seleccionamos la opción "pylint":  
![](/assets/img/posts/migrated/2019/04/12.png)  

24. En el explorador de archivos creamos un nuevo archivo:  
![](/assets/img/posts/migrated/2019/04/13.png)  

26. Le llamamos **prueba.py**:  
![](/assets/img/posts/migrated/2019/04/14.png)  

28. Colocamos un código python de prueba:
```
mensaje = 'prueba de mensaje'
print(mensaje)
```
30. Hacemos clic derecho en cualquier lugar del archivo y seleccionamos la siguiente opción:  
![](/assets/img/posts/migrated/2019/04/15.png)  

32. Nos mostrará la ejecución del programa en la terminal del Visual Studio Code:  
![](/assets/img/posts/migrated/2019/04/16.png)  

De esta manera, tenemos instalada la extensión de Python dentro de Visual Studio Code haciendo mucho más sencillo el desarrollo y la depuración del programa que estemos realizando.
