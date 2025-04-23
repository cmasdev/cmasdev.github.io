---
layout: post
title: "Firestore como base NoSQL para apps Go"
author: Christian Amado
date: 2025-04-23 00:00:00 -0300
category: [Desarrollo de software]
tags: [Google,Google Cloud,Go,Firestore]
thumbnail-img: /img/posts/thumbnails/golang.jpg
cover-img: /img/posts/cover/Go-Lang.png
share_img: /img/posts/shared/golang.jpg
---

**Firestore**, la base de datos **NoSQL** de **Google Cloud**, ofrece una solución escalable y de baja latencia ideal para aplicaciones modernas. En este artículo se explora cómo integrar **Firestore** con aplicaciones desarrolladas en **Go**, aprovechando el **SDK** oficial de **Google Cloud**. A lo largo del artículo se muestra un enfoque práctico para conectar, leer, escribir y actualizar documentos en **Firestore** desde una aplicación escrita en **Go**.

<!--more-->

## ¿Por qué Firestore con Go?

Go es un lenguaje compilado, concurrente y eficiente, ideal para aplicaciones de backend. Firestore, por su parte, ofrece sincronización en tiempo real, una estructura basada en documentos y una integración nativa con GCP. Combinarlos resulta natural si se desea:

- Escalabilidad automática sin configurar instancias manualmente.
- Un esquema flexible sin necesidad de migraciones.
- Baja latencia para operaciones de lectura/escritura.
- Seguridad granular con reglas basadas en usuarios.

## Requisitos previos

Antes de comenzar, se debe tener:

- Una cuenta de Google Cloud (puede ser gratuita).
- Un proyecto de GCP con Firestore habilitado.
- El SDK de Google Cloud instalado (`gcloud`).
- Go instalado (recomendado Go 1.20 o superior).
- Una carpeta de proyecto Go con módulos habilitados (`go mod init`).

## Paso 1: Crear el proyecto en GCP y habilitar Firestore

Desde la consola de Google Cloud:

1. Crear un nuevo proyecto:  
   Navegar a [console.cloud.google.com](https://console.cloud.google.com), ir a "IAM y administración" > "Proyectos" > "Nuevo Proyecto".

2. Habilitar Firestore:  
   En el menú lateral, ir a "Firestore", seleccionar "Modo nativo" y elegir una región.

3. Crear una cuenta de servicio:
   - Ir a "IAM y administración" > "Cuentas de servicio".
   - Crear una nueva con permisos `Cloud Datastore User`.
   - Descargar la clave en formato JSON.

## Paso 2: Configurar el entorno de desarrollo Go

En la terminal:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/ruta/a/tu/clave.json"
```

En tu proyecto Go, instala las dependencias necesarias:

```bash
go mod init firego
go get cloud.google.com/go/firestore
go get google.golang.org/api/option
```

## Paso 3: Conectar a Firestore

```go
package main

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()

	sa := option.WithCredentialsFile("ruta/a/tu/clave.json")
	client, err := firestore.NewClient(ctx, "ID_DEL_PROYECTO", sa)
	if err != nil {
		log.Fatalf("Error al conectar con Firestore: %v", err)
	}
	defer client.Close()

	fmt.Println("Conexión establecida con Firestore")
}
```

## Paso 4: Agregar documentos

```go
type Usuario struct {
	Nombre  string `firestore:"nombre"`
	Correo  string `firestore:"correo"`
	Activo  bool   `firestore:"activo"`
}

func agregarUsuario(client *firestore.Client, ctx context.Context) error {
	u := Usuario{"Christian", "cmas@example.com", true}
	_, _, err := client.Collection("usuarios").Add(ctx, u)
	return err
}
```

## Paso 5: Leer documentos

```go
func obtenerUsuarios(client *firestore.Client, ctx context.Context) error {
	iter := client.Collection("usuarios").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}
		var u Usuario
		doc.DataTo(&u)
		fmt.Printf("Usuario: %+v\n", u)
	}
	return nil
}
```

## Paso 6: Actualizar documentos

```go
func actualizarCorreo(client *firestore.Client, ctx context.Context, docID string) error {
	_, err := client.Collection("usuarios").Doc(docID).Update(ctx, []firestore.Update{
		{Path: "correo", Value: "nuevo@email.com"},
	})
	return err
}
```

## Paso 7: Eliminar documentos

```go
func eliminarUsuario(client *firestore.Client, ctx context.Context, docID string) error {
	_, err := client.Collection("usuarios").Doc(docID).Delete(ctx)
	return err
}
```

## Buenas prácticas

- **Evitar operaciones dentro de loops** sin control de errores.
- **Usar `context.WithTimeout`** para prevenir bloqueos indefinidos.
- **Cerrar el cliente correctamente** con `defer client.Close()`.
- **Aplicar reglas de seguridad** desde la consola para limitar accesos.
- **Monitorear el uso y costos** desde el panel de GCP.

## Conclusión

Integrar **Firestore** en una aplicación **Go** es un proceso directo gracias al **SDK** oficial de **Google Cloud**. Este enfoque permite desarrollar aplicaciones backend escalables, eficientes y seguras. Con **Firestore** se elimina la necesidad de gestionar servidores o configurar réplicas manuales, y se gana un modelo de datos flexible ideal para apps modernas.

Este artículo mostró paso a paso cómo conectar, crear, leer, actualizar y borrar documentos. A partir de aquí, se puede escalar a funcionalidades más avanzadas como búsquedas compuestas, seguridad basada en usuarios, y sincronización en tiempo real mediante **Firebase Authentication** y **Firestore listeners**.