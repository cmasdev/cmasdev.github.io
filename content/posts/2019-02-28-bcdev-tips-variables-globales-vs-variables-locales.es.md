---
layout: post
title: "BCDEV Tips: Variables globales vs Variables locales"
author: "Christian Amado"
date: 2019-02-28 18:54:31 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central,Visual Studio Code]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En esta entrada quiero mostrar la diferencia entre las variables globales y las locales para el desarrollo de Dynamics 365 Business Central. Recordemos que a partir de esta versión ya no tendremos disponible el entorno de desarrollo que teníamos en Dynamics NAV.

Ahora, debemos utilizar Visual Studio Code para el desarrollo en Dynamics 365 Business Central. Por eso, aquí demostraré 3 cosas:

<!--more-->

- Declarar variables globales: las cuales permiten que una variable pueda ser utilizada dentro del ámbito general del objeto que estamos utilizando.
- Declarar un método o procedimiento dentro del objeto.
- Declarar variables locales dentro del método.

Empezamos con los ejemplos:

La variable **HabilitarCampo** en este caso es Global porque se declara fuera de cualquier método:
```
//Creamos la extensión de tabla
tableextension 50100 CompanyInformationExt extends "Company Information"
{
    //Creamos los campos de la tabla
    fields
    {
        //Campo "Habilitar documentos legales Paraguay"
        field(50000; HabilitarDocumentosPY; Boolean)
        {
            //Agregamos el evento de validación.
            //Aquí utilizamos una variable booleana para habilitar campos
            //Name, es el campo nombre de empresa de la Tabla padre.
            trigger OnValidate();
            begin
                HabilitarCampo := HabilitarDocumentosPY;
                Message('El nombre de la empresa es: ' + Name);
            end;
        }

    }

    //Esta es una variable Global, que puede utilizarse en las tablas
    //"Company Information" y "Company Information Ext".
    var
        HabilitarCampo: Boolean;
}
```
Bajo la variable declaramos el método o procedimiento para realizar alguna tarea:
```
local procedure Saludar()
begin
    Message('Hola desde metodo');
end;
```
Por último declaramos la variable local:
```
local procedure Saludar()
begin
    var
        SoyLocal: Integer;
    Message('Hola desde metodo');
end;
```
En este ejemplo creamos la variable local "SoyLocal" que únicamente se puede utilizar dentro del método _Saludar()_

De manera similar que en Dynamics NAV, podemos crear ambos tipos de variables. Al fin y al cabo, todos los lenguajes de programación lo hacen. AL también debe hacerlo.