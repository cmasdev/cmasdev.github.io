---
layout: post
title: "Debugging remoto desde Windows a servicios en WSL2"
author: Christian Amado
date: 2024-11-01 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Uno de los grandes beneficios de WSL2 es la integración fluida entre el sistema operativo Windows y el entorno Linux, lo que permite realizar debugging remoto de servicios que corren en WSL2 desde herramientas gráficas y editores del host. Esto es clave para flujos de desarrollo moderno, ya que permite aprovechar lo mejor de ambos mundos: servidores nativos de Linux y herramientas de análisis de Windows.

Este artículo describe paso a paso cómo depurar servicios web, APIs, scripts Python, aplicaciones Node.js y otros procesos que corren en WSL2, accediéndolos remotamente desde Windows, especialmente con VS Code y otros entornos integrados.

<!--more-->

## Requisitos

- Windows 10/11 con WSL2
- Visual Studio Code con extensiones:
  - Remote - WSL
  - Debuggers específicos (Python, Node.js, etc.)
- Servicios corriendo dentro de la distro WSL2
- Conexión funcional entre host y entorno WSL (localhost)

## Paso 1: Abrir el entorno con Remote WSL

1. Iniciar WSL2 (`wsl` en terminal).
2. Ejecutar `code .` desde el directorio del proyecto.
3. VS Code se conectará directamente a la distro WSL2 y abrirá el proyecto allí.

Esto permite editar y ejecutar el código dentro de Linux, pero con acceso completo a las herramientas de VS Code.

## Paso 2: Configurar un archivo `launch.json`

Ejemplo para depurar un servidor Python:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Flask",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/app.py",
      "env": {
        "FLASK_APP": "app.py"
      },
      "args": ["run", "--no-debugger", "--no-reload", "--host=0.0.0.0"],
      "jinja": true
    }
  ]
}
```

Ejemplo para Node.js:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Iniciar servidor Node",
  "program": "${workspaceFolder}/index.js",
  "runtimeExecutable": "node",
  "skipFiles": ["<node_internals>/**"]
}
```

## Paso 3: Exponer servicios a Windows

Si el servidor corre en `0.0.0.0`, se puede acceder desde el navegador Windows vía `http://localhost:<puerto>`.

Ejemplo:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

Verificar desde navegador: `http://localhost:8000`

## Paso 4: Conexión desde otras herramientas externas

Desde Windows, se puede conectar a servicios que corren en WSL2 usando herramientas como:

- Postman
- Insomnia
- curl en PowerShell
- Navegador con consola DevTools

Ejemplo:

```powershell
curl http://localhost:5000/api
```

## Paso 5: Inspección remota avanzada (Node, Chrome DevTools)

Node.js puede ser depurado usando el puerto de inspección:

```bash
node --inspect-brk=0.0.0.0:9229 index.js
```

Desde Chrome:

```
chrome://inspect
```

Agregar target `localhost:9229` y conectar al proceso remoto dentro de WSL2.

## Paso 6: Breakpoints y variables en VS Code

Con `launch.json` correctamente configurado, es posible:

- Establecer breakpoints visuales
- Ver variables locales y globales
- Inspeccionar la pila
- Evaluar expresiones interactivamente

Todo esto funciona igual que si se depurara localmente desde Windows.

## Buenas prácticas

- Asegurar que los servicios escuchen en `0.0.0.0`, no solo `127.0.0.1`
- Evitar puertos restringidos (<1024) si no se ejecuta como root
- Usar `--reload` solo en desarrollo para Flask/FastAPI
- Separar entornos de debug y producción en `launch.json`
- Si el puerto no responde, reiniciar WSL con `wsl --shutdown`

## Conclusión

Con WSL2 y herramientas modernas como VS Code, es posible depurar de forma remota y fluida servicios Linux desde Windows. Esta capacidad permite flujos de desarrollo productivos, portables y multiplataforma, manteniendo el rendimiento y la fidelidad del entorno Linux sin salir del sistema operativo principal.