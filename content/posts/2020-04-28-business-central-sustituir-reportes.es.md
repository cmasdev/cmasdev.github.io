---
layout: post
title: "Business Central: Sustituir reportes"
author: Christian Amado
date: 2020-04-28 22:53:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En el [artículo anterior](http://cmas.dev/2020/04/business-central-utilizar-manejador-de-eventos-en-reportes/), vimos cómo suscribirnos a eventos de un reporte sin poder modificar diseño. En este artículo, veremos cómo sustituir reportes en Business Central.

Por ejemplo, necesitamos hacer cambios en el diseño del reporte y también en la funcionalidad para satisfacer las necesidades que pueda tener nuestro cliente. Entonces, procedemos a sustituir el reporte nativo por el reporte personalizado. Lo hacemos suscribiéndonos al evento **OnAfterSubstituteReport** del CodeUnit **ReportManagement**.

<!--more-->

Es importante aclarar que TODOS los reportes llaman a este método indefectiblemente. Eso hace que podamos cambiar el reporte y procesarlo según la necesidad.
```
[EventSubscriber(ObjectType::Codeunit, Codeunit::ReportManagement, 'OnAfterSubstituteReport', '', false, false)]
local procedure OnSubstituteReport(ReportId: Integer; var NewReportId: Integer)
begin
    //Reporte Cheque
    if ReportId = Report::Check then
        NewReportId := Report::ChequePY;
end;
```
En el ejemplo de arriba vemos que buscamos el reporte que corresponde al cheque nativo del Business Central y ahora lo debemos cambiar por el cheque estándar que se utiliza en Paraguay.

De esta manera, logramos sustituir reportes en Business Central utilizando este suscriptor de eventos.