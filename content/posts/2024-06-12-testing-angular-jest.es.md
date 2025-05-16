---
layout: post
title: "Testing avanzado en Angular con Jest: Mejores prácticas"
author: Christian Amado
date: 2024-06-12 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,Google,Jest]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

Las pruebas en aplicaciones **Angular** son esenciales para garantizar la calidad, confiabilidad y mantenibilidad del código. En este artículo, exploraremos el uso avanzado de **Jest** como framework de pruebas en **Angular**, cubriendo configuración inicial, estrategias de pruebas unitarias y de integración, así como buenas prácticas para lograr un enfoque moderno, eficiente y seguro.

<!--more-->

## ¿Por qué usar Jest en Angular?
### Ventajas de Jest
1. **Rápido y eficiente**: Jest paraleliza la ejecución de pruebas, lo que mejora significativamente los tiempos.
2. **API intuitiva**: Proporciona una sintaxis clara y fácil de aprender.
3. **Mocks y espías integrados**: Simplifica la simulación de dependencias.
4. **Informes detallados**: Ofrece feedback claro sobre las pruebas fallidas.
5. **Snapshot testing**: Permite capturar estados de componentes para detectar cambios inesperados.

## Configuración inicial de Jest en un proyecto Angular
### Requisitos previos
1. Tener Angular CLI instalado:
   ```
   npm install -g @angular/cli
   ```
2. Crear un nuevo proyecto Angular o usar uno existente:
   ```
   ng new angular-jest-demo --routing --style css
   ```

### Instalar Jest y dependencias
Reemplaza el entorno de pruebas predeterminado de Angular (Karma) con Jest:

```
npm install jest @types/jest jest-preset-angular --save-dev
```

### Configurar Jest
1. Agrega un archivo de configuración `jest.config.js` en la raíz del proyecto:
   ```
   module.exports = {
     preset: 'jest-preset-angular',
     setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
     testEnvironment: 'jsdom',
     testMatch: ['**/+(*.)+(spec).+(ts|js)'],
     transform: {
       '^.+\.(ts|html)$': 'jest-preset-angular',
     },
     moduleFileExtensions: ['ts', 'html', 'js', 'json'],
     collectCoverage: true,
     coverageReporters: ['html', 'text'],
     coverageDirectory: 'coverage/jest',
   };
   ```

2. Crea el archivo `setup-jest.ts`:
   ```
   import 'jest-preset-angular/setup-jest';
   ```

3. Modifica `tsconfig.spec.json` para incluir Jest:
   ```
   {
     "compilerOptions": {
       "types": ["jest"]
     }
   }
   ```

4. Actualiza los scripts de `package.json`:
   ```
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch"
     }
   }
   ```

## Escribir pruebas unitarias avanzadas
### Pruebas de componentes
#### Configurar pruebas básicas
```
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el título', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Bienvenido a MyComponent!');
  });
});
```
### Pruebas de servicios
#### Mocking de dependencias
```
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService],
    });
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener datos correctamente', () => {
    const mockData = { id: 1, name: 'Test' };

    service.getData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## Snapshot Testing en Angular
Los snapshots permiten capturar el estado de un componente y compararlo con versiones futuras para detectar cambios inesperados.

### Crear un snapshot
```
import { render } from '@testing-library/angular';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  it('debería coincidir con el snapshot', async () => {
    const { container } = await render(MyComponent);
    expect(container).toMatchSnapshot();
  });
});
```

### Actualizar snapshots
Si los cambios son intencionales, actualiza los snapshots:
```
jest --updateSnapshot
```
## Buenas prácticas para pruebas avanzadas
1. **Configurar CI/CD**: Automatiza las pruebas en plataformas como GitHub Actions o Azure DevOps.
2. **Cobertura de código**: Asegúrate de alcanzar al menos el 80% de cobertura.
3. **Separar pruebas unitarias e integradas**: Mantén un enfoque claro entre las pruebas locales y las de sistema.
4. **Mocking eficiente**: Usa herramientas como `jest.mock` para simular dependencias externas.
5. **Documentar las pruebas**: Incluye descripciones claras sobre los objetivos de cada caso de prueba.

## Conclusión
Implementar pruebas avanzadas con **Jest** en **Angular** mejora la calidad del software y reduce riesgos en el desarrollo. Al seguir buenas prácticas y adoptar herramientas modernas, los equipos pueden garantizar que sus aplicaciones sean robustas, seguras y fáciles de mantener. ¡Empieza hoy mismo a implementar Jest en tus proyectos **Angular**!
