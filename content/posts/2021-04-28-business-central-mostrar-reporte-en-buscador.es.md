---
layout: post
title: "Business Central: Mostrar reporte en el buscador"
author: Christian Amado
date: 2021-04-28 14:15:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En esta ocasion quisiera mostrar cómo agregar un reporte en el buscador para que sea más sencillo encontrarlo. En un [artículo anterior](https://cmas.dev/posts/2019-02-20-bcdev-tips-crear-un-reporte-nuevo) vimos cómo crear un reporte nuevo (se me ocurre trabajar sobre ese mismo reporte). 

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*  

Aplicamos la definición del reporte de la siguiente manera:
```
report 50100 D365ReporteNuevo
{
    Caption = 'Reporte Nuevo Blog';
    DefaultLayout = RDLC;
    RDLCLayout = 'ReporteNuevo.rdl';

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

}
```

Compilamos y ejecutamos la aplicación y tratamos de buscar "Reporte Nuevo Blog", veremos el buscador de la siguiente manera:  
![](/img/posts/2021/04/28/Reporte1.png)  

Modificamos la definición del reporte y nos quedaría de la siguiente manera:
```
Caption = 'Reporte Nuevo Blog';
DefaultLayout = RDLC;
RDLCLayout = 'ReporteNuevo.rdl';
UsageCategory = ReportsAndAnalysis;
AdditionalSearchTerms = 'cmasdev, blog';
```
Volvemos a compilar y ejecutar. Buscamos por la palabra "blog" o "cmasdev" o "reporte nuevo blog" y obtendremos el resultado deseado:  
![](/img/posts/2021/04/28/Reporte2.png)  
![](/img/posts/2021/04/28/Reporte3.png)   
![](/img/posts/2021/04/28/Reporte4.png)  

De esta manera logramos colocar en el buscador el reporte con denominaciones distintas para facilitar la búsqueda.  

¡Espero resulte útil!