---
layout: post
title: "Seguridad avanzada en WSL2: sandboxing y seccomp"
author: Christian Amado
date: 2024-07-19 00:00:00 -0400
category: [Desarrollo de software]
tags: [WinDev,Windows 11,WSL]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

WSL2, al ejecutar un kernel Linux completo dentro de Windows, hereda capacidades de seguridad del subsistema Linux y del entorno de Windows. Esto permite aplicar técnicas avanzadas como sandboxing y control de llamadas al sistema mediante `seccomp`, protegiendo aplicaciones y conteniendo procesos potencialmente inseguros.

<!--more-->

## Entendiendo el modelo de seguridad de WSL2

- WSL2 corre dentro de una VM ligera sobre Hyper-V
- Tiene su propio espacio de usuarios, red y sistema de archivos
- Puede acceder al sistema de archivos Windows, pero de forma controlada
- Hereda los permisos y restricciones del usuario de Windows anfitrión

Aunque no es un contenedor, se puede aplicar aislamiento similar con herramientas del ecosistema Linux.

## Usar seccomp para limitar llamadas al sistema

`seccomp` permite definir qué llamadas al sistema (`syscalls`) puede hacer un proceso. Esto es útil para bloquear funcionalidades peligrosas o limitar comportamientos.

Instalar herramientas necesarias:

```bash
sudo apt install -y seccomp libseccomp-dev strace
```

Ejemplo de script bloqueando `execve` (ejecución de procesos):

```c
#include <linux/seccomp.h>
#include <linux/filter.h>
#include <linux/audit.h>
#include <sys/prctl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    prctl(PR_SET_SECCOMP, SECCOMP_MODE_STRICT);
    printf("Hola, mundo seguro!\n");
    execl("/bin/ls", "ls", NULL);  // Esta llamada será bloqueada
    return 0;
}
```

Compilar y ejecutar:

```bash
gcc secure.c -o secure
./secure
```

El intento de ejecutar `/bin/ls` fallará, mostrando que `execve` fue bloqueado.

## Usar Firejail para sandboxing de procesos

**Firejail** crea entornos aislados para correr procesos sin acceso a partes sensibles del sistema.

Instalar:

```bash
sudo apt install -y firejail
```

Ejecutar un programa con aislamiento:

```bash
firejail --private gedit
```

Esto corre `gedit` en un entorno aislado, sin acceso al home del usuario.

Configurar perfiles personalizados para más control:

```bash
firejail --profile=mi_perfil.profile programa
```

## Reforzar seguridad con permisos de archivo

Aplicar técnicas tradicionales:

```bash
chmod -R go-rwx ~/proyecto_secreto
chattr +i archivo.conf  # Evita que sea modificado
```

También se pueden usar *namespaces* y *cgroups* para limitar CPU, RAM y accesos.

## Buenas prácticas

- Usar usuarios no privilegiados por defecto
- Aislar procesos críticos con `firejail` o seccomp
- Limitar accesos al sistema de archivos de Windows desde `/mnt/c/`
- Auditar procesos con `strace` o `auditd`

## Conclusión

WSL2 no solo ofrece potencia para desarrollo, sino también mecanismos de seguridad avanzados para proteger datos y procesos. Con herramientas como seccomp, Firejail y permisos reforzados, se puede alcanzar un alto nivel de aislamiento sin perder flexibilidad, incluso en entornos compartidos o productivos.