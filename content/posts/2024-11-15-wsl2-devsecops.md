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

WSL2 se ha convertido en una herramienta clave para equipos DevSecOps que buscan una solución ligera, segura y flexible para automatizar la integración, entrega y operaciones de software. Su compatibilidad con herramientas de seguridad, contenedores, scripting y pipelines CI/CD, lo convierte en un puente ideal entre desarrollo y operaciones dentro del sistema operativo Windows.

Este artículo detalla un caso real de integración de WSL2 en un entorno DevSecOps, con ejemplos de workflows que incluyen validación de código, escaneo de vulnerabilidades, despliegue automatizado y hardening de entornos desde una terminal Linux sobre Windows.

<!--more-->

## Objetivo

Demostrar cómo un entorno WSL2 puede ser parte activa y segura en un flujo DevSecOps moderno, usando herramientas como Docker, GitHub Actions, Trivy, Ansible y más.

## Paso 1: Preparar entorno de trabajo seguro en WSL2

Instalar herramientas básicas:

```bash
sudo apt update && sudo apt install -y git curl build-essential python3-pip
```

Instalar Docker dentro de WSL2 o usar Docker Desktop con integración activa:

```bash
docker version
```

Instalar herramientas DevSecOps:

```bash
pip install ansible
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh
```

## Paso 2: Escaneo de vulnerabilidades con Trivy

Escanear imágenes antes del despliegue:

```bash
docker pull node:18
trivy image node:18
```

Escanear un proyecto local:

```bash
trivy fs .
```

Agregar esto a un script `scan.sh` para automatizar:

```bash
#!/bin/bash
echo "Escaneando vulnerabilidades..."
trivy fs ./backend
```

## Paso 3: Automatización de seguridad con Ansible

Playbook de hardening básico:

```yaml
- name: Aplicar hardening de sistema
  hosts: localhost
  tasks:
    - name: Asegurar permisos de logs
      file:
        path: /var/log
        state: directory
        mode: '0750'
```

Ejecutar desde WSL2:

```bash
ansible-playbook playbooks/hardening.yml -c local
```

## Paso 4: CI/CD con GitHub Actions desde WSL2

Simular el pipeline local con [`act`](https://github.com/nektos/act):

```bash
brew install act
act -j test
```

Ejemplo de workflow:

```yaml
name: CI

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
```

Usar WSL2 para validar estos scripts antes de hacer push a producción.

## Paso 5: Integración de análisis de código estático

Instalar ESLint o Bandit (Python):

```bash
npm install -g eslint
pip install bandit
```

Escanear:

```bash
eslint ./frontend
bandit -r ./backend
```

## Paso 6: Política de seguridad de contenedores

Definir un archivo `Dockerfile` seguro:

```Dockerfile
FROM node:18-alpine
RUN addgroup -S app && adduser -S app -G app
USER app
COPY . .
CMD ["node", "index.js"]
```

Validar con Trivy o Docker Scout:

```bash
trivy image myimage:latest
```

## Buenas prácticas

- No usar root dentro de contenedores
- Validar código con linters y analizadores de seguridad
- Versionar todos los scripts y playbooks en Git
- Usar variables de entorno cifradas para secrets
- Monitorear imágenes con alertas de vulnerabilidad

## Conclusión

WSL2 permite simular y ejecutar flujos DevSecOps reales con herramientas de seguridad, automatización y despliegue en un entorno Linux completo dentro de Windows. Con acceso a Docker, Trivy, Ansible y GitHub Actions, es posible desarrollar y validar código seguro, auditable y productivo sin necesidad de servidores externos o máquinas virtuales.