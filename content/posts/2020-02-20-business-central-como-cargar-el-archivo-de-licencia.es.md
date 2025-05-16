---
layout: post
title: "Business Central: Cómo cargar el archivo de licencia"
author: "Christian Amado"
date: 2020-02-19 23:10:13 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Resulta que el nuevo Business Central Wave 2 no trae consigo el entorno de desarrollo de NAV y por ende no podemos cargar el archivo de licencia de manera visual. De hecho, casi nada se puede hacer de manera visual, todo por código. Encantador, para los desarrolladores.  

<!--more-->

Lo primero que debemos hacer es buscar PowerShell ISE y abrirlo: ![](/img/posts/migrated/2020/02/1-2.png)  

Importamos los módulos para powrshell:  
```
Import-Module 'C:\\Program Files\\Microsoft Dynamics 365 Business Central\\150\\Service\\NavAdminTool.ps1'  
```
![](/img/posts/migrated/2020/02/2-2.png)  

Verificamos la licencia que tenemos actualmente:  
```
Export-NAVServerLicenseInformation -ServerInstance BC150  
```
![](/img/posts/migrated/2020/02/3-2.png)  

Ahora cargamos nuestro propio archivo de licencia (con los objetos comprados/adquiridos/partner)  
```
Import-NAVServerLicense -LicenseFile 'C:\\CMAS.flf' -ServerInstance BC150  
```
![](/img/posts/migrated/2020/02/4-2.png)  

Reiniciamos el servicio solicitado:  
```
Restart-NAVServerInstance -ServerInstance BC150  
```
![](/img/posts/migrated/2020/02/5-2.png)  

Esto depende del servidor, puede tardar unos minutos.  

Por último, volvemos a verificar si la licencia fue aplicada correctamente:  
```
Export-NAVServerLicenseInformation -ServerInstance BC150  
```
![](/img/posts/migrated/2020/02/6-1.png)  

De esta manera, hemos cargado el archivo de licencia en el servidor de Dynamics 365 Business Central Wave 2.
