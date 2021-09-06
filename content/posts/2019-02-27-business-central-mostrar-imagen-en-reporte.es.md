---
layout: post
title: "Business Central: Mostrar imagen en reporte"
author: "Christian Amado"
date: 2019-02-27 21:35:18 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En esta entrada mostraré cómo mostrar imagen en un reporte. En la [entrada anterior](/2019/02/bcdev-tips-crear-un-reporte-nuevo/), hemos visto cómo crear un nuevo reporte en Dynamics 365 Business Central.

En esta parte, veremos cómo agregar una imagen en el reporte. De manera similar a [esta entrada](/2019/01/nav-mostrar-imagen-dentro-de-un-reporte/) donde mostrábamos cómo hacerlo en Dynamics NAV.

Aquí muestro los pasos para agregar la imagen en el reporte:

<!--more-->

1. Agregar el campo de imagen desde la tabla "Company Information":
```
report 50100 D365ReporteNuevo
{
    DefaultLayout = RDLC;
    RDLCLayout = 'ReporteNuevo.rdl';

    dataset
    {
        dataitem(SalesInvoiceHeader; "Sales Invoice Header")
        {
            column(Cliente; "Bill-to Customer No.")
            {

            }
            column(Logo; CompanyInformation.Picture)
            {

            }
        }
    }

    var
        CompanyInformation: Record "Company Information";
}
```
3. Agregamos los triggers del reporte y del dataItem:
```
report 50100 D365ReporteNuevo
{
    DefaultLayout = RDLC;
    RDLCLayout = 'ReporteNuevo.rdl';

    dataset
    {
        dataitem(SalesInvoiceHeader; "Sales Invoice Header")
        {
            column(Cliente; "Bill-to Customer No.")
            {

            }
            column(Logo; CompanyInformation.Picture)
            {

            }

            trigger OnAfterGetRecord()
            begin
                CompanyInformation.CalcFields(Picture);
            end;
        }
    }

    trigger OnPreReport()
    begin
        CompanyInformation.Get();
    end;

    var
        CompanyInformation: Record "Company Information";
}
```
5. Abrimos el reporte generado y agregamos el objeto imagen.

De esta manera, hemos agregado la imagen al reporte en Dynamics 365 Business Central.