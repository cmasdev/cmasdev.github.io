---
layout: post
title: "How To: Ejecución de microservicios híbridos en WSL2 + Windows"
author: Christian Amado
date: 2024-11-22 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Uno de los escenarios más potentes que habilita WSL2 es la capacidad de ejecutar arquitecturas **híbridas de microservicios** donde algunos componentes corren sobre Linux (WSL2) y otros directamente sobre Windows. Esto permite integrar aplicaciones legadas, herramientas de escritorio, procesos en contenedores y servicios distribuidos desde una sola estación de trabajo, ideal para desarrollo, testing y validación de arquitecturas modernas.

Este artículo presenta un caso real donde se ejecutan múltiples microservicios en ambos entornos, aprovechando la interoperabilidad de red y archivos entre Windows y WSL2.

<!--more-->

## Objetivo

- Ejecutar una arquitectura basada en microservicios con:
  - Backend y base de datos en WSL2 (Linux)
  - Servicio de autenticación en contenedor Docker (Linux)
  - Cliente de escritorio en Windows (Electron app simulada)
  - Comunicación entre servicios vía localhost

## Paso 1: Preparar backend y base de datos en WSL2

Desde WSL2:

```bash
mkdir -p ~/proyectos/microservicios/backend
cd ~/proyectos/microservicios/backend
npm init -y
npm install express pg dotenv
```

Crear `.env`:

```env
PORT=5001
DB_USER=dev
DB_PASSWORD=clave123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ms_backend
```

Configurar servicio básico en `index.js`:

```js
const express = require("express");
const app = express();
app.get("/api/data", (req, res) => res.json({ message: "Hello from backend" }));
app.listen(process.env.PORT, () => console.log("Backend WSL2 listo"));
```

Ejecutar:

```bash
node index.js
```

## Paso 2: Servicio de autenticación en Docker

Crear directorio `auth-service/` con un simple servidor Node.js en Docker.

`Dockerfile`:

```Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "auth.js"]
```

`auth.js`:

```js
const express = require("express");
const app = express();
app.get("/auth", (_, res) => res.json({ token: "abc123" }));
app.listen(4000, () => console.log("Servicio Auth en contenedor"));
```

Construir y ejecutar:

```bash
docker build -t auth-service .
docker run -d --name auth --network host auth-service
```

## Paso 3: Cliente de escritorio en Windows

Desde Windows, crear una aplicación simulada con `index.html`:

```html
<!DOCTYPE html>
<html>
<body>
  <h1>Microservicio Híbrido</h1>
  <button onclick="getData()">Cargar datos</button>
  <pre id="output"></pre>
  <script>
    async function getData() {
      const res1 = await fetch('http://localhost:5001/api/data');
      const json1 = await res1.json();
      const res2 = await fetch('http://localhost:4000/auth');
      const json2 = await res2.json();
      document.getElementById("output").textContent = JSON.stringify({ json1, json2 }, null, 2);
    }
  </script>
</body>
</html>
```

Abrir en navegador (`file:///C:/ruta/a/index.html`).

## Paso 4: Comunicación entre entornos

Gracias al puente virtual de red que crea WSL2, los servicios escuchando en `0.0.0.0` o `localhost` dentro de WSL2 o Docker con `--network host` son accesibles desde Windows.

Verificar:

```powershell
curl http://localhost:5001/api/data
curl http://localhost:4000/auth
```

## Paso 5: Monitoreo y orquestación opcional

Desde WSL2 o Windows:

- Monitorear contenedores con `docker ps`, `docker logs auth`
- Usar `Postman` o `curl` para validar endpoints
- Gestionar servicios con `taskkill` (Windows) y `kill` (Linux)

## Buenas prácticas

- Usar `.env` y `.env.example` para configurar servicios
- Automatizar inicio de servicios con scripts Bash y PowerShell
- Mantener contenedores ligeros y separados por función
- Verificar puertos en uso para evitar conflictos (`netstat -an`)
- Versionar cada microservicio en su propio repositorio si es necesario

## Conclusión

Con WSL2 y la interoperabilidad de red de Windows, es posible ejecutar arquitecturas híbridas reales con múltiples microservicios distribuidos en Linux y Windows desde una misma máquina. Esto permite validar integración, rendimiento, y colaboración entre equipos sin depender de infraestructura externa o entornos cloud.