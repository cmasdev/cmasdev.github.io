---
layout: post
title: "WSL2 + Azure CLI: gestión de recursos cloud desde terminal Linux"
author: Christian Amado
date: 2024-09-27 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**WSL2** permite ejecutar un entorno **Linux** real dentro de **Windows**, lo que habilita el uso de herramientas nativas para gestión en la nube como **Azure CLI**. Con esta combinación, los desarrolladores y administradores pueden trabajar cómodamente desde la terminal Linux para administrar recursos en **Azure**, automatizar tareas, monitorear infraestructura y ejecutar scripts multiplataforma sin salir del entorno local.

Este artículo explica paso a paso cómo instalar **Azure CLI** en **WSL2**, cómo autenticarse y gestionar recursos como máquinas virtuales, redes, contenedores y más.

<!--more-->

## Requisitos

- WSL2 activo con una distribución Ubuntu (recomendado)
- Cuenta activa de Azure con acceso de administrador
- Git y curl instalados
- Acceso a un navegador para autenticación

## Paso 1: Instalar Azure CLI en WSL2

Desde una terminal WSL2 (Ubuntu):

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

Verificar instalación:

```bash
az version
```

Debe mostrar la versión instalada y sus componentes.

## Paso 2: Iniciar sesión en Azure

```bash
az login
```

Esto abrirá una URL en el navegador predeterminado de Windows. Se puede copiar y abrir manualmente si es necesario.

Una vez autenticado, se mostrará la suscripción activa:

```bash
az account show
```

## Paso 3: Comandos básicos para gestión de recursos

### Listar grupos de recursos

```bash
az group list --output table
```

### Crear un grupo de recursos

```bash
az group create --name demo-wsl --location eastus
```

### Crear una máquina virtual

```bash
az vm create   --resource-group demo-wsl   --name vmLinuxDemo   --image UbuntuLTS   --admin-username dev   --generate-ssh-keys
```

### Abrir puerto SSH

```bash
az vm open-port --resource-group demo-wsl --name vmLinuxDemo --port 22
```

### Conectarse por SSH

```bash
ssh dev@<IP_PÚBLICA>
```

Obtener IP pública:

```bash
az vm list-ip-addresses -g demo-wsl -n vmLinuxDemo --query "[].virtualMachine.network.publicIpAddresses[].ipAddress" -o tsv
```

## Paso 4: Gestión de almacenamiento y contenedores

### Crear una cuenta de almacenamiento

```bash
az storage account create   --name almacendemowsl   --resource-group demo-wsl   --location eastus   --sku Standard_LRS
```

### Crear un contenedor en Azure Blob Storage

```bash
az storage container create   --name archivos   --account-name almacendemowsl   --auth-mode login
```

### Subir un archivo

```bash
az storage blob upload   --account-name almacendemowsl   --container-name archivos   --name demo.txt   --file ./demo.txt   --auth-mode login
```

## Paso 5: Automatización con scripts Bash

Crear un script `provisionar-vm.sh`:

```bash
#!/bin/bash
GRUPO="dev-wsl"
NOMBRE="vm-wsl2"

az group create --name $GRUPO --location eastus
az vm create --resource-group $GRUPO --name $NOMBRE --image UbuntuLTS --admin-username dev --generate-ssh-keys
```

Dar permisos y ejecutar:

```bash
chmod +x provisionar-vm.sh
./provisionar-vm.sh
```

## Buenas prácticas

- Usar `--output table` o `--output yaml` para resultados legibles
- Almacenar scripts en Git y versionarlos por proyecto
- Usar `az config set extension.use_dynamic_install=yes_without_prompt` para extensiones
- No compartir archivos `.azure/` con otras máquinas sin cifrado
- Combinar con `jq` para procesamiento de resultados en JSON

## Conclusión

Usar **Azure CLI** desde **WSL2** permite trabajar de forma profesional y segura con recursos cloud desde un entorno **Linux**, combinando lo mejor de la nube con la productividad del terminal. Esto habilita flujos de automatización, integración CI/CD, administración remota y scripting robusto directamente desde **Windows**.