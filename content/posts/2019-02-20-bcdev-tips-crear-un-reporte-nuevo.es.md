---
layout: post
title: "BCDEV Tips: Crear un reporte nuevo"
author: "Christian Amado"
date: 2019-02-20 22:51:59 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En la entrada anterior vimos cómo crear una nueva página, aquí crearemos un nuevo reporte. Debemos tener en cuenta que en Dynamics 365 Business Central no se puede modificar un reporte, sólo pueden crearse reportes nuevos. Evidentemente, éstos consumen reportes disponibles en la licencia obtenida por el cliente.

Básicamente, para crear un reporte nuevo se deben seguir estos pasos:

<!--more-->

1. Creamos la definición del reporte:
```
report 50200 D365ReporteNuevo
{
    DefaultLayout = RDLC;
    RDLCLayout = 'ReporteNuevo.rdl'; 
}
```
2. Dentro del reporte, agregamos el "dataset" que contiene los datos:
```
dataset
{
    dataitem(SalesInvoiceHeader; "Sales Invoice Header")
    {
        column(Cliente; "Bill-to Customer No.")
        {

        }
        column(Numero; "No.")
        {

        }
        column(MontoTotal; "Amount Including VAT")
        {

        }
    }
}
```
3. Debemos tener en cuenta, que debe compilar el código con Ctrl + Shift + B.

4. Veremos que genera el archivo **.rdlc** con el mismo nombre que nuestro archivo AL:  
![](/img/posts/migrated/2019/02/1-2.png)  

5. Abrimos el reporte .rdlc con Visual Studio o bien con SQL Server Report Designer.

6. Una vez terminado el diseño, procedemos a compilar el archivo AL y el RDLC.

Como hemos visto, crear un reporte en Dynamics 365 Business Central es sencillo.
