---
layout: post
title: "Publicar aplicación para usuarios externos"
author: "Christian Amado"
date: 2020-03-31 12:32:20 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En la [entrada de ayer](/2020/03/publicar-aplicacion/) vimos cómo publicar una aplicación dentro del dominio de nuestra organización con usuarios propios de la empresa. Digamos que sirve para una aplicación interna que puede ser utilizada sin inconvenientes.
  
En este caso, habilitaremos la misma aplicación pero para usuarios externos a nuestra organización. Para eso necesitamos un poco de Microsoft Azure.

<!--more-->
  
Nos dirigimos al [portal de Microsoft Azure](https://portal.azure.com) y seleccionamos la opción para Administrar **Active Directory**:  
![](/img/posts/migrated/2020/03/1-2.png)
  
Seleccionamos la opción **Usuarios**:  
![](/img/posts/migrated/2020/03/2-2.png)
  
Agregamos un **Usuario invitado**:  
![](/img/posts/migrated/2020/03/3-2.png)
  
Agregamos el correo de la persona a la cual deseamos invitar:  
![](/img/posts/migrated/2020/03/4-2.png)  
Nos dirigimos a la sección **Licencias**:  
![](/img/posts/migrated/2020/03/5-1.png)  

Asignamos la licencia correspondiente:  
![](/img/posts/migrated/2020/03/6-1.png)
  
Agregamos el usuario y los permisos a productos:  
![](/img/posts/migrated/2020/03/7-1.png)
  
![](/img/posts/migrated/2020/03/8-1.png)
  
![](/img/posts/migrated/2020/03/9-1.png)
  
![](/img/posts/migrated/2020/03/10-1.png)
  
Ahora, en PowerApps, procedemos a **Compartir la aplicación**:  
![](/img/posts/migrated/2020/03/11.png)
  
Seleccionamos al usuario y hacemos clic en **Compartir**:  
[](/img/posts/migrated/2020/03/12.png)
  
El usuario que acepta la invitación deberá otorgar permisos para su propio usuario:  
![](/img/posts/migrated/2020/03/13.png)
  
La aplicación se ejecuta normalmente:  
![](/img/posts/migrated/2020/03/14.png)
  
De esta forma, hemos compartido una aplicación externa con un usuario. Debemos tener en cuenta que realizar esta acción consume las licencias de la organización que la comparte.
  
¡Espero resulte de utilidad!
