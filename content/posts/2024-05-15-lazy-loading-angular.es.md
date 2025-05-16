---
layout: post
title: "Lazy Loading en Angular: Mejora el rendimiento de tus aplicaciones"
author: Christian Amado
date: 2024-05-15 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,Google]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

El rendimiento es un factor crítico en las aplicaciones web modernas. Angular, como uno de los frameworks más populares para construir aplicaciones, ofrece herramientas avanzadas para optimizar la carga y el uso de recursos. Una de estas herramientas es el **Lazy Loading** (carga diferida), que permite cargar módulos de la aplicación sólo cuando son necesarios. Este artículo explora cómo implementar Lazy Loading en Angular, sus beneficios y las mejores prácticas para maximizar su eficacia.

## ¿Qué es Lazy Loading?
Lazy Loading es una técnica que retrasa la carga de recursos o módulos hasta que sean realmente necesarios. En el contexto de Angular, esto implica cargar partes específicas de la aplicación (como módulos) sólo cuando el usuario las solicita. Esto mejora significativamente el tiempo de carga inicial de la aplicación y reduce el uso de recursos del navegador.

### Beneficios de Lazy Loading
1. **Tiempo de carga inicial reducido**: Solo se cargan los recursos necesarios para la vista inicial.
2. **Uso eficiente de recursos**: Reduce la cantidad de código que el navegador necesita procesar al inicio.
3. **Mejora en la experiencia del usuario**: La aplicación responde más rápido a las interacciones iniciales.
4. **Soporte para escalabilidad**: Ideal para aplicaciones grandes con múltiples módulos y rutas.

## Configuración básica de Lazy Loading en Angular

### Paso 1: Crear un módulo con rutas independientes
Primero, generar un nuevo módulo utilizando Angular CLI:

```
ng generate module feature --route feature --module app.module
```

Este comando genera un módulo llamado `FeatureModule` y configura la ruta correspondiente en el `AppRoutingModule`.

### Paso 2: Configurar rutas con Lazy Loading
El archivo `app-routing.module.ts` debería verse así:

```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Paso 3: Crear componentes dentro del módulo cargado de forma diferida
Dentro del `FeatureModule`, genera un componente:

```
ng generate component feature/feature-home
```

Asegúrate de declarar este componente en el `FeatureModule` y configurarlo en el archivo `feature-routing.module.ts`:

```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureHomeComponent } from './feature-home/feature-home.component';

const routes: Routes = [
  { path: '', component: FeatureHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
```

## Mejores prácticas para Lazy Loading
1. **Organización modular**: Divide la aplicación en módulos coherentes y significativos.
2. **Prefetching**: Carga anticipada de módulos con alta probabilidad de ser usados.
3. **Rutas protegidas**: Implementa Lazy Loading junto con guardias de ruta (route guards) para asegurar recursos sensibles.
4. **Análisis de rendimiento**: Usa herramientas como Lighthouse para identificar oportunidades de mejora.

### Ejemplo: Implementación de prefetching
El prefetching anticipa y carga módulos en segundo plano mientras el usuario interactúa con la aplicación.

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

## Seguridad en Lazy Loading
Lazy Loading también puede usarse para proteger rutas sensibles de forma eficiente. Algunos enfoques incluyen:

### Uso de Route Guards
Los Route Guards controlan el acceso a rutas específicas. Implementa un guardia básico:

```
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
```

Configura el guardia en la ruta:

```
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
    canActivate: [AuthGuard],
  },
];
```

### Validación de datos en el servidor
Siempre valida los datos del lado del servidor para evitar accesos no autorizados, incluso si se usan guardias del lado del cliente.

## Conclusión
Lazy Loading es una técnica poderosa para optimizar aplicaciones Angular, mejorando tanto el rendimiento como la experiencia del usuario. Al combinar Lazy Loading con buenas prácticas de seguridad y prefetching, puedes construir aplicaciones escalables, rápidas y seguras. Mantén tu aplicación organizada y realiza pruebas de rendimiento periódicas para garantizar su eficacia.