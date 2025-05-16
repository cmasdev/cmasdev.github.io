---
layout: post
title: "Creación de aplicaciones serverless con Deno y Azure"
author: Christian Amado
date: 2024-11-20 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, Deno, Azure]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.png
---

El paradigma serverless permite construir aplicaciones sin necesidad de gestionar servidores, proporcionando escalabilidad automática y optimización de costos. En este artículo, exploraremos cómo crear aplicaciones serverless utilizando Deno y Azure Functions, combinando la eficiencia de Deno con la potencia de la nube de Azure.

<!--more-->

## ¿Por qué usar Deno y Azure Functions?

### **Beneficios de Deno**
Deno es un runtime moderno para JavaScript y TypeScript con varias características que lo hacen ideal para aplicaciones serverless:

- **Seguridad integrada**: Requiere permisos explícitos para acceder a archivos, red y entorno.
- **Soporte nativo para TypeScript**: No necesita configuración adicional.
- **Gestión de dependencias simplificada**: Se utilizan URLs en lugar de `node_modules`.
- **Rápido y eficiente**: Basado en V8 y Rust, ofrece un excelente rendimiento.

### **Beneficios de Azure Functions**
Azure Functions es una plataforma serverless que permite ejecutar código en la nube sin administrar infraestructura:

- **Escalabilidad automática**: Se adapta a la demanda sin intervención manual.
- **Modelo de pago por uso**: Solo se cobra por el tiempo de ejecución.
- **Integración con otros servicios de Azure**: Como bases de datos, colas y almacenamiento.

## Configuración del Entorno

### **1. Instalar Deno**

Para instalar Deno en tu máquina local, ejecuta:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Verifica la instalación con:

```
deno --version
```

### **2. Configurar Azure Functions**

Para trabajar con Azure Functions, necesitamos la **Azure Functions Core Tools** y una suscripción activa en Azure.

1. **Instalar las herramientas de Azure Functions**

   ```
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```

2. **Iniciar sesión en Azure**

   ```
   az login
   ```

3. **Crear un nuevo proyecto de Azure Functions**

   ```
   func init my-deno-function --worker-runtime custom
   cd my-deno-function
   ```

## Creación de una Función Serverless con Deno

Vamos a crear una función HTTP que reciba una solicitud y devuelva una respuesta utilizando Deno.

### **1. Crear la Función HTTP**

Ejecuta el siguiente comando para generar la función:

```
func new --name helloDeno --template "HTTP trigger" --language JavaScript
```

Esto generará una carpeta `helloDeno` con los archivos necesarios. Ahora, modificamos `helloDeno/index.ts` para usar Deno:

```
export default async function (context: any, req: Request): Promise<void> {
    context.log("Deno Serverless Function ejecutada");
    const name = req.url.searchParams.get("name") || "Mundo";
    
    context.res = {
        body: `Hola, ${name} desde Deno y Azure Functions!`
    };
}
```

### **2. Modificar el archivo `function.json`**

Editamos `helloDeno/function.json` para definir los métodos HTTP permitidos:

```
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## Despliegue en Azure

### **1. Crear un recurso de Azure Functions**

Antes de desplegar, necesitamos un grupo de recursos y una cuenta de almacenamiento:

```
az group create --name deno-serverless --location eastus
az storage account create --name denostorage --location eastus --resource-group deno-serverless --sku Standard_LRS
```

Luego, creamos una instancia de Azure Functions:

```
az functionapp create --resource-group deno-serverless --consumption-plan-location eastus --runtime custom --functions-version 4 --name myDenoFunctionApp --storage-account denostorage
```

### **2. Desplegar la función en Azure**

Ahora podemos desplegar nuestra función con:

```
func azure functionapp publish myDenoFunctionApp
```

Si el despliegue es exitoso, obtendremos una URL donde la función está disponible:

```
https://myDenoFunctionApp.azurewebsites.net/api/helloDeno
```

Podemos probarla enviando una solicitud HTTP:

```
curl "https://myDenoFunctionApp.azurewebsites.net/api/helloDeno?name=Juan"
```

## Integración con una Base de Datos

Para conectar nuestra función con una base de datos, podemos usar Azure Cosmos DB.

1. **Crear una cuenta de Cosmos DB:**

   ```
   az cosmosdb create --resource-group deno-serverless --name denoCosmosDB
   ```

2. **Obtener la cadena de conexión:**

   ```
   az cosmosdb keys list --resource-group deno-serverless --name denoCosmosDB --type connection-strings
   ```

3. **Modificar la función para leer datos de Cosmos DB:**

   ```
   import { Client } from "https://deno.land/x/postgres/mod.ts";
   
   const client = new Client({
       user: "usuario",
       database: "denoDB",
       hostname: "tu-host",
       password: "tu-password",
       port: 5432
   });

   export default async function (context: any, req: Request): Promise<void> {
       await client.connect();
       const result = await client.query("SELECT * FROM usuarios");
       await client.end();
       
       context.res = {
           body: JSON.stringify(result.rows)
       };
   }
   ```

## Conclusión

Desarrollar aplicaciones serverless con **Deno y Azure Functions** nos permite crear aplicaciones altamente escalables y eficientes sin preocuparnos por la infraestructura. **Deno**, con su seguridad y rendimiento, y **Azure Functions**, con su escalabilidad automática, forman una combinación poderosa para aplicaciones modernas.

¡Explora estas tecnologías y crea tus propias soluciones serverless con Deno y Azure!