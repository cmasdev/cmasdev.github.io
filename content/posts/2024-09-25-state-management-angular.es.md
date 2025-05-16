---
layout: post
title: "Gestión de estado en Angular con NgRx"
author: Christian Amado
date: 2024-09-25 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,Firebase]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

La gestión de estado es un aspecto fundamental en el desarrollo de aplicaciones frontend, especialmente en aplicaciones complejas donde se manejan grandes cantidades de datos compartidos entre componentes. **NgRx** es una librería basada en **Redux** que permite gestionar el estado de manera predecible y escalable en aplicaciones **Angular**. Este artículo ofrece una guía detallada para implementar y utilizar NgRx en tus proyectos Angular.

<!--more-->

## 1. ¿Qué es NgRx y por qué usarlo?

NgRx es una implementación de patrones Redux y RxJS para Angular. Redux se basa en un estado único y centralizado que describe toda la aplicación. NgRx combina este patrón con la reactividad de RxJS para manejar flujos de datos asincrónicos y garantizar la inmutabilidad.

### Ventajas de NgRx:
- **Estado centralizado:** Facilita la sincronización entre componentes.
- **Predecibilidad:** Los cambios en el estado son manejados mediante acciones y reducers, lo que mejora la trazabilidad.
- **Escalabilidad:** Ideal para aplicaciones de gran tamaño.
- **Integración con RxJS:** Simplifica el manejo de operaciones asincrónicas.

## 2. Instalación y configuración inicial

1. **Instalar NgRx:**
   ```
   npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
   ```

2. **Configurar el Store en el módulo principal:**
   ```
   import { NgModule } from '@angular/core';
   import { StoreModule } from '@ngrx/store';
   import { EffectsModule } from '@ngrx/effects';
   import { StoreDevtoolsModule } from '@ngrx/store-devtools';
   import { environment } from '../environments/environment';

   @NgModule({
     imports: [
       StoreModule.forRoot({}, {}),
       EffectsModule.forRoot([]),
       !environment.production ? StoreDevtoolsModule.instrument() : []
     ],
     declarations: [AppComponent],
     bootstrap: [AppComponent]
   })
   export class AppModule {}
   ```

## 3. Conceptos fundamentales de NgRx

### Store
El **Store** es un contenedor global para el estado de la aplicación. Proporciona una única fuente de verdad que todos los componentes pueden acceder.

### Actions
Las **acciones** describen eventos que ocurren en la aplicación y disparan cambios en el estado.

```
import { createAction, props } from '@ngrx/store';

export const loadTasks = createAction('[Tasks] Load Tasks');
export const addTask = createAction('[Tasks] Add Task', props<{ task: string }>());
```

### Reducers
Los **reducers** especifican cómo cambia el estado en respuesta a las acciones.

```
import { createReducer, on } from '@ngrx/store';
import { loadTasks, addTask } from './tasks.actions';

export interface TaskState {
  tasks: string[];
}

export const initialState: TaskState = { tasks: [] };

export const tasksReducer = createReducer(
  initialState,
  on(loadTasks, state => ({ ...state })),
  on(addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] }))
);
```

### Selectors
Los **selectors** permiten acceder a partes específicas del estado.

```
import { createSelector } from '@ngrx/store';

export const selectTasksState = (state: any) => state.tasks;
export const selectAllTasks = createSelector(
  selectTasksState,
  (state: TaskState) => state.tasks
);
```

### Effects
Los **effects** manejan operaciones asincrónicas como llamadas HTTP y despachan nuevas acciones.

```
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { TaskService } from './task.service';
import { loadTasks, addTask } from './tasks.actions';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      mergeMap(() => this.taskService.getTasks().pipe(
        map(tasks => addTask({ task: tasks[0] }))
      ))
    )
  );

  constructor(private actions$: Actions, private taskService: TaskService) {}
}
```

## 4. Implementación paso a paso

### 1. Creación del Store
Define el estado inicial y regístralo en el módulo principal.

### 2. Definición de acciones y reducers
Crea acciones para describir eventos y reducers para modificar el estado.

### 3. Uso de selectors en componentes
Accede al estado usando `Store` y `selectors`.

```
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllTasks } from './tasks.selectors';

@Component({
  selector: 'app-task-list',
  template: '<ul><li *ngFor="let task of tasks$ | async">{{ task }}</li></ul>'
})
export class TaskListComponent {
  tasks$ = this.store.select(selectAllTasks);

  constructor(private store: Store) {}
}
```

### 4. Manejo de efectos para llamadas HTTP
Usa effects para realizar operaciones asincrónicas y despachar acciones.

## 5. Buenas prácticas en NgRx

- **Mantén los reducers simples:** Divide los reducers en funciones más pequeñas si es necesario.
- **Usa actions descriptivas:** Los nombres de las acciones deben describir claramente el evento.
- **Centraliza la lógica en effects:** Mantén las operaciones complejas fuera de los componentes.
- **Prueba todo:** Asegúrate de probar reducers, effects y selectors.

## 6. Ejemplo práctico: Aplicación de tareas

### Estructura del proyecto
```
project/
├── actions/
│   └── tasks.actions.ts
├── reducers/
│   └── tasks.reducer.ts
├── effects/
│   └── tasks.effects.ts
├── selectors/
│   └── tasks.selectors.ts
└── components/
    └── task-list.component.ts
```

### Resultado esperado
Una lista de tareas que se actualiza dinámicamente al agregar nuevas tareas o al cargarlas desde una API.

## 7. Conclusión

**NgRx** es una herramienta poderosa para gestionar el estado en aplicaciones Angular complejas. Aunque puede requerir una curva de aprendizaje inicial, su enfoque estructurado y predecible mejora significativamente la mantenibilidad y escalabilidad del código. Al seguir las mejores prácticas descritas en este artículo, estarás bien equipado para implementar **NgRx** en tus proyectos Angular con éxito.
