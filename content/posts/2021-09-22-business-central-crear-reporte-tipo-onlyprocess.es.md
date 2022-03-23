---
layout: post
title: "Business Central: Crear reporte de tipo OnlyProcess"
author: Christian Amado
date: 2021-09-22 13:48:03 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo crear procesos dentro de Microsoft Dynamics 365 Business Central para poder realizar tareas de cualquier índole. Normalmente mente este tipo de procedimientos nos ayudar a realizar tareas masivas de algún tipo.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

En este artículo modificaremos datos de Movimientos de clientes. Inicialmente la grilla se ve asi:  
![](/img/posts/2021/09/22/Process1.png)  

Agregamos el reporte con el siguiente código:
```
report 50100 ReporteBlog
{
    Caption = 'Reporte de prueba';
    UsageCategory = Tasks;
    ProcessingOnly = true;
    Permissions = tabledata 21 = rimd;

    dataset
    {
        dataitem(MovimientoClientes; "Cust. Ledger Entry")
        {
            //Por cada elemento del dataitem
            trigger OnAfterGetRecord()
            begin
                //Modificamos el campo en cuestion
                MovimientoClientes."IC Partner Code" := 'PRUEBA';
                //Explicitamente llamamos al metodo modificar
                MovimientoClientes.Modify();
            end;

            trigger OnPostDataItem()
            begin 
                //Preservamos los datos en la base de datos. Solo al final del reporte
                Commit();

                Message('Se procesó el cambio correctamente');
            end;
        }
    }
}
```
Ejecutamos el reporte:  
![](/img/posts/2021/09/22/Process2.png)  

Completamos algún filtro (en este caso, los movimientos pendientes del cliente):  
![](/img/posts/2021/09/22/Process3.png)  

Luego de completarse el código del reporte veremos el mensaje que colocamos:  
![](/img/posts/2021/09/22/Process4.png) 

Al ejecutar el reporte se procesará el mismo, no va mostrar ningún reporte de manera visual, solo va procesar lo que dijimos que procese.  
![](/img/posts/2021/09/22/Process5.png)  

¡Espero resulte útil!