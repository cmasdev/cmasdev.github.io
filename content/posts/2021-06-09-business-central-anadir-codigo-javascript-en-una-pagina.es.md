---
layoyt: post
title: "Business Central: Añadir código JavaScript en una página"
author: Christian Amado
date: 2021-06-09 15:12:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central, HTML, JavaScript]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

La semana pasada vimos como inyectar HTML en una página dentro de Microsoft Dynamics 365 Business Central. Hoy veremos cómo agregar código Javascript que muestre una ventana de confirmación y luego muestre una alerta. Ya dá para empezar...

<!--more-->
*<font size="2">Versión: 2020 Wave 2 (KID: 5001735)</font>*

Vamos a retomar el código que escribimos en el archivo **js/script.js** para poder realizar la acción allí:
```
function ClickMe()
{
    let nombre = prompt("Por favor, ingresa tu nombre", "");

    alert('Tu nombre es: '+ nombre);
}
```
En la página de Microsoft Dynamics 365 Business Central haremos la llamada al script en cuestión:
```
usercontrol(html; Html)
{
    ApplicationArea = All;
    trigger HacerAlgo()
    var
        htmlText: Text;
    begin
        htmlText := '<button type="button" onclick="ClickMe()">Click Me!</button>';

        CurrPage.html.Render(htmlText);

    end;
}
```
De esta manera veremos el resultado según los siguientes pasos:  
![](/img/posts/2021/06/09/JS1.png)  

![](/img/posts/2021/06/09/JS2.png)  

![](/img/posts/2021/06/09/JS3.png)  

Así logramos realizar acciones con JavaScript desde una página en Microsoft Dynamics 365 Business Central. También podemos realizar tareas complejas como llamadas a APIs, AJAX, etc.

¡Espero resulte útil!