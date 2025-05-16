---
layout: post
title: "Business Central: Mostrar página en el buscador"
author: Christian Amado
date: 2021-05-20 20:07:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En esta ocasion quisiera mostrar cómo agregar una página en el buscador para que sea más sencillo encontrarlo. En un [artículo anterior](https://cmas.dev/posts/2021-04-28-business-central-mostrar-reporte-en-buscador/) vimos cómo mostrar un reporte en dicho buscador. 

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

Aplicamos la definición de la página de la siguiente manera:
```
page 50101 PaginaCustomerCard
{
    Caption = 'Página de Blog';
    PageType = Card;
    SourceTable = Customer;

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

Compilamos y ejecutamos la aplicación y tratamos de buscar "Página de Blog", veremos el buscador de la siguiente manera:  
![](/img/posts/2021/05/20/PageSearch1.png)  

Modificamos la definición de la página y nos quedaría de la siguiente manera:
```
Caption = 'Página de Blog';
PageType = Card;
SourceTable = Customer;
UsageCategory = Documents;
ApplicationArea = All;
AdditionalSearchTerms = 'cmasdev,blog';
```
Volvemos a compilar y ejecutar. Buscamos por la palabra "blog" o "cmasdev" o "página de blog" y obtendremos el resultado deseado:  
![](/img/posts/2021/05/20/PageSearch2.png)  
![](/img/posts/2021/05/20/PageSearch3.png)   
![](/img/posts/2021/05/20/PageSearch4.png)  

De esta manera logramos colocar en el buscador la página con denominaciones distintas para facilitar la búsqueda.  

¡Espero resulte útil!