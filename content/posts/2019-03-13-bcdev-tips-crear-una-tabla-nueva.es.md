---
layout: post
title: "BCDEV Tips: Crear una tabla nueva"
author: "Christian Amado"
date: 2019-03-13 19:34:23 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En esta entrada veremos cómo crear una tabla en Dynamics 365 Business Central con Visual Studio Code. Hemos visto en una [entrada anterior](/2019/02/bc-dev-tips-crear-extension-de-tabla-con-visual-studio-code/), cómo crear una extensión de tabla. Aquí hablamos de crear una tabla, por lo tanto, la diferencia radica en el licenciamiento. Pues en el primer caso no se consumen las tablas de la licencia, en la segunda sí.

Aquí mostraremos los pasos para crear la tabla.

<!--more-->

1. Creamos la tabla con la definición, las columnas y las claves:
```
//Se crea la tabla
table 50100 NuevaTabla
{
    //Agregamos los valores a las propiedades necesarias
    caption = 'Una tabla nueva';
    DataPerCompany = true; //Esto indica si en la base de datos los datos van por empresa

    fields
    {
        field(1; Numero; Integer)
        {
            Description = 'Un número entero';
        }
        field(2; Texto; Text[30])
        {
            Description = 'Un texto cualquiera';
        }
    }
    keys
    {
        key(PrimaryKey; Numero)
        {
            Clustered = TRUE;
        }
    }
}
```
3. Colocamos el trigger para controlar si el nombre tiene más de 5 letras:
```
field(2; Texto; Text[30])
{
    Description = 'Un texto cualquiera';
    trigger OnValidate()
    begin
        if strlen(Texto) < 5 then
            FieldError(Texto, 'El Número debe contener 5 letras como mínimo.');
    end;
}
```
Con estos sencillos pasos hemos creado una nueva tabla en Dynamics 365 Business Central. En otra entrada utilizaremos esta tabla y la probaremos en el cliente Web.