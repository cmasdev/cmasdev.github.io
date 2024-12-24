---
layout: post
title: "Usando Blazor para crear Progressive Web Apps (PWA)"
author: Christian Amado
date: 2024-12-24 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Blazor,.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

**Blazor**, el framework moderno basado en **.NET**, ha demostrado ser una herramienta poderosa para el desarrollo de aplicaciones web interactivas. Combinado con las capacidades de **Progressive Web Apps (PWA)**, ofrece una forma innovadora de construir aplicaciones que funcionan offline. Se pueden instalar en dispositivos y ofrecen una experiencia similar a las aplicaciones nativas. En este artículo, exploraremos cómo usar **Blazor** para crear **PWAs**, centrándonos en las nuevas capacidades introducidas con **.NET 9**, buenas prácticas y ejemplos detallados.

<!--more-->

## ¿Qué es una Progressive Web App (PWA)?

Las **PWAs** son aplicaciones web que combinan las mejores características de las aplicaciones web y las nativas. Algunas de sus características clave incluyen:

1. **Capacidad offline**: Funcionan sin conexión a internet mediante el uso de *Service Workers*.
2. **Instalables**: Se pueden agregar a la pantalla de inicio de un dispositivo.
3. **Rápidas y responsivas**: Optimizadas para ofrecer un rendimiento similar al de las aplicaciones nativas.
4. **Seguras**: Utilizan *HTTPS* para garantizar conexiones seguras.


## ¿Por qué usar Blazor para PWAs?

1. **Reutilización de código**: Con **Blazor**, puedes usar **C#** y **.NET** tanto en el cliente como en el servidor.
2. **Ecosistema robusto**: Accede a las bibliotecas de .**NET** y herramientas modernas.
3. **Soporte para WebAssembly**: **Blazor WebAssembly** permite ejecutar aplicaciones completas en el navegador.
4. **Integración nativa de PWA**: Con configuraciones simples, **Blazor** puede transformar una aplicación en una **PWA**.


## Configuración inicial

### Requisitos previos

1. Tener instalado **.NET 9 SDK**:
   ```
   dotnet --version
   ```
2. Editor de código, como **Visual Studio 2022** o **Visual Studio Code**.
3. Navegador moderno compatible con **PWAs**.

### Crear un proyecto Blazor WebAssembly

1. Ejecutar el comando para crear un proyecto **PWA**:
   ```
   dotnet new blazorwasm -o BlazorPwaApp --pwa
   ```
2. Navegar al directorio del proyecto:
   ```
   cd BlazorPwaApp
   ```
3. Ejecutar la aplicación:
   ```
   dotnet run
   ```

Al usar la opción `--pwa`, el proyecto incluye configuraciones predeterminadas para convertirlo en una **PWA**.


## Entender los archivos clave de una PWA

### `manifest.json`

El archivo `manifest.json` proporciona metadatos sobre la aplicación, como el nombre, íconos y configuraciones de inicio.

```
{
  "short_name": "BlazorPWA",
  "name": "Blazor Progressive Web App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0078D7",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

El *Service Worker* gestiona el almacenamiento en caché y las funcionalidades offline. En **Blazor**, el archivo predeterminado es `service-worker.published.js`.

#### Ejemplo de manejo de caché

```
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('blazor-cache').then(cache => {
            return cache.addAll([
                '/',
                'index.html',
                'manifest.json',
                '_framework/blazor.webassembly.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
```

## Crear una experiencia offline

### Habilitar funcionalidad offline

1. Actualizar el *Service Worker* para gestionar recursos adicionales.
2. Configurar rutas en `manifest.json` y asegurarse de incluir recursos clave.

#### Ejemplo

Agrega un mensaje personalizado para los usuarios sin conexión:

```
@if (isOffline)
{
    <p>No tienes conexión a internet. Algunas funcionalidades pueden no estar disponibles.</p>
}

@code {
    private bool isOffline;

    protected override void OnInitialized()
    {
        isOffline = !navigator.onLine;
        window.addEventListener('online', () => isOffline = false);
        window.addEventListener('offline', () => isOffline = true);
    }
}
```


## Buenas prácticas para PWAs con Blazor

1. **Optimizar recursos**:
   - Usa herramientas como `dotnet publish` con opciones para reducir el tamaño de los archivos.
2. **Usar HTTPS**:
   - Las **PWAs** requieren *HTTPS* para funcionar correctamente.
3. **Pruebas regulares**:
   - Prueba la aplicación en diferentes navegadores y dispositivos.
4. **Actualizar el Service Worker**:
   - Implementa una estrategia para actualizar el *Service Worker* cuando haya cambios significativos.
5. **Diseño responsivo**:
   - Asegúrate de que la interfaz funcione en diferentes tamaños de pantalla.


## Ventajas y limitaciones de Blazor para PWAs

### Ventajas

1. **Reutilización de código** entre plataformas.
2. **Integración nativa con .NET**.
3. **Compatibilidad con WebAssembly** para un rendimiento eficiente en el cliente.

### Limitaciones

1. **Tamaño inicial** alto en **Blazor WebAssembly**.
2. **Dependencia del ecosistema .NET** para ciertos escenarios.
3. **Curva de aprendizaje** para desarrolladores nuevos en **.NET**.

## Conclusión

Combinar las capacidades de **Blazor** y **PWAs** permite a los desarrolladores crear aplicaciones modernas y escalables que funcionan offline, se pueden instalar y ofrecen una experiencia de usuario mejorada. Aunque existen algunas limitaciones, las ventajas de usar **Blazor** con **PWA** superan ampliamente los desafíos, especialmente para equipos que ya utilizan **.NET** en su flujo de desarrollo. ¡Explora las posibilidades de **Blazor** para **PWAs** y lleva tus aplicaciones web al siguiente nivel!