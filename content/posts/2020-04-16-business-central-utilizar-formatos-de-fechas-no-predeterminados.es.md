---
layout: post
title: "Business Central: Utilizar formatos de fechas no predeterminados"
author: Christian Amado
date: 2020-04-16 19:43:00 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En cualquier lenguaje de programación el tipo de dato más complejo es justamente la fecha. ¿Por qué? Porque las configuraciones regionales hacen que varíe el formato y ahí se presten a confusiones o errores. En este artículo veremos cómo utilizar formatos de fechas no predeterminados.

<!--more-->

## Formatos de fechas predeterminados

En la tabla siguiente se muestran los formatos de fecha estándar con el
entorno regional de un país o región europeo.

|                   Fecha de Europa                   | Formato |    Ejemplo    |
|-----------------------------------------------------|---------|---------------|
|          <Closing><Day,2>-<Month,2>-<Year>          |    0    |   05-04-03    |
|          <Closing><Day,2>-<Month,2>-<Year>          |    1    |   05-04-03    |
|          <Day,2><Month,2><Year><Closing>D           |    2    |    050403D    |
|          <Closing><Year>-<Month,2>-<Day,2>          |    3    |   03-04-05    |
|        <Closing><Day>. <Month Text> <Year4>         |    4    | 5. April 2003 |
|           <Closing><Day,2><Month,2><Year>           |    5    |    050403     |
|           <Closing><Year><Month,2><Day,2>           |    6    |    030405     |
| <Day,2><Filler Character, >. <Month Text,3> <Year4> |    7    |  5. Apr 2003  |
|                     XML format                      |    9    |  2003-04-05   |

En la tabla siguiente se muestran los formatos de fecha estándar con la
configuración regional de inglés (EE. UU.).

|                   Fecha de EE.UU.                   | Formato |    Ejemplo    |
|-----------------------------------------------------|---------|---------------|
|          <Closing><Month,2>/<Day,2>/<Year>          |    0    |   04/05/03    |
|          <Closing><Month,2>/<Day,2>/<Year>          |    1    |   04/05/03    |
|          <Month,2><Day,2><Year><Closing>D           |    2    |    040503D    |
|          <Closing><Year>/<Month,2>/<Day,2>          |    3    |   03/04/05    |
|        <Month Text> <Closing><Day>, <Year4>         |    4    | April 5, 2003 |
|           <Closing><Month,2><Day,2><Year>           |    5    |    040503     |
|           <Closing><Year><Month,2><Day,2>           |    6    |    030405     |
| <Day,2><Filler Character, >. <Month Text,3> <Year4> |    7    |  5. Apr 2003  |
|                     XML format                      |    9    |  2003-04-05   |

Utilizando código AL tendríamos los siguientes ejemplos:
```
//Opción 1
FORMAT(Fecha, 0,1); //Esto imprimirá **04/14/2020** que leeríamos 14 de Abril de 2020 (mi configuración regional es USA.)

//Opción 2
FORMAT(Fecha, '<closing><month,2>/<day,2>/<year>'); //Esto imprimirá **04/14/2020** que leeríamos 14 de Abril de 2020 (mi configuración regional es USA.)</year> </day,2></month,2></closing></pre>
```
Recordemos que el formato a ser utilizado será el que tengamos en la configuración regional del sistema operativo.

## Formatos de fecha NO predeterminados

Aquí podemos entrar en detalle utilizando los distintos valores expuestos en los valores predeterminados y modificarlo a placer según la necesidad. En el ejemplo, queremos obtener el formato 14-Abril-2020
```
FORMAT(Fecha, '<Closing><Day,2>-<Month Text>-<Year4>'); //De esta manera damos el formato necesario.
```
De esta manera mostré cómo podemos utilizar un formato de fecha que no está predeterminado para el uso dentro de Microsoft Dynamics Business Central.

¡Espero resulte útil!