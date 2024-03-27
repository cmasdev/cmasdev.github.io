---
layout: post
title: "Incrustar página web externa en Power Apps"
author: "Christian Amado"
date: 2023-09-20 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps, .NET]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En este artículo veremos cómo incrustar oáginas web externas en **Microsoft Power Apps** como si incluyeramos un IFrame dentro de nuestra App.

<!--more-->

Un cliente me ha solicitado hace poco que le incluya un sitio web dentro de su aplicación **Power Apps** y no sabía cómo hacerlos, de hecho tenía entendido que no se podía hacerlo.

Pero he encontrado una forma y el cliente quedó contento.

# Windows y PowerShell
1. Descargar los componentes de ejemplo desde aquí:
![](https://i.ibb.co/3vjKfwD/external-web-pa-1.png)

2. Descargar el **Power Platform CLI** desde [aquí](https://aka.ms/PowerAppsCLI) (en mi caso instalé la versión MSI).

3. Descomprimir el archivo descargado desde **GitHub**.

4. En **PowerShell** empezar a jugar un poco con los comandos (siguiendo las instrucciones de [aqui](https://github.com/microsoft/PowerApps-Samples/blob/master/component-framework/README.md)):
```
cd C:\A\PowerApps-Samples-master\PowerApps-Samples-master\component-framework\IFrameControl\
```
```
mkdir IFrameSolution
cd C:\A\PowerApps-Samples-master\PowerApps-Samples-master\component-framework\IFrameControl\IFrameSolution
```
```
pac solution init --publisher-name powerapps_samples --publisher-prefix sample
```
```
pac solution add-reference --path ../../IFrameControl
pac solution add-reference --path ../../IFrameControl/IFrameControl.pcfproj
```
```
msbuild /t:restore
msbuild /t:rebuild /restore /p:Configuration=Release
msbuild
```
Con todo esto se debe crear un archivo **IFrameSolution.zip** dentro de la carpeta *bin/Release/*, el cual, llevaremos a **Power Apps**.

# Power Apps
1. Procedemos a importar la solución generada en los pasos anteriores:
![](https://i.ibb.co/gw2D1Pw/external-web-pa-2.png)

2. Verificamos si la importación fue correcta:
![](https://i.ibb.co/RS07pgJ/external-web-pa-3.png)

3. Importamos el componente (en este caso, es un componente de tipo Código):
![](https://i.ibb.co/D9TPFHL/external-web-pa-4.png)

4. Utilizamos el IFRAME

Debemos tener en cuenta que el control de ejemplo sólo es un Mapa de Bing que permite latitud y longitud. Como en mi caso, se pueden agregar y/o modificar los parametros y volver a generar el control para cubrir nuestras necesidades.

Se debe tener cuidado con ingresas **JavaScript** pues el componente puede ser bloqueado por considerarse araque de **Cross-Site Scripting (XSS)**.

De esta manera, hemos visto como incrustar una página web dentro de **Microsoft Power Apps**

¡Espero resulte de utilidad!
