---
layout: post
title: "Migración UWP a WinUI 3"
author: Christian Amado
date: 2022-07-06 00:12:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, UWP, WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

¡Feliz cumple para mí! Arranco mi día con un artículo (es día de festejo así que será complicado cumplir con la comunidad).

En este artículo haré una migración de **UWP** a **WinUI 3** sin que se complique demasiado.

***Windows 11 Insider Preview Build 25151***

<!--more-->

Microsoft ha anunciado oficialmente la depreciación de **UWP** (Plataforma Universal de Windows) y que no se actualizaría en el nuevo sistema **Windows 11**. Sin embargo, todavía hay algunas formas de usar **UWP** en proyectos existentes o nuevos.

> Microsoft continues to baby-step around the obvious, but it has officially deprecated the Universal Windows Platform (UWP) as it pushes the desktop-focused Windows App SDK (formerly called Project Reunion) and WinUI 3 as the future of Windows application development.

Esto lo expresó Paul Thurrott en su blog ([quién es él](https://www.thurrott.com/paul)) donde nos lleva al enlace de **GitHub** del proyecto **Windows App SDK**. Aunque esta noticia no es nueva ahora, en este momento abandono **UWP** antes que me ocurra lo mismo que con mis desarrollos **Windows Phone** 🫶

## ¿Cómo proceder con la migración?
Como la ansiedad me gana, abrí un proyecto de **UWP** que tenía (no lo puedo exponer porque es de la empresa donde trabajaba) y decidí crear un nuevo proyecto de tipo **WinUI3** para adelantarme a los hechos ...

Me encontré con dos maneras de hacer la migración:

### La migración "manual"
Al migrar, en la mayoría de los casos, el código de la interfaz de usuario solo necesita algunos cambios en el espacio de nombres. Gran parte del código de su plataforma seguirá siendo el mismo. Se tiene que modificar o cambiar algún código en función de las diferentes funcionalidades/disponibilidades de las aplicaciones de escritorio frente a las aplicaciones para **UWP**. 

A nivel general se deben realizar estas tareas:
1. Crear un nuevo proyecto de escritorio empaquetado de **WinUI 3** en la solución existente.

2. Copiar el código **XAML** para la **UI** (esto debido a cambios en los nombres de espacios de nombres).

3. Copiar el código lógico de la aplicación (clases diferentes y/o diferencias de APIs).

Debemos seguir los pasos indicados [aquí](https://learn.microsoft.com/es-es/windows/apps/windows-app-sdk/migrate-to-windows-app-sdk/migrate-to-windows-app-sdk-ovw)

### La migración con una herramienta
Para migrar una aplicación UWP a **WinUI 3**, se puede usar el **.NET Upgrade Assistant**, que es una herramienta que automatiza gran parte del proceso de migración. Antes de migrar, se recomienda revisar la siguiente lista de características que aún no son compatibles con **WinUI 3**.

|            Característica de **UWP**             |                                         Estado de **WinUI 3**                                          |
|----------------------------------------------|----------------------------------------------------------------------------------------------------|
| Controles comunes de la interfaz de usuario  |                                             ✅ Soportado                                              |
|                     MSIX                     |                                             ✅ Soportado                                              |
|          Notificaciones del sistema          |                                             ✅ Soportado                                              |
|       Iconos dinámicos (en Windows 10)       |                                             ✅ Soportado                                              |
|      Distribución a través de la Tienda      |                                             ✅ Soportado                                              |
|               Biblioteca MSAL                |                                             ✅ Soportado                                              |
|           Visual Studio App Center           |                                             ✅ Soportado                                              |
|        Creación de instancias únicas         |                                             ✅ Soportado                                              |
|           Tareas en segundo plano            | ✅ Compatible con C++ ⚠️ Compatible parcialmente con C# (se admiten tareas en segundo plano de OOP) |
|               CameraCaptureUI                |                                  ❌ No se admite en la versión 1.0                                  |
|           CoreTextServicesManager            |                                  ⚠️ Solo se admite en Windows 11                                   |
|                  InkCanvas                   |                                  ❌ No se admite en la versión 1.0                                  |
|                  MapControl                  |                                  ❌ No se admite en la versión 1.0                                  |
|                 MediaElement                 |                                  ❌ No se admite en la versión 1.0                                  |
|                 PrintManager                 |                                  ❌ No se admite en la versión 1.0                                  |
|           WebAuthenticationBroker            |                                  ❌ No se admite en la versión 1.0                                  |
|             Acrílico en el fondo             |                                  ❌ No se admite en la versión 1.0                                  |
|        Quiosco de una sola aplicación        |                                  ❌ No se admite en la versión 1.0                                  |
|              TaskbarManager API              |                                  ❌ No se admite en la versión 1.0                                  |
| Contenedorización completa de la aplicación  |                                  ❌ No se admite en la versión 1.0                                  |
| Mejor velocidad y rendimiento de lanzamiento |                   ⚠️ Ligera desventaja, consulte consideraciones de rendimiento.                   |

Más información sobre la migración, se encuentra en la documentación oficial de **Microsoft** [aquí](https://learn.microsoft.com/es-es/windows/apps/windows-app-sdk/migrate-to-windows-app-sdk/upgrade-assistant)

## Conclusión
En general, el proceso de migración es sencillo si se utiliza el **.NET Upgrade Assistant**, que guía paso a paso y realiza los cambios necesarios en el código. Sin embargo, puede haber algunos casos en los que se tenga que hacer ajustes manuales o buscar alternativas a algunas características que no son compatibles con **WinUI 3**.

En líneas generales seguí [el ejemplo de la documentación de Microsoft](https://learn.microsoft.com/es-es/dotnet/core/porting/upgrade-assistant-uwp-framework) y logramos terminar la migración sin problemas en 2 días (14 horas en total).

```
upgrade-assistant upgrade XX.sln
```

¡No modificamos nada!

Es hora de ir a tomar un poco de tequila 😋

¡Espero resulte útil!
