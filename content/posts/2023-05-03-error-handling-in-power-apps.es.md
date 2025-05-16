---
layout: post
title: "Manejo de errores en Power Apps"
author: "Christian Amado"
date: 2023-05-03 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En este artículo veremos cómo manejar errores en **Microsoft Power Apps** pues no es algo netamente de lenguajes de programación sino que es un tema real que debe ser cubierto también por aplciaciones de tipo *Low Code*.

<!--more-->

La semana pasada se presentó un problema en una de las aplicaciones **Power Apps** y justamente ha ocurrido por no haber manejado los errores correspondientes. A continuación, explicaré manejo de errores en distintos niveles.

# Manejo de errores (Preventivos)
Llamaremos a estos preventivos, ya que son errores que se pueden prever y están relacionados a controles dentro de la aplicación, por ejemplo que se ingrese correctamente un correo, que un campo permita sólo datos numéricos, etc.

Aquí es donde existen funciones para el manejo de errores:

## IfError
> La función IfError prueba valores hasta que encuentra un error. Si la función descubre un error, la función evalúa y devuelve un valor de reemplazo correspondiente y detiene la evaluación adicional.

```
IfError( 1/0, 0 )
```
Aquí tenemos el popular caso de división por cero. En este caso no mostrará mensaje ni nada simplemente asumirá que en caso de producirse ese error coloca el valor en cero.

```
IfError(1/0, Notify("No se puede dividir por cero"))
```
Aquí en caso de producirse el error notifica (muestra en pantalla el mensaje como tal). En este caso no asume valores como el ejemplo anterior.

## IsError
Esta función prueba un valor de error. El valor devuelto es un valor booleano *true* o *false*.
```
IsError(1/0)
```
Es función retornará el valor *true*.

## IsBlankOrError
Esta función prueba un valor en blanco o un valor de error. 
```
IsBlankOrError(1)
```
Retorna *false* pues no es un error.

```
IsBlankOrError(1/0)
```
Retorna *true* pues es un error (de división por cero).

# Manejo de errores globales inesperados
Esto se dá cuando los errores no son controlados o simplemente no los podemos controlas, por ejemplo, tenemos la llamada a una API y esta falla por algún motivo. Es ahí donde podemos utilizar esta función para capturar los errores que puedan suceder:
 ```
Notify("Concatenate("Ocurrió un error general ", FirstError.Source), NotificationType.Error);
```
Con esto notificamos que hubo un error y especificamos donde se produjo.

De esta manera, hemos visto algunas maneras de manejar errores en **Microsoft Power Apps**

¡Espero resulte de utilidad!
