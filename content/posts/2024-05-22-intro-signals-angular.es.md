---
layout: post
title: "Introducción a los Signals en Angular: Casos prácticos"
author: Christian Amado
date: 2024-05-22 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development, Angular, Google]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

Angular es un framework robusto y evolutivo que continuamente introduce nuevas características para mejorar el desarrollo de aplicaciones web modernas. Una de estas innovaciones son los **Signals**, una herramienta que permite manejar cambios de estado de manera reactiva, clara y eficiente. Este artículo ofrece una introducción detallada a los Signals en Angular, explicando cómo utilizarlos, sus ventajas comparativas frente a otras soluciones reactivas y sus aplicaciones en el desarrollo real, acompañado de casos prácticos ampliados, buenas prácticas y un enfoque moderno en seguridad.

<!--more-->

## ¿Qué son los Signals en Angular?
Los Signals son una forma reactiva de manejar cambios de estado dentro de una aplicación Angular. A diferencia de las propiedades tradicionales o las soluciones basadas en *Observables* de *RxJS*, los Signals proporcionan un enfoque más directo para gestionar actualizaciones en la interfaz de usuario. Esta simplicidad es particularmente útil para escenarios donde se necesita un manejo del estado local claro y eficiente, reduciendo la complejidad general del código.

### Características clave de los Signals
1. **Reactividad Automática**: Los Signals reaccionan automáticamente a los cambios en su estado, actualizando los componentes afectados. Esto elimina la necesidad de invocar manualmente procesos de actualización de la interfaz.
2. **Simplicidad**: Reducir la necesidad de suscribirse y manejar manualmente flujos de datos, mejorando la legibilidad del código.
3. **Integración nativa**: Diseñar para integrarse de manera fluida con Angular, los Signals pueden ser utilizados junto con otras herramientas del framework.

## Configuración de Signals en Angular
### Paso 1: Configurar un proyecto Angular
Primero, crear un nuevo proyecto Angular utilizando Angular CLI. Este proceso genera una estructura base para la aplicación.

```
ng new signals-demo --routing --style css
```

### Paso 2: Instalar las dependencias necesarias
Si los Signals no están incluidos en tu versión de Angular, se debe asegurar de actualizar a la última versión. Esto garantiza que se tenga acceso a las funcionalidades más recientes y al soporte técnico oficial.

```
ng update @angular/core @angular/cli
```

## Usando Signals en Angular
### Declaración de un Signal
Poder declarar un Signal utilizando el método `signal` del paquete Angular. Este método permitir definir estados reactivos que pueden actualizarse y observarse de manera eficiente.

```
import { signal } from '@angular/core';

export class AppComponent {
  count = signal(0);

  increment() {
    this.count.update(value => value + 1);
  }
}
```

### Uso en plantillas
Los Signals se integran perfectamente con las plantillas de Angular. Se puede enlazarlos directamente, lo que simplifica la gestión del estado en la interfaz de usuario.

```
<div>
  <p>Contador: {{ count() }}</p>
  <button (click)="increment()">Incrementar</button>
</div>
```

### Reactividad con Computed Signals
Los *Computed Signals* permiten derivar valores basados en otros Signals. Esto es útil para evitar cálculos repetitivos o duplicados en la aplicación.

```
import { signal, computed } from '@angular/core';

export class AppComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(value => value + 1);
  }
}
```

En la plantilla:

```
<div>
  <p>Doble del contador: {{ doubleCount() }}</p>
  <button (click)="increment()">Incrementar</button>
</div>
```

## Casos Prácticos
### 1. Manejo de Estados Globales
Los Signals son útiles para gestionar estados compartidos en una aplicación. Un ejemplo clásico es la administración del estado de autenticación.

#### Ejemplo
```
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn = signal(false);

  isLoggedIn = this._isLoggedIn.asReadonly();

  login() {
    this._isLoggedIn.set(true);
  }

  logout() {
    this._isLoggedIn.set(false);
  }
}
```

### 2. Formularios Reactivos con Signals
Los Signals pueden simplificar la reactividad en formularios, mejorando la claridad del código y reduciendo la dependencia de estados auxiliares.

#### Ejemplo
```
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.isSubmitting.set(true);
      // Simular una petición de login
      setTimeout(() => {
        this.isSubmitting.set(false);
      }, 2000);
    }
  }
}
```

Plantilla:
```
<form [formGroup]="loginForm" (ngSubmit)="submit()">
  <input formControlName="username" placeholder="Usuario" />
  <input formControlName="password" type="password" placeholder="Contraseña" />
  <button type="submit" [disabled]="isSubmitting()">Iniciar Sesión</button>
</form>
```
## Buenas Prácticas con Signals
1. **Mantener la simplicidad**: Usar Signals para estados locales y Observables para flujos de datos complejos o asíncronos.
2. **Usar Signals derivados**: Preferir `computed` para evitar código duplicado y mejorar la eficiencia.
3. **Proteger los Signals**: Utilizar `asReadonly` para evitar modificaciones accidentales en estados que no deben cambiarse directamente.
4. **Combinar Signals y Observables**: En aplicaciones grandes, considerar usar Signals para estados locales y Observables para comunicaciones con servicios remotos.

## Seguridad con Signals
1. **Validar datos**: Siempre validar los datos antes de actualizarlos en un Signal. Esto es especialmente importante en escenarios donde los datos provienen de entradas de usuario.
2. **Evitar manipulaciones directas**: Encapsular los Signals en servicios para proteger su integridad y evitar accesos no autorizados.
3. **Auditar**: Implementar logs para registrar cambios en Signals sensibles. Esto permite rastrear modificaciones inesperadas y detectar posibles problemas de seguridad.
4. **Evitar exponerse a cambios externos**: Cuando se trabaja con aplicaciones multiusuario, considerar estrategias de sincronización seguras para evitar conflictos.

## Conclusión
Los Signals representan un avance significativo en el manejo del estado reactivo en Angular. Su simplicidad y eficiencia los convierten en una herramienta esencial para aplicaciones modernas. Al adoptar buenas prácticas y aprovechar sus características avanzadas, como los Computed Signals, los desarrolladores pueden construir experiencias de usuario más fluidas, escalables y seguras. ¡Empezá a explorar los Signals hoy mismo y transforma la manera en que diseñas aplicaciones con Angular! Además, considerar su combinación con otras herramientas reactivas para maximizar su impacto en proyectos complejos.
