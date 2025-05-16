---
layout: post
title: "BC DEV Tips: Crear extensión de página con Visual Studio Code"
author: "Christian Amado"
date: 2019-02-07 18:10:20 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este Tip, mostraré cómo crear extensiones de página en Dynamics 365 Business Central, utilizando Visual Studio Code, como de costumbre. Este Tip sigue la [secuencia anterior.](/2019/02/bc-dev-tips-crear-extension-de-tabla-con-visual-studio-code/)

Aquí coloco el código necesario para crear la página extendida de "Company Information", para este ejemplo:

<!--more-->

Antes de la extensión (vista Web):  
![](/img/posts/migrated/2019/02/1-1.png)  

Después de la extensión (vista Web):  
![](/img/posts/migrated/2019/02/2-1.png)  

![](/img/posts/migrated/2019/02/3.png)  

![](/img/posts/migrated/2019/02/3.5.png)  

Si la página está mal direccionada veremos un error como este:  
![](/img/posts/migrated/2019/02/4.png)  

Se corrige cambiando la variable de inicio en _launch.json_

Y por último aquí está la extensión de página con sus respectivos comentarios:
```
//Creamos la extensión de página
pageextension 50110 PageCompanyInformationExt extends "Company Information"
{
    //Generamos el diseño...
    layout
    {
        //Agregamos los campos necesarios al final de algún grupo existente
        addlast(General)
        {
            //agregar el campo en cuestión
            field(HabilitacionDocumentos; HabilitarDocumentosPY)
            {
                //Completar sus propiedades
                ApplicationArea = All;
                Caption = '¿Documentos PY habilitados?';
                Enabled = true;
            }
        }

        //Modificar algún campo existente
        modify("Address")
        {
            Caption = 'Dirección de Paraguay';
        }
    }

    //Generar las acciones
    actions
    {
        //Agregar la acción en alguna sección existente
        addlast(Creation)
        {
            //Crear un grupo...
            group(Paraguay)
            {
                //Agregar una acción dentro del grupo
                Action(Habilitar)
                {
                    //Colocar sus propiedades
                    ApplicationArea = All;
                    Caption = 'Habilitar!';

                    //Generar el código para la acción (clic o touch)
                    trigger OnAction();
                    begin
                        Message('Los documentos, ¿están habilitados? ' + Format(HabilitarDocumentosPY));
                    end;
                }
            }
        }
    }
}
```
De esta manera, logramos agregar más campos a la página "Company Information" sin modificarla nativamente y mostrando/ocultando botones. Nos encargamos de desarrollar sobre los objetos extendidos, tal como lo hicimos con la [tabla extendida](/2019/02/bc-dev-tips-crear-extension-de-tabla-con-visual-studio-code/).