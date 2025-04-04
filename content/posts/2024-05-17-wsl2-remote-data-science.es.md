---
layout: post
title: "VS Code Remote WSL para flujos de trabajo Data Science"
author: Christian Amado
date: 2024-05-17 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

El desarrollo de proyectos de ciencia de datos desde Windows puede beneficiarse enormemente del uso de **WSL2 con VS Code Remote**. Esta combinación permite aprovechar herramientas y entornos Linux directamente desde el editor, manteniendo la flexibilidad de Windows en tareas cotidianas como análisis, visualización o modelado de datos.

<!--more-->

## 🎯 Objetivo

- Configurar un entorno Linux para ciencia de datos dentro de WSL2
- Integrarlo con **Visual Studio Code** mediante la extensión **Remote - WSL**
- Usar Jupyter Notebooks, entornos virtuales y bibliotecas científicas desde VS Code
- Trabajar con flujos reproducibles usando pip, conda y notebooks

## 🧰 Requisitos previos

- Windows 10/11 con WSL2 activado
- Distro Linux instalada (Ubuntu 22.04 recomendado)
- VS Code con la extensión **Remote - WSL**
- Python 3, pip y/o conda

## ⚙️ Paso 1: Instalar dependencias en la distro WSL2

Desde tu terminal WSL:

```
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv git
```

Instalar bibliotecas de ciencia de datos:

```
pip install numpy pandas matplotlib seaborn scikit-learn jupyter
```

Opcional: usar `miniconda` si se prefiere conda como gestor de entornos.

## 💻 Paso 2: Abrir WSL desde VS Code

1. Abrí **VS Code**
2. Presioná `Ctrl+Shift+P` y escribí: `Remote-WSL: New Window`
3. Seleccioná tu distribución (ej: Ubuntu)

Ahora estás en una sesión remota con acceso completo a la terminal, Python, Jupyter y entorno Linux desde el editor.

## 📓 Paso 3: Usar Jupyter Notebooks dentro de VS Code

Instalar extensión oficial de **Jupyter** en VS Code.

Crear un nuevo notebook (`.ipynb`) y seleccioná el kernel Python correspondiente desde el entorno WSL.

Verificá que ejecutás en WSL:

```
import platform
print(platform.system(), platform.release())
```

## 🧪 Ejemplo práctico: Análisis exploratorio

```
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("penguins")
sns.pairplot(df, hue="species")
plt.show()
```

Este script corre directamente en el entorno WSL, usando la GPU (si está disponible), y sin overhead de traducción de entornos.

## 🛠️ Buenas prácticas

- Guardar los proyectos en el sistema de archivos Linux (`~/proyectos`, no en `/mnt/c/`) para mayor rendimiento
- Usar entornos virtuales (`python3 -m venv .venv`) para evitar conflictos
- Versionar notebooks y scripts con Git (`git init`)
- Añadir `requirements.txt` para reproducibilidad:

```
pip freeze > requirements.txt
```

## ✅ Conclusión

**VS Code** + R**emote WSL** ofrece una experiencia fluida para la ciencia de datos en **Windows**, combinando la potencia de **Linux** con la comodidad de un entorno gráfico moderno. Con Jupyter, Python y bibliotecas científicas listas para usar, es posible construir, visualizar y entrenar modelos de manera productiva, eficiente y reproducible.
