---
layout: post
title: "Business Central: Extensión de reportes"
author: Christian Amado
date: 2022-03-09 22:12:07 -0400
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo extender reportes en Microsoft Dynamics 365 Business Central para faciltiarnos algunas cosas a la hora de crear reportes.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

En un [artículo anterior](https://cmas.dev/posts/2019-02-12-bc-dev-tips-crear-extension-de-reporte-con-visual-studio-code/) mencionaba que esto no es factible, pero después de leer algunos artículos encontré que ya es factible realizar esto :)  Aplica desde *Microsoft Dynamics 365 Business Central 2021 release wave 1 (v18.0) y superior.  

Las extensiones de informe se basan en un nuevo tipo de objeto en AL. Con este tipo de objeto, podemos ampliar un informe existente de varias maneras diferentes, incluidas las siguientes:

1. Agregar nuevas columnas a los elementos de datos existentes.
2. Agregar nuevos elementos de datos anidados.
3. Agregar columnas para los campos de una tabla de origen, una extensión de tabla, tablas relacionadas, variables, procedimientos o expresiones.
4. Agregar o modificar la página de solicitud (**Request Page**).

Lo que no se puede hacer es ampliar o modificar un diseño existente. Esto lo debemos hacer a través de la página **diseño de informes personalizados**.  

En el ejemplo vemos el cambio:
```
//Se agrega el campo nuevo a la tabla.
tableextension 50110 CustomerTableExt extends Customer
{
    fields
    {
        field(50100; MyField; Integer)
        {
            DataClassification = ToBeClassified;
            
        }
    }
}

//Agregamos la porcion del reporte que falta.
reportextension 50110 MyExtension extends "Customer - Top 10 List"
{
    dataset
    {
        add(Integer)
        {
            // agregar un campo existente de la tabla base al conjunto de datos
            column(fromBaseTable; Customer.GLN) { }

            // agregar campo de la tabla que se extiende "Customer"
            column(fromBaseTableExt; Customer.MyField) { }
        }

        add(Customer)
        {
            // agregar un nuevo campo al conjunto de datos
            column(netWeight; netWeight) { }
        }

        modify(Customer)
        {
            // modificar el nuevo campo agregado
            trigger OnBeforeAfterGetRecord()
            begin
                if (weightInPounds) then begin
                    netWeight := netWeight * 2.2;
                end else begin
                    netWeight := netWeight;
                end;
            end;
        }
    }

    requestpage
    {
        layout
        {
            addafter(Show)
            {
                // agregar campo desde la extensión de la tabla a la página de solicitud
                field(fromBaseTableExt; Customer.myField) { }
            }
        }
    }

    var
        netWeight: Integer;
        weightInPounds: Boolean;
}
```
*[El código fue tomado del sitio oficial de Microsoft](https://docs.microsoft.com/es-es/dynamics365/business-central/dev-itpro/developer/devenv-report-ext-object)*

Podemos compilar y ejecutar la extensión para que los cambios tengan el efecto deseado.  

Por útlimo, cambiamos el diseño del reporte (con los nuevos cambios si es requerido) en la página **Diseño de informes personalizados**  

¡Espero resulte útil!