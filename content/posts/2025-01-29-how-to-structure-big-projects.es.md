---
layout: post
title: "Cómo estructurar grandes proyectos en TypeScript"
author: Christian Amado
date: 2025-01-29 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Typescript]
thumbnail-img: /img/posts/thumbnails/typescript.png
cover-img: /img/posts/cover/typescript.png
share_img: /img/posts/shared/typescript.jpg
---

El desarrollo de grandes aplicaciones en **TypeScript** requiere una estructura de proyecto bien definida para mantener la escalabilidad, mantenibilidad y eficiencia del código. Una mala organización puede llevar a problemas de acoplamiento, dificultades en la depuración y una curva de aprendizaje elevada para nuevos desarrolladores en el equipo.

En este artículo, exploraremos cómo organizar un proyecto grande en TypeScript utilizando **buenas prácticas, patrones de diseño y herramientas avanzadas**.

<!--more-->

## 1. Configuración Inicial del Proyecto

Antes de estructurar el código, debemos preparar un entorno robusto en **TypeScript**.

### **1.1 Crear un Proyecto TypeScript**
Ejecuta el siguiente comando para inicializar un nuevo proyecto:

```
mkdir my-large-ts-project && cd my-large-ts-project
npm init -y
npm install typescript --save-dev
```

### **1.2 Configuración de `tsconfig.json`**

Generamos un archivo de configuración:

```
npx tsc --init
```

Modificamos el archivo `tsconfig.json` con las siguientes opciones recomendadas:

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 2. Estructura de Carpetas para Grandes Proyectos

Una estructura bien definida facilita la escalabilidad del proyecto. Un modelo recomendado es:

```
/my-large-ts-project
│── /src
│   ├── /config
│   │   ├── appConfig.ts
│   │   ├── dbConfig.ts
│   ├── /models
│   │   ├── userModel.ts
│   │   ├── orderModel.ts
│   ├── /services
│   │   ├── userService.ts
│   │   ├── orderService.ts
│   ├── /controllers
│   │   ├── userController.ts
│   │   ├── orderController.ts
│   ├── /routes
│   │   ├── userRoutes.ts
│   │   ├── orderRoutes.ts
│   ├── /middlewares
│   │   ├── authMiddleware.ts
│   ├── /utils
│   │   ├── logger.ts
│   ├── /tests
│   │   ├── userService.test.ts
│   ├── app.ts
│── /dist
│── package.json
│── tsconfig.json
│── README.md
```

### **Descripción de las Carpetas**
- **`/config`**: Configuración de base de datos, variables de entorno y opciones globales.
- **`/models`**: Definiciones de modelos y entidades.
- **`/services`**: Lógica de negocio (capa intermedia entre controladores y base de datos).
- **`/controllers`**: Manejo de solicitudes HTTP.
- **`/routes`**: Definición de rutas para cada entidad.
- **`/middlewares`**: Middleware para autenticación, validaciones, etc.
- **`/utils`**: Funciones auxiliares reutilizables.
- **`/tests`**: Pruebas unitarias y de integración.

## 3. Modularización y Separación de Responsabilidades

Dividir el código en **módulos independientes** mejora la reutilización y el mantenimiento.

### **Ejemplo: Modelo de Usuario (`models/userModel.ts`)**

```
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### **Ejemplo: Servicio de Usuario (`services/userService.ts`)**

```
import { User } from "../models/userModel";

const users: User[] = [];

export class UserService {
  static getAllUsers(): User[] {
    return users;
  }

  static addUser(user: User): void {
    users.push(user);
  }
}
```

### **Ejemplo: Controlador de Usuario (`controllers/userController.ts`)**

```
import { Request, Response } from "express";
import { UserService } from "../services/userService";

export const getUsers = (req: Request, res: Response) => {
  res.json(UserService.getAllUsers());
};

export const addUser = (req: Request, res: Response) => {
  const user = req.body;
  UserService.addUser(user);
  res.status(201).json(user);
};
```

## 4. Uso de TypeScript con Express.js

### **4.1 Instalar Express y Tipos**

```
npm install express
npm install @types/express --save-dev
```

### **4.2 Definir las Rutas (`routes/userRoutes.ts`)**

```
import { Router } from "express";
import { getUsers, addUser } from "../controllers/userController";

const router = Router();

router.get("/users", getUsers);
router.post("/users", addUser);

export default router;
```

### **4.3 Configurar el Servidor (`app.ts`)**

```
import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
```

## 5. Implementación de Pruebas con Jest

Las pruebas garantizan la estabilidad del código en proyectos grandes.

### **5.1 Instalar Jest**

```
npm install --save-dev jest ts-jest @types/jest
```

### **5.2 Configurar Jest en `package.json`**

```
"scripts": {
  "test": "jest --config jest.config.js"
}
```

### **5.3 Ejemplo de Prueba (`tests/userService.test.ts`)**

```
import { UserService } from "../services/userService";

test("Agregar un usuario", () => {
  UserService.addUser({ id: "1", name: "Juan", email: "juan@example.com" });
  expect(UserService.getAllUsers().length).toBe(1);
});
```

## Conclusión

Estructurar grandes proyectos en **TypeScript** requiere una organización clara y modular. Al seguir estas prácticas, logramos:

✅ **Código mantenible y escalable**.
✅ **Separación clara de responsabilidades**.
✅ **Reutilización y modularidad del código**.
✅ **Facilidad para pruebas unitarias e integración**.