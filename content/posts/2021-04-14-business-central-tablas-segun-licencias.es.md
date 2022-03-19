---
type: post
title: "Business Central: Tablas según licencias"
author: Christian Amado
date: 2021-04-14 17:14:00 -0400
category: [Aplicaciones de negocio]
tag: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Este es un caso muy particular, porque se dá en Microsoft Dynamics 365 Business Central en su modalidad On-Premise (quiere decir en un servidor local no en la nube) porque en dicha opción tenemos limitadas cantidades de tablas.  

Esto es un tema de licenciamiento para versiones On-Premise.

<!--more-->

En este artículo veremos cómo se definen las tablas. Básicamente todos los partners de Microsoft Dynamics tenemos acceso a un portal que se denomina [partnersource](https://businesscenter.mbs.microsoft.com/) donde accedemos a los datos de nuestros clientes.  

Dicho eso, procedo a mostrar en dicho portal la asignación de tablas de uno de ellos:  
![](/img/posts/2021/04/14/LicenseTable1.png)  

En la parte de arriba nos indica que cantidad de tablas compradas y asignadas tenemos. En la parte de abajo nos indica los rangos que podemos utilizar, que aquí se especifican del 50000 al 50009.  

Entonces, dentro del Visual Studio code debemos definir ese tango dentro del archivo **app.json** en la sección correspondiente:
```
"idRanges": [
    {
      "from": 50000,
      "to": 50009
    }
  ],
  "target": "OnPrem"
  "runtime": "6.0"
```
Lo que expresamos aqui es lo que la licencia nos permite. Por lo tanto, no se pueden crear 11 tablas, no se puede usar otra numeración que la expuesta.

**Tip:** Si tenemos por ejemplo páginas del 50000 al 500099 debemos colocar en el archivo de configuración dentro de idRanges la numeración de las páginas. Solo debemos tener en cuenta la limitación que existe dentro de cada objeto, como está expresado en la tabla más arriba.

La configuración final quedaría así:
```
{
  "id": "66ae3477-c77e-4e15-8118-2c5c60edb3a5",
  "name": "VersionesExtensiones",
  "publisher": "Christian Amado",
  "version": "1.0.1.0",
  "brief": "Prueba de versiones",
  "description": "Versionado de extensiones",
  "privacyStatement": "",
  "EULA": "",
  "help": "",
  "url": "",
  "logo": "",
  "dependencies": [],
  "screenshots": [],
  "platform": "1.0.0.0",
  "application": "17.0.0.0",
  "idRanges": [
    {
      "from": 50000,
      "to": 50009
    }
  ],
  "target": "OnPrem",
  "runtime": "6.0",
  "showMyCode": true
}
```

¡Espero resulte útil!