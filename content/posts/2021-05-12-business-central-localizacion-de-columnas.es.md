---
layout: post
title: "Business Central: Localización de Columnas"
author: Christian Amado
date: 2021-05-12 09:34:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo quiero mostrar como aplicar traducciones de textos en los títulos, en este caso, utilizaremos la página que ya hemos visto anteriormente con el buscador. Resumiendo, localizaremos el término de búsqueda y el título de la página.

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

Normalmente los textos enlazados a las columnas ya se encuentran localizados en la Tabla, pues eso facilita la reutilización en todos los lugares donde hacemos la llamada a la columna de la tabla.  

Aquí mostraré, el detalle de la página que ya utilizamos:
```
page 50101 SimpleCustomerCard
{
    Caption = 'Página de Blog';
    PageType = Card;
    SourceTable = Customer;
    UsageCategory = Documents;
    ApplicationArea = All;
    AdditionalSearchTerms = 'cmasdev,blog';

    layout
    {
        area(content)
        {
            group(General)
            {
                field("No."; "No.")
                {
                    ApplicationArea = All;
                    Caption = 'Hello';

                    trigger OnValidate()
                    begin
                        if "No." < '' then
                            Message('Invalido')
                    end;
                }

                field(Name; Name)
                {
                    ApplicationArea = All;
                }
                field(Address; Address)
                {
                    ApplicationArea = All;
                }
            }
        }
    }
}
```
Para este ejemplo, traduciremos el título de la página y la columna "No.". Al hacer cambio de idioma en el ERP se ajustarán todos los títulos.

En el caso del título quedaría de la siguiente manera:
```
CaptionML = ENU='Blog page',ESP='Página de Blog';
PageType = Card;
SourceTable = Customer;
UsageCategory = Documents;
ApplicationArea = All;
AdditionalSearchTerms = 'cmasdev,blog';
```

Mientras que en la columna quedaría así:
```
field("No."; "No.")
{
    ApplicationArea = All;
    CaptionML = ENU='Code',ESP='Código';

    trigger OnValidate()
    begin
        if "No." < '' then
            Message('Invalido')
    end;
}
```
Compilamos y ejecutamos, vemos que está en el idioma de configuración de Microsoft 365 Business Central:  
![](/img/posts/2021/05/12/Translator1.png)  

Cambiamos a **English (United States)** y vemos de la siguiente manera:  
![](/img/posts/2021/05/12/Translator2.png)  

¡Espero resulte útil!