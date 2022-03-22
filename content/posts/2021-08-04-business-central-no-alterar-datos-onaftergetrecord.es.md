---
layout: post
title: "Business Central: No alterar datos en el método OnAfterGetRecord"
author: Christian Amado
date: 2021-08-04 08:19:05 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo demuestro por qué no debemos alterar (insertar, modificar o eliminar) datos dentro del método de obtención de datos para una grilla en Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Resulta que el trigger **OnAfterGetRecord** se utiliza para obtener datos, además estos datos se van cargando a medida que el usuario navega a través de la grilla. Cuando hace scroll hacia arriba o hacia abajo los datos se van cargando. No necesariamente se cargan TODOS los datos de la tabla al momento de mostrar la grilla.

La vista de Clientes se ve asi al comienzo:  
![](/img/posts/2021/08/04/GetRecord1.png) 

Veamos el siguiente código:
```
trigger OnAfterGetRecord()
begin
    Rec."Responsibility Center" := 'Test';
end;
```
Esto no es recomendable porque asignamos un valor a un campo directo en la base de datos. Pero si le agregamos esto:
```
trigger OnAfterGetRecord()
begin
    Rec."Responsibility Center" := 'Test';
    Modify();
end;
```  
![](/img/posts/2021/08/04/GetRecord2.png) 
Aquí sí ya tenemos un grave problema, pues por cada registro hará un modificar innecesario.

## Solución
Básicamente, utilizar una variable local y asignar su valor a un nuevo campo.
```
pageextension 50100 CustomerListExt extends "Customer List"
{
    layout
    {
        addbefore("Responsibility Center")
        {
            field(responsabilidad; textoResponsabilidad)
            {
                ApplicationArea = All;
                Caption = 'Centro de responsabilidad';
            }
        }
    }

    trigger OnAfterGetRecord()

    begin
        textoResponsabilidad := 'Test';
    end;

    var
        textoResponsabilidad: Text;
}
```
De esta manera logramos mostrar los datos necesarios sin afectarlos en la base de datos. Ahora, si queremos cambiar los datos se utilizan otras técnicas veremos más adelante en este Blog.  
![](/img/posts/2021/08/04/GetRecord3.png) 

¡Espero resulte útil!