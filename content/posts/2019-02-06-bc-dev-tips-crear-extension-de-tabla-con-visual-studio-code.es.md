---
layout: post
title: "BC DEV Tips: Crear extensión de tabla con Visual Studio Code"
author: "Christian Amado"
date: 2019-02-05 23:15:33 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este Tip, mostraré cómo crear extensiones de tablas en Dynamics 365 Business Central, utilizando Visual Studio Code (que ya se ha convertido en mi principal herramienta de desarrollo).

Aquí coloco el código necesario para crear la tabla extendida de "Company Information", para este ejemplo:

<!--more-->

Antes de la extensión (vista SQL Server):  
![](/img/posts/migrated/2019/02/1.png)

Después de la extensión (vista SQL Server):  
![](/img/posts/migrated/2019/02/2.png)

Y por último aquí está la extensión de tabla con sus respectivos comentarios:
```
//Creamos la extensión de tabla
tableextension 50100 CompanyInformationExt extends "Company Information"
{
    //Creamos los campos de la tabla
    fields
    {
        //Campo "Habilitar documentos legales Paraguay"
        field(50000; HabilitarDocumentosPY; Boolean)
        {
            //Agregamos el evento de validación.
            //Aquí utilizamos una variable booleana para habilitar campos
            //Name, es el campo nombre de empresa de la Tabla padre.
            trigger OnValidate();
            begin
                HabilitarCampo := HabilitarDocumentosPY;
                Message('El nombre de la empresa es: ' + Name);
            end;
        }
    }

    //Variable auxiliar para habilitar un campo.
    var
        HabilitarCampo: Boolean;
}
```
De esta manera, logramos agregar más campos a la tabla "Company Information" sin modificarla nativamente. Nos encargamos de desarrollar sobre los objetos extendidos.