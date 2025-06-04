---
layout: post
title: "Integración entre apps WSL2 y WinUI 3: ejecución de comandos Linux desde UI nativa"
author: Christian Amado
date: 2025-05-28 00:00:00 -0300
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WinUI 3]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---
Con la disponibilidad de **WSL2 (Windows Subsystem for Linux 2)**, los desarrolladores de **Windows** cuentan con una herramienta poderosa para ejecutar software Linux dentro de **Windows**. Este artículo explica cómo una aplicación de escritorio **WinUI 3** puede interactuar con **WSL2**, ejecutar comandos en una distribución **Linux** y recuperar los resultados, todo desde una interfaz nativa moderna.

El enfoque se centra en ejecutar comandos de línea desde C#, capturar su salida, y mostrarla dentro de la app **WinUI** como parte de una experiencia productiva e integrada.

<!--more-->

## Requisitos previos

- Windows 10 (build 2004+) o Windows 11 con WSL2 habilitado  
- Una distribución Linux instalada (como Ubuntu)  
- Windows App SDK 1.4 o superior  
- Visual Studio 2022 o superior  
- Habilitación de ejecución de comandos WSL desde `cmd.exe` o PowerShell  

## Crear una app base en WinUI 3

```bash
dotnet new winui3 -n WSLWinUIIntegration
cd WSLWinUIIntegration
```

La app incluirá un `TextBox` para mostrar los resultados de un comando Linux ejecutado desde WSL2.

## Ejecutar un comando Linux desde C#

El siguiente fragmento ejecuta un comando simple (`ls -la`) en WSL2 utilizando `wsl.exe` como puente:

```csharp
using System.Diagnostics;

public static string RunWslCommand(string command)
{
    var psi = new ProcessStartInfo
    {
        FileName = "wsl.exe",
        Arguments = $"-e bash -c \"{command}\"",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    using var process = Process.Start(psi);
    string output = process.StandardOutput.ReadToEnd();
    string error = process.StandardError.ReadToEnd();

    process.WaitForExit();

    return string.IsNullOrWhiteSpace(error) ? output : $"Error: {error}";
}
```

> Es importante manejar adecuadamente la codificación de salida y sanitizar el input si se permite interacción del usuario.

## Integrar la salida en la UI de WinUI 3

Diseño simple en XAML:

```xml
<StackPanel>
    <Button Content="Ejecutar comando en WSL2" Click="OnRunClick"/>
    <TextBox x:Name="OutputBox" AcceptsReturn="True" TextWrapping="Wrap" Height="300"/>
</StackPanel>
```

Code-behind:

```csharp
private void OnRunClick(object sender, RoutedEventArgs e)
{
    string result = RunWslCommand("ls -la /home");
    OutputBox.Text = result;
}
```

Este código ejecutará el comando en Linux y mostrará el listado del directorio `/home` dentro de la aplicación de escritorio Windows.

## Casos de uso posibles

- Integrar scripts Bash que ejecutan tareas administrativas o despliegues.  
- Analizar archivos de log generados por microservicios corriendo en WSL2.  
- Ejecutar procesos científicos, de compilación o herramientas CLI que solo están disponibles en Linux.  
- Proveer una GUI para herramientas devops o backends que corren dentro de WSL2.  

## Conclusión

La integración entre **WSL2** y **WinUI 3** abre la puerta a una nueva generación de herramientas híbridas que aprovechan lo mejor de ambos mundos: la potencia del ecosistema Linux y la familiaridad del entorno Windows. Con un enfoque simple y directo, cualquier desarrollador puede construir una interfaz moderna en C# que se comunique fluidamente con su backend en Bash, Python o cualquier otra herramienta Linux disponible bajo **WSL2**.
