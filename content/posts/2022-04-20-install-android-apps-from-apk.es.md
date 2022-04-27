---
layout: post
title: "Windows 11: Instalar aplicaciones Android desde APK"
author: Christian Amado
date: 2022-04-20 13:01:14 -0400
category: [Windows]
tags: [Windows 11, Windows Insider Preview, Android]
thumbnail-img: /img/posts/thumbnails/wsa.png
cover-img: /img/posts/cover/wsa.png
share_img: /img/posts/thumbnails/wsa.png
---

En este artículo mostraré cómo instalar aplicaciones Android en Windows 11 gracias a **Windows Subsystem for Android** utilizando herramientas del propio Android y habilitando ciertas opciones. En un [artículo anterior](/posts/2022-04-13-enable-wsa/) hemos visto cómo habilitar la plataforma desde **Microsoft Store**.

***Windows 11 Insider Preview Build 22598***

<!--more-->

Debemos seguir algunos pasos para poder tener cualquier aplicación Android directamente en Windows 11, recordando que para habilitar esto debemos tener la región indicada como Estados Unidos.

# Preparar Windows Subsystem for Android
Para preparar la plataforma debemos seguir estos pasos:
1. Iniciar la aplicación **Windows Subsystem for Android**
2. Establecer el **Modo desarrollador**:
![](/img/posts/2022/04/20/adb1.png)
3. Hacemos clic en la opción **Gestionar configuración de desarrollador**:
![](/img/posts/2022/04/20/adb2.png)
4. Habilitamos la opción de **Depuración USB**:
![](/img/posts/2022/04/20/adb3.png)

# Preparar herramientas de Android SDK
## Preparar Android SDk Platform Tools
> Las Herramientas de la plataforma del SDK de Android son un componente del SDK de Android. Se incluyen herramientas que interactúan con la plataforma de Android, principalmente, *adb* y *fastboot*. Si bien adb es obligatorio en el desarrollo de apps para Android, por lo general, los desarrolladores de apps solo usarán la copia que instala Studio. Esta descarga es útil si deseas usar adb directamente desde la línea de comandos, y no tienes instalado Studio. (Si tienes instalado Studio, recomendamos que uses la copia que se instaló, ya que Studio lo actualizará automáticamente). Se necesita fastboot si deseas desbloquear el bootloader de tu dispositivo y actualizarlo con una nueva imagen del sistema. Este paquete solía contener *systrace*, pero quedó obsoleto y se reemplazó por el generador de perfiles de Android Studio, *gpuinspector.dev*, o *Perfetto*.

Para esto debemos descargar la última versión disponible para Windows desde [aquí](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)

## Ubicar los archivos
1. Debemos crear una nueva carpeta en el directorio principal de Windows y copiar la carpeta descomprimida. Quedaría así:
![](/img/posts/2022/04/20/adb4.png)
2. Hacemos clic derecho en el icono de Windows en la barra de tareas o **Win**+**i**:
![](/img/posts/2022/04/20/adb5.png)
3. Seleccionamos **Variables de entorno**:
![](/img/posts/2022/04/20/adb6.png)
4. Seleccionamos la variable **Path** y agregamos un nuevo registro:
![](/img/posts/2022/04/20/adb7.png)
5. Agregamos la ubicación del ejecutable que queremos agregar a la variable:
![](/img/posts/2022/04/20/adb8.png)
6. Abrimos el comando de windows **CMD** o **PowerShell** y probamos el comando **adb**:
```
adb devices
```
![](/img/posts/2022/04/20/adb9.png)

## Conexión al dispositivo
1. Verificamos la IP del dispositivo (en la configuración de **Windows Subsystem for Android**):
![](/img/posts/2022/04/20/adb10.png)
2. Nos conectamos a la IP y al puerto correspondiente:
```
adb connect 172.18.136.138:5555
```
## Instalación en el dispositivo
1. Descargamos un archivo apk, en este caso la última versión de Angry Birds Dream Blast [aquí](https://www.apkmirror.com/apk/rovio-entertainment-corporation/angry-birds-dream-blast/angry-birds-dream-blast-1-40-1-release/angry-birds-dream-blast-1-40-1-android-apk-download/)
2. Instalamos el paquete descargado:
```
adb install "C:\Users\chris\Downloads\andry.apk"
```
3. Veremos el icono anclado al menú inicio:
![](/img/posts/2022/04/20/adb11.png)
4. La aplicación se verá así:
![](/img/posts/2022/04/20/adb12.png)

Para cualquier aplicación que funcione para Android debemos repetir estos 4 pasos anteriores. Aprovecharé *HBO Max* para ver el nuevo Batman...

¡Espero resulte útil!