---
layout: post
title: "DataItem Temporal en Reporte"
author: "Christian Amado"
date: 2020-02-26 20:19:52 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En una [entrada anterior](/2019/06/nav-dataitem-temporal-en-reporte/), hemos visto cómo realizar esta tarea desde Dynamics NAV 2018. Ahora toca el turno de verlo cómo se hace en Business Central.  

Dentro del mundo de desarrollo de Microsoft Dynamics existen limitaciones, por ejemplo, sólo se pueden crear hasta 10 tablas (luego se deben comprar más tablas si se desea seguir desarrollando). Es por eso, que muchas veces necesitamos procesar el resultado de una tabla existente dentro de la misma tabla, pero haciéndola temporal sólo para emitir un reporte.  

<!--more-->

En ese caso, debemos procesar lo necesario en un paso previo y pasar los datos temporales al reporte que posee como DataItem una tabla temporal. En este ejemplo intentaremos hacer un "análisis de saldo por proveedor".  

Creamos el reporte desde Visual Studio Code utilizando el lenguaje AL y lo definimos de la siguiente manera:  
```
report 50000 CmasBlog
{
    Caption='Saldo por año por proveedor';
    DefaultLayout = RDLC;
    //RDLCLayout = 'Prueba.rdl';
    dataset
    {
        dataitem(Vendor; Vendor)
        {            
            column(VendorName; Name){
                Caption='Nombre';
            }
            column(VendBalanceDue_1; Vendor."Balance Due"){
                Caption='Vencimiento';
            }
            column(VendBalanceDue_2; Vendor."Balance Due"){
                Caption='Vencimiento';
            }
        }
        dataitem(Integer; Integer)
        {
            DataItemTableView= sorting(Number) where(Number=filter(1..));         
            column(VendorName2; Vendor.Name){
                Caption='Nombre';
            }
            trigger OnAfterGetRecord()
            begin
                if Number = 1 then
                    Vendor.Find('-')
                else
                    if Vendor.Next = 0 then
                        CurrReport.Break;
            end;

        }
    }
}
```
Debemos tener en cuenta, que se asume que el **Record** que se está pasando al reporte es una tabla temporal. Para este caso, la tabla ya viene procesada con los datos filtrados según nuestras necesidades.  

¡Espero resulte útil!
