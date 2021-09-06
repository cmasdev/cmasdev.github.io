---
layout: post
title: "Integración con Dynamics 365 for Sales"
author: "Christian Amado"
date: 2019-04-03 21:34:10 -04:00
categories: [Aplicaciones de negocio]
tags: [CRM,Dynamics 365,Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/dynamics365.png
cover-img: /img/posts/cover/dynamics-365-for-sales.svg
---

Como todo producto Microsoft existe integraciones entre ellos que nos facilitan la vida. En este caso veremos cómo se integra Dynamics 365 Business Central (On-Premise) con Dynamics 365 for Sales (Cloud).

En un [artículo anterior](/2018/05/integracion-dynamics-nav-2018-con-dynamics-365-for-sales/), ya hemos visto como realizar la mitad de la integración (sigamos hasta el paso 10 de ese tutorial para no repetir la historia). Donde cambia un poco el panorama es dentro de Dynamics 365 Business Central que reemplaza a Dynamics NAV 2018.

<!--more-->

También resulta importante ver [este artículo](/2018/10/roles-de-seguridad-para-integracion-con-d365-business-central/) sobre los roles de seguridad a ser aplicados para la integración.

Primeramente, debemos enlazar el usuario Business Central con el usuario CRM (al que acabamos de asignar los permisos necesarios). Entonces, los datos del usuario quedarían de la siguiente manera: Debemos buscar la ruta con la Lupa   
![](/img/posts/migrated/2019/04/1-2.png)  

1. Obtener el usuario (email) de inicio de sesion del usuario en Dynamics 365 for Sales  
![](/img/posts/migrated/2019/04/2-2.png)

3. En Dynamics Business Central, colocar dicho correo en el campo usuario de Office 365:  
![](/img/posts/migrated/2019/04/3-2.png)

5. En la misma ventana, colocar los permisos necesarios para D365 (en este caso le damos FULL ACCESS):  
![](/img/posts/migrated/2019/04/4-2.png)

Hemos culminado, con lo referente al usuario. Es decir, que el usuario de Dynamics Business Central esta enlazado con el usuario de Dynamics 365 for Sales.

Ahora debemos configurar la conexión de Microsoft Dynamics Business Central con Microsoft Dynamics 365 for Sales. Para ello, seguimos estos pasos:
1. Ingresamos al modulo necesario, colocando en el buscador la palabra "conexión"  
![](/img/posts/migrated/2019/04/5-2.png)  

2. Completamos los datos de conexión y le damos clic en "Probar conexión"  
![](/img/posts/migrated/2019/04/6-2.png)  

3. Si la conexión fue exitosa, veremos un mensaje como este:  
![](/img/posts/migrated/2019/04/7-2.png)  

4. Hacemos clic en la opción "Activado". Si sale error debemos corregirlo:  
![](/img/posts/migrated/2019/04/8-2.png)  

5. Si nos aceptan los cambios procedemos a completar los demás campos necesarios y listo.  
![](/img/posts/migrated/2019/04/9-1.png)

De esta manera, logramos la integración en esta nueva plataforma.