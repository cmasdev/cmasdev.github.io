---
layout: post
title: "Business Central: Añadir HTML en una página"
author: Christian Amado
date: 2021-06-02 18:17:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central, HTML, JavaScript]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo deseo mostrar cómo inyectar HTML en una página dentro de Microsoft Dynamics 365 Business Central. No es muy complejo realizar la tarea necesaria pero debemos entender su utilidad y qué podemos lograr haciéndolo. Así que espero lo disfruten...

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

Veremos a continuación que necesitamos una serie de pasos para poder generar un HTML. Para enteder esto debemos tener en claro que inyectar HTML en una página es idéntico a introducir un IFRAME dentro de cualquier sitio HTML.  

Dicho esto, procedemos a realizar los pasos para la inserción de HTML dentro de una página en Microsoft Dynamics 365 Business Central.  

1. Debemos crear un objeto de tipo *ControlAddIn* en nuestro proyecto AL:  
```
usercontrol(html; Html)
{
    ApplicationArea = All;
    trigger HacerAlgo()
    var
        htmlText: Text;
    begin
        //Cargamos los elementos HTML
        htmlText := '<b>Soy un elemento HTML</b> ¿No me crees? <br/>' +
            '<img alt="" src="https://pbs.twimg.com/profile_images/1177530173245317122/PVFFrjO9_400x400.png" />';

        //Llamamos al procedimiento para inyectar el codigo HTML
        CurrPage.html.Render(htmlText);

    end;
}
```
2. Es obligatorio introducir 2 archivos JavaScript en nuestro proyecto AL, los cuales son:  

    2.1 **StartupScript**: Especifica el script que se invoca cuando se carga la página web con el complemento de control.  
    **Archivo js/startup.js**
    ```
    Contenedor = document.getElementById('controlAddIn');

    Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('HacerAlgo', [])
    ```
    2.2 **Script**: Especifica la lista de scripts que se van a incluir en el complemento de control. Los scripts pueden ser archivos locales en el paquete o referencias a archivos externos utilizando el protocolo http o https. Los valores pueden ir separados por comas.  
    **Archivo js/script.js**
    ```
    function Render(html)
    {
        Contenedor.insertAdjacentHTML('beforeend',html);
    }
    ```
3. El código del ControlAddIn quedaría de la siguiente manera:
```
controladdin Html
{
    StartupScript = 'js/startup.js';
    Scripts = 'js/script.js';
    HorizontalStretch = true;
    VerticalStretch = true;
    RequestedHeight = 400;

    event HacerAlgo();

    procedure Render(TextHtml: Text);
}
```
El código completo de la página se vería así:
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

            group(HTMLGroup)
            {
                Caption = 'Elementos HTML';
                usercontrol(html; Html)
                {
                    ApplicationArea = All;
                    trigger HacerAlgo()
                    var
                        htmlText: Text;
                    begin
                        //Cargamos los elementos HTML
                        htmlText := '<b>Soy un elemento HTML</b> ¿No me crees? <br/>' +
                            '<img alt="" src="https://pbs.twimg.com/profile_images/1177530173245317122/PVFFrjO9_400x400.png" />';

                        //Llamamos al procedimiento para inyectar el codigo HTML
                        CurrPage.html.Render(htmlText);

                    end;
                }
            }
        }
    }
}
```
4. El resultado del codigo sería el siguiente:  
![](/img/posts/2021/06/02/Html2.png)  

Con esto logramos inyectar HTML dentro de una página Microsoft Dynamics 365 Business Central.  

¡Espero resulte útil!