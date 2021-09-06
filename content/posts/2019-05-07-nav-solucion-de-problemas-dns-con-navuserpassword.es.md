---
layout: post
title: "NAV: Solución de problemas DNS con NavUserPassword"
author: "Christian Amado"
date: 2019-05-07 22:13:51 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

Recibí la llamada de un cliente referente a una situación de conexión entre el Servidor NAV y su cliente, que en este caso utilizan las credenciales de tipo **NavUserPassword**. El problema se muestra en la siguiente imagen (CMASUS es el nombre de referencia del Servidor):  
![](/img/posts/migrated/2018/07/7-1.png)  

<!--more-->

En una [entrada anterior](/2018/07/solucionar-error-protocolo-cliente-y-servidor-no-coinciden-en-dynamics-nav-2018/) habíamos definido cómo habilitar la autenticación NAV en el servidor (para ese caso con un certificado SSL local), aquí el escenario es el mismo.

> Debemos buscar el archivo de configuración ClientUserSettings.config y verificar que la opción DNSIdentity no esté vacía. En caso que este vacía, procedemos a colocar el dato necesario, el cual sería el nombre del servidor (en mi caso CMASUS).

Una vez realizada la tarea, el cliente de Microsoft Dynamics NAV 2018 se conectará sin problemas.
