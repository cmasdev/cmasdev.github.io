---
layout: post
title: "Automatización de tareas con Makefiles y Bash avanzado en WSL2"
author: Christian Amado
date: 2024-05-24 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Una de las ventajas más potentes de WSL2 es la posibilidad de usar herramientas Linux como `make` y Bash para automatizar tareas en proyectos de desarrollo, ciencia de datos, o DevOps. Este artículo detalla cómo crear scripts avanzados con Bash y cómo estructurar `Makefiles` efectivos para ejecutar tareas complejas con un solo comando.

<!--more-->

## 🎯 Objetivo

- Crear scripts Bash reutilizables y robustos
- Diseñar `Makefiles` para tareas como tests, builds o pipelines
- Integrar la automatización en entornos reproducibles bajo WSL2

## ⚙️ Paso 1: Preparar entorno en WSL2

Instalar dependencias básicas:

```
sudo apt update && sudo apt install -y make build-essential
```

Organizar proyecto:

```
mi-proyecto/
├── scripts/
│   ├── build.sh
│   └── test.sh
├── Makefile
└── README.md
```

## 🧪 Paso 2: Crear scripts Bash reutilizables

### build.sh

```
#!/bin/bash
set -e
echo "Compilando proyecto..."
gcc src/main.c -o bin/app
echo "Build completado con éxito."
```

### test.sh

```
#!/bin/bash
set -e
echo "Ejecutando tests..."
pytest tests/
```

Dar permisos de ejecución:

```
chmod +x scripts/*.sh
```

## 📦 Paso 3: Diseñar un Makefile

```
.PHONY: build test clean all

build:
	bash scripts/build.sh

test:
	bash scripts/test.sh

clean:
	rm -rf bin/

all: clean build test
```

Ahora se pueden ejecutar tareas fácilmente:

```
make build
make test
make all
```

## 🔁 Paso 4: Automatización avanzada

Agregar detección de entorno, logs o argumentos en los scripts:

```
#!/bin/bash
set -e
echo "Sistema operativo: $(uname -a)"
DATE=$(date +%Y-%m-%d)
LOG="build_$DATE.log"
echo "Iniciando build..." | tee "$LOG"
gcc src/main.c -o bin/app >> "$LOG" 2>&1
```

O usar variables en `Makefile`:

```
DATE := $(shell date +%F)
LOGFILE := logs/build_$(DATE).log

logbuild:
	mkdir -p logs
	bash scripts/build.sh | tee $(LOGFILE)
```

## 🛠️ Buenas prácticas

- Validar argumentos (`"$#"` y `"$1"`) en scripts
- Documentar cada tarea con comentarios o `README.md`
- Usar `.PHONY` para evitar conflictos con archivos
- Versionar scripts y `Makefile` en Git para control de cambios

## ✅ Conclusión

Con Bash avanzado y Makefiles bien diseñados, es posible automatizar completamente tareas comunes de desarrollo en WSL2, mejorando la productividad, reduciendo errores y asegurando reproducibilidad en equipos o entornos compartidos.