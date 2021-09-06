---
layout: post
title: "NAV: Mostrar imagen dentro de un reporte"
author: "Christian Amado"
date: 2019-01-23 18:26:33 -04:00
categories: [Aplicaciones de negocio]
tags: [Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

En esta entrada pretendo mostrar los pasos para poder cargar una imagen dentro de un reporte en Dynamics NAV 2018. No resulta complicado pero sí es un proceso largo para realizar una tarea tan simple.

Los pasos a seguir serían los siguientes:

<!--more-->
1. Nos dirigimos al histórico de facturas de ventas, seleccionamos alguna y hacemos clic en "Imprimir":  
![](/img/posts/migrated/2019/01/1.png)  

2. Hacemos clic en el botón de "Vista previa":  
![](/img/posts/migrated/2019/01/2.png)  

3. Vemos un reporte bastante feo, donde remarco en rojo donde debería figurar el logo:  
![](/img/posts/migrated/2019/01/3.png)  

4. En el entorno de desarrollo de NAV, nos dirigimos al reporte que deseamos modificar:  
![](/img/posts/migrated/2019/01/4.png)  

5. Una vez abierto, hacemos clic derecho y seleccionamos "New":  
![](/img/posts/migrated/2019/01/5.png)  

6. Agreamos el campo "Picture" de la tabla "CompanyInfo" y le ponemos el nombre "Logo" a la variable "Name":  
![](/img/posts/migrated/2019/01/6.png)  

7. Nos dirigimos al código C/AL:  
![](/img/posts/migrated/2019/01/7.png)  

8. Buscamos la llamada al método **GET** de "Company Information":  
![](/img/posts/migrated/2019/01/8.png)  

Agregamos el código necesario dentro del método OnAfterGetRecord del DataItem "Sales Invoice Header":  
```
Sales Invoice Header - OnAfterGetRecord()
//CMASDEV
//Picture es un campo de tipo BLOB y para poder obtenerlo
//debemos llamar al método siguiente que retorna el valor
//desde la base de datos.
CompanyInfo.CALCFIELDS(Picture);
//CMASDEV
...
```
Compilamos y guardamos el código.

9. Abrimos el diseño del reporte, en este caso con "SQL Server Report Designer" y arrastramos el objeto "Image":  
![](/img/posts/migrated/2019/01/9.png)  

10. Completamos las propiedades, guardamos todos (diseñador de reporte y Reporte):  
![](/img/posts/migrated/2019/01/10.png)  

11. Verificamos si tenemos un logo cargado en la página "Company Information":  
![](/img/posts/migrated/2019/01/11.png)  

12. Volvemos al paso Nº 1 e imprimimos el reporte:  
![](/img/posts/migrated/2019/01/12.png)  

Hemos seguido estos sencillos pero tediosos pasos para lograr colocar una imagen dentro de un reporte. La ventaja de esto es que ese logo lo obtenemos para todos los reportes desde el mismo lugar, aplicando la reutilización :P