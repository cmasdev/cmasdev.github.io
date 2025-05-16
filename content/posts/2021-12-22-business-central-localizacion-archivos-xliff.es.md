---
layout: post
title: "Business Central: Localización con archivos XLIFF"
author: Christian Amado
date: 2021-12-22 13:27:04 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo gestionar las traducciones en un archivo de configuración dentro de Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Primeramente, debemos establecer la propiedad **features** en el archivo de configuración **app.json**:
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
  "features": [ "TranslationFile" ],
  "resourceExposurePolicy": 
    {"allowDebugging": true, 
      "allowDownloadingSource": true, 
      "includeSourceInSymbolFile": true
    },
  "runtime": "8.0"
}
```
Con la opcion **TranslationFile** en **Features** logramos habilitar el archivo **xliff** que nos permite gestionar las traducciones.  
![](/img/posts/2021/12/22/Translate1.png)  

El archivo generado de manera automática queda de la siguiente manera:
```
<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2-transitional.xsd">
  <file datatype="xml" source-language="en-US" target-language="en-US" original="BC2021W1">
    <body>
      <group id="body">
        <trans-unit id="PageExtension 1255613137 - Control 3732224266 - Property 2879900210" size-unit="char" translate="yes" xml:space="preserve" al-object-target="Page 2901867346">
          <source>prueba</source>
          <note from="Developer" annotates="general" priority="2"></note>
          <note from="Xliff Generator" annotates="general" priority="3">PageExtension CustomerListExt - Control Test - Property Caption</note>
        </trans-unit>
      </group>
    </body>
  </file>
</xliff>
```
Ahora, veremos la opción en español del archivo con extensión **.xlf** (copiamos y pegamos el archivo anterior y le agregamos es-MX.xlf al final):  
```
<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2-transitional.xsd">
  <file datatype="xml" source-language="en-US" target-language="es-MX" original="BC2021W1">
    <body>
      <group id="body">
        <trans-unit id="PageExtension 1255613137 - Control 3732224266 - Property 2879900210" size-unit="char" translate="yes" xml:space="preserve" al-object-target="Page 2901867346">
          <source>prueba</source>
          <target>prueba</target>
          <note from="Developer" annotates="general" priority="2"></note>
          <note from="Xliff Generator" annotates="general" priority="3">PageExtension CustomerListExt - Control Test - Property Caption</note>
        </trans-unit>
      </group>
    </body>
  </file>
</xliff>
```
Ahora, veremos la opción en inglés del archivo con extensión **.xlf** (copiamos y pegamos el archivo anterior y le agregamos en-US.xlf al final):  
```
<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2-transitional.xsd">
  <file datatype="xml" source-language="en-US" target-language="es-MX" original="BC2021W1">
    <body>
      <group id="body">
        <trans-unit id="PageExtension 1255613137 - Control 3732224266 - Property 2879900210" size-unit="char" translate="yes" xml:space="preserve" al-object-target="Page 2901867346">
          <source>prueba</source>
          <target>test</target>
          <note from="Developer" annotates="general" priority="2"></note>
          <note from="Xliff Generator" annotates="general" priority="3">PageExtension CustomerListExt - Control Test - Property Caption</note>
        </trans-unit>
      </group>
    </body>
  </file>
</xliff>
```
Vamos a compilar y ejecutar:  
![](/img/posts/2021/12/22/Translate2.png)  

![](/img/posts/2021/12/22/Translate3.png)  

Con estos pasos, logramos traducir los texto en los idiomas que necesitamos.

Nuestro proyecto quedaría así:  
![](/img/posts/2021/12/22/Translate4.png)  

¡Espero resulte útil!