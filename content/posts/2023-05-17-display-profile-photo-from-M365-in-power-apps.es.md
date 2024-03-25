---
layout: post
title: "Mostrar foto de perfil desde Microsoft 365 en Power Apps"
author: "Christian Amado"
date: 2023-05-17 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps, Microsoft 365]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En este artículo veremos cómo agregar una foto de perfil desde **Microsoft 365** en **Microsoft Power Apps** de modo a reutilizarlo y manejar un mismo perfil dentro de las aplicaciones.

<!--more-->

Primeramente, creamos una nueva aplicación vacía:
![](https://i.ibb.co/2q4Sxxv/profile-photo-power-apps-1.png)

Luego, le colocamos el nombre y hacemos clic en el botón *Crear*:
![](https://i.ibb.co/cwmTBcr/profile-photo-power-apps-2.png)

En el nuevo lienzo agregamos los siguientes controles:
- Container
- Image (para la foto de perfil)
- 2 Text Label (para el nombre y para el correo)

Quedaría algo así:
![](https://i.ibb.co/kD3F3wh/profile-photo-power-apps-3.png)

Hacemos clic en la imagen y colocamos la siguiente fórmula:
```
Microsoft365Users.UserPhoto(Microsoft365Users.MyProfile().Id)
```
Esto nos dará un error, porque no encontrará la variable *Microsoft365Users*

Procedemos a agregar un nuevo conector a nuestro **Power Apps**:
![](https://i.ibb.co/56B6dgD/profile-photo-power-apps-4.png)

Cambiamos el nombre al conector:
![](https://i.ibb.co/0yv6P4T/profile-photo-power-apps-5.png)

Adicionamos las fórmulas a los objetos que hemos agregado:
```
Microsoft365Users.MyProfile().DisplayName
```
```
Microsoft365Users.MyProfile().Mail
```

Veremos los cambios en tiempo real:
![](https://i.ibb.co/yXwngsM/profile-photo-power-apps-6.png)

Por último, probamos la aplicación para ver los cambios:
![](https://i.ibb.co/JvtNQfB/profile-photo-power-apps-7.png)


De esta manera, hemos visto como mostrar la foto de perfil desde **Microsoft 365** en **Microsoft Power Apps**

¡Espero resulte de utilidad!