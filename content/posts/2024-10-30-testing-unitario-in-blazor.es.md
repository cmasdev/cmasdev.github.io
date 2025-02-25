---
layout: post
title: "Integración de Angular con APIs RESTful en Deno"
author: Christian Amado
date: 2024-10-30 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,Deno]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

La integración entre **Angular** y **APIs RESTful** creadas con **Deno** permite desarrollar aplicaciones modernas y escalables con una arquitectura limpia y basada en **TypeScript**. En este artículo, exploraremos cómo conectar una aplicación Angular con un backend RESTful en Deno paso a paso, incluyendo fundamentos teóricos, ejemplos prácticos y buenas prácticas.

<!--more-->

## ¿Por qué utilizar Angular y Deno?

### **Beneficios de Angular**

**Angular** es un framework frontend desarrollado por **Google** que permite construir aplicaciones web robustas y escalables. Sus principales características incluyen:

- **Arquitectura basada en componentes**: Facilita la reutilización del código y el mantenimiento.
- **TypeScript como base**: Mejora la seguridad del código y facilita la detección de errores en tiempo de desarrollo.
- **Herramientas integradas**: Angular CLI permite generar componentes, servicios y módulos de manera eficiente.
- **Manejo avanzado de estado y datos**: Usa RxJS para gestionar datos de forma reactiva.

### **Beneficios de Deno**

Deno es un runtime seguro para JavaScript y TypeScript que ofrece múltiples ventajas sobre Node.js:

- **Seguridad por defecto**: Requiere permisos explícitos para acceder a archivos, red y entorno.
- **Soporte nativo para TypeScript**: Sin necesidad de configuración adicional.
- **Gestión de dependencias sin `node_modules`**: Se utilizan URLs en lugar de paquetes locales.
- **Servidor HTTP integrado**: No requiere frameworks adicionales para manejar solicitudes HTTP.

---

## Configuración del Entorno

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

## Creación de una API RESTful en Deno

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

### **Implementación de una API REST con Deno**

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

## Consumo de la API RESTful en Angular

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

```
<h2>Lista de Usuarios</h2>
<ul>
  <li *ngFor="let usuario of usuarios">
    {{ usuario.nombre }} - {{ usuario.email }}
  </li>
</ul>
```

## Conclusión

Integrar **Angular** con **APIs RESTful** en Deno proporciona una solución segura y escalable para el desarrollo web moderno. La combinación de TypeScript en ambos entornos permite una experiencia de desarrollo fluida y consistente. ¡Explora estas tecnologías y lleva tu desarrollo full-stack al siguiente nivel!