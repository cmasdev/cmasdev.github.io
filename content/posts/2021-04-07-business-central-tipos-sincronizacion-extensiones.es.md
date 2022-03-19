---
type: post
title: "Business Central: Tipos de sincronización en extensiones"
author: Christian Amado
date: 2021-04-07 22:47:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Este artículo lo escribo porque en mi equipo de trabajo surgieron dudas en cuanto a esto debido a que se han borrado datos de un cliente (obviamente en su espacio Sandbox) pero esto consume tiempo y el motivo es muy sencillo. 

<!--more-->

Básicamente existen tres tipos de sincronización en Microsoft Dynamics 365 Business Central (similares a Microsoft Dynamics NAV) los cuales son:  
1. Syncronize.
2. Recreate. 
3. ForceSync.

Estas configuraciones se realizan en el archivo **launch.json** de nuestor proyecto AL dentro del Visual Studio Code. Las opciones se ven así:    
![](/img/posts/2021/04/07/SyncType1.png)  

## Syncronize
Esta opción agrega todas las nuevas funcionalidades y mantiene los datos entre compilaciones, permitiendo construir las nuevas funcionalidades sobre datos existentes.  

## Recreate
Exactamente lo opuesto al anterior. Esta opción permite agregar las nuevas funcionalidades pero todos los datos de la extensión en cuestión se eliminan sin dejar rastros. Como su nombre indica elimina los objetos y luego los vuelve a crear.  

## ForceSync
Es el primer caso pero mejorado. Siempre intentará mantener la estructura inicial con sus datos pero si tenemos una nueva clave primaria, modificación de campos o renombramiento de columnas en una tabla, TODO (lo referente a esos campos) se borrarán. El resto de los campos no afectados se mantendrá sin problemas.  

Con mi equipo siempre utilizamos la opción **ForceSync** para desarrollo contra un Sandbox.

Toda la información se encuentra en el sitio oficial de Microsoft [aquí](https://docs.microsoft.com/es-es/dynamics365/business-central/dev-itpro/developer/devenv-retaining-data-after-publishing)