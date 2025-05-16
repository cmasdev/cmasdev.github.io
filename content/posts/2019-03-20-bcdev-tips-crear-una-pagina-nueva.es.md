---
layout: post
title: "BCDEV Tips: Crear una página nueva"
author: "Christian Amado"
date: 2019-03-20 20:50:54 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En esta entrada explicaré cómo crear una página para que utilice la tabla que hemos creado en la [entrada anterior](/2019/03/bcdev-tips-crear-una-tabla-nueva/). También, hemos visto en este blog una [entrada que trataba sobre la creación de una extensión de página](/2019/02/bc-dev-tips-crear-extension-de-pagina-con-visual-studio-code/).

<!--more-->

1. Generamos la página con los siguientes campos:
```
page 50100 NuevaPagina
{
    PageType = Card;
    SourceTable = NuevaTabla;

    layout
    {
        area(content)
        {
            group(General)
            {
                field(Numero; Numero)
                {
                    ApplicationArea = All;
                    Caption = 'Numero';

                    trigger OnValidate()
                    begin
                        if Numero < 1 then
                            FieldError(Numero, 'El número debe ser mayor que 1')
                    end;
                }

                field(Nombre; Texto)
                {
                    ApplicationArea = All;
                }
            }
        }
    }
}
```
3. Publicamos la página desde el Visual Studio Code.
4. Veremos la página que apunta a la nueva página y tablas creadas:  
![](/img/posts/migrated/2019/02/1-3.png)  

De esta manera, hemos creado una página nueva según la necesidad.