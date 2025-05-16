---
layout: post
title: "Business Central: Consumir API externa para integración"
author: "Christian Amado"
date: 2021-06-23 23:02:42 -04:00
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo muestro cómo consumir una API REST desde cualquier servicio hacia Microsoft Dynamics 365 Business Central con muy pocas líneas de código. Hagamos la prueba...

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

Lo primero que debemos hacer es tener una API REST funcional. Para este caso utilizo [esta prueba](https://reqbin.com/req/nfilsyk5/get-request-example) que es pública. Así que intentaremos obtener el mismo resultado en un cuadro de mensaje en una página de Microsoft Dynamics 365 Business Central.  

Ahora, debemos escribir el siguiente código, en un botón de la página por ejemplo:
```
trigger OnAction()
var
    clienteHttp: HttpClient;
    respuesta: HttpResponseMessage;
    resultado: Text;
    funciona: Boolean;
begin
    clienteHttp.Get('https://reqbin.com/echo', respuesta);

    //Leer el contenido de la respuesta desde la URL
    funciona := respuesta.Content().ReadAs(resultado);

    if not funciona then
        Error('No funciona la API');

    //Imprimimos el resultado si todo funciona correctamente
    Message(FORMAT(resultado));
end;
```
De esta manera, nuestro código final en la página quedaría:
```
page 50101 SimpleCustomerCard
{
    CaptionML = ENU = 'Blog page', ESP = 'Página de Blog';
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
                    CaptionML = ENU = 'Code', ESP = 'Código';

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

    actions
    {
        area(Navigation)
        {
            action(NewAction)
            {
                ApplicationArea = All;
                Caption = 'Probar API';

                trigger OnAction()
                var
                    clienteHttp: HttpClient;
                    respuesta: HttpResponseMessage;
                    resultado: Text;
                    funciona: Boolean;
                begin
                    clienteHttp.Get('https://reqbin.com/echo', respuesta);

                    //Leer el contenido de la respuesta desde la URL
                    funciona := respuesta.Content().ReadAs(resultado);

                    if not funciona then
                        Error('No funciona la API');

                    //Imprimimos el resultado si todo funciona correctamente
                    Message(FORMAT(resultado));
                end;
            }
        }
    }
}
```
Seguimos los siguientes pasos para la prueba:  
1. Clic en *Relacionado* > *Probar API*  
![](/img/posts/2021/06/23/Api1.png)  

2. Esperamos el resultado y...  
![](/img/posts/2021/06/23/Api2.png)  

De esta manera hemos consumido un REST API con el método predeterminado GET.

¡Espero les resulte útil!