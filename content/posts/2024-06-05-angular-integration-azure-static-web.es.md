---
layout: post
title: "Integración de Angular con Azure Static Web Apps: Un caso práctico"
author: Christian Amado
date: 2024-06-05 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, Azure, Angular, Google]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

En la era moderna del desarrollo web, la combinación de frameworks frontend como **Angular** y servicios en la nube como **Azure Static Web Apps** proporciona una solución eficiente y escalable para crear y desplegar aplicaciones. Este artículo explora cómo integrar **Angular** con **Azure Static Web Apps**, mostrando ejemplos prácticos, buenas prácticas y enfoques modernos y seguros para garantizar el éxito en tus proyectos.

<!--more-->

## ¿Por qué elegir Angular y Azure Static Web Apps?
### Ventajas de Angular
1. **Ecosistema robusto**: Angular es un framework completo con herramientas integradas para el desarrollo de aplicaciones escalables.
2. **TypeScript nativo**: Mejora la calidad del código y la experiencia del desarrollador.
3. **Componentes reusables**: Facilitan la organización y el mantenimiento del código.

### Beneficios de Azure Static Web Apps
1. **Despliegue sencillo**: Automatiza el despliegue directo desde repositorios como GitHub.
2. **Distribución global**: Servidores edge para un rendimiento óptimo.
3. **Soporte para APIs**: Integración con Azure Functions para lógica backend.
4. **Certificados SSL automáticos**: Garantiza conexiones seguras sin configuraciones adicionales.

## Configuración inicial
### Requisitos previos
- Node.js y Angular CLI instalados:
  ```
  npm install -g @angular/cli
  ```
- Cuenta de Azure activa.
- Repositorio en GitHub (opcional pero recomendado).

### Crear una aplicación Angular
1. Generar un nuevo proyecto:
   ```
   ng new angular-azure-demo --routing --style css
   ```
2. Navegar al directorio del proyecto:
   ```
   cd angular-azure-demo
   ```
3. Ejecutar el servidor de desarrollo:
   ```
   ng serve
   ```

## Preparar la aplicación para despliegue
### Generar los archivos de producción
1. Ejecutar el comando de construcción:
   ```
   ng build --prod
   ```
2. Los archivos generados se encontrarán en el directorio `dist/angular-azure-demo`.

### Configurar un archivo `staticwebapp.config.json`
Este archivo define rutas y configuraciones personalizadas para Azure Static Web Apps:
```
{
  "routes": [
    {
      "route": "/api/*",
      "method": "GET",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "rewrite": "/index.html"
    }
  ]
}
```

Guarda este archivo en el directorio `dist/angular-azure-demo`.

## Crear y configurar Azure Static Web App
### Paso 1: Crear un recurso en Azure
1. Inicia sesión en el [portal de Azure](https://portal.azure.com).
2. Selecciona **Crear un recurso** y busca **Static Web Apps**.
3. Completa los detalles del recurso:
   - **Nombre**: `angular-static-web`.
   - **Plan**: Gratis (Free).
   - **Región**: Elige la más cercana a tus usuarios.

### Paso 2: Vincular el repositorio
1. Conecta el recurso con tu repositorio de GitHub.
2. Selecciona la rama principal y el directorio de la aplicación (`/dist/angular-azure-demo`).

### Paso 3: Despliegue automático
Cada vez que actualices la rama principal, Azure redeployará la aplicación automáticamente.

## Integrar una API con Azure Functions
### Crear una Azure Function
1. Instalar las herramientas necesarias:
   ```
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```
2. Crear un proyecto de funciones:
   ```
   func init api --typescript
   ```
3. Crear una nueva función HTTP:
   ```
   cd api
   func new --template "HTTP trigger" --name GetMessage
   ```

### Conectar la API con la aplicación Angular
1. Modificar el código de la función:
   ```
   export async function run(context: Context, req: HttpRequest): Promise<void> {
       context.res = {
           body: { message: "Hola desde Azure Functions" }
       };
   }
   ```
2. Agregar un servicio Angular para consumir la API:
   ```
   import { HttpClient } from '@angular/common/http';
   import { Injectable } from '@angular/core';

   @Injectable({ providedIn: 'root' })
   export class ApiService {
     constructor(private http: HttpClient) {}

     getMessage() {
       return this.http.get('/api/GetMessage');
     }
   }
   ```
3. Usar el servicio en un componente:
   ```
   import { Component, OnInit } from '@angular/core';
   import { ApiService } from './api.service';

   @Component({
     selector: 'app-root',
     template: `<h1>{{ message }}</h1>`
   })
   export class AppComponent implements OnInit {
     message = '';

     constructor(private api: ApiService) {}

     ngOnInit() {
       this.api.getMessage().subscribe((data: any) => {
         this.message = data.message;
       });
     }
   }
   ```

## Buenas prácticas
1. **Usar HTTPS**: Siempre habilita HTTPS en el entorno de producción.
2. **Monitorear el rendimiento**: Utiliza Azure Monitor para detectar cuellos de botella.
3. **Validar entradas**: Implementa validaciones en la API para evitar vulnerabilidades como inyecciones.
4. **Minimizar y optimizar recursos**: Usa herramientas como `ng build --prod` para reducir el tamaño de los archivos.
5. **Seguridad**: Configura roles y permisos en el archivo `staticwebapp.config.json` para proteger rutas sensibles.

## Conclusión
La integración de Angular con **Azure Static Web Apps** ofrece una solución moderna, escalable y eficiente para desplegar aplicaciones web. Siguiendo las mejores prácticas y aprovechando herramientas como Azure Functions, puedes construir sistemas completos y seguros que se adapten a las necesidades de tus usuarios. ¡Empieza hoy mismo a aprovechar estas tecnologías y lleva tus proyectos al siguiente nivel!