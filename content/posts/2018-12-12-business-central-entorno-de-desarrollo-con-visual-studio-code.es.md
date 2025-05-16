---
layout: post
title: "Business Central: Entorno de desarrollo con Visual Studio Code"
author: "Christian Amado"
date: 2018-12-12 20:25:24 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Luego de la instalación de Dynamics 365 Business Central, me encontré con el entorno de desarrollo del mismo y nada a cambiado...  
![](/img/posts/migrated/2019/12/0.png)  

Hasta que vi un [material oficial de Microsoft](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-get-started) donde hablaba de extensiones y fue ahí donde encontré una muy buena salida para el desarrollo de las personalizaciones en el mundo Dynamics 365 Business Central. Aquí están los pasos:

<!--more-->
1. Ir a "Business Central Administration", desplegar la instancia e ir a la sección "Development":  
![](/img/posts/migrated/2019/12/1.png)  

2. Instalar [Visual Studio Code](/2016/02/primeros-pasos-con-visual-studio-code/) y luego abrirlo.

3. [Descargar la extensión "AL language"](https://marketplace.visualstudio.com/items?itemName=ms-dynamics-smb.al) e instalarla.

4. Se puede instalar desde Visual Studio Code, utilizando "Ctrl+Shift+X" para abrir las extensiones:  
![](/img/posts/migrated/2019/12/2.png)  

5. Procedemos a buscar e instalar:  
![](/img/posts/migrated/2019/12/3.png)  

6. ¡Instalado y funcional!  
![](/img/posts/migrated/2019/12/4.png)  

7. Presionamos la combinación "Ctrl+Shift+P" para abrir "Command Palette" y escribimos AL Go!. Seleccionammos "Your own server":  
![](/img/posts/migrated/2019/12/5.png)  

8. Abrimos el archivo "launch.json":  
![](/img/posts/migrated/2019/12/6.png)  

9. Y modificamos según los parámetros de nuestro servicio:  
![](/img/posts/migrated/2019/12/7.png)  

10. Presionamos la combinación "Ctrl+Shift+P" para abrir "Command Palette" y escribimos "AL: Download symbols", si los parámetros son correctos descargará:  
![](/img/posts/migrated/2019/12/8.png)  

11. Abrimos el archivo HelloWorld.al y modificamos según la necesidad:  
![](/img/posts/migrated/2019/12/9.png)  

De esta forma podemos desarrollar extensiones sobre los objetos del Dynamics 365 Business Central!!!