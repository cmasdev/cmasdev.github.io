---
layout: post
title: "NAVDEV Tips: Abrir WinForms desde Dynamics NAV 2018"
author: "Christian Amado"
date: 2019-06-11 12:49:07 -04:00
categories: [Aplicaciones de negocio]
tags: [C/SIDE,Dynamics NAV]
thumbnail-img: /img/posts/thumbnails/nav.png
cover-img: /img/posts/cover/nav.svg
---

En esta ocasión quiero compartir con ustedes una información bastante útil referente al consumo de aplicaciones ya desarrolladas. Normalmente, es ley no reinventar la rueda en cuanto a trabajos de desarrollo se refiere. Vamos a un caso puntual...

Tenemos una pequeña aplicación que gestiona las actividades del cajero de un Restaurant. Los dueños han decidido gestionar sus operaciones con Microsoft Dynamics NAV 2018 (buena decisión) pero no desean modificar su aplicación de cajero que les funciona de maravilla. Entonces, le proponemos utilizar ambos sistemas para que no dejen de utilizar su sistema actual.

<!--more-->

El dueño, sin embargo, no desea manejar dos aplicaciones. Quiere todo integrado (ya que esa es la idea del Dynamics NAV). Ahí es donde surge esta solución:

Desde Microsoft Dynamics NAV, podemos realizar llamadas a librerías de .NET (que ya vienen integradas con Dynamics NAV), esto permite abrir cualquier programa instalado en nuestras máquinas.

Tenemos como ejemplo el siguiente formulario (desarrollado en .NET Framework 4.7.2):  
![](/img/posts/migrated/2020/06/1.png)  

Con un simple saludo escrito en C#:
```
using System;
using System.Windows.Forms;

namespace NAV AbrirWinForm
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1 Click(object sender, EventArgs e)
        {
            MessageBox.Show("Hola, " + this.textBox1.Text + ".");
        }
    }
}
```
De modo a que lo entiendan, tenemos el siguiente resultado:  
![](/img/posts/migrated/2020/06/2.png)  

Dentro de Dynamics NAV, para este ejemplo, en una Acción "Abrir Formulario" de la página "Información de la Compañía", disculpen pero tengo la versión Australiana por un tema de retenciones :) colocamos la llamada:  
![](/img/posts/migrated/2020/06/3.png)  

Luego, procedemos a declarar las variables globales, invocando a librerías de .NET:  
![](/img/posts/migrated/2020/06/4.png)  

Por último, escribimos el código correspondiente para efectuar la llamada:
```
Abrir Formulario - OnAction()
Proceso := Proceso.Process;
Proceso.StartInfo.UseShellExecute := FALSE;
Proceso.StartInfo.FileName := 'C:\\temp\\NAV\_AbrirWinForm.exe';
Proceso.StartInfo.Arguments := '';
Proceso.StartInfo.CreateNoWindow := TRUE;
Proceso.Start();
CLEAR(Proceso);
```
De este modo, el resultado final será:  
![](/img/posts/migrated/2020/06/5.png)  

Así logramos invocar un programa externo desde Dynamics NAV 2018 sin perjudicar la operativa del usuario.