---
layout: post
title: "Business Central: Obtener versión de extensión"
author: Christian Amado
date: 2021-04-02 10:28:14 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo explico cómo se puede obtener la versión de la extensión que desarrollamos de manera a poder mostrarlo en algún lugar.

El código es muy simple (y no es mío)...

<!--more-->
*<span style="font-size: 8pt;">Versión: 2020 Wave 2 (KID: 5001735)</span>*  

Básicamente escribimos la siguiente función:
```
local procedure ObtenerVersion(): Text
    var
        infoModule: ModuleInfo;
        appVersion: Version;
    begin
        NavApp.GetCurrentModuleInfo(infoModule);
        appVersion := infoModule.AppVersion();
        exit(Format(appVersion));
    end;
```

Y nos quedaría así:
```
pageextension 50100 CustomerListExt extends "Customer List"
{
    trigger OnOpenPage();
    begin
        Message('Hola soy la version' + ObtenerVersion());
    end;

    local procedure ObtenerVersion(): Text
    var
        infoModule: ModuleInfo;
        appVersion: Version;
    begin
        NavApp.GetCurrentModuleInfo(infoModule);
        appVersion := infoModule.AppVersion();
        exit(Format(appVersion));
    end;
}
```

De esta manera, obtenemos la version de la extensión que se está ejecutando (la versión se coloca en el archivo **app.json**).   
![](/img/posts/2021/04/02/VersionExtension1.png)

*<span style="font-size: 8pt;">Código creado por [Teddy H](https://community.dynamics.com/members/teddyh "Teddy Herryanto")</span>* 