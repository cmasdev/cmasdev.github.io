---
layout: post
title: "Creación de reglas de negocios"
author: "Christian Amado"
date: 2019-12-10 19:43:22 -04:00
categories: [Aplicaciones de negocio]
tags: [CRM,Dynamics 365]
thumbnail-img: /img/posts/thumbnails/dynamics365.png
cover-img: /img/posts/cover/dynamics-365-for-sales.svg
---

En esta ocasión quiero comentarles cómo poder crear reglas de negocio dentro de Dynamics 365 for Sales (al fin y al cabo utilizamos PowerApps de fondo :P).

## ¿Qué son las reglas de negocios?
Las reglas de negocios son pequeños flujos que se realizan en determinados campos cuando queremos que éstos realicen una determinada acción siguiendo algunas condiciones y variables que definamos.

<!--more-->

## ¿Cómo se crean?
Gracias al poder de PowerApps se pueden crear estas reglas fácilmente utilizando el diseñador y siguiendo los pasos que se especifican. Veremos paso a paso un ejemplo donde queremos ver si el país es **Paraguay**, que esconda el **Código Postal** del formulario de **Cuentas**.

Tener en cuenta que la opción "Editar formulario" fue quitada de la aplicación para ser accedida desde allí.

Primero debemos dirigirnos al entorno de desarrollo de Dynamics 365 for Sales (basado en PowerApps): Nos dirigimos a Opciones Avanzadas > Personalizaciones > Personalizar el sistema  
![](/img/posts/migrated/2019/12/1-5.png)  

![](/img/posts/migrated/2019/12/2-5.png)  

![](/img/posts/migrated/2019/12/3-5.png)  

A continuación, agregamos los detalles de la regla de negocio:  
![](/img/posts/migrated/2019/12/4-4.png)  

Colocamos las propiedades de la Entidad que deseamos controlar y agregamos las condiciones:  
![](/img/posts/migrated/2019/12/5-2.png)  

Una vez culminado, procedemos a agregar las acciones que una condición puede realizar (hay dos salidas siempre, el **sí** y el **no**):  
![](/img/posts/migrated/2019/12/6-2.png)  

Agregamos la acción para el **sí**:  
![](/img/posts/migrated/2019/12/7-1.png)  

Luego, agregamos la acción pàra el **no**:  
![](/img/posts/migrated/2019/12/8-1.png)  

Una vez terminado, hacemos clic en **Validar** y luego en **Guardar**:  
![](/img/posts/migrated/2019/12/9-1.png)  

Si todo es correcto, procedemos a **Activar** la regla de negocio:  
![](/img/posts/migrated/2019/12/10.png)  

Probamos el no cumplimiento de la condición:  
![](/img/posts/migrated/2019/12/11.png)  

Y por último, probamos el cumplimiento de la condición:  
![](/img/posts/migrated/2019/12/12.png)  

De esta manera logramos crear en simples pasos reglas de negocios sin la necesidad de un programador/desarrollador.