---
layout: post
title: "Implementación de clusters Kubernetes locales con k3s sobre WSL2"
author: Christian Amado
date: 2024-08-02 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

Para entornos de desarrollo y pruebas, contar con un cluster **Kubernetes** liviano y funcional es clave. **k3s**, una distribución de **Kubernetes** simplificada, se puede ejecutar perfectamente sobre **WSL2**, permitiendo crear un cluster local completo sin necesidad de herramientas pesadas como **Minikube** o **Docker Desktop**.

Este artículo describe paso a paso cómo instalar y configurar **k3s** en **WSL2**, con recomendaciones prácticas para flujos **DevOps** y testing de microservicios.

<!--more-->

## Requisitos

- Windows 10/11 con WSL2 habilitado
- Distro Linux instalada (Ubuntu 22.04 recomendado)
- Usuario con privilegios `sudo`
- Docker (opcional para algunos complementos)

## Paso 1: Preparar el entorno

Actualizar paquetes e instalar herramientas necesarias:

```bash
sudo apt update && sudo apt install -y curl wget gnupg lsb-release
```

Verificar la red de WSL2:

```bash
ip addr show eth0
```

## Paso 2: Instalar k3s en modo single-node

Ejecutar el script oficial:

```bash
curl -sfL https://get.k3s.io | sh -
```

Esto instalará k3s como un servicio y arrancará automáticamente.

Verificar que el cluster esté en funcionamiento:

```bash
sudo kubectl get nodes
```

Debería verse un nodo en estado `Ready`.

## Paso 3: Acceder a `kubectl` sin `sudo`

Para facilitar el acceso:

```bash
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
```

Comprobar acceso:

```bash
kubectl get pods -A
```

## Paso 4: Desplegar una aplicación de prueba

Ejemplo: servidor NGINX

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
```

Ver el servicio expuesto:

```bash
kubectl get svc
```

Usar el puerto asignado (ej: 30001) para acceder desde el navegador:

```
http://localhost:30001
```

## Paso 5: Usar k3s en entornos multi-node (avanzado)

También es posible crear múltiples distros WSL2 y configurar nodos worker usando direcciones IP locales, aunque este flujo requiere túneles, sincronización SSH y scripts personalizados.

Para la mayoría de los casos de desarrollo, el nodo único es suficiente.

## Buenas prácticas

- Configurar `.kube/config` con perfiles personalizados
- Automatizar la instalación con Makefiles o scripts
- Agregar namespaces para separar proyectos: `kubectl create ns desarrollo`
- Usar `k9s` para una visualización tipo TUI

## Conclusión

**k3s** permite implementar clusters **Kubernetes** funcionales en segundos, ideal para desarrollo de microservicios, CI/CD local o pruebas en pipelines. Ejecutarlo sobre **WSL2** combina rendimiento, facilidad y compatibilidad total con **Linux** sin salir de **Windows**.
