---
layout: post
title: "Business Central: Exponer Servicios Web"
author: Christian Amado
date: 2021-08-25 18:19:54 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo exponer servicios web para ser consumidos por otras aplicaciones desde Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Para lograr esto, debemos verificar la configuración de OData, de SOAP Services estén habilitados (queda a criterior del administrador habilitar uno u otr servicio). Por compatibilidad, se pueden habilitar ambos, siempre con las medidas de seguridad necesarias.  
![](/img/posts/2021/08/25/WebService1.png)  

Luego, debemos dirigirnos al sistema y buscar la página **Servicios Web**:  
![](/img/posts/2021/08/25/WebService2.png)  

Verificamos que el servicio esté publicado:  
![](/img/posts/2021/08/25/WebService3.png)  

Por último, hacemos la prueba del servicio haciendo clic en el enlace que corresponde a *OData* o *SOAP*:  
![](/img/posts/2021/08/25/WebService4.png)  

En el navegador, veremos el resultado del servicio:  
![](/img/posts/2021/08/25/WebService5.png)  

¡Espero resulte útil!