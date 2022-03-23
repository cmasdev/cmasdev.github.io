---
layout: post
title: "Business Central: Mostrar números enteros como Requerido "
author: Christian Amado
date: 2021-09-29 23:53:10 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo indicar que un campo es requerido y realizar el control pertinente en Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Vamos a utilizar la página **Cliente** para poder ver el cambio que deseamos ingresar. Teniendo en cuenta el siguiente código:
```
pageextension 50100 CustomerExt extends "Customer Card"
{
    layout
    {
        addafter(Blocked)
        {
            field(Numero; numeroEntero)
            {
                ApplicationArea = All;
                Caption = 'Cedula de Identidad';
                ShowMandatory = true;
            }
        }
    }

    var numeroEntero : Integer;
}
```
Con esto, logramos marcar el campo como requerido (es decir, coloca un * de color rojo en el campo en cuestión). Quedando así:  
![](/img/posts/2021/09/29/Mandatory1.png)  

Pero, definitivamente necesitamos darle más forma y permitir controlarlo más profundamente:
1. No permitir blancos.
2. Poner rangos entre 1.000.000 y 6.000.000 por ejemplo.

De esta manera, nuestro código quedaría así:
```
pageextension 50100 CustomerExt extends "Customer Card"
{
    layout
    {
        addafter(Blocked)
        {
            field(Numero; numeroEntero)
            {
                ApplicationArea = All;
                Caption = 'Cedula de Identidad';
                ShowMandatory = true;

                NotBlank = true;
                BlankZero = true;
                MinValue = 1000000;
                MaxValue = 6000000;
            }
        }
    }

    var
        numeroEntero: Integer;
}
```

Con este código veremos, primero la validación y luego el procesamiento correcto del mismo:  ![](/img/posts/2021/09/29/Mandatory2.png)  

![](/img/posts/2021/09/29/Mandatory3.png)  

¡Espero resulte útil!