---
layout: post
title: "Desarrollo Rust en WSL2: toolchain, testing y empaquetado"
author: Christian Amado
date: 2024-07-05 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

**Rust** es un lenguaje moderno y seguro por diseño, ideal para crear aplicaciones de alto rendimiento y sistemas embebidos. Combinado con WSL2, permite a los desarrolladores trabajar en un entorno **Linux** desde **Windows**, aprovechando herramientas como `cargo`, `rustup`, pruebas automatizadas y sistemas de empaquetado como `cargo-deb`.

<!--more-->

## Instalar Rust en WSL2

Desde la terminal WSL2:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Verificar la instalación:

```bash
rustc --version
cargo --version
```

## Crear un proyecto Rust básico

```bash
cargo new mi_app
cd mi_app
cargo run
```

Esto crea una estructura de proyecto estándar con `Cargo.toml` y un archivo `main.rs` en `src/`.

## Usar componentes adicionales del toolchain

Instalar herramientas comunes:

```bash
rustup component add clippy rustfmt
```

Verificar y formatear el código:

```bash
cargo clippy
cargo fmt
```

## Escribir y ejecutar tests automatizados

Agregar una función de prueba en `src/lib.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn suma_funciona() {
        assert_eq!(2 + 2, 4);
    }
}
```

Ejecutar tests:

```bash
cargo test
```

Se obtiene un resumen detallado del resultado, cobertura y errores si existen.

## Empaquetado del proyecto con cargo-deb

Instalar herramienta para generar paquetes `.deb`:

```bash
cargo install cargo-deb
```

Empaquetar la aplicación:

```bash
cargo deb
```

Esto genera un archivo `.deb` listo para distribuir e instalar en sistemas basados en Debian.

## Buenas prácticas

- Usar `cargo watch` para recompilar automáticamente al guardar cambios
- Separar lógica en módulos reutilizables dentro de `src/`
- Mantener documentación con `cargo doc --open`
- Publicar paquetes en crates.io solo si están documentados y testeados

## Conclusión

Desarrollar con Rust en WSL2 brinda una experiencia fluida y potente, integrando el ecosistema Linux sin salir de Windows. Herramientas como `cargo`, `rustfmt`, `clippy` y `cargo-deb` permiten construir, probar y empaquetar software profesionalmente desde un entorno moderno y reproducible.
