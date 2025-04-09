---
layout: post
title: "How To: Desarrollo fullstack con WSL2 y PostgreSQL"
author: Christian Amado
date: 2024-11-07 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

WSL2 permite desarrollar aplicaciones backend completas desde un entorno Linux real sobre Windows, facilitando el uso de tecnologías como **Node.js**, **Express**, **PostgreSQL** y herramientas modernas de frontend como **React** o **Vue**. Este caso real describe paso a paso cómo montar un entorno fullstack funcional, productivo y reproducible usando WSL2, PostgreSQL y herramientas de desarrollo frontend y backend.

<!--more-->

## Objetivo

Construir y ejecutar una API REST con Express y PostgreSQL desde WSL2, accesible desde Windows y conectada a un cliente frontend moderno (React). Todo funcionando de forma local, con persistencia y debugging habilitado.

## Paso 1: Preparar entorno base en WSL2

### Crear proyecto y entorno de trabajo

```bash
mkdir ~/proyectos/fullstack-wsl2
cd ~/proyectos/fullstack-wsl2
```

Instalar dependencias comunes:

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib
```

Verificar PostgreSQL:

```bash
psql --version
```

Verificar Node.js:

```bash
node -v
npm -v
```

## Paso 2: Configurar base de datos PostgreSQL

### Crear base de datos y usuario

```bash
sudo -u postgres psql
```

Dentro de PostgreSQL:

```sql
CREATE DATABASE fullstack_dev;
CREATE USER devuser WITH PASSWORD 'clave123';
GRANT ALL PRIVILEGES ON DATABASE fullstack_dev TO devuser;
```

Salir con `\q`.

## Paso 3: Crear backend con Node.js y Express

```bash
mkdir backend
cd backend
npm init -y
npm install express pg dotenv
```

Crear archivo `.env`:

```env
PORT=5000
DB_USER=devuser
DB_PASSWORD=clave123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fullstack_dev
```

Crear `index.js`:

```js
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

app.use(express.json());

app.get('/api/usuarios', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json(result.rows);
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
```

Ejecutar backend:

```bash
node index.js
```

Probar desde navegador o `curl`:

```bash
curl http://localhost:5000/api/usuarios
```

## Paso 4: Crear cliente frontend (React)

Desde el directorio raíz:

```bash
npx create-react-app frontend
cd frontend
```

Modificar `package.json`:

```json
"proxy": "http://localhost:5000"
```

Crear componente para consumir la API:

```jsx
import React, { useEffect, useState } from "react";

function App() {
  const [hora, setHora] = useState("");

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data) => setHora(data[0].now));
  }, []);

  return <div>Hora desde PostgreSQL: {hora}</div>;
}

export default App;
```

Ejecutar:

```bash
npm start
```

Acceder desde navegador a `http://localhost:3000` para ver la integración.

## Paso 5: Acceso desde Windows

Tanto el backend (puerto 5000) como el frontend (puerto 3000) son accesibles desde navegador en Windows gracias al reenvío automático de puertos WSL2.

Verificar:

```powershell
curl http://localhost:5000/api/usuarios
start http://localhost:3000
```

## Buenas prácticas

- Separar entorno de desarrollo y producción con variables de entorno
- Versionar código en Git desde WSL2 o integrado a GitHub
- Usar `nodemon` para hot-reload del backend
- Crear scripts de inicio en `package.json` para automatización
- Agregar middleware de CORS si frontend se ejecuta desde origen distinto

## Conclusión

WSL2 permite desarrollar aplicaciones fullstack modernas combinando tecnologías de backend y frontend con base de datos PostgreSQL de manera fluida. Todo el entorno corre desde Linux real dentro de Windows, lo que permite depurar, escalar y trabajar colaborativamente sin comprometer el rendimiento ni la experiencia de desarrollo.