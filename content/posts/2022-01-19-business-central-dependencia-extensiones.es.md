---
layout: post
title: "Business Central: Dependencia en extensiones"
author: Christian Amado
date: 2022-01-19 17:21:04 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo indicar que un campo es requerido y realizar el control pertinente en Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Básicamente, la idea aquí es demostrar cómo una extensión depende de otra para su funcionamiento. Esto se logra configurando el archivo **app.json**.

## Base

Primero, se desarrolla la extensión base. En este caso el archivo **app.json**:
```
{
  "id": "a41c92fb-dc08-4252-be15-e1d693e9bbbf",
  "name": "Dependencia1",
  "publisher": "cmasdev",
  "version": "1.0.0.0",
  "brief": "Prueba dependencia",
  "description": " Solo es una prueba",
  "privacyStatement": "",
  "EULA": "",
  "help": "",
  "url": "",
  "logo": "",
  "dependencies": [],
  "screenshots": [],
  "platform": "1.0.0.0",
  "application": "19.0.0.0",
  "idRanges": [
    {
      "from": 50100,
      "to": 50149
    }
  ],
  "resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": true,
    "includeSourceInSymbolFile": true
  },
  "runtime": "8.0"
}
```
Y la página de ejemplo se ve así:
```
pageextension 50100 CustomerListExt extends "Customer List"
{
    trigger OnOpenPage();
    begin
        Message('Soy la dependencia base');
    end;
}
```
![](/img/posts/2022/01/19/Dependencia1.png)  

## Dependencia
Esta extensión depende de la otra para funcionar. Sin eso, no es posible el funcionamiento. En el archivo **app.json** definimos la dependencia así:
```
{
  "id": "8941379f-65d8-46c5-8f12-3931790d2f23",
  "name": "BC2021W1",
  "publisher": "cmasdev",
  "version": "1.0.0.0",
  "brief": "",
  "description": "",
  "privacyStatement": "",
  "EULA": "",
  "help": "",
  "url": "",
  "logo": "",
  "dependencies": 
  [
    {
      "id": "a41c92fb-dc08-4252-be15-e1d693e9bbbf",
      "name": "Dependencia1",
      "publisher": "cmasdev",
      "version": "1.0.0.0"
    }
  ],
  "screenshots": [],
  "platform": "1.0.0.0",
  "application": "19.0.0.0",
  "idRanges": [
    {
      "from": 50100,
      "to": 50149
    }
  ],
  
  "resourceExposurePolicy": 
    {"allowDebugging": true, 
      "allowDownloadingSource": true, 
      "includeSourceInSymbolFile": true
    },
  "runtime": "8.0"
}
```

Si nos fijamos en la página que estamos creando y coinciden los números de elementos que creamos en la dependencia base, se produce un error:  
![](/img/posts/2022/01/19/Dependencia2.png)  

De esta manera comprobamos que respeta los valores de la dependencia, pues debemos [descargar los símbolos](https://cmas.dev/posts/2021-09-07-business-central-download-symbols-cloud) para poder ejecutarlo y ahí se crea el enlace.


¡Espero resulte útil!