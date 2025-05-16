---
layout: post
title: "Automatización de entornos WSL2 para onboarding de equipos"
author: Christian Amado
date: 2024-10-04 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

El onboarding de nuevos miembros en un equipo técnico suele implicar configurar entornos complejos con múltiples herramientas, dependencias, claves, servicios y flujos específicos. WSL2 permite automatizar completamente esta experiencia, facilitando que cualquier integrante configure un entorno de desarrollo productivo en minutos, con mínima intervención y total reproducibilidad.

Este artículo presenta estrategias y herramientas para automatizar la preparación de entornos WSL2, integrando scripting, dotfiles, Dev Containers, provisioning declarativo y prácticas de mantenimiento colaborativo.

<!--more-->

## Objetivo

- Establecer un entorno base reproducible en WSL2
- Reducir errores manuales durante onboarding
- Versionar configuraciones y automatizaciones
- Proveer una experiencia coherente entre dispositivos

## Paso 1: Script de instalación WSL2 + Distro personalizada

En una máquina limpia, desde PowerShell (Administrador):

```powershell
wsl --install -d Ubuntu
```

Configurar distro:

```bash
sudo apt update && sudo apt upgrade -y
```

Instalar herramientas comunes:

```bash
sudo apt install -y git curl build-essential zsh python3-pip
```

Guardar este paso como `setup.sh` en el repositorio del equipo.

## Paso 2: Clonación y aplicación de dotfiles

Mantener configuraciones como `.bashrc`, `.zshrc`, `.gitconfig`, alias y funciones personalizadas en un repositorio compartido:

```bash
git clone https://github.com/empresa/dotfiles ~/.dotfiles
cp ~/.dotfiles/.zshrc ~/.zshrc
cp ~/.dotfiles/.gitconfig ~/.gitconfig
```

Usar herramientas como:

- [`chezmoi`](https://www.chezmoi.io/)
- [`dotbot`](https://github.com/anishathalye/dotbot)
- `make install` con targets definidos

## Paso 3: Provisioning automatizado del stack de herramientas

Ejemplo con `Makefile` por proyecto:

```makefile
install:
	bash scripts/install-python-tools.sh
	bash scripts/install-node.sh
	bash scripts/setup-venv.sh
```

También se pueden usar `ansible-playbook` o `bash setup.sh` con detección de sistema, instalación de dependencias y personalización por usuario.

## Paso 4: Dev Containers para entornos por proyecto

Usar `.devcontainer` para configurar el stack por repositorio:

```json
{
  "name": "backend-node-postgres",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
  "postCreateCommand": "npm install && npm run setup-db",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint"]
    }
  }
}
```

Esto garantiza que todos los miembros usen las mismas versiones y herramientas al abrir el proyecto en VS Code con WSL2.

## Paso 5: Automatizar con scripts de bootstrap

Estructura común para bootstrap completo:

```
onboarding/
├── install.sh
├── setup.sh
├── dotfiles/
├── devcontainer/
├── Makefile
```

Ejemplo de `install.sh`:

```bash
#!/bin/bash
echo "Configurando entorno WSL2..."
bash ./setup.sh
git clone https://github.com/org/dotfiles ~/.dotfiles
cd ~/.dotfiles && ./install.sh
code .
```

## Buenas prácticas

- Usar scripts idempotentes (que se pueden correr múltiples veces)
- Documentar variables de entorno necesarias en `.env.example`
- Versionar herramientas y librerías clave en `requirements.txt`, `package.json`, etc.
- Probar en entornos limpios y documentar prerequisitos (ej. Docker Desktop, VS Code)
- Incluir pruebas de validación (`make check-env`)

## Conclusión

Automatizar la configuración de entornos WSL2 mejora el onboarding técnico, elimina fricciones y promueve la colaboración entre desarrolladores. Con un diseño reproducible y bien documentado, cada integrante del equipo puede empezar a trabajar con el stack completo en minutos, desde cualquier máquina con Windows, sin perder tiempo en configuraciones manuales.
