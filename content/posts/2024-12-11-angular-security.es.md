---
layout: post
title: "Seguridad en Angular: Roles y autenticación avanzada"
author: Christian Amado
date: 2024-12-11 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

La seguridad en Angular es un aspecto fundamental para cualquier aplicación web moderna. Implementar un sistema de autenticación robusto y un control de acceso basado en roles garantiza la integridad y protección de los datos. En este artículo, exploraremos estrategias avanzadas de autenticación y gestión de roles en Angular con ejemplos prácticos.

<!--more-->

## 1. Introducción a la Seguridad en Angular

Las aplicaciones web requieren mecanismos de seguridad efectivos para proteger información sensible y garantizar que los usuarios solo accedan a los recursos que les corresponden. En Angular, se pueden implementar diversas estrategias de seguridad, tales como:

- **Autenticación**: Verificación de identidad de los usuarios.
- **Autorización basada en roles**: Control de acceso según privilegios de usuario.
- **Protección de rutas**: Restricción de acceso a ciertas secciones de la aplicación.
- **Manejo de tokens (JWT)**: Uso de tokens seguros para gestionar sesiones.

## 2. Implementación de Autenticación en Angular

### 2.1 Configuración del Proyecto

Primero, creamos un nuevo proyecto Angular e instalamos las dependencias necesarias:

```
ng new angular-security
cd angular-security
npm install @angular/fire firebase jsonwebtoken
```

### 2.2 Creación del Servicio de Autenticación

El servicio `AuthService` manejará el registro, inicio de sesión y cierre de sesión de usuarios.

```
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string>('');

  constructor(private router: Router) {}

  login(email: string, password: string): void {
    // Simulación de autenticación
    if (email === 'admin@demo.com' && password === 'password') {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('role', 'admin');
      this.authState.next(true);
      this.userRole.next('admin');
      this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.authState.next(false);
    this.userRole.next('');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }
}
```

## 3. Protección de Rutas en Angular

Angular proporciona **route guards** para restringir el acceso a ciertas rutas en función de la autenticación del usuario.

### 3.1 Implementación de `AuthGuard`

```
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

### 3.2 Configuración de las Rutas Protegidas

```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

## 4. Gestión de Roles en Angular

Para restringir accesos según el rol del usuario, utilizamos un **Role Guard**.

### 4.1 Implementación de `RoleGuard`

```
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();
    if (role === 'admin') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

### 4.2 Aplicación del `RoleGuard` en Rutas
```
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [RoleGuard] },
];
```

## 5. Implementación de JSON Web Tokens (JWT)

Para mejorar la seguridad, se recomienda el uso de **JWT** para gestionar sesiones.

### 5.1 Generación de un JWT en el Servidor (Node.js)

```
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign({ email: user.email, role: user.role }, 'secreto', { expiresIn: '1h' });
}
```

### 5.2 Validación del JWT en el Cliente (Angular)

```
import { HttpClient, HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
this.http.get('https://api.protegida.com/data', { headers });
```

## 6. Conclusión

Implementar autenticación avanzada en Angular es esencial para proteger los datos y restringir el acceso de los usuarios según sus roles. Con **route guards, RoleGuard y JWT**, podemos garantizar un sistema seguro y escalable.

Al aplicar estas prácticas, se fortalece la seguridad de las aplicaciones Angular, proporcionando un entorno confiable para los usuarios.

**Resumen:**
- ✅ Implementación de autenticación en Angular.
- ✅ Protección de rutas con `AuthGuard`.
- ✅ Gestión de roles con `RoleGuard`.
- ✅ Uso de JSON Web Tokens (JWT) para mayor seguridad.

¡Con estas estrategias, puedes mejorar significativamente la seguridad de tus aplicaciones Angular!