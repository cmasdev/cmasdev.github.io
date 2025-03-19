---
layout: post
title: "Deploy automatizado de APIs Deno en Azure Functions"
author: Christian Amado
date: 2025-02-05 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Deno,Azure]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.jpg
---

El despliegue automatizado de APIs en la nube es una práctica esencial en el desarrollo moderno. **Deno**, con su seguridad integrada y soporte nativo para TypeScript, es una excelente opción para construir APIs escalables y eficientes. **Azure Functions**, por otro lado, permite ejecutar código sin preocuparse por la infraestructura subyacente.

En este artículo, aprenderás cómo **desplegar automáticamente una API de Deno en Azure Functions** usando GitHub Actions.

<!--more-->

## 1. ¿Por qué Usar Deno con Azure Functions?

Las ventajas de utilizar Deno con **Azure Functions** incluyen:

✅ **Ejecuta código sin servidores**: Solo pagas por las ejecuciones realizadas.  
✅ **Compatibilidad con TypeScript**: No requiere configuración adicional.  
✅ **Seguridad mejorada**: Deno requiere permisos explícitos.  
✅ **Escalabilidad automática**: Azure Functions escala dinámicamente según la carga.  
✅ **Despliegue automatizado**: Se puede integrar con GitHub Actions para CI/CD.  

## 2. Configuración del Proyecto Deno

### **2.1 Instalación de Deno**
Si no tienes Deno instalado, usa el siguiente comando:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
deno --version
```

### **2.2 Creación de una API en Deno**

Primero, creamos una API REST básica usando el framework Oak:

```
mkdir deno-api && cd deno-api
echo "{}" > deps.ts
echo "{}" > server.ts
echo "{}" > routes.ts
echo "{}" > controllers.ts
```

#### **`deps.ts` (Dependencias)**

```
export { Application, Router } from "https://deno.land/x/oak/mod.ts";
```

#### **`server.ts` (Servidor Principal)**

```
import { Application } from "./deps.ts";
import router from "./routes.ts";

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("API Deno corriendo en http://localhost:8080");
await app.listen({ port: 8080 });
```

#### **`routes.ts` (Definición de Rutas)**

```
import { Router } from "./deps.ts";
import { getHello } from "./controllers.ts";

const router = new Router();
router.get("/hello", getHello);

export default router;
```

#### **`controllers.ts` (Controlador de Rutas)**

```
import { Context } from "https://deno.land/x/oak/mod.ts";

export const getHello = (ctx: Context) => {
    ctx.response.body = { message: "Hola desde Deno y Azure!" };
};
```

## 3. Configuración de Azure Functions

### **3.1 Crear un Azure Function App**
1. Ingresa a [Azure Portal](https://portal.azure.com/).
2. Dirígete a **Azure Functions** y selecciona **Crear Función**.
3. Configura los siguientes parámetros:
   - **Nombre de la función**: `deno-api-func`
   - **Lenguaje**: **Custom Handler**
   - **Plan de ejecución**: **Consumo (Pay-as-you-go)**
   - **Sistema Operativo**: **Linux**
   - **Región**: La más cercana a tu ubicación.
4. Presiona **Crear y Desplegar**.

### **3.2 Configurar Variables de Entorno**

En el portal de Azure, dirígete a **Configuración > Variables de Entorno** y añade:

- `DENO_VERSION=1.38.0`
- `PORT=8080`

## 4. Creación de `host.json` y `function.json`

Para que Azure Functions entienda nuestra API, debemos crear archivos de configuración.

#### **`host.json`**
```
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[3.*, 4.0.0)"
  }
}
```

#### **`function.json`**
```
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## 5. Automatización con GitHub Actions

Para desplegar automáticamente nuestra API Deno en **Azure Functions**, usaremos GitHub Actions.

### **5.1 Crear un archivo de Workflow**

En el repositorio de GitHub, crea la ruta `.github/workflows/deploy.yml` y agrega lo siguiente:

```
name: Deploy Deno API to Azure Functions

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Deploy to Azure Functions
        uses: Azure/functions-action@v1
        with:
          app-name: "deno-api-func"
          package: "."
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
```

### **5.2 Configurar Secretos en GitHub**

1. Entra a tu repositorio en GitHub.
2. Ve a **Settings > Secrets and Variables > Actions**.
3. Agrega un secreto llamado `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` con el contenido del perfil de publicación de Azure.

## 6. Despliegue y Prueba

### **6.1 Ejecutar el Despliegue**
Cada vez que hagas `git push` a la rama `main`, GitHub Actions ejecutará el despliegue automáticamente.

```
git add .
git commit -m "Deploy API Deno en Azure Functions"
git push origin main
```

### **6.2 Probar la API en Azure**

Cuando el despliegue finalice, podrás acceder a la API con:

```
curl https://deno-api-func.azurewebsites.net/api/hello
```

Debería responder:
```
{ "message": "Hola desde Deno y Azure!" }
```

## 7. Conclusión

El **deploy automatizado de APIs Deno en Azure Functions** ofrece una solución escalable y eficiente sin preocuparse por la infraestructura. **GitHub Actions** facilita la automatización del proceso CI/CD.