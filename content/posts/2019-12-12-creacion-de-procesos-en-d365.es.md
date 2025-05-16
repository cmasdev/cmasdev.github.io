---
layout: post
title: "Creación de procesos en D365"
author: "Christian Amado"
date: 2019-12-12 20:43:07 -04:00
categories: [Aplicaciones de negocio]
tags: [CRM,Dynamics 365]
thumbnail-img: /img/posts/thumbnails/dynamics365.png
cover-img: /img/posts/cover/dynamics-365-for-sales.svg
---

En una [entrada anterior](/2019/12/creacion-de-reglas-de-negocios/), vimos cómo crear reglas de negocios para una entidad. En esta entrada mostraré cómo crear o modificar procesos de negocios existentes. Para este caso, tomaremos como ejemplo una Oportunidad y modificaremos el proceso predeterminado de un proceso de ventas.

¿Qué es un proceso de negocio? Según Microsoft Docs...

<!--more-->

> Los flujos de proceso de negocio proporcionan una guía para que la gente realice el trabajo. Proporcionan una experiencia de usuario simplificada que guía a los usuarios por los procesos que su organización ha definido para las interacciones que deben avanzarse a una conclusión de algún tipo.
> 
> Use flujos de proceso de negocio para definir un conjunto de pasos para que la gente siga para obtener el resultado deseado. Estos pasos proporcionan un mensaje visual que indica a los usuarios dónde se encuentran en el proceso de negocio.

Observemos el proceso actual de un proceso de venta:  
![](/img/posts/migrated/2019/12/2-6.png)  

Nos dirigimos a **Opciones Avanzadas** > **Personalizaciones** > **Personalizar el sistema**:  
![](/img/posts/migrated/2019/12/1-6.png)  

Buscamos el proceso y procedemos a modificarlo:  
![](/img/posts/migrated/2019/12/3-6.png)  

Realizamos las modificaciones necesarias, hacemos clic en **Guardar** y **Validar**:  
![](/img/posts/migrated/2019/12/4-5.png)  

Vemos el cambio realizado (eliminado un proceso completo, el de **Contrato**):  
![](/img/posts/migrated/2019/12/5-3.png)  

De esta manera se puede crear y/o modificar el proceso necesario.