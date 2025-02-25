---
layout: post
title: "Uso de Azure Cosmos DB en aplicaciones Blazor"
author: Christian Amado
date: 2024-10-09 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, .NET, Blazor]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.png
---
**Azure Cosmos DB** es una base de datos distribuida globalmente y altamente escalable que permite almacenar y consultar datos de forma rápida y segura. Al integrarla con aplicaciones **Blazor**, puedes construir soluciones web modernas y dinámicas con acceso a datos en tiempo real. Este artículo ofrece un instructivo paso a paso para usar **Azure Cosmos DB** con **Blazor**, incluyendo ejemplos de código prácticos y buenas prácticas.

<!--more-->

## ¿Qué es Azure Cosmos DB?

Azure Cosmos DB es un servicio de base de datos NoSQL en la nube que soporta múltiples modelos de datos, como documentos, claves-valor, gráficos y tablas. Ofrece:

- **Escalabilidad global**: Replica los datos en múltiples regiones.
- **Latencia baja**: Respuestas en milisegundos para operaciones de lectura y escritura.
- **Soporte para múltiples API**: Incluye SQL, MongoDB, Cassandra, Gremlin y Table.
- **Altamente disponible**: Con acuerdos de nivel de servicio (SLA) del 99.999%.

Azure Cosmos DB es ideal para aplicaciones que requieren alta disponibilidad, consistencia en datos distribuidos y escalabilidad masiva.

## Configuración inicial

### Requisitos previos

1. **Cuenta de Azure**: Si no tienes una, regístrate en [Azure Portal](https://portal.azure.com/).
2. **Visual Studio 2022 o Visual Studio Code**.
3. **SDK de .NET 6 o superior** instalado.

### Crear una cuenta de Azure Cosmos DB

1. Inicia sesión en el [portal de Azure](https://portal.azure.com/).
2. Haz clic en **Crear un recurso** > **Bases de datos** > **Azure Cosmos DB**.
3. Selecciona el modelo de API SQL (Core).
4. Proporciona los detalles necesarios:
   - **Nombre de la cuenta**: `blazor-cosmosdb-demo`.
   - **Grupo de recursos**: Crea uno nuevo o selecciona uno existente.
   - **Ubicación**: Selecciona la región más cercana a tus usuarios.
5. Haz clic en **Revisar y crear**.
6. Una vez creada, accede a la cuenta de Cosmos DB y toma nota de la clave primaria y la cadena de conexión.

## Crear una aplicación Blazor con Cosmos DB

### Paso 1: Configurar el proyecto Blazor

1. Crea un nuevo proyecto Blazor Server:
   ```
   dotnet new blazorserver -o BlazorCosmosDemo
   cd BlazorCosmosDemo
   ```

2. Instala el paquete NuGet para Azure Cosmos DB:
   ```
   dotnet add package Microsoft.Azure.Cosmos
   ```

3. Verifica que los paquetes estén instalados correctamente ejecutando:
   ```
   dotnet list package
   ```

### Paso 2: Configurar la conexión a Cosmos DB

1. Agrega las configuraciones de Cosmos DB al archivo `appsettings.json`:

   ```
   {
     "CosmosDb": {
       "AccountEndpoint": "<TU_ENDPOINT>",
       "AccountKey": "<TU_LLAVE>",
       "DatabaseName": "BlazorDemoDB",
       "ContainerName": "Items"
     }
   }
   ```

2. Configura los servicios en `Program.cs`:

   ```
   using Microsoft.Azure.Cosmos;

   var builder = WebApplication.CreateBuilder(args);

   builder.Services.AddSingleton(s =>
   {
       var config = builder.Configuration.GetSection("CosmosDb");
       return new CosmosClient(config["AccountEndpoint"], config["AccountKey"]);
   });

   builder.Services.AddSingleton<CosmosDbService>();

   var app = builder.Build();

   app.Run();
   ```

### Paso 3: Crear el servicio Cosmos DB

1. Crea una clase llamada `CosmosDbService`:

   ```
   using Microsoft.Azure.Cosmos;
   using System.Threading.Tasks;

   public class CosmosDbService
   {
       private readonly CosmosClient _cosmosClient;
       private readonly Container _container;

       public CosmosDbService(CosmosClient cosmosClient, IConfiguration configuration)
       {
           _cosmosClient = cosmosClient;
           var databaseName = configuration["CosmosDb:DatabaseName"];
           var containerName = configuration["CosmosDb:ContainerName"];

           _container = _cosmosClient.GetContainer(databaseName, containerName);
       }

       public async Task AddItemAsync<T>(T item, string id)
       {
           await _container.CreateItemAsync(item, new PartitionKey(id));
       }

       public async Task<List<T>> GetItemsAsync<T>(string query)
       {
           var items = new List<T>();
           var iterator = _container.GetItemQueryIterator<T>(query);
           while (iterator.HasMoreResults)
           {
               var response = await iterator.ReadNextAsync();
               items.AddRange(response);
           }
           return items;
       }

       public async Task DeleteItemAsync(string id)
       {
           await _container.DeleteItemAsync<object>(id, new PartitionKey(id));
       }
   }
   ```

2. Implementa pruebas básicas para verificar la funcionalidad del servicio:

   ```
   // Ejemplo de prueba rápida
   var service = new CosmosDbService(client, configuration);
   await service.AddItemAsync(new { Id = "1", Name = "Test Item" }, "1");
   var items = await service.GetItemsAsync<dynamic>("SELECT * FROM c");
   Console.WriteLine(items);
   ```

## Crear un componente Blazor para interactuar con Cosmos DB

### Paso 1: Crear el componente `ItemList.razor`

1. Crea un nuevo componente llamado `ItemList.razor`:

   ```
   @inject CosmosDbService CosmosDbService

   <h3>Lista de Items</h3>

   <button @onclick="LoadItems">Cargar Items</button>
   <button @onclick="AddNewItem">Agregar Item</button>

   <ul>
       @foreach (var item in Items)
       {
           <li>@item.Name <button @onclick="() => DeleteItem(item.Id)">Eliminar</button></li>
       }
   </ul>

   @code {
       private List<Item> Items = new List<Item>();

       private async Task LoadItems()
       {
           Items = await CosmosDbService.GetItemsAsync<Item>("SELECT * FROM c");
       }

       private async Task AddNewItem()
       {
           var newItem = new Item { Id = Guid.NewGuid().ToString(), Name = "Nuevo Item" };
           await CosmosDbService.AddItemAsync(newItem, newItem.Id);
           await LoadItems();
       }

       private async Task DeleteItem(string id)
       {
           await CosmosDbService.DeleteItemAsync(id);
           await LoadItems();
       }

       public class Item
       {
           public string Id { get; set; }
           public string Name { get; set; }
       }
   }
   ```

### Paso 2: Agregar el componente a la página principal

1. Abre `Pages/Index.razor` y agrega:

   ```
   <ItemList />
   ```

## Buenas prácticas

1. **Optimiza las consultas**:
   - Usa índices en Cosmos DB para acelerar las búsquedas.
   - Realiza consultas específicas con cláusulas WHERE para evitar iteraciones innecesarias.

2. **Manejo de errores**:
   - Implementa bloques try-catch en las operaciones CRUD.

3. **Paginación**:
   - Implementa la funcionalidad de paginación para manejar grandes volúmenes de datos.

4. **Validación de datos**:
   - Verifica y valida los datos antes de insertarlos en Cosmos DB.

5. **Seguridad**:
   - No expongas directamente las claves de acceso en el cliente.
   - Usa servicios de identidad como Azure Managed Identity.

## Conclusión

Integrar **Azure Cosmos DB** con **Blazor** permite construir aplicaciones escalables y dinámicas con facilidad. Este artículo ha detallado un enfoque paso a paso para configurar, integrar y trabajar con **Cosmos DB** en aplicaciones **Blazor**, incluyendo funcionalidades avanzadas como eliminación y paginación. Con el uso de servicios bien configurados y buenas prácticas, puedes aprovechar al máximo esta poderosa base de datos en la nube. ¡Explora las posibilidades de **Azure Cosmos DB** en tus proyectos **Blazor** y lleva tus aplicaciones al siguiente nivel!