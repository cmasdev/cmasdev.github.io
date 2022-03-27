---
layout: post
title: "Business Central: Funciones recursivas en AL"
author: Christian Amado
date: 2022-02-16 09:12:07 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo se realizan funciones recursivas dentro de Microsoft Dynamics 365 Business Central con el lenguaje de programación AL.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Como en cualquier lenguaje de programación tenemos funciones recursivas que pueden ser utilizadas dentro del lenguaje AL.  

En este ejemplo, haremos la [serie Fibonacci](https://es.wikipedia.org/wiki/Sucesi%C3%B3n_de_Fibonacci), tan común en el mundo de la programación.  

En alguna página vamos a escribir el siguiente código:
```
pageextension 50102 CustomerListExt extends "Customer List"
{
    trigger OnOpenPage()
    var
        Contador: Integer;
        Texto: Text;
    begin
        Texto := '';
        Contador := 0;
        while Contador < 10 do begin
            Texto += Format(Fibonacci(Contador)) + ' ';
            Contador += 1;
        end;
        Message(Texto);
    end;

    procedure Fibonacci(numero: integer): integer
    var
        resultado: integer;
    begin
        if numero = 0 then
            exit(0)
        else
            if numero = 1 then
                exit(1)
            else begin
                exit(fibonacci(numero - 1) + fibonacci(numero - 2));
            end;
    end;
}
```

Para este ejemplo, la función Fibonacci es recursiva porque se llama a sí misma indefinidamente.

El resultado queda de la siguiente manera en Microsoft Dynamics 365 Business Central.  
![](/img/posts/2022/02/16/Recursivo1.png)  

¡Espero resulte útil!