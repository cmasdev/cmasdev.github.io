---
layout: post
title: "Implementación de Background Tasks persistentes en apps modernas"
author: Christian Amado
date: 2024-03-07 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3,Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Las apps modernas no siempre necesitan estar en primer plano para ofrecer valor. Muchas tareas pueden ejecutarse en segundo plano: desde sincronizar datos, recibir notificaciones push, recolectar telemetría o mantener información actualizada. **Windows App SDK**, junto con el modelo de **Background Tasks**, permite que las aplicaciones **WinUI 3** implementen lógica persistente y autónoma en segundo plano, sin requerir una ventana activa.

Este artículo explica cómo crear y registrar tareas en segundo plano usando temporizadores, eventos del sistema o push notifications (RAW), y cómo integrarlas en una aplicación moderna empaquetada.

<!--more-->

## Requisitos

- Windows 11
- Visual Studio 2022+
- Proyecto WinUI 3 empaquetado (MSIX)
- Windows App SDK 1.3+
- Conocimiento de manifiesto MSIX

## Tipos de Background Tasks

- **TimeTrigger**: se ejecuta a intervalos (mínimo 15 min)
- **MaintenanceTrigger**: cuando el sistema está inactivo
- **PushTrigger (Raw Push)**: notificación sin UI
- **SystemTrigger**: conectado a eventos del sistema

## Paso 1: Crear clase de tarea en segundo plano

Agregar nuevo archivo:

```csharp
public sealed class MiBackgroundTask : IBackgroundTask
{
    public void Run(IBackgroundTaskInstance taskInstance)
    {
        // Lógica que se ejecuta en segundo plano
        var deferral = taskInstance.GetDeferral();

        // Ejemplo: guardar log
        File.AppendAllText("C:\Logs\tasklog.txt", $"Ejecutado {DateTime.Now}
");

        deferral.Complete();
    }
}
```

## Paso 2: Registrar la tarea desde la app principal

En `App.xaml.cs` o `MainWindow.xaml.cs`:

```csharp
var builder = new BackgroundTaskBuilder
{
    Name = "MiTareaTimer",
    TaskEntryPoint = "NombreApp.MiBackgroundTask"
};

builder.SetTrigger(new TimeTrigger(15, false)); // cada 15 min

BackgroundTaskRegistration task = builder.Register();
```

Este código registra la tarea al iniciar la app.

## Paso 3: Declarar extensión en `Package.appxmanifest`

Abrir el manifiesto en modo texto y agregar:

```xml
<Extensions>
  <Extension Category="windows.backgroundTasks" EntryPoint="NombreApp.MiBackgroundTask">
    <BackgroundTasks>
      <Task Type="timer"/>
    </BackgroundTasks>
  </Extension>
</Extensions>
```

Esto informa al sistema que la app ejecuta tareas temporizadas.

## Paso 4: Usar Raw Push Notifications

Configurar canal:

```csharp
var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
Debug.WriteLine("URI canal push: " + channel.Uri);
```

Registrar:

```csharp
builder.SetTrigger(new PushNotificationTrigger());
builder.Name = "PushTask";
builder.TaskEntryPoint = "NombreApp.MiPushTask";
builder.Register();
```

Desde backend, enviar notificación RAW con cuerpo:

```xml
<toast>
  <visual><binding template="ToastText01"><text>Push Recibido</text></binding></visual>
</toast>
```

## Paso 5: Ejecutar tareas en mantenimiento

```csharp
builder.SetTrigger(new MaintenanceTrigger(15, false)); // cada 15 mins cuando el sistema está idle
```

Usado para limpieza, archivado, backups, etc.

## Paso 6: Monitorear ejecución

Registrar evento de monitoreo:

```csharp
task.Completed += (s, e) =>
{
    Debug.WriteLine($"Tarea completada: {s.Name}");
};
```

Ver eventos del sistema en Visor de Eventos > Aplicaciones y servicios > Microsoft > Windows > BackgroundTaskInfrastructure

## Consideraciones importantes

- Las tareas en segundo plano no pueden mostrar UI
- Si el sistema está en ahorro de batería, pueden ser diferidas
- El `EntryPoint` debe estar bien definido y coincidir con el namespace

## Casos de uso reales

- Sincronización periódica con backend
- Recibir notificaciones silenciosas
- Reintentar envíos fallidos
- Registro de métricas, backups, auditorías

## Buenas prácticas

- Siempre solicitar `GetDeferral()` si la tarea es async
- No hacer lógica intensiva que exceda el tiempo permitido (30 seg máx)
- Registrar tareas solo una vez y verificar si ya existen
- No abusar de intervalos mínimos (respetar consumo energético)

## Conclusión

La implementación de **Background Tasks** en apps modernas permite extender su funcionalidad más allá del primer plano, ejecutando lógica útil, context-aware y controlada por el sistema. Usando **Windows App SDK**, es posible construir tareas eficientes, reactivas y persistentes que mejoran la autonomía y robustez de la aplicación.