---
layout: post
title: "Configuración de CI/CD para proyectos Angular con GitHub Actions"
author: Christian Amado
date: 2024-09-04 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,GitHub]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

La integración continua (CI) y la entrega continua (CD) son pilares fundamentales en el desarrollo de software moderno. **GitHub Actions** proporciona una solución poderosa y flexible para automatizar procesos de **CI/CD** directamente en repositorios de **GitHub**. En este artículo, aprenderemos a configurar **CI/CD** para un proyecto Angular utilizando **GitHub Actions**.

<!--more-->

## 1. Introducción a CI/CD y GitHub Actions

### ¿Qué es CI/CD?
- **CI (Integración Continua):** Automatiza la verificación del código mediante pruebas y validaciones cada vez que se realiza un cambio en el repositorio.
- **CD (Entrega Continua):** Automatiza el proceso de despliegue del código a entornos de producción o pruebas.

### Ventajas de GitHub Actions
- Integración nativa con repositorios de GitHub.
- Flexibilidad para definir pipelines personalizados.
- Amplio ecosistema de acciones reutilizables.
- Historial detallado de ejecuciones y logs.

## 2. Configuración inicial del proyecto Angular

1. **Crear un proyecto Angular:**
   Si no tienes un proyecto Angular, puedes crear uno nuevo:
   ```
   ng new angular-ci-cd-example
   cd angular-ci-cd-example
   ```

2. **Subir el proyecto a GitHub:**
   Inicializa un repositorio y empuja el proyecto:
   ```
   git init
   git remote add origin <tu-repositorio>
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

## 3. Creación del workflow de CI

### Estructura básica del workflow
GitHub Actions utiliza un archivo YAML ubicado en `.github/workflows`. Crearemos un archivo llamado `ci.yml`:

```
name: CI for Angular

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Check out code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run tests
      run: npm test
```

### Explicación del workflow
1. **Eventos de disparo:** Ejecuta el workflow en cada `push` o `pull_request` hacia la rama `main`.
2. **Jobs:** El trabajo `build-and-test` incluye:
   - **actions/checkout:** Descarga el código del repositorio.
   - **actions/setup-node:** Configura Node.js en la máquina.
   - **npm ci:** Instala las dependencias de forma limpia.
   - **npm run lint:** Ejecuta la verificación de estilo de código.
   - **npm test:** Ejecuta pruebas unitarias.

## 4. Configuración del workflow de CD

### Despliegue en GitHub Pages

Si deseas publicar tu aplicación Angular en GitHub Pages, sigue estos pasos:

1. **Configurar el archivo `angular.json`:**
   Asegúrate de que la propiedad `outputPath` de `build` esté configurada correctamente:
   ```
   "outputPath": "dist/angular-ci-cd-example"
   ```

2. **Agregar el workflow de despliegue:**
   Crea un archivo `.github/workflows/cd-gh-pages.yml`:

   ```
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
       - name: Check out code
         uses: actions/checkout@v3

       - name: Set up Node.js
         uses: actions/setup-node@v3
         with:
           node-version: 18

       - name: Install dependencies
         run: npm ci

       - name: Build project
         run: npm run build -- --output-path=dist

       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist/angular-ci-cd-example
   ```

3. **Habilitar GitHub Pages:**
   - Ve a la configuración de tu repositorio en GitHub.
   - Activa GitHub Pages y selecciona la rama `gh-pages` como fuente.

### Despliegue en un servidor externo

Si prefieres desplegar en un servidor externo, como AWS o Azure, puedes agregar un paso adicional al workflow.

**Ejemplo para FTP:**

```
    - name: Deploy to FTP server
      uses: sebastianpopp/ftp-action@v2
      with:
        host: ${{ secrets.FTP_HOST }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/angular-ci-cd-example
        remote-dir: /var/www/html
```

## 5. Buenas prácticas en CI/CD para Angular

1. **Usar `npm ci` en lugar de `npm install`:** Garantiza una instalación consistente de dependencias.
2. **Configurar pruebas end-to-end (E2E):** Agrega un paso para ejecutar pruebas E2E utilizando herramientas como Cypress o Protractor.
3. **Separar workflows:** Divide CI y CD en archivos separados para mayor claridad.
4. **Utilizar secretos de GitHub:** Almacena credenciales sensibles en `Secrets` para mantener la seguridad.
5. **Monitorear el rendimiento:** Usa herramientas de seguimiento como Lighthouse para verificar el impacto de los cambios.

## 6. Conclusión

Configurar **CI/CD** para proyectos **Angular** con **GitHub Actions** mejora la eficiencia del desarrollo y asegura entregas rápidas y confiables. Desde la ejecución de pruebas hasta el despliegue automatizado en **GitHub Pages** o servidores externos, **GitHub Actions** simplifica el proceso y permite un flujo de trabajo profesional y moderno. ¡Empieza a automatizar hoy mismo y lleva tu proyecto Angular al siguiente nivel!