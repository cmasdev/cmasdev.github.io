---
layout: post
title: "Seguridad en aplicaciones Deno: Autenticación y autorización"
author: Christian Amado
date: 2024-05-08 00:00:00 -0400
category: [Desarrollo de software]
tags: [Web Development,Deno,Typescript]
thumbnail-img: /img/posts/thumbnails/deno.png
cover-img: /img/posts/cover/deno.png
share_img: /img/posts/shared/deno.png
---

**Deno**, como entorno de ejecución moderno para **JavaScript** y **TypeScript**, ofrece varias ventajas en términos de seguridad. Su enfoque en la seguridad por diseño incluye la gestión de permisos granular y un runtime sin acceso implícito al sistema. Sin embargo, la seguridad en aplicaciones Deno no solo depende del entorno, sino también de cómo se implementan funcionalidades clave como la autenticación y autorización. Este artículo explora cómo construir aplicaciones seguras en Deno con ejemplos prácticos y buenas prácticas.

## Introducción a la seguridad en Deno

### Ventajas de Deno en términos de seguridad
1. **Sistema de permisos**: Deno requiere permisos explícitos para acceder a archivos, red y entorno.
2. **Tipado estático**: TypeScript mejora la robustez del código.
3. **Integración nativa con WebAssembly (WASM)**: Reduce vulnerabilidades por código nativo inseguro.

A pesar de estas ventajas, los desarrolladores deben implementar medidas adicionales para proteger sus aplicaciones, especialmente en lo relacionado con la autenticación y autorización.

## Autenticación en Deno

La autenticación verifica la identidad de los usuarios. Una implementación segura considera:
1. Uso de protocolos modernos como *OAuth 2.0* o *OpenID Connect (OIDC)*.
2. Encriptación de contraseñas con algoritmos seguros (*bcrypt*, *Argon2*).
3. Tokens seguros (*JWT* con *HS256* o *RS256*).

### Ejemplo práctico: Autenticación basada en JWT

```
import { create, verify } from "https://deno.land/x/djwt/mod.ts";

const secretKey = "your-secret-key";

// Generar un token
async function generateToken(payload: Record<string, unknown>) {
  const jwt = await create({ alg: "HS256", typ: "JWT" }, payload, secretKey);
  return jwt;
}

// Verificar un token
async function verifyToken(token: string) {
  try {
    const payload = await verify(token, secretKey, "HS256");
    return payload;
  } catch (error) {
    throw new Error("Token inválido");
  }
}

// Ejemplo de uso
const token = await generateToken({ id: 1, role: "admin" });
console.log("Token generado:", token);

const payload = await verifyToken(token);
console.log("Payload verificado:", payload);
```

### Buenas prácticas para la autenticación
1. **Usar HTTPS**: Protege los tokens en tránsito.
2. **Implementar expiración de tokens**: Minimiza riesgos en caso de compromiso.
3. **Almacenar contraseñas de forma segura**:

```
import { hash, compare } from "https://deno.land/x/bcrypt/mod.ts";

const password = "securepassword";
const hashedPassword = await hash(password);
console.log("Contraseña hasheada:", hashedPassword);

const isValid = await compare(password, hashedPassword);
console.log("Contraseña válida:", isValid);
```

## Autorización en Deno
La autorización determina qué recursos puede acceder un usuario autenticado.

### Ejemplo práctico: Middleware para roles
Un *middleware* puede garantizar que solo ciertos roles accedan a rutas específicas:
```
import { Context } from "https://deno.land/x/oak/mod.ts";

async function roleMiddleware(ctx: Context, next: () => Promise<unknown>, allowedRoles: string[]) {
  const token = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token no proporcionado" };
    return;
  }

  try {
    const payload = await verifyToken(token);

    if (!allowedRoles.includes(payload.role)) {
      ctx.response.status = 403;
      ctx.response.body = { error: "Acceso denegado" };
      return;
    }

    await next();
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token inválido" };
  }
}

// Ejemplo de uso
router.get(
  "/admin",
  (ctx, next) => roleMiddleware(ctx, next, ["admin"]),
  (ctx) => {
    ctx.response.body = { message: "Bienvenido, admin" };
  },
);
```

### Buenas prácticas para la autorización
1. **Principio de menor privilegio**: Limitar accesos a lo estrictamente necesario.
2. **Políticas basadas en roles (RBAC)**: Simplifican la gestión de permisos.
3. **Registro de eventos de acceso**: Proporciona trazabilidad.

## Medidas adicionales de seguridad
1. **CORS**: Configurar correctamente para evitar accesos no autorizados.

```
import { oakCors } from "https://deno.land/x/cors/mod.ts";

app.use(oakCors({
  origin: "https://example.com",
}));
```

2. **Validación de datos**:
```
import { z } from "https://deno.land/x/zod/mod.ts";

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

try {
  const userData = userSchema.parse({ username: "test", password: "secure" });
  console.log("Datos válidos:", userData);
} catch (error) {
  console.error("Error de validación:", error);
}
```

3. **Monitoreo y auditoría**: Implementar registros de eventos sensibles.
4. **Uso de secretos seguros**: Gestionar claves de API y configuraciones sensibles mediante herramientas como Deno Deploy Secrets.

## Conclusión
La seguridad en aplicaciones Deno va más allá de las capacidades intrínsecas del entorno. Una implementación adecuada de autenticación y autorización, junto con medidas complementarias, garantiza aplicaciones robustas y protegidas contra amenazas modernas. Aplicar las mejores prácticas descritas y mantenerse actualizado con las últimas vulnerabilidades es esencial para mantener la confianza y la integridad de tus aplicaciones.
