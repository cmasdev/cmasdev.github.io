---
layout: post
title: "Lazy Loading avanzado en Angular con rutas dinámicas"
author: Christian Amado
date: 2024-11-06 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, Angular]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

El **Lazy Loading** es una técnica fundamental en Angular para mejorar el rendimiento de las aplicaciones al cargar solo los módulos necesarios cuando se requieren. En este artículo, exploraremos cómo implementar **Lazy Loading avanzado con rutas dinámicas** para optimizar aún más la carga de módulos y mejorar la experiencia del usuario.

<!--more-->

## ¿Qué es el Lazy Loading en Angular?

**Lazy Loading (Carga diferida)** permite que los módulos de una aplicación Angular se carguen solo cuando se necesitan, en lugar de cargar todo el código de la aplicación desde el inicio.

### **Ventajas del Lazy Loading**
- **Mejora el rendimiento**: Reduce el tiempo de carga inicial de la aplicación.
- **Optimiza el uso de recursos**: Solo se cargan los módulos cuando son necesarios.
- **Reduce el consumo de memoria**: La aplicación no mantiene en memoria módulos innecesarios.
- **Escalabilidad**: Facilita la gestión de grandes aplicaciones con múltiples módulos.

## Configuración Básica del Lazy Loading

Para empezar, configuraremos una aplicación Angular con Lazy Loading. Supongamos que tenemos los siguientes módulos:

- **HomeModule** → `/home`
- **AdminModule** → `/admin`
- **UserModule** → `/user`

### **1. Configurar el AppRoutingModule**

```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

## Lazy Loading con Rutas Dinámicas

En muchas aplicaciones, las rutas pueden ser dinámicas, lo que significa que los módulos deben cargarse en función de parámetros o roles de usuario. Vamos a ver cómo hacerlo con Angular.

### **1. Crear un servicio para la carga dinámica de módulos**

```
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DynamicLoaderGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route): boolean {
    const userRole = this.authService.getUserRole();
    if (route.path === 'admin' && userRole !== 'admin') {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
```

### **2. Configurar las rutas con el Lazy Loading condicional**

```
const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canLoad: [DynamicLoaderGuard] },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: '**', redirectTo: 'home' }
];
```

Aquí, usamos `canLoad` para evitar la carga del módulo si el usuario no tiene el rol adecuado.

## Implementación de un Loader para el Lazy Loading

Para mejorar la experiencia del usuario, podemos agregar un **Loader** que se muestre mientras se carga un módulo.

### **1. Crear un Loader Component**

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<div class="loader">Cargando...</div>`,
  styles: [`.loader { font-size: 20px; text-align: center; padding: 20px; }`]
})
export class LoaderComponent {}
```

### **2. Modificar el AppComponent para mostrar el Loader**

```
import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <app-loader *ngIf="isLoading"></app-loader>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  isLoading = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.isLoading = false;
      }
    });
  }
}
```

Con esta implementación, se mostrará el Loader mientras un módulo se está cargando.

## Optimización del Lazy Loading con Prefetching

Podemos optimizar aún más la carga diferida utilizando **preloading strategies**, lo que permite cargar en segundo plano los módulos que probablemente se necesiten pronto.

### **1. Usar PreloadAllModules**

```
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

Esta estrategia carga los módulos en segundo plano después de que la aplicación haya terminado de cargar, mejorando la velocidad de navegación sin afectar el rendimiento inicial.

## Conclusión

El **Lazy Loading avanzado en Angular** con rutas dinámicas permite optimizar el rendimiento de las aplicaciones y mejorar la experiencia del usuario. Implementar estrategias como **canLoad**, **Loaders visuales** y **Preloading Strategies** ayuda a gestionar mejor los recursos y acelerar la carga de los módulos.

Con este enfoque, puedes construir aplicaciones más eficientes y escalables, garantizando una navegación fluida y una mejor administración de los módulos en tu proyecto Angular.