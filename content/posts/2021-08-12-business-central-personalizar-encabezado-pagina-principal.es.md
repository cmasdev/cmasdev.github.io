---
layout: post
title: "Business Central: Personalizar el encabezado de la página principal"
author: Christian Amado
date: 2021-08-12 12:25:36 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo personalizar el título de la página principal dentro de Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Esta funcionalidad, permite agregar cualquier elemento que necesitemos para dar una buena primera impresión en la página principal.  

El control que siempre está consiste en el saludo dependiendo de la hora del sistema.  
![](/img/posts/2021/08/12/Title1.png)

Aquí agregaremos otro control con el siguiente código:
```
pageextension 50104 NuevoTitulo extends "Headline RC Business Manager"
{
    layout
    {        
        addafter(Control2)
        {
            field(nuevoTexto;texto)
            {
                ApplicationArea = All;                
            }
        }
    }

    var
        texto: Text;

    trigger OnOpenPage()
    begin
        //Set Headline text           
        texto := '¡Soy el nuevo texto de la página principal!';
    end;

}
```

El resultado queda así:  
![](/img/posts/2021/08/12/Title2.png)

¡Espero resulte útil!