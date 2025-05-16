---
layout: post
title: "Dashboards interactivos con Blazor y gráficos dinámicos"
author: Christian Amado
date: 2025-03-19 00:00:00 -0400
category: [Desarrollo de software]
tags: [.NET,Blazor]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

Los dashboards interactivos se han convertido en herramientas esenciales para visualizar grandes volúmenes de información en tiempo real. **Blazor**, como framework moderno para construir aplicaciones web con C#, permite crear interfaces ricas que se ejecutan directamente en el navegador o en el servidor. Cuando se combina con bibliotecas de gráficos dinámicos como Chart.js o ApexCharts, Blazor ofrece una experiencia visual potente y altamente personalizable.

Este artículo explora cómo construir un dashboard interactivo en **Blazor Server** utilizando datos dinámicos y gráficos en tiempo real, abordando tanto el diseño del componente visual como la lógica de actualización de datos.

<!--more-->

## Requisitos previos

- Visual Studio 2022 o superior con soporte para ASP.NET y Blazor.
- Conocimientos intermedios de C# y Blazor Server.
- Familiaridad con conceptos de visualización de datos.
- Paquete NuGet `Blazor-ApexCharts` (u otra biblioteca de gráficos compatible con Blazor).

## Crear el proyecto base

1. Abrir Visual Studio y seleccionar **Crear nuevo proyecto**.
2. Seleccionar **Blazor Server App**.
3. Nombrar el proyecto como `BlazorDashboardApp` y confirmar la plantilla con .NET 8 (o superior).

## Instalar ApexCharts para Blazor

Desde la consola del administrador de paquetes ejecutar:

```powershell
Install-Package ApexCharts
```

También se puede agregar desde el administrador de NuGet buscando `ApexCharts`.

## Configurar ApexCharts

En `_Imports.razor`, agregar:

```razor
@using ApexCharts
```

En `Pages/_Host.cshtml`, agregar en el `<head>`:

```html
<link href="_content/ApexCharts.Blazor/apexcharts.css" rel="stylesheet" />
```

Y antes de cerrar la etiqueta `</body>`:

```html
<script src="_content/ApexCharts.Blazor/apexcharts.js"></script>
```

## Crear un componente de gráfico

Crear una carpeta llamada `Components`, y dentro un archivo `SalesChart.razor`:

```razor
@using ApexCharts
@using BlazorDashboardApp.Data

<ApexChart TItem="SalesData" Title="Ventas por mes"
           Width="100%" Height="350"
           Series="@series"
           Options="@options">
</ApexChart>

@code {
    private List<Series<SalesData>> series = new();
    private ApexChartOptions<SalesData> options = new();

    protected override void OnInitialized()
    {
        series.Add(new Series<SalesData>
        {
            Name = "Ventas",
            Data = new List<SalesData>
            {
                new() { X = "Ene", Y = 25000 },
                new() { X = "Feb", Y = 42000 },
                new() { X = "Mar", Y = 37000 },
                new() { X = "Abr", Y = 54000 }
            }
        });

        options = new ApexChartOptions<SalesData>
        {
            Chart = new Chart
            {
                Type = ChartType.Bar
            },
            Xaxis = new XAxis
            {
                Title = new Title { Text = "Mes" }
            },
            Yaxis = new List<YAxis>
            {
                new() { Title = new Title { Text = "Monto (USD)" } }
            }
        };
    }
}
```

Y definir la clase `SalesData.cs` en la carpeta `Data`:

```csharp
namespace BlazorDashboardApp.Data
{
    public class SalesData
    {
        public string X { get; set; } = string.Empty;
        public decimal Y { get; set; }
    }
}
```

## Incluir el gráfico en una página

Editar `Pages/Index.razor` para incluir el componente del gráfico:

```razor
@page "/"
<h3>Dashboard de Ventas</h3>
<SalesChart />
```

También es necesario importar el componente:

```razor
@using BlazorDashboardApp.Components
```

## Hacer el gráfico dinámico

Para que el gráfico se actualice cada cierto intervalo, se puede usar un `Timer`. Reemplazar el bloque `@code` en `SalesChart.razor` por:

```razor
@code {
    private List<Series<SalesData>> series = new();
    private ApexChartOptions<SalesData> options = new();
    private System.Timers.Timer? updateTimer;

    protected override void OnInitialized()
    {
        InicializarGrafico();

        updateTimer = new System.Timers.Timer(5000); // cada 5 segundos
        updateTimer.Elapsed += async (_, _) => await ActualizarDatos();
        updateTimer.Start();
    }

    private void InicializarGrafico()
    {
        series.Add(new Series<SalesData>
        {
            Name = "Ventas",
            Data = GenerarDatos()
        });

        options = new ApexChartOptions<SalesData>
        {
            Chart = new Chart { Type = ChartType.Bar },
            Xaxis = new XAxis { Title = new Title { Text = "Mes" } },
            Yaxis = new List<YAxis> { new() { Title = new Title { Text = "Monto (USD)" } } }
        };
    }

    private async Task ActualizarDatos()
    {
        var nuevosDatos = GenerarDatos();

        await InvokeAsync(() =>
        {
            series[0].Data = nuevosDatos;
            StateHasChanged();
        });
    }

    private List<SalesData> GenerarDatos()
    {
        var rnd = new Random();
        return new List<SalesData>
        {
            new() { X = "Ene", Y = rnd.Next(20000, 50000) },
            new() { X = "Feb", Y = rnd.Next(20000, 50000) },
            new() { X = "Mar", Y = rnd.Next(20000, 50000) },
            new() { X = "Abr", Y = rnd.Next(20000, 50000) }
        };
    }

    public void Dispose()
    {
        updateTimer?.Stop();
        updateTimer?.Dispose();
    }
}
```

Esto simula datos que se actualizan automáticamente en tiempo real.

## Conclusión

**Blazor** permite construir dashboards ricos e interactivos combinando componentes gráficos como ApexCharts con datos en tiempo real. Con unas pocas líneas de código, es posible crear visualizaciones profesionales que se actualizan dinámicamente, ya sea mediante temporizadores o eventos del sistema.

Este enfoque puede escalar fácilmente para representar múltiples gráficos, integrarse con bases de datos, servicios **REST** o incluso conectarse a flujos de eventos como **SignalR** o **Azure Event Hubs**. Los dashboards construidos con **Blazor** ofrecen una alternativa moderna, extensible y mantenible a frameworks de **JavaScript** tradicionales, sin salir del ecosistema **.NET**.