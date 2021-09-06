---
layout: post
title: "Business Central: Utilizar manejador de eventos"
author: Christian Amado
date: 2020-04-21 20:13:00 -0400
category: [Aplicaciones de negocio]
tag: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En Microsoft Business Central también encontraremos algo básico a la hora de programar y/o usar un sistema que consiste en los eventos, de hecho, los eventos están presentes durante la ejecución de cualquier programa informático sea Web, escritorio y/o móvil. Un evento básicamente se produce cuando realizamos una acción en particular dentro de dicho programa. Por ejemplo, hacer clic en un botón.

La información se encuentra disponible en la documentación de Business Central y se puede encontrar [aquí](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-events-in-al?source=docs).

En esta ocasión haré una introducción copiando la información del sitio mencionado en el párrafo anterior (de modo a hacer una ontroducción y que el documento no está en español). Permiso Microsoft ;)

<!--more-->

## Eventos en AL (Business Central)

El uso de eventos es un concepto de programación probado y establecido que puede facilitar la actualización de la aplicación y limitar o incluso eliminar la necesidad de modificaciones de código en aplicaciones personalizadas debido a los cambios en la plataforma de aplicaciones.

Puede usar eventos para diseñar la aplicación para reaccionar a acciones o comportamientos específicos que se producen. Los eventos permiten separar la funcionalidad personalizada de la lógica empresarial de la aplicación. Mediante el uso de eventos en la aplicación donde normalmente se realizan personalizaciones, puede reducir el costo de las modificaciones de código y las actualizaciones a la aplicación original.

*   Las modificaciones de código a la funcionalidad personalizada se pueden realizar sin tener que modificar la aplicación original.
*   Los cambios en el código de aplicación original se pueden realizar con un impacto mínimo en las personalizaciones.

En la tabla siguiente se describen todos los tipos de eventos diferentes:

| Tipos de eventos |                                      Descripción                                       |  
|------------------|----------------------------------------------------------------------------------------|  
|  BusinessEvent   | Especifica el método que se va a tratar como publicador de eventos de tipo de negocio. |  
| IntegrationEvent | Especifica el método que se va a usar el publicador de eventos de tipo de integración. |  
|  InternalEvent   |                                                                                        |  
|      Global      |          Especifica el método para que sea un publicador de eventos interno.           |  
|     Trigger      |             El tiempo de ejecución publica los eventos de desencadenador.              |  

El proceso para implementar estos eventos es ligeramente diferente. Para obtener más información sobre los diferentes tipos, consulte Tipos de eventos.

## Cómo funcionan los eventos

El principio básico es que se programan eventos en la aplicación para ejecutar un comportamiento personalizado cuando se producen. Los eventos de AL se modelan después de Microsoft .NET Framework. Hay tres participantes importantes involucrados en eventos: el evento, un editor y un suscriptor.

*   Un **evento** es la declaración de la ocurrencia o cambio en la aplicación. Un evento se declara mediante un método AL, que se conoce como una función de publicador de eventos. Un método de publicador de eventos se compone únicamente de una firma y no ejecuta ningún código.
*   Un **publicador** es el objeto que contiene el método de publicador de eventos que declara el evento. El editor expone un evento en la aplicación a los suscriptores, esencialmente proporcionándoles un punto de conexión en la aplicación.

La publicación de un evento no hace nada en la aplicación, aparte de hacer que el evento esté disponible para la suscripción. El evento debe generarse para que los suscriptores respondan. Un evento se genera agregando lógica a la aplicación que llama al publicador para invocar el evento (el método de publicador de eventos).

*   Un **suscriptor** escucha y controla un evento publicado. Un suscriptor es un método AL que se suscribe a un método de publicador de eventos específico e incluye la lógica para controlar el evento. Cuando se genera un evento, se llama al método de suscriptor y se ejecuta su código. Un suscriptor permite a los socios conectarse a la funcionalidad principal de la aplicación sin tener que realizar modificaciones de código tradicionales. Cualquier proveedor de soluciones de Dynamics 365, que también incluye Microsoft, puede usar suscriptores de eventos.

Pueden hacerlo varios suscriptores a un único método de publicador de eventos. Sin embargo, un editor no tiene conocimiento de los suscriptores, si los hay. Los suscriptores pueden residir en diferentes partes de la aplicación que los editores.

## ¿Cómo implementar un **IntegrationEvent**?

Debemos tener en cuenta que en Business Central no se puede tocar (modificar) el código nativo, tal como se hacía en Microsoft Dynamics NAV. En Business Central, únicamente se pueden suscribirse a eventos y manejarlos desde algún CodeUnit personalizado. Para este ejemplo crearé un CodeUnit que se llama _CmasDevCU_.

1.  Primeramente debemos crear un CodeUnit en nuestro Visual Studio Code:

```        
codeunit 50000 CmasDevCU
{ 
    //Aquí colocaremos los detalles de la suscripción
}
```

3.  Vemos la ubicación del publicador de eventos, en este caso, **Codeunit::"Sales-Post"** (que corresponde al CodeUnit 80)

```        
codeunit 50000 CmasDevCU
{ 
    [EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 'OnBeforeSalesInvHeaderInsert', '', true, true)]
    local procedure SalesPost_OnBeforeSalesInvHeaderInsert
    (
        var SalesInvHeader: Record "Sales Invoice Header";
        SalesHeader: Record "Sales Header";
        CommitIsSuppressed: Boolean
    )
    var CompanyInfo: Record "Company Information";
    begin
        CompanyInfo.Get();
        if CompanyInfo.EvxHabilitarCambios then begin
            SalesInvHeader.CampoExtra := SalesHeader.CampoExtra;
        end else
            Error('No está habilitado para hacer cambios.');
    end;
    }
```

En el ejemplo, muestro como nos suscribimos al evento que fue publicado en **Codeunit::"Sales-Post"** y se llama **OnBeforeSalesInvHeaderInsert**, utilizamos un procedimiento local y le ponemos el nombre que nos venga a la mente en ese momento, en este caso: **SalesPost_OnBeforeSalesInvHeaderInsert** .

De esta manera, he intentado explicar (usando documentación de Microsoft) los conceptos de eventos. Y al mismo tiempo hemos visto un ejemplo. Prácticamente todos los objetos dentro de Business Central poseen su publicador de eventos para realizar las diferentes acciones necesarias para cumplir con los objetivos que nuestros clientes esperan.