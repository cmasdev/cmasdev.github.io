---
layout: post
title: "Business Central: Manejo de versiones publicadas"
author: Christian Amado
date: 2020-04-30 20:31:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En versiones anteriores de Microsoft Dynamics, NAV específicamente se hacía complicado el versionado. De hecho no lo tenía, pero ahora el manejo de versiones publicadas en Business Central permite tener varias y utilizar la que estamos necesitando.

En este punto estoy hablando de versiones en cuanto a extensiones, no a control de código fuente y sus beneficios. Eso es tema para otro artículo.

<!--more-->

## ¿Cómo gestiono las versiones de mis extensiones?

Primero, debemos tener en cuenta que debemos aumentar la versión que estamos usando en nuestro archivo **app.json**:
```
{
  "id": "7c3c1ec4-addf-6fcf-b254-be50656e1bca",
  "name": "CMASDEV",
  "publisher": "Christian Amado",
  **"version": "1.0.0.1",**
  "brief": "Prueba de versiones",
  "description": "",
  "privacyStatement": "",
  "EULA": "",
  "help": "",
  "url": "https://cmas.dev",
  "logo": "./res/logo.png",
  "dependencies": [
    {
      "appId": "63ca2fa4-4f03-4f2b-a480-172fef340d3f",
      "publisher": "Microsoft",
      "name": "System Application",
      "version": "1.0.0.0"
    },
    {
      "appId": "437dbf0e-84ff-417a-965d-ed2bb9650972",
      "publisher": "Microsoft",
      "name": "Base Application",
      "version": "15.0.0.0"
    }
  ],
  "screenshots": [],
  "platform": "15.0.0.0",
  "idRanges": [
    {
      "from": 50000,
      "to": 50099
    }
  ],
  "contextSensitiveHelpUrl": "",
  "showMyCode": true,
  "runtime": "4.0",
  "target": "OnPrem"
}
```

Para nuestro ejemplo la versión es 1.0.0.1, pero ya tenemos instalada la versión 1.0.0.0 en nuestro Business Central. Entonces, ¿Qué ventaja tengo? Pues la ventaja es que puedo hacer pruebas y utilizar la versión que me convenga en ese momento para realizar comparaciones de funcionalidades. Únicamente necesitamos los permisos para administrar las **Extensiones** dentro de Business Central.