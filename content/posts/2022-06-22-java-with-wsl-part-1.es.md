---
layout: post
title: "Java con WSL parte 1"
author: Christian Amado
date: 2022-06-22 18:19:00 -0400
category: [Desarrollo de software]
tags: [WinDev, WSL, Java, Ubuntu]
thumbnail-img: /img/posts/thumbnails/android.png
cover-img: /img/posts/cover/android.png
share_img: /img/posts/shared/android.jpg
---

En este artículo mostraré cómo instalar y preparar el entorno para el desarrollo de **Java** sobre **Windows Subsystem for Linux (WSL)**.

***Windows 11 Insider Preview Build 25145***

<!--more-->

Personalmente no soy desarrollador Java, pero desde que lo estudié (obligado) en la Universidad siempre le seguí el rastro. El lenguaje, la plataforma en general, para mi gusto es lento y a veces frustrante. Pero esa es una opinión muy particular.

El foco aquí es ver como instalar todo el paquete y sacar una pequeña web. Según la encuesta anual de StackOverflow Java se posiciona entre uno de los primeros lenguajes. [Aquí](https://survey.stackoverflow.co/2022/#section-most-popular-technologies-programming-scripting-and-markup-languages) se encuentra la encuesta para quien esté interesado.

## Instalar Java desde Visual Studio Code en WSL
Existe el proceso manual (para las personas que quieren isntalarlo asegurando todos los pasos). Cómo sólo estoy investigando (y publicando la investigación) iremos por el camino más corto.

Para ello, haremos los siguientes pasos:
1. En **WSL:Ubuntu**, ingresaremos el comando:
```
code
```
![](/img/posts/2022/06/22/1.png)  
2. En Visual Studio Code (WSL) procedemos a instalar los objetos necesarios (esto debido a que toda la instalación estará en Ubuntu):
![](/img/posts/2022/06/22/2.png)  
3. Veamos que versión de Java tenemos...
![](/img/posts/2022/06/22/3.png)  
4. Debemos instalar el **JVM (Java Virtual Machine)** para que funcione: 
```
sudo apt install default-jdk
```
![](/img/posts/2022/06/22/4.png)  
5. Establecemos el **Java Home**:
```
sudo vi ~/.bashrc
  export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```
6. Verificamos la versión de **Java**
![](/img/posts/2022/06/22/5.png)  

## Instalar Gradle para los proyectos Java
1. Descargar Gradle a una carpeta temporal:
```
wget https://services.gradle.org/distributions/gradle-7.3.3-bin.zip -P /tmp
```
2. Extraer los archivos a **/opt/gradle**:
```
sudo apt install unzip
sudo unzip -d /opt/gradle /tmp/gradle-*.zip
```
3. Verificar los archivos:
```
ls /opt/gradle/gradle-7.3.3/
```
4. Configurar la variable de entorno creando **gradle.sh**
```
sudo vi /etc/profile.d/gradle.sh
```
5. Agregamos lo siguiente a ese archivo:
```
# /etc/profile.d/gradle.sh
export GRADLE_HOME=/opt/gradle/gradle-7.3.3
export PATH=${GRADLE_HOME}/bin:${PATH}
```
6. Convertir el archivo en ejecutable:
```
sudo chmod +x /etc/profile.d/gradle.sh
```
7. Cargamos la variable de entorno
```
source /etc/profile.d/gradle.sh
```
8. Verificamos que todo esté bien:
```
gradle -v
```
![](/img/posts/2022/06/22/6.png)  
9. Instalar la extensión **Gradle for Java**
![](/img/posts/2022/06/22/7.png)  
## Crear un proyecto Java
1. Crear el proyecto Java:
![](/img/posts/2022/06/22/8.png)  
2. Marcamos la opción de "No build tools":
![](/img/posts/2022/06/22/9.png)  
3. Seguimos las instrucciones en pantalla para la creación del proyecto.
4. Modificamos el archivo **App.java**:
```
public class App {
    public static void main(String[] args) throws Exception {
        System.out.println("Hello, World from cmasdev!");
    }
}
```
5. Ejecutamos la aplicación con *F5*:
![](/img/posts/2022/06/22/10.png)  

¡Espero resulte útil!
