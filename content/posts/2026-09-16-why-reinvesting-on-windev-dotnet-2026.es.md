---
layout: post
title: "Por qué vuelvo a apostar por el desarrollo para Windows con .NET en 2026"
author: "Christian Amado"
date: 2026-09-16 14:30:00 -03:00
category: [Desarrollo de software]
tags: [WinDev,Windows 11,Windows App SDK,AI,Azure]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---
Para muchos desarrolladores .NET, los últimos años han estado dominados
por el desarrollo web, las APIs, la computación en la nube, los
contenedores y, más recientemente, la inteligencia artificial.

Esa evolución tiene sentido.

.NET moderno se ha convertido en una excelente plataforma para construir
servicios backend, aplicaciones cloud-native, APIs web y sistemas
distribuidos. Pero hay otra área del ecosistema .NET que creo que merece
más atención: **el desarrollo para Windows**.

He trabajado con tecnologías de Microsoft y .NET durante muchos años, y
en 2026 decidí volver a invertir más tiempo en crear software
específicamente para Windows.

No porque quiera regresar al desarrollo de escritorio del pasado.

Todo lo contrario.

Quiero explorar qué significa construir una **aplicación moderna para
Windows con el ecosistema .NET que tenemos hoy**.

## El desarrollo de escritorio no desapareció

Las aplicaciones web resolvieron muchos problemas importantes.

Simplificaron la distribución, hicieron que las aplicaciones fueran
accesibles prácticamente desde cualquier lugar y permitieron a los
equipos crear software que funciona en diferentes sistemas operativos y
dispositivos.

Pero eso no significa que todas las aplicaciones deban convertirse en
aplicaciones web.

Todavía existen escenarios en los que una aplicación de escritorio
nativa tiene sentido.

Una aplicación puede necesitar una integración profunda con el sistema
operativo, acceso a recursos locales, interacción con hardware,
funcionamiento sin conexión, procesamiento en segundo plano,
notificaciones nativas, administración de ventanas o simplemente una
experiencia de usuario diseñada específicamente para Windows.

Por lo tanto, la pregunta interesante no es:

**"¿Está muerto el desarrollo de escritorio?"**

Creo que una pregunta mucho mejor es:

**"¿Cuándo una aplicación nativa para Windows ofrece una mejor solución
que una aplicación web?"**

Esa es la pregunta que quiero explorar.

## El desarrollo para Windows ha cambiado

Construir una aplicación para Windows hoy no significa necesariamente
elegir las mismas tecnologías que utilizábamos hace 10 o 15 años.

Microsoft recomienda actualmente **WinUI 3 con Windows App SDK** para
nuevas aplicaciones de escritorio nativas para Windows.

WinUI 3 proporciona el framework de interfaz de usuario nativa, mientras
que Windows App SDK ofrece APIs y capacidades para áreas como el ciclo
de vida de la aplicación, administración de ventanas, notificaciones,
implementación y otras funcionalidades de la plataforma Windows.

Para los desarrolladores .NET, el stack tecnológico resulta
especialmente interesante:

**C# + .NET + Windows App SDK + WinUI 3 + XAML**

WinUI 3 no es un framework web ni una abstracción multiplataforma. Está
diseñado específicamente para aplicaciones de escritorio nativas para
Windows.

Esa diferencia es importante.

A veces, una solución multiplataforma es exactamente lo que necesita un
proyecto.

Otras veces, no.

Si Windows es la plataforma objetivo, quiero entender qué ganamos al
aprovechar directamente la plataforma en lugar de abstraerla.

## Por qué esto es interesante para un desarrollador .NET

Lo que más me interesa no es simplemente aprender otro framework de
interfaz de usuario.

Es poder combinar el desarrollo para Windows con el ecosistema .NET
moderno.

Una aplicación para Windows no tiene por qué existir como un ejecutable
de escritorio aislado.

Muchos de los mismos conceptos de arquitectura que utilizamos en otras
aplicaciones .NET también pueden aplicarse aquí:

-   Dependency Injection
-   programación asincrónica
-   clientes HTTP
-   configuración
-   logging
-   telemetría
-   servicios en segundo plano
-   APIs cloud
-   autenticación
-   testing

Y, dependiendo de la aplicación, los servicios de Azure pueden
integrarse naturalmente en esa arquitectura.

Esto cambia la forma en que pienso sobre el desarrollo de escritorio.

En lugar de considerar la aplicación de escritorio como el sistema
completo, puedo verla como un componente dentro de una arquitectura más
amplia.

La aplicación Windows proporciona la experiencia de usuario nativa.

.NET proporciona la plataforma de desarrollo.

Los servicios cloud aportan capacidades cuando son necesarias.

Y ahora existe otro componente cada vez más interesante.

## Windows + .NET + AI

La inteligencia artificial abre posibilidades particularmente
interesantes para las aplicaciones nativas.

Gran parte de la conversación actual sobre desarrollo con AI se
concentra, naturalmente, en aplicaciones web, agentes, APIs y servicios
cloud.

Pero las capacidades de AI no tienen por qué existir exclusivamente
dentro de un navegador.

Imaginemos una aplicación nativa capaz de combinar AI con archivos
locales, funcionalidades de Windows, servicios cloud, el contexto de la
propia aplicación, notificaciones o recursos del dispositivo.

Algunas cargas de trabajo de AI pueden ejecutarse de forma remota.

Otras podrán ejecutarse cada vez más de manera local.

Y algunas aplicaciones probablemente combinarán ambos enfoques.

Para un desarrollador .NET, esto crea una intersección muy interesante:

**Windows + .NET + AI**

Es un área que quiero explorar con mucha más profundidad.

Pero en lugar de limitarme a leer documentación o experimentar con
ejemplos aislados, quiero abordarla de otra manera.

Quiero construir algo.

## Aprender construyendo

Durante los próximos meses voy a construir una aplicación para Windows
desde cero.

El objetivo no es crear otro "Hello World".

Quiero utilizar el proyecto para explorar las decisiones que aparecen
cuando construimos una aplicación real.

Comenzaremos por los fundamentos:

**.NET, Windows App SDK, WinUI 3 y XAML.**

Después iremos incorporando gradualmente elementos que una aplicación de
producción realmente necesita:

**navegación, Dependency Injection, configuración, comunicación HTTP,
persistencia local, arquitectura de aplicación, APIs de Windows,
operaciones asincrónicas, logging y telemetría.**

Una vez establecida esa base, exploraré la integración con **Azure y
capacidades de AI**.

El código evolucionará junto con los artículos.

Eso significa que algunas decisiones de arquitectura pueden cambiar.

Algunos experimentos pueden fallar.

Y espero que algunas de las suposiciones que tengo hoy sean diferentes
al finalizar el proyecto.

Ese es precisamente el objetivo.

## Un proyecto, no veinte ejemplos

No quiero crear un repositorio nuevo para cada artículo.

En su lugar, voy a mantener un único proyecto y hacerlo evolucionar a lo
largo de toda la serie.

Por ahora, lo llamaré:

**ModernWindowsDev**

Cada artículo introducirá un concepto, explicará el razonamiento detrás
de él y después lo aplicará sobre la misma aplicación.

Esto permitirá seguir no solamente ejemplos técnicos individuales, sino
también observar cómo evoluciona la arquitectura a medida que la
aplicación se vuelve más compleja.

El proyecto estará disponible en GitHub para que sea posible explorar el
código junto con los artículos.

## Lo que quiero aprender

Ya tengo muchos años de experiencia trabajando con .NET.

Y esa es, precisamente, una de las razones por las que me interesa hacer
esto.

No quiero abordar el desarrollo para Windows como si todo lo que aprendí
en otros ámbitos dejara de ser aplicable.

En cambio, quiero responder preguntas como estas:

¿Cuánto de la arquitectura moderna de aplicaciones .NET se traslada
naturalmente a WinUI 3?

¿Dónde debería residir el código específico de la plataforma Windows?

¿Cómo debería estructurarse una aplicación WinUI a medida que crece?

¿Cuándo la integración nativa con Windows proporciona una ventaja
significativa?

¿Cómo deberían combinarse las capacidades locales y cloud?

Y, eventualmente:

**¿Cómo debería ser una buena arquitectura para una aplicación Windows
con capacidades de AI?**

No sé si todas las respuestas serán las que espero hoy.

Y justamente eso hace que valga la pena desarrollar este proyecto.

## ¿Qué sigue?

Este artículo es el punto de partida.

A continuación, crearé la aplicación y exploraré la arquitectura básica
de una aplicación moderna para Windows utilizando **.NET, Windows App
SDK y WinUI 3**.

A partir de ahí, iremos transformando progresivamente una aplicación
pequeña en algo mucho más cercano a una arquitectura de producción.

El desarrollo para Windows no desapareció.

.NET ciertamente no dejó de evolucionar.

Y con la llegada de nuevas capacidades de AI, creo que la intersección
entre **Windows, .NET y AI** vuelve a ser especialmente interesante.

Es hora de construir y descubrirlo.
