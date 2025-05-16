---
layout: post
title: "Desarrollo full-stack con Angular y Deno"
author: Christian Amado
date: 2024-10-23 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,Deno]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

El desarrollo full-stack ha evolucionado con nuevas tecnologías que permiten construir aplicaciones modernas, escalables y seguras. En este artículo, exploraremos cómo combinar Angular en el frontend y Deno en el backend para crear aplicaciones full-stack eficientes y bien estructuradas.

<!--more-->

## ¿Por qué Angular y Deno?

### **Ventajas de Angular**

Angular es un framework de desarrollo frontend basado en TypeScript que permite construir aplicaciones web robustas y escalables. Sus principales ventajas incluyen:

- **Arquitectura modular**: Usa módulos y componentes para organizar el código.
- **Two-way data binding**: Permite la sincronización automática entre la vista y el modelo.
- **Soporte para PWA**: Facilita la creación de aplicaciones progresivas.
- **Ecosistema amplio**: Compatible con RxJS, Angular Material y otras bibliotecas.

### **Ventajas de Deno**

Deno es un runtime seguro para JavaScript y TypeScript que ofrece múltiples mejoras con respecto a Node.js. Sus principales características son:

- **Seguridad integrada**: Requiere permisos explícitos para acceder a archivos, red y entorno.
- **Soporte nativo para TypeScript**: No requiere configuración adicional.
- **Gestión de dependencias simplificada**: Usa URLs en lugar de `node_modules`.
- **Servidor HTTP nativo**: Sin necesidad de frameworks adicionales.

## Configuración del entorno

Para desarrollar una aplicación full-stack con Angular y Deno, primero debemos configurar ambos entornos.

### **Instalación de Angular**

1. Instalar Angular CLI:
   ```
   npm install -g @angular/cli
   ```
2. Crear un nuevo proyecto Angular:
   ```
   ng new frontend-angular
   cd frontend-angular
   ```
3. Ejecutar la aplicación:
   ```
   ng serve --open
   ```

### **Instalación de Deno**

1. Instalar Deno:
   ```
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```
2. Verificar la instalación:
   ```
   deno --version
   ```
3. Crear el directorio del backend:
   ```
   mkdir backend-deno && cd backend-deno
   ```

## Desarrollo del Backend con Deno

### **Configuración del Servidor HTTP**

Deno permite crear servidores HTTP de manera sencilla con `std/http`:

```
import { serve } from "https://deno.land/std@0.194.0/http/server.ts";

const handler = (request: Request): Response => {
    return new Response("Hola desde Deno API!", { status: 200 });
};

serve(handler, { port: 8080 });
console.log("Servidor corriendo en http://localhost:8080");
```

Ejecuta el servidor con:
```
deno run --allow-net server.ts
```

### **Creación de una API REST con Deno**

Vamos a estructurar nuestra API en un modelo MVC.

#### **1. Definir el modelo**
```
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}
```

#### **2. Implementar un controlador**
```
import { Usuario } from "./models.ts";

let usuarios: Usuario[] = [];

export const obtenerUsuarios = (): Response => {
    return new Response(JSON.stringify(usuarios), { status: 200 });
};

export const crearUsuario = async (req: Request): Promise<Response> => {
    const body = await req.json();
    const nuevoUsuario: Usuario = { id: crypto.randomUUID(), ...body };
    usuarios.push(nuevoUsuario);
    return new Response(JSON.stringify(nuevoUsuario), { status: 201 });
};
```

#### **3. Configurar rutas con Oak**

Oak es un framework similar a Express.js para Deno.

```
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { obtenerUsuarios, crearUsuario } from "./controllers.ts";

const router = new Router();
router.get("/usuarios", obtenerUsuarios);
router.post("/usuarios", crearUsuario);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
```

Ejecutar la API:
```
deno run --allow-net --allow-read --allow-write server.ts
```

## Desarrollo del Frontend con Angular

### **Configurar conexión con la API**

1. Crear un servicio Angular para consumir la API REST:

```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
}
```

2. Agregar el servicio a `app.module.ts`:

```
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### **Crear un componente para mostrar usuarios**

1. Generar el componente:
```
ng generate component usuarios
```

2. Implementar la lógica en `usuarios.component.ts`:

```
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }
}
```

3. Agregar la vista en `usuarios.component.html`:

```
<h2>Lista de Usuarios</h2>
<ul>
  <li *ngFor="let usuario of usuarios">
    {{ usuario.nombre }} - {{ usuario.email }}
  </li>
</ul>
```

4. Incluir el componente en `app.component.html`:

```
<app-usuarios></app-usuarios>
```

## Conclusión

Desarrollar aplicaciones full-stack con **Angular y Deno** ofrece ventajas significativas en términos de seguridad, rendimiento y escalabilidad. Con Angular en el frontend y Deno en el backend, podemos construir aplicaciones modernas con un stack completamente basado en TypeScript.

¡Explora estas tecnologías y lleva tu desarrollo full-stack al siguiente nivel!