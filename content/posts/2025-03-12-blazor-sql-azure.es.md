---
layout: post
title: "Integración de Blazor con bases de datos SQL en Azure"
author: Christian Amado
date: 2025-03-12 00:00:00 -0400
category: [Desarrollo de software]
tags: [.NET,Blazor]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

El desarrollo de aplicaciones web modernas con **Blazor** permite aprovechar el poder de .NET para construir interfaces interactivas del lado cliente utilizando **C#**. A su vez, las bases de datos SQL en **Azure** ofrecen una solución altamente escalable, segura y gestionada para el almacenamiento de datos. Integrar ambas tecnologías representa una solución robusta para proyectos empresariales que requieren rendimiento, fiabilidad y facilidad de mantenimiento.

Este artículo detalla cómo conectar una aplicación Blazor Server con una base de datos SQL en **Azure**, utilizando **Entity Framework Core** como ORM (Object-Relational Mapping). Se cubre desde la creación de la base de datos hasta la implementación de operaciones CRUD básicas.

<!--more-->

## Requisitos previos

Para seguir este tutorial, se requiere:

- Una cuenta activa en Microsoft Azure.
- Visual Studio 2022 o superior con soporte para ASP.NET y desarrollo Blazor.
- Conocimientos básicos en C#, Blazor Server y Entity Framework Core.
- SQL Server Management Studio (SSMS) opcional, para gestionar la base de datos en Azure.

## Crear una base de datos SQL en Azure

1. Iniciar sesión en [https://portal.azure.com](https://portal.azure.com).
2. Seleccionar **"Crear un recurso"** > **"Base de datos SQL"**.
3. En el formulario de configuración, establecer:
   - **Nombre de la base de datos:** `BlazorAppDB`
   - **Servidor:** Crear uno nuevo o seleccionar uno existente. Al crear uno nuevo, asignar un nombre como `blazor-sql-server`, seleccionar región, usuario administrador (por ejemplo `adminuser`) y contraseña.
   - **Nivel de precio:** Seleccionar el plan básico para propósitos de prueba.
   - **Redes:** Habilitar el acceso a través del cliente actual para permitir la conexión desde el entorno de desarrollo.

4. Una vez creada, tomar nota del **nombre del servidor** (por ejemplo, `blazor-sql-server.database.windows.net`) y el **nombre de la base de datos**.

## Crear el proyecto Blazor Server

1. Abrir Visual Studio y seleccionar **Crear nuevo proyecto**.
2. Elegir **Blazor Server App**.
3. Asignar un nombre, por ejemplo, `BlazorAzureSqlApp`.
4. Confirmar que la opción **.NET 8 (o superior)** esté seleccionada.
5. Finalizar la creación del proyecto.

## Agregar Entity Framework Core

1. Abrir la consola del administrador de paquetes (Package Manager Console).
2. Ejecutar los siguientes comandos:

```powershell
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Tools
```

## Definir el modelo de datos

Crear una carpeta llamada `Models` y dentro, un archivo `Product.cs` con el siguiente contenido:

```csharp
using System.ComponentModel.DataAnnotations;

namespace BlazorAzureSqlApp.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
```

## Crear el contexto de base de datos

Crear una carpeta llamada `Data` y un archivo `AppDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using BlazorAzureSqlApp.Models;

namespace BlazorAzureSqlApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products => Set<Product>();
    }
}
```

## Configurar la cadena de conexión a Azure SQL

En el archivo `appsettings.json`, agregar la cadena de conexión:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:blazor-sql-server.database.windows.net,1433;Initial Catalog=BlazorAppDB;Persist Security Info=False;User ID=adminuser;Password=TuPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

**Nota:** Sustituir `adminuser` y `TuPassword123!` por las credenciales reales utilizadas al crear el servidor de Azure SQL.

## Registrar el contexto en el contenedor de servicios

En el archivo `Program.cs`, agregar la configuración del contexto justo antes de `builder.Build()`:

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

## Crear la migración e inicializar la base de datos

Ejecutar en la consola del administrador de paquetes:

```powershell
Add-Migration InitialCreate
Update-Database
```

Esto creará las tablas necesarias directamente en la base de datos SQL de Azure.

## Crear un servicio para acceso a datos

Dentro de la carpeta `Data`, crear el archivo `ProductService.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using BlazorAzureSqlApp.Models;

namespace BlazorAzureSqlApp.Data
{
    public class ProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync() =>
            await _context.Products.ToListAsync();

        public async Task AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
```

Y registrar el servicio en `Program.cs`:

```csharp
builder.Services.AddScoped<ProductService>();
```

## Crear una interfaz para gestionar productos

Agregar un nuevo componente Razor llamado `Pages/Products.razor`:

```razor
@page "/products"
@inject ProductService ProductService

<h3>Productos</h3>

<EditForm Model="@newProduct" OnValidSubmit="AddProduct">
    <DataAnnotationsValidator />
    <ValidationSummary />

    <InputText @bind-Value="newProduct.Name" placeholder="Nombre" />
    <InputNumber @bind-Value="newProduct.Price" placeholder="Precio" />
    <button class="btn btn-primary">Agregar</button>
</EditForm>

<hr />

<ul>
    @foreach (var product in products)
    {
        <li>
            @product.Name - $@product.Price
            <button class="btn btn-sm btn-danger" @onclick="() => DeleteProduct(product.Id)">Eliminar</button>
        </li>
    }
</ul>

@code {
    private List<Product> products = new();
    private Product newProduct = new();

    protected override async Task OnInitializedAsync()
    {
        products = await ProductService.GetAllAsync();
    }

    private async Task AddProduct()
    {
        await ProductService.AddAsync(newProduct);
        newProduct = new();
        products = await ProductService.GetAllAsync();
    }

    private async Task DeleteProduct(int id)
    {
        await ProductService.DeleteAsync(id);
        products = await ProductService.GetAllAsync();
    }
}
```

Agregar esta ruta al menú en `Shared/NavMenu.razor`:

```razor
<NavLink class="nav-link" href="products">
    <span class="oi oi-list-rich" aria-hidden="true"></span> Productos
</NavLink>
```

## Conclusión

Integrar **Blazor** con una base de datos SQL en **Azure** es un proceso directo cuando se utiliza **Entity Framework Core** como puente entre la aplicación y la capa de persistencia. Esta arquitectura permite desarrollar aplicaciones empresariales modernas, seguras y escalables que se ejecutan sobre infraestructura de nube gestionada. El modelo de desarrollo **Blazor Server**, combinado con una base de datos en **Azure**, permite reducir costos operativos, mejorar la experiencia de usuario en tiempo real y mantener una lógica de negocio robusta y centralizada en el servidor.

A partir de esta base, es posible escalar la solución incorporando autenticación con **Microsoft Entra ID**, funciones más complejas como reportes dinámicos, paginación, integración con servicios externos y migración hacia una arquitectura Blazor WebAssembly si se desea delegar más carga al cliente. Además, se puede extender el modelo para trabajar con procedimientos almacenados o vistas, y aprovechar herramientas como Azure Key Vault para almacenar credenciales de forma segura.

Este enfoque garantiza una solución moderna alineada con los estándares de desarrollo en la nube de **Microsoft**.**
