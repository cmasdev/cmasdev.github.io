---
layout: post
title: "Business Central: Locktable y Commit"
author: Christian Amado
date: 2021-07-21 07:29:48 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré la utilidad de dos métodos muy importantes a la hroa de transaccionar con base de datos pero dentro de Microsoft Dynamics 365 Business Central.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Primero, veamos qué hace cada método o función:
1. **Locktable**: Bloquea el registro en una tabla para protegerla de las transacciones de escritura que entran en conflicto entre sí.
2. **Commit**: Finaliza la transacción de escritura actual.

Un error muy común es utilizar el primero sin el segundo. ¿Qué problema causa esto? - Bloquea el servicio de Microsoft Dynamics 365 Business Central porque la base de datos queda esperando la confimación de una transacción.

Vemos un ejemplo:
```
CustLedgEntry.Reset;
CustLedgEntry.SetRange("Document No.", YOURNUMBER);
if CustLedgEntry.FindFirst() then begin
    CustLedgEntry.Locktable();
    CustLedgEntry.SomeField := CHANGEDVALUE;
    CustLedgEntry.Modify();

    //Sin esta linea se bloquea todo el trabajo. Solucion: Reinicio de servicio BC.
    COMMIT;
end;
```
¡Espero resulte útil!
