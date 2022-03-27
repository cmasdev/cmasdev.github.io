---
layout: post
title: "Business Central: Try…Catch en AL"
author: Christian Amado
date: 2022-02-23 19:37:11 -0400
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo emular un Try...Catch en Microsoft Dynamics 365 Business Central pues tal método no existe en AL y debemos emularlo.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

Vamos a programar algo que sabemos que está mal:
```
trigger OnOpenPage()
    var numero1 : integer;
        numero2 : integer;
    begin
        numero1 := 10;
        numero2 := 0;

        Message(Format(numero1/numero2);
    end;
```
Evidentemente, esto produce un error del tipo **No se puede dividir por cero**:  
![](/img/posts/2022/02/23/Try1.png)  

Para evitar esto debemos agregar un método que realice la acción y adornar el método con el atributo **TryFunction**:
```
[TryFunction]
    local procedure ControlError(numero:integer)
    begin
        if (numero = 0) then
            Error('la division por cero no esta permitida');
    end;
```

Entonces, nuestro procedimiento quedaria así:
```
pageextension 50102 CustomerListExt extends "Customer List"
{
    trigger OnOpenPage()
    var
        numero1: integer;
        numero2: integer;
    begin
        numero1 := 10;
        numero2 := 0;

        if ControlError(numero2) then
            Message(Format(numero1 / numero2))
        else
            Error('Hubo un error en el proceso');        
    end;

    [TryFunction]
    local procedure ControlError(numero:integer)
    begin
        if (numero = 0) then
            Error('la division por cero no esta permitida');
    end;
}
```
El resultado final, para nuestro ejemplo, seria:   
![](/img/posts/2022/02/23/Try2.png)   

La diferencia es que en este último caso, por más que haya error podemos seguir utilizando el sistema y no queda en estado inválido.

¡Espero resulte útil!