---
layout: post
title: "Uso seguro de variables y secretos en GCP con Go"
author: Christian Amado
date: 2025-04-30 00:00:00 -0300
category: [Desarrollo de software]
tags: [Google,Google Cloud,GCP,Go]
thumbnail-img: /img/posts/thumbnails/golang.webp
cover-img: /img/posts/cover/Go-Lang.svg
share_img: /img/posts/shared/golang.png
---

Manejar secretos —como claves API, tokens y credenciales— de forma segura es esencial en cualquier aplicación moderna. **Google Cloud Platform (GCP)** ofrece una solución robusta para este desafío a través de **Secret Manager**, que permite almacenar, acceder y auditar secretos de manera segura y centralizada.

Este artículo muestra cómo acceder y gestionar secretos en **GCP** desde aplicaciones desarrolladas en **Go**, asegurando que tus variables sensibles estén protegidas sin necesidad de hardcodearlas o exponerlas en entornos inseguros.

<!--more-->

## ¿Por qué usar Secret Manager?

Secret Manager de GCP es un servicio completamente gestionado que ofrece:

- **Cifrado automático** con claves de Google o personalizadas (CMEK).
- **Versionado de secretos** para revertir fácilmente a estados anteriores.
- **Control de acceso granular** vía IAM.
- **Registros de auditoría** con Cloud Audit Logs.
- **Integración nativa con entornos serverless, Compute Engine y GKE**.

## Requisitos previos

Antes de comenzar, asegurate de tener:

- Un proyecto activo en Google Cloud.
- El API de Secret Manager habilitada.
- El SDK de Google Cloud (`gcloud`) configurado.
- Una cuenta de servicio con permisos `Secret Manager Accessor` (`roles/secretmanager.secretAccessor`).
- Go instalado (se recomienda Go 1.20+).
- Módulos habilitados (`go mod init` en tu proyecto).

## Paso 1: Crear y almacenar un secreto en GCP

Desde la consola o terminal:

```bash
gcloud secrets create DB_PASSWORD --replication-policy=automatic
echo -n "super-clave-secreta" | gcloud secrets versions add DB_PASSWORD --data-file=-
```

Esto crea el secreto `DB_PASSWORD` con una versión y lo almacena de forma segura.

## Paso 2: Configurar permisos de acceso

Otorgá acceso a la cuenta de servicio usada por tu aplicación:

```bash
gcloud secrets add-iam-policy-binding DB_PASSWORD \
  --member="serviceAccount:mi-cuenta@mi-proyecto.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Paso 3: Instalar dependencias en Go

En tu archivo `go.mod`:

```bash
go get cloud.google.com/go/secretmanager/apiv1
go get google.golang.org/api/option
```

## Paso 4: Código para acceder al secreto en Go

```go
package main

import (
	"context"
	"fmt"
	"log"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"google.golang.org/api/option"
	secretspb "google.golang.org/genproto/googleapis/cloud/secretmanager/v1"
)

func main() {
	ctx := context.Background()

	client, err := secretmanager.NewClient(ctx, option.WithCredentialsFile("ruta/a/tu/clave.json"))
	if err != nil {
		log.Fatalf("Error creando cliente: %v", err)
	}
	defer client.Close()

	accessRequest := &secretspb.AccessSecretVersionRequest{
		Name: "projects/ID_PROYECTO/secrets/DB_PASSWORD/versions/latest",
	}

	result, err := client.AccessSecretVersion(ctx, accessRequest)
	if err != nil {
		log.Fatalf("Error accediendo al secreto: %v", err)
	}

	secret := string(result.Payload.Data)
	fmt.Println("Secreto accedido:", secret)
}
```

> ⚠️ **Nunca imprimas el secreto en producción.** Este ejemplo es solo para demostración.

## Paso 5: Uso de secretos en variables de entorno

```go
import (
	"os"
)

os.Setenv("DB_PASSWORD", secret)
fmt.Println(os.Getenv("DB_PASSWORD"))
```

Esto es útil para usar librerías que esperan configuraciones vía `env`.

## Buenas prácticas

- **Nunca hardcodees secretos** en el código fuente.
- **Evitá guardar secretos en archivos de configuración planos**.
- **Usá versionado de secretos** para rotaciones sin downtime.
- **Controlá el acceso con políticas IAM específicas** para minimizar el riesgo.
- **Usá registros de auditoría** para detectar accesos indebidos.
- **No loguees secretos accidentalmente.**

## Alternativas: acceso automático desde Cloud Run o GKE

Si desplegás en Cloud Run, App Engine o GKE, podés acceder a los secretos sin usar claves JSON, simplemente mediante la cuenta de servicio adjunta al entorno, lo que refuerza la seguridad y evita manejar archivos sensibles.

```go
client, err := secretmanager.NewClient(ctx) // sin option.WithCredentialsFile
```

Este enfoque se recomienda en producción.

## Conclusión

**Secret Manager** permite gestionar variables sensibles de forma segura, eficiente y auditada. Su integración con **Go** es directa gracias al *SDK* oficial, lo que permite eliminar configuraciones inseguras y mejorar la postura de seguridad general de cualquier aplicación backend.

Adoptar estas buenas prácticas desde el inicio mejora la seguridad, simplifica la gestión de configuración y garantiza que tus aplicaciones **Go** en **GCP** estén listas para producción desde el primer día.