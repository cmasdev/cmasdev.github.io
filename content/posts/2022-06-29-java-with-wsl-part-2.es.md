---
layout: post
title: "Java con WSL parte 2"
author: Christian Amado
date: 2022-06-29 20:47:00 -0400
category: [Desarrollo de software]
tags: [WinDev, WSL, Java, Ubuntu]
thumbnail-img: /img/posts/thumbnails/android.png
cover-img: /img/posts/cover/android.png
share_img: /img/posts/shared/android.jpg
---

En este artículo mostraré cómo desarrollar una pequeña aplicación web en **Java** corriendo sobre **WSL (Windows Subsystem for Linux)**. En el [artículo anterior](/posts/2022-06-22-java-with-wsl-part-1/) hemos visto como preparar **Visual Studio Code** para **Java** sobre **WSL (Windows Subsystem for Linux)**.

***Windows 11 Insider Preview Build 25151***

<!--more-->

Vamos a ponernos un poco creativos ahora y veremos cómo crear una aplicación web con Java. PAra ellos debemos utilizar el proyecto [**Apache Maven**](https://maven.apache.org/) y lo utilizaremos desde **Visual Studio Code** sobre la plataforma **WSL**.

## Instalar Apache Maven
1. Descargar el instalador:
```
wget https://dlcdn.apache.org/maven/maven-3/3.9.0/binaries/apache-maven-3.9.0-bin.zip -P /tmp
```
2. Extraer los archivos a **/opt/gradle**:
```
sudo unzip -d /opt/apache-maven /tmp/apache-maven-3.9.0-bin.zip
```
3. Configurar la variable de entorno creando **maven.sh**
```
sudo vi /etc/profile.d/maven.sh
```
4. Agregamos lo siguiente a ese archivo:
```
# /etc/profile.d/maven.sh
export MAVEN_HOME=/opt/apache-maven/apache-maven-3.9.0/
export PATH=${MAVEN_HOME}/bin:${PATH}
```
5. Convertir el archivo en ejecutable:
```
sudo chmod +x /etc/profile.d/maven.sh
```
6. Cargamos la variable de entorno
```
source /etc/profile.d/maven.sh
```
7. Verificamos que todo esté bien:
```
mvn -v
```
![](/img/posts/2022/06/29/1.png)  

## Crear un proyecto Java Spring Boot
No tenemos una plantilla como tal en Visual Studio Code, no es un IDE potente como otros que existen en el mercado para Java.

Entonces procedemos con los siguientes pasos:
1. Clonamos el repositorio de GitHub [https://github.com/spring-guides/gs-spring-boot.git](https://github.com/spring-guides/gs-spring-boot.git)
![](/img/posts/2022/06/29/2.png)  
2. Ejecutamos la applicación y veremos el texto predeterminado:
![](/img/posts/2022/06/29/3.png)  

Con todo esto tenemos una aplicación Web desarrollada en **Java** con el servidor corriendo en **Ubuntu** gracias a **WSL** sin salis de nuestro sistema operativo **Windows**.

¡Espero resulte útil!
