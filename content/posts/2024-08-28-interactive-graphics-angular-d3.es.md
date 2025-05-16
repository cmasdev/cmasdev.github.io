---
layout: post
title: "Gráficos interactivos con Angular y D3.js"
author: Christian Amado
date: 2024-08-28 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular,Javascript]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.png
---

Los gráficos interactivos son esenciales para visualizar datos de manera efectiva en aplicaciones modernas. **Angular**, combinado con **D3.js**, ofrece una solución poderosa para crear visualizaciones dinámicas y altamente interactivas. Este artículo explora cómo integrar **D3.js** en una aplicación **Angular** para construir gráficos interactivos desde cero, proporcionando ejemplos prácticos y consejos clave.

<!--more-->

## 1. Introducción a Angular y D3.js

### Angular
Angular es un framework de desarrollo frontend mantenido por Google que permite construir aplicaciones web robustas y escalables. Con su arquitectura basada en componentes y herramientas modernas como TypeScript y RxJS, Angular es ideal para proyectos grandes.

### D3.js
D3.js (Data-Driven Documents) es una biblioteca de JavaScript para crear visualizaciones de datos utilizando SVG, HTML y CSS. Es conocido por su flexibilidad y capacidad para manipular el DOM en función de los datos.

### ¿Por qué combinar Angular y D3.js?
La combinación de Angular y D3.js permite:
- **Reactividad:** Sincronizar datos y gráficos con cambios en tiempo real.
- **Modularidad:** Organizar código de visualización en componentes reutilizables.
- **Interactividad:** Crear experiencias de usuario enriquecedoras.

## 2. Configuración del proyecto Angular

### Creación del proyecto Angular
1. Asegúrate de tener Angular CLI instalado:
   ```
   npm install -g @angular/cli
   ```

2. Crea un nuevo proyecto Angular:
   ```
   ng new graficos-angular-d3
   cd graficos-angular-d3
   ```

3. Instala D3.js:
   ```
   npm install d3
   ```

### Estructura del proyecto
Crea un nuevo componente para los gráficos:
```bash
ng generate component components/bar-chart
```

## 3. Fundamentos de D3.js en Angular

D3.js utiliza selectores para manipular elementos del DOM y vincularlos a datos. Al trabajar con Angular, es importante integrar estas funcionalidades en el ciclo de vida de los componentes.

### Seleccionar un elemento
```
import * as d3 from 'd3';

d3.select('svg')
  .append('rect')
  .attr('width', 100)
  .attr('height', 50)
  .attr('fill', 'blue');
```

### Ciclo de vida de Angular
Usa `ngOnInit` para inicializar gráficos:
```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  template: '<svg></svg>',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const svg = d3.select('svg')
      .attr('width', 500)
      .attr('height', 300);

    svg.append('rect')
      .attr('x', 50)
      .attr('y', 50)
      .attr('width', 100)
      .attr('height', 200)
      .attr('fill', 'steelblue');
  }
}
```

## 4. Creando un gráfico de barras interactivo

### Configuración inicial
Define los datos y el espacio de trabajo:
```
const data = [10, 20, 30, 40, 50];
const width = 500;
const height = 300;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
```

### Renderizado del gráfico
Crea las escalas y ejes:
```
const x = d3.scaleBand()
  .domain(data.map((d, i) => i.toString()))
  .range([margin.left, width - margin.right])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(data) as number])
  .nice()
  .range([height - margin.bottom, margin.top]);

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('g')
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => x(i.toString()) as number)
  .attr('y', d => y(d))
  .attr('height', d => y(0) - y(d))
  .attr('width', x.bandwidth())
  .attr('fill', 'steelblue');
```

### Agregando interactividad
Agrega eventos de hover:
```
svg.selectAll('rect')
  .on('mouseover', function () {
    d3.select(this).attr('fill', 'orange');
  })
  .on('mouseout', function () {
    d3.select(this).attr('fill', 'steelblue');
  });
```

## 5. Creando un gráfico de líneas

Define datos y escalas:
```
const lineData = [
  { x: 0, y: 30 },
  { x: 1, y: 80 },
  { x: 2, y: 45 },
  { x: 3, y: 60 },
  { x: 4, y: 20 },
  { x: 5, y: 90 },
];

const line = d3.line()
  .x(d => x(d.x))
  .y(d => y(d.y));

svg.append('path')
  .datum(lineData)
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('d', line);
```

## 6. Buenas prácticas para trabajar con D3.js en Angular

1. **Encapsular lógica en servicios:**
   - Centraliza el código D3.js para evitar redundancia.

2. **Utilizar ChangeDetectionStrategy.OnPush:**
   - Mejora el rendimiento al minimizar detecciones de cambios innecesarias.

3. **Evitar manipulaciones directas del DOM:**
   - Usa ViewChild para seleccionar elementos del DOM en lugar de usar selectores globales.

## 7. Conclusión

**Angular** y **D3.js** forman una combinación poderosa para crear visualizaciones interactivas y reactivas. Aunque la integración puede requerir algunos ajustes iniciales, el resultado ofrece flexibilidad y modularidad en aplicaciones modernas. Al seguir las mejores prácticas y estructurar correctamente tu proyecto, puedes aprovechar al máximo estas herramientas.
