---
layout: post
title: "BCDEV Tips: Configurar entorno de desarrollo - Parte 3"
author: "Christian Amado"
date: 2020-03-25 20:44:03 -04:00
categories: [Aplicaciones de negocio]
tags: [AL,Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /assets/img/posts/thumbnails/businesscentral.png
cover-img: /assets/img/posts/thumbnails/businesscentral.png
---

En esta última parte del artículo veremos cómo clonar el repositorio y unirlo con Visual Studio Code. Por último publicaremos la extensión en Dynamics 365 Business Central Wave 2.  

<!--more-->

Para ello, debemos ubicarnos en la sección de repositorios del Visual Studio Code y clonar el repositorio:  
![](/assets/img/posts/migrated/2020/03/1-7.png)  

Obtenemos la URL del reporitorio de archivos ubicado en Azure DevOps Services:  
![](/assets/img/posts/migrated/2020/03/2-7.png)  

Seleccionamos la carpeta donde se colocará localmente el proyecto:  
![](/assets/img/posts/migrated/2020/03/3-6.png)  

Debemos autenticarnos al servicio y listo:  
![](/assets/img/posts/migrated/2020/03/4-6.png)  

![](/assets/img/posts/migrated/2020/03/5-5.png)  

![](/assets/img/posts/migrated/2020/03/6-5.png)  

Ahora, debemos autenticarnos al repositorio para ver/editar los cambios:  
![](/assets/img/posts/migrated/2020/03/7-4.png)  

![](/assets/img/posts/migrated/2020/03/8-3.png)  

![](/assets/img/posts/migrated/2020/03/9-3.png)  

![](/assets/img/posts/migrated/2020/03/10-3.png)  

Una vez terminado este paso nos lleva de nuevo al Visual Studio Code y seguimos...  

Verificamos que estén sincronizados los repositorios:  
![](/assets/img/posts/migrated/2020/03/11-2.png)  

Creamos el proyecto AL, dentro del mismo proyecto del repositorio y nos vamos al control de código fuente:  
![](/assets/img/posts/migrated/2020/03/12-2.png)  

Escribimos un mensaje relacionado y le damos **Commit**:  
![](/assets/img/posts/migrated/2020/03/13-1.png)  

Aceptamos la sugerencia:  
![](/assets/img/posts/migrated/2020/03/14-1.png)   

Procedemos a Sincronizar los cambios para que se refleje en el servidor:  
![](/assets/img/posts/migrated/2020/03/15.png)  

En Azure DevOps Services, verificamos si está todo correcto:  
![](/assets/img/posts/migrated/2020/03/16.png)  

De esta manera, tenemos configurado y lsito nuestro entorno de desarrollo **Dynamics 365 Business Central Wave 2** con **Azure DevOps Services**.  

¡Espero resulte útil!
