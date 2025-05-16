---
layout: post
title: "Business Central: Utilizar manejador de eventos en reportes"
author: Christian Amado
date: 2020-04-23 21:12:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En el [artículo anterior](http://cmas.dev/2020/04/business-central-utilizar-manejador-de-eventos/), hemos visto los conceptos relacionados a eventos dentro del Business Central. En esta ocasión veremos cómo utilizar manejador de eventos en reportes en Business Central. Este artículo es más rápido que el anterior porque sólo se deben tener en cuenta ciertas cosas.

Hemos visto en una [entrada anterior](http://cmas.dev/2019/02/bc-dev-tips-crear-extension-de-reporte-con-visual-studio-code/), que los reportes no pueden ser extendidos. De esta manera quedamos limitados a la hora de generar reportes dentro del Business Central. Pero debemos tener en cuenta algunos puntos:

<!--more-->

*   Si el diseño del reporte no cambia, podemos utilizar el manejador de eventos del reporte para cambiar alguna lógica dentro del mismo.
*   Si el diseño del reporte cambia, debemos crear una copia del reporte y hacer la llamada a éste.

Leído lo anterior vamos a proceder a ver cómo realizaríamos la solución al primer punto mencionado arriba. Así que aquí vamos:

Buscamos el reporte en cuestión y verificamos que **DataItem** tiene asignados. Esto resulta necesario porque debemos saber exactamente a qué evento debemos suscribirnos para cambiar la lógica.

En este caso utilizaremos el reporte **"Calculate Depreciation"**. Dicho reporte tiene un publicador de eventos que se denomina **OnAfterCalculateDepreciation** y es a éste evento que debemos suscribirnos.
```
[EventSubscriber(ObjectType::Report, Report::"Calculate Depreciation", 'OnAfterCalculateDepreciation', '', true, true)]
local procedure CalculateDepreciation_OnAfterCalculateDepreciation(FANo: Code[20]; var TempGenJournalLine: Record "Gen. Journal Line"; var TempFAJournalLine: Record "FA Journal Line"; var DeprAmount: Decimal; var NumberOfDays: Integer; DeprBookCode: Code[10]; DeprUntilDate: Date; EntryAmounts: array[4] of Decimal; DaysInPeriod: Integer)
begin
    //Aqui realizamos la acción necesaria sobre cualquiera de las variables que se recibe como parámetro.    
end;
```
De esta manera hemos visto cómo utilizar manejador de eventos en reportes en Business Central siempre y cuando no involucre un cambio en el diseño del mismo.