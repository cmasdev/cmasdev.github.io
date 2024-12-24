---
layout: post
title: "Optimización de Angular Universal para SEO y rendimiento"
author: Christian Amado
date: 2024-07-31 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,Google]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

**Angular Universal** es una herramienta poderosa que permite realizar el renderizado del lado del servidor (SSR, por sus siglas en inglés) en aplicaciones **Angular**. Esto no solo mejora la experiencia del usuario, sino que también optimiza la aplicación para motores de búsqueda (SEO) y mejora significativamente el rendimiento. Este artículo explora cómo optimizar **Angular Universal** para **SEO** y rendimiento con ejemplos prácticos y buenas prácticas.

<!--more-->

## ¿Qué es Angular Universal?

**Angular Universal** es una tecnología que permite renderizar aplicaciones **Angular** en el servidor antes de enviarlas al cliente. Esto ayuda a los motores de búsqueda y a las redes sociales a indexar correctamente las páginas y a mejorar el tiempo de carga inicial de la aplicación.

### Beneficios de Angular Universal

1. **Mejoras en SEO**: Permite que los motores de búsqueda indexen contenido dinámico.
2. **Rendimiento mejorado**: Reduce el tiempo hasta el primer renderizado.
3. **Compartibilidad social**: Genera metadatos dinámicos para compartir en redes sociales.
4. **Compatibilidad**: Funciona en navegadores sin soporte para JavaScript habilitado.


## Configuración de Angular Universal

### Requisitos previos

1. Tener Angular CLI instalado:
   ```
   npm install -g @angular/cli
   ```
2. Crear o tener un proyecto Angular existente.

### Agregar Angular Universal a tu proyecto

1. Ejecuta el siguiente comando para agregar Angular Universal:
   ```
   ng add @nguniversal/express-engine
   ```

   Esto configura automáticamente los archivos necesarios y agrega soporte para SSR.

2. Verifica que se hayan creado los siguientes archivos:
   - `server.ts`: El punto de entrada para el servidor.
   - `angular.json`: Actualizado con las configuraciones de SSR.
   - `main.server.ts`: El módulo principal para la ejecución del servidor.

### Ejecutar la aplicación en modo SSR

1. Construye la aplicación para SSR:
   ```
   npm run build:ssr
   ```

2. Sirve la aplicación:
   ```
   npm run serve:ssr
   ```

   Visita `http://localhost:4000` para verificar que la aplicación se renderice del lado del servidor.

## Optimización para SEO

### Implementar metadatos dinámicos

1. Usa el servicio `Meta` para actualizar los metadatos de la página:

   ```
   import { Component } from '@angular/core';
   import { Meta, Title } from '@angular/platform-browser';

   @Component({
     selector: 'app-home',
     templateUrl: './home.component.html',
   })
   export class HomeComponent {
     constructor(private meta: Meta, private title: Title) {
       this.title.setTitle('Página de inicio - Mi Aplicación');
       this.meta.addTags([
         { name: 'description', content: 'Bienvenido a nuestra aplicación optimizada para SEO.' },
         { name: 'keywords', content: 'Angular, SEO, Universal' },
       ]);
     }
   }
   ```

2. Asegúrate de que cada página tenga un título único y metadatos relevantes.

### Crear un archivo `robots.txt`

1. Crea un archivo `src/assets/robots.txt` con las siguientes líneas:
   ```
   User-agent: *
   Allow: /
   ```

2. Incluye el archivo en el proceso de construcción:
   ```
   {
     "assets": [
       "src/assets",
       "src/robots.txt"
     ]
   }
   ```

### Agregar un `sitemap.xml`

1. Usa herramientas como [Sitemap Generator](https://www.xml-sitemaps.com/) para crear un archivo `sitemap.xml`.
2. Inclúyelo en la carpeta `src/assets` y asegúrate de que esté accesible desde el servidor.


## Optimización para rendimiento

### Lazy Loading

Divide tu aplicación en módulos cargados bajo demanda:

1. Configura módulos con lazy loading:
   ```
   const routes: Routes = [
     {
       path: 'feature',
       loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
     },
   ];
   ```

2. Verifica que cada módulo solo se cargue cuando sea necesario.

### Implementar precarga

1. Usa el servicio de precarga predeterminado de Angular:
   ```
   RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
   ```

2. Asegúrate de que los módulos importantes se carguen rápidamente.

### Compresión de archivos

1. Configura el servidor para servir archivos comprimidos con Gzip o Brotli.
2. Usa herramientas como `webpack-bundle-analyzer` para reducir el tamaño de los paquetes.

### Caché en el servidor

1. Configura el caché para recursos estáticos y dinámicos:
   ```
   server.use(express.static('dist/browser', { maxAge: '1y' }));
   ```

2. Usa Service Workers para manejar la caché del lado del cliente.

## Buenas prácticas

1. **Mantener URLs amigables**:
   - Usa URLs descriptivas y evita parámetros innecesarios.

2. **Evitar contenido duplicado**:
   - Configura etiquetas `canonical` para páginas duplicadas.

3. **Supervisar el rendimiento**:
   - Usa herramientas como Lighthouse y PageSpeed Insights para identificar áreas de mejora.

4. **Pruebas regulares**:
   - Verifica que los motores de búsqueda indexen correctamente tu aplicación.

5. **Minimizar recursos**:
   - Usa imágenes optimizadas y minimiza los archivos CSS y JavaScript.


## Conclusión

Optimizar **Angular Universal** para **SEO** y rendimiento no solo mejora la experiencia del usuario, sino que también garantiza que tu aplicación sea accesible y visible para los motores de búsqueda. Siguiendo las buenas prácticas y utilizando las herramientas adecuadas, puedes maximizar el potencial de tu aplicación y destacarte en un entorno web competitivo. ¡Comienza hoy mismo y lleva tu aplicación Angular al siguiente nivel!
