---
layout: post
title: "Integración con servicios locales vía App Services y extensión de funcionalidades entre apps"
author: Christian Amado
date: 2025-03-14 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En **Windows**, las aplicaciones modernas pueden compartir capacidades y comunicarse entre sí a través de **App Services**. Esta tecnología permite que una app ofrezca un servicio que puede ser invocado por otra app —incluso si están empaquetadas por separado— de forma segura y asincrónica.

Este enfoque es ideal para dividir funcionalidades entre componentes, implementar microservicios locales o permitir extensibilidad entre apps del mismo desarrollador. **Windows App SDK** conserva la compatibilidad con App Services, permitiendo a las apps modernas establecer esta comunicación sin usar sockets ni canalizaciones personalizadas.

Este artículo explora cómo implementar un servicio local entre dos apps modernas, incluyendo su declaración, registro, activación y comunicación estructurada con respuestas.

<!--more-->

## Escenario

Una app "Cliente" quiere consultar datos a una app "Servicio" (por ejemplo, conversión de monedas). El servicio se mantiene empaquetado con su propio MSIX y ofrece un punto de entrada App Service.

## Requisitos

- Dos apps empaquetadas (Cliente y Servicio)
- Ambas deben declararse en sus respectivos manifiestos
- Se necesita control del namespace y entrypoint de la app de servicio

## Paso 1: Crear la app de servicio

Implementar clase `IBackgroundTask`:

```csharp
public sealed class ServicioConversion : IBackgroundTask
{
    public async void Run(IBackgroundTaskInstance taskInstance)
    {
        var deferral = taskInstance.GetDeferral();
        var details = taskInstance.TriggerDetails as AppServiceTriggerDetails;
        var connection = details.AppServiceConnection;
        var msg = await connection.RequestReceivedTask;

        if (msg.Request.Message.ContainsKey("monto"))
        {
            double monto = Convert.ToDouble(msg.Request.Message["monto"]);
            var resultado = monto * 0.92;

            var respuesta = new ValueSet();
            respuesta.Add("resultado", resultado.ToString("F2"));
            await msg.Request.SendResponseAsync(respuesta);
        }

        deferral.Complete();
    }
}
```

## Paso 2: Declarar App Service en el manifiesto

En el `Package.appxmanifest` del servicio:

```xml
<Extensions>
  <Extension Category="windows.appService" EntryPoint="ServicioApp.ServicioConversion">
    <AppService Name="Servicio.Conversion" />
  </Extension>
</Extensions>
```

El `EntryPoint` debe coincidir con el namespace completo.

## Paso 3: Crear app cliente

Desde la app cliente, establecer conexión:

```csharp
var connection = new AppServiceConnection
{
    AppServiceName = "Servicio.Conversion",
    PackageFamilyName = "ServicioApp_xyz123" // copiar desde appxmanifest generado
};

var estado = await connection.OpenAsync();
if (estado == AppServiceConnectionStatus.Success)
{
    var datos = new ValueSet();
    datos.Add("monto", "100");

    var respuesta = await connection.SendMessageAsync(datos);
    var valorConvertido = respuesta.Message["resultado"];
    ResultadoText.Text = $"Valor: {valorConvertido}";
}
else
{
    ResultadoText.Text = $"Error de conexión: {estado}";
}
```

## Paso 4: Empaquetar y firmar ambas apps

Ambas deben estar empaquetadas, firmadas e instaladas. En desarrollo, puede usarse instalación local con certificados de prueba.

## Paso 5: Comunicación bidireccional

El servicio puede devolver múltiples valores, y el cliente puede enviar instrucciones con múltiples claves.

```csharp
datos.Add("comando", "convertir");
datos.Add("origen", "USD");
datos.Add("destino", "EUR");
```

El servicio puede interpretar estas claves para ejecutar lógica diferente.

## Casos de uso

- Apps que extienden funcionalidades de otra (plugin, extensiones)
- Apps que centralizan lógica compartida (autenticación, licencia, almacenamiento seguro)
- Clientes ligeros que consultan una app “nodo” local con base de datos
- Comunicación entre app de escritorio y servicio auxiliar en background

## Buenas prácticas

- Definir claves de mensajes con nombres únicos y versionados
- Validar inputs antes de ejecutar operaciones
- Usar `try/catch` para proteger el canal de comunicación
- No mantener conexiones abiertas más allá de lo necesario
- Revisar que la app de servicio esté activa o instalada correctamente

## Conclusión

**App Services** permite una arquitectura modular para aplicaciones modernas en **Windows**, fomentando la reutilización, extensibilidad y separación de responsabilidades. Este enfoque es robusto, seguro y bien integrado en el modelo **MSIX**, facilitando aplicaciones compuestas que se comunican entre sí de forma directa y eficiente.