---
layout: post
title: "Automatización de Windows con PowerShell + UIAutomation desde una app WinUI"
author: Christian Amado
date: 2025-05-21 00:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---
En entornos empresariales, automatizar tareas repetitivas o de soporte técnico puede incrementar significativamente la productividad. Este artículo demuestra cómo una aplicación desarrollada en **WinUI 3** puede invocar scripts de **PowerShell** para automatizar procesos del sistema operativo **Windows**, utilizando técnicas de **UI Automation** y ejecución controlada desde C#.

<!--more-->

## Requisitos previos

- Visual Studio 2022 o superior  
- Windows App SDK v1.4 o superior  
- PowerShell 5.1 o superior (se utiliza el host clásico de Windows)  
- Conocimientos básicos de scripting en PowerShell  

## Crear la app base en WinUI 3

```bash
dotnet new winui3 -n WinUIAutomationDemo
cd WinUIAutomationDemo
```

En el proyecto se incluirá un botón que al hacer clic ejecutará un script de PowerShell que abre una aplicación, interactúa con su UI, y cierra el proceso.

## Crear un script PowerShell para automatización de UI

El siguiente ejemplo abre el Bloc de notas, espera 2 segundos, escribe texto y lo cierra:

```powershell
Start-Process notepad
Start-Sleep -Seconds 2

Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes

$notepad = Get-Process notepad | Select-Object -First 1
$element = [System.Windows.Automation.AutomationElement]::FromHandle($notepad.MainWindowHandle)
$pattern = $element.GetCurrentPattern([System.Windows.Automation.TextPatternIdentifiers]::Pattern)

if ($pattern -ne $null) {
    # Este patrón no está disponible en Notepad; se puede mejorar el ejemplo para apps con campos de texto.
}

# Alternativa: usar SendKeys para insertar texto (más genérico)
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.SendKeys]::SendWait("Automatización desde WinUI{ENTER}")
Start-Sleep -Seconds 1

Stop-Process -Name notepad
```

Este script puede guardarse como `AutomateNotepad.ps1`.

## Invocar el script desde la app WinUI 3 (C#)

Se utiliza `System.Diagnostics.Process` para lanzar PowerShell:

```csharp
using System.Diagnostics;

private void RunAutomationScript()
{
    var psi = new ProcessStartInfo
    {
        FileName = "powershell.exe",
        Arguments = "-ExecutionPolicy Bypass -File \"Scripts\\AutomateNotepad.ps1\"",
        UseShellExecute = false,
        RedirectStandardOutput = true,
        CreateNoWindow = true
    };

    var process = new Process { StartInfo = psi };
    process.Start();
}
```

El método puede invocarse desde el `Click` de un botón:

```xml
<Button Content="Automatizar Notepad" Click="OnRunAutomationClick"/>
```

```csharp
private void OnRunAutomationClick(object sender, RoutedEventArgs e)
{
    RunAutomationScript();
}
```

## Consideraciones de seguridad

- El script debe estar ubicado en una ruta segura.  
- Se recomienda firmar los scripts en entornos productivos.  
- Evitar invocar comandos con privilegios elevados desde la UI.

## Conclusión

El uso combinado de **WinUI 3** y **PowerShell** permite extender el alcance de las aplicaciones de escritorio modernas, integrando capacidades de automatización del sistema operativo sin necesidad de desarrollar drivers o servicios complejos. Esta estrategia es ideal para apps internas, herramientas de soporte técnico o asistentes de productividad personalizados.
