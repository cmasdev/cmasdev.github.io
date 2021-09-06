---
layout: post
title: "BCDEV Tips: Modificar funciones base"
author: "Christian Amado"
date: 2020-03-27 19:49:50 -04:00
categories: [Aplicaciones de negocio]
tags: [AL,Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Supongamos que deseamos validar que un cheque no pueda ser anulado por algún motivo. Nativamente Business Central no tiene esta funcionalidad, entonces lo más lógico es agregar código al CodeUnit 367 "Check Management" para agregar toda la funcionalidad requerido.  

## ¿El problema?  

En Dynamics 365 Business Central no se pueden modificar los CodeUnits de la aplicación base ni se pueden crear extensiones de CodeUnits. 

<!--more--> 

¿La solución? Se deben utilizar los eventos disponibles en los CodeUnits para poder realizar acciones que son necesarias en la lógica de nuestra aplicación. Mas información [aquí](https://docs.microsoft.com/es-es/dynamics365/business-central/dev-itpro/developer/devenv-events-in-al) (en inglés).  

Como ya vimos en una entrada anterior, debemos hacer uso de la extensión de Visual Studio Code que se llama **AL Object Designer** y buscar el codeunit necesario:  
![](/img/posts/migrated/2020/03/1-4.png)  

![](/img/posts/migrated/2020/03/2-4.png)  

Buscamos el lugar donde deberíamos ingresar nuestro código personalizado: Encontramos la línea 151 en adelante... Pero código no se puede escribir. Es ahí donde encontramos el publicador de eventos **OnBeforeFinancialVoidCheck(CheckLedgEntry);** y debemos suscribirnos a él.  

Utilizaremos un codeunit creado por nosotros (donde irían todas las suscripciones de eventos) para luego ser utilizado:  
```
codeunit 50000 CmasDev
{
    [EventSubscriber(ObjectType::Codeunit, Codeunit::CheckManagement, 'OnBeforeFinancialVoidCheck', '', true, true)]
    procedure ValidarAnulacionCheque(var CheckLedgerEntry: Record "Check Ledger Entry")
    begin
        if CheckLedgerEntry."Check No." = '' then
            Error('Debe tener un número de cheque');
    end;
}
```
Por último lanzamos el evento donde sea necesario utilizando el código:  
```
begin
   codeun.ValidarAnulacionCheque(CheckLedgeEntry);
end;

var codeun : Codeunit CmasDev;
```
¡Espero resulte útil!
