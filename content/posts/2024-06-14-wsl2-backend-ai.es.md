---
layout: post
title: "Deno, Go y Python en WSL2 para flujos mixtos de backend + AI"
author: Christian Amado
date: 2024-06-14 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL,Deno,Go,Python]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Combinar lenguajes modernos como **Deno**, **Go** y **Python** permite crear soluciones backend de alto rendimiento con componentes de inteligencia artificial de forma modular y eficiente. Gracias a **WSL2**, es posible configurar este stack en Linux desde Windows, integrando herramientas, librerías y entornos de ejecución en un mismo flujo de trabajo.

<!--more-->

## 🎯 Objetivo

- Instalar Deno, Go y Python en WSL2
- Ejecutar servidores backend ligeros con Deno y Go
- Usar Python para lógica de IA (modelo, predicción)
- Comunicar los componentes entre sí usando HTTP/REST

## ⚙️ Paso 1: Instalar entornos en WSL2

```bash
# Python
sudo apt update && sudo apt install -y python3 python3-pip

# Go
sudo apt install -y golang

# Deno
curl -fsSL https://deno.land/install.sh | sh
echo 'export DENO_INSTALL="$HOME/.deno"' >> ~/.bashrc
echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Verificar versiones:

```bash
python3 --version
go version
deno --version
```

## 🧪 Paso 2: Crear backend HTTP con Deno

```ts
// api.ts
import { serve } from "https://deno.land/std@0.178.0/http/server.ts";

serve(req => new Response("Hola desde Deno API"), { port: 8000 });
```

Ejecutar:

```bash
deno run --allow-net api.ts
```

## ⚙️ Paso 3: Crear servicio Go para procesamiento

```go
// server.go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/go", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hola desde Go service")
    })
    http.ListenAndServe(":8080", nil)
}
```

Compilar y correr:

```bash
go run server.go
```

## 🤖 Paso 4: Python como motor de IA

```python
# model.py
from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    x = request.json['input']
    pred = np.log1p(x)  # lógica simulada
    return jsonify({'result': pred.tolist()})

if __name__ == '__main__':
    app.run(port=5000)
```

Instalar dependencias y correr:

```bash
pip install flask numpy
python3 model.py
```

## 🔗 Paso 5: Comunicación entre servicios

Desde Deno o Go se puede consumir el endpoint de Python:

```bash
curl -X POST http://localhost:5000/predict -H "Content-Type: application/json" -d '{"input": [1, 2, 3]}'
```

Respuesta:

```json
{"result": [0.6931, 1.0986, 1.3862]}
```

## ✅ Conclusión

Con WSL2 es posible combinar de forma eficiente lenguajes especializados para backend (Go, Deno) y lógica de IA (Python), manteniendo un entorno ligero y modular. Esta arquitectura híbrida mejora la productividad y facilita el mantenimiento en equipos multidisciplinarios que desarrollan APIs inteligentes.
