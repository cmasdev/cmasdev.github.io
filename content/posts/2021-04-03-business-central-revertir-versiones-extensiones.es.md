---
type: post
title: "Business Central: Revertir versiones de extensiones"
author: Christian Amado
date: 2021-04-01 16:38:12 -0400
category: [Aplicaciones de negocio]
tag: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este articulo deseo mostrar cómo revertir las versiones de las extensiones que creamos y cómo poder utilizarlas sin afectar las siguientes. Resulta que BC almacena todas las versiones, es decir, deshabilita las versiones anteriores pero no las elimina. eso permite volver a utilizarlas, aunque no es un proceso común.

<!--more-->

Para que se entienda un poco, primero mostraré el archivo de configuración donde se establece la última versión:
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
      "from": 50100,
      "to": 50149
    }
  ],
  "showMyCode": true,
  "runtime": "6.0"
}
```
Con el correr de las ejecuciones y el tiempo de desarrollo estas versiones van mejorando o actualizándose. Por ejemplo, creamos la versión 1.0.0.1 y luego la versión 1.0.1.0. Para entender más sobre versionado puedes leer [este artículo](https://docs.microsoft.com/es-es/dotnet/standard/library-guidance/versioning#assembly-version "Versión de ensamblado")  

Entonces, en la página *Extensiones* dentro de nuestro sistema encontraremos algo así:  
![](/img/posts/2021/04/03/VersionExtension1.png)  

Para que se entienda estamos necesitando la versión 1.0.0.1, así que debemos desinstalar y deshabilitar la extensión actual (1.0.1.0):  
![](/img/posts/2021/04/03/VersionExtension2.png)  

Aquí debemos seleccionar la opción de **Eliminar datos de extensión** según sea nuestra intención:  
![](/img/posts/2021/04/03/VersionExtension3.png)  

Entonces, esto nos queda así luego de la desinstalación. Todos esperamos que pueda volver automáticamente a la versión anterior, pero de momento eso no es posible.  
![](/img/posts/2021/04/03/VersionExtension4.png)  

Con eso podemos volver a compilar y ejecutar la extensión anterior que teníamos. De momento, no hay una forma de hacer downgrade de versiones en extensiones.

**Recomendación:** Si tienen control de código fuente puedes crear una rama (branch) con el número de versión utilizada, de manera a volver a publicar esa versión según la necesidad.

