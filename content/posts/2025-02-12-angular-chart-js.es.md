---
layout: post
title: "Angular y gráficos interactivos con Chart.js"
author: Christian Amado
date: 2025-02-12 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Angular]
thumbnail-img: /img/posts/thumbnails/angular.png
cover-img: /img/posts/cover/angular.png
share_img: /img/posts/shared/angular.jpg
---

La visualización de datos es una parte fundamental en el desarrollo de aplicaciones web modernas. **Chart.js** es una de las bibliotecas más populares y livianas para la creación de gráficos dinámicos e interactivos. Combinado con **Angular**, podemos construir visualizaciones de datos altamente eficientes y personalizables.

En este artículo, aprenderemos cómo integrar **Chart.js** en un proyecto Angular y cómo crear gráficos interactivos con ejemplos prácticos.

<!--more-->

## 1. ¿Por qué Usar Chart.js en Angular?

✅ **Ligero y eficiente**: Chart.js es una librería optimizada con un tamaño reducido.  
✅ **Compatibilidad con Angular**: Fácil integración con componentes y servicios de Angular.  
✅ **Interactividad**: Soporta animaciones y eventos interactivos.  
✅ **Diversidad de gráficos**: Soporta gráficos de barras, líneas, pastel, radar, burbujas, entre otros.  
✅ **Personalización avanzada**: Configuración flexible para estilos, colores y datos dinámicos.  

## 2. Instalación de Chart.js en un Proyecto Angular

Para comenzar, crearemos un nuevo proyecto Angular o utilizaremos uno existente.

### **2.1 Crear un Nuevo Proyecto Angular**
Si aún no tienes un proyecto, puedes crear uno con el siguiente comando:

```
ng new angular-chartjs-demo
cd angular-chartjs-demo
```

### **2.2 Instalar Chart.js**
Ejecuta el siguiente comando para instalar la librería:

```
npm install chart.js
```

### **2.3 Instalar `ng2-charts` (Opcional, pero Recomendado)**
Para una integración más sencilla con Angular, podemos instalar `ng2-charts`:

```
npm install ng2-charts
```

## 3. Creación del Componente de Gráficos

### **3.1 Generar un Componente para el Gráfico**

```
ng generate component components/bar-chart
```

### **3.2 Configuración del Componente (`bar-chart.component.ts`)**

```
import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  
  public barChartLabels: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55], label: 'Ventas 2023', backgroundColor: '#42A5F5' },
      { data: [28, 48, 40, 19, 86, 27], label: 'Ventas 2024', backgroundColor: '#66BB6A' }
    ]
  };
}
```

### **3.3 Plantilla HTML (`bar-chart.component.html`)**

```
<div class="chart-container">
  <canvas baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="barChartType">
  </canvas>
</div>
```

### **3.4 Estilos CSS (`bar-chart.component.css`)**

```
.chart-container {
  width: 80%;
  margin: auto;
}
```

## 4. Integración en la Aplicación

Para mostrar el gráfico en nuestra aplicación, agregamos el componente en `app.component.html`:

```
<h2>Gráfico de Ventas</h2>
<app-bar-chart></app-bar-chart>
```

También es necesario importar `NgChartsModule` en `app.module.ts`:

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## 5. Personalización de Gráficos

### **5.1 Cambiar Colores y Estilos**

Podemos personalizar los colores y estilos de los gráficos cambiando las propiedades `backgroundColor`, `borderColor` y `hoverBackgroundColor`:

```
this.barChartData.datasets[0].backgroundColor = '#FF6384';
this.barChartData.datasets[1].backgroundColor = '#36A2EB';
```

### **5.2 Agregar Animaciones**

Podemos activar animaciones en el gráfico:

```
public barChartOptions: ChartOptions = {
  responsive: true,
  animation: {
    duration: 2000, // Duración en milisegundos
    easing: 'easeInOutQuart'
  }
};
```

### **5.3 Agregar Eventos Interactivos**

Podemos detectar clics en el gráfico con `chartClicked`:

```
<canvas baseChart
        (chartClick)="onChartClick($event)"
        [data]="barChartData"
        [options]="barChartOptions"
        [type]="barChartType">
</canvas>
```

```
onChartClick(event: any) {
  console.log('Datos seleccionados:', event);
}
```

## 6. Conclusión

La integración de **Chart.js** con **Angular** nos permite crear gráficos interactivos y dinámicos con facilidad. Al seguir este enfoque, podemos mejorar la presentación de datos en nuestras aplicaciones.