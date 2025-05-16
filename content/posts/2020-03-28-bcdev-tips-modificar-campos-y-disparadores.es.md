---
layout: post
title: "BCDEV Tips: Modificar campos y disparadores"
author: "Christian Amado"
date: 2020-03-28 14:54:57 -04:00
categories: [Aplicaciones de negocio]
tags: [AL,Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Dynamics 365 Business Central trajo consigo muchos cambios novedosos. En la empresa donde trabajo estamos implementando uno y nos encontramos con un tema no menor: ¡No podemos modificar el trigger de una tabla!  

Es decir, no podemos modificar el código nativo de un objeto en Dynamics 365 Business Central ¿Por qué? Porque Microsoft quiere que utilicemos extensiones, no que modifiquemos el código nativo a placer poniendo en riesgo la seguridad y/o integridad del producto.  

<!--more-->

Primeramente debemos crear una extensión de tabla (por ejemplo, extensión de la tabla **CompanyInformation**):  
```
tableextension 50100 "Company Information Ext." extends "Company Information"
{
    fields
    {
    }
}
```
Luego agregamos las siguientes líneas de código:  
```
tableextension 50100 "Company Information Ext." extends "Company Information"
{
    fields
    {
        modify("VAT Registration No.")
        {
            Caption = 'RUC';
        }
   }
}
```
Y ahora, agregaremos el trigger de validación del campo (debe ser antes o despues) en cuestión para hacerlo oblgatorio:  
```
tableextension 50100 "Company Information Ext." extends "Company Information"
{
    fields
    {
        modify("VAT Registration No.")
        {
            Caption='RUC';
            trigger OnAfterValidate()
            {
                //Si queremos realizar una acción después de la validación escribimos código aquí
                if "VAT Registration No." = '' then
                  ERROR('Debe ingresar el RUC de la empresa');
            }

            trigger OnBeforValidate()
            {
                //Si queremos realizar una acción antes de la validación escribimos código aquí
            }
        }
   }
}
```
¡Espero que resulte útil!
