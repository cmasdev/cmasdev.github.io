---
layout: post
title: "Creando analizadores personalizados en C# con Roslyn"
author: Christian Amado
date: 2025-04-29 00:00:00 -0300
category: [Desarrollo de software]
tags: [.NET]
thumbnail-img: /img/posts/thumbnails/dotnet.png
cover-img: /img/posts/cover/dotnet.png
share_img: /img/posts/shared/dotnet.jpg
---

Mantener un código limpio, coherente y alineado con estándares internos es clave en proyectos profesionales. Aunque herramientas como **SonarQube**, **StyleCop** o **ReSharper** ayudan, a veces es necesario ir más allá y crear reglas personalizadas que se adapten a las necesidades específicas del equipo o la arquitectura.

Con **Roslyn**, el compilador de **C#** y **VB.NET**, es posible crear analizadores (analyzers) que inspeccionen el código fuente, detecten patrones y ofrezcan sugerencias o advertencias en tiempo de compilación. En este artículo se muestra cómo crear, probar e integrar un analizador personalizado en un proyecto C#.

<!--more-->

## ¿Qué es Roslyn?

**Roslyn** es el nombre clave del compilador de código abierto de .NET que permite acceder al análisis del código fuente como un modelo estructurado de árboles de sintaxis, semántica, símbolos, y mucho más.

Con Roslyn es posible:
- Leer y analizar código fuente como árbol de sintaxis (AST).
- Modificar código o generar nuevo.
- Crear herramientas de refactorización.
- Desarrollar analizadores personalizados para detectar problemas en tiempo real en Visual Studio o en pipelines de CI.

## Escenario: Detectar clases cuyo nombre no termina en "Service"

Supongamos que en una arquitectura basada en servicios, toda clase de capa de servicio debe terminar en `Service`. Si alguien crea una clase `UserHandler` en la capa de servicios, queremos advertirlo.

## Paso 1: Crear un proyecto de analizador con plantilla Roslyn

```bash
dotnet new analyzer -n NamingConventionAnalyzer
cd NamingConventionAnalyzer
```

## Paso 2: Modificar el analizador generado

```csharp
using System.Collections.Immutable;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace NamingConventionAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class NamingConventionAnalyzer : DiagnosticAnalyzer
    {
        public const string DiagnosticId = "NC001";
        private static readonly LocalizableString Title = "Nombre de clase de servicio incorrecto";
        private static readonly LocalizableString MessageFormat = "La clase '{0}' debería terminar en 'Service'";
        private const string Category = "Naming";

        private static DiagnosticDescriptor Rule = new DiagnosticDescriptor(
            DiagnosticId, Title, MessageFormat, Category,
            DiagnosticSeverity.Warning, isEnabledByDefault: true);

        public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics => ImmutableArray.Create(Rule);

        public override void Initialize(AnalysisContext context)
        {
            context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
            context.EnableConcurrentExecution();
            context.RegisterSyntaxNodeAction(AnalyzeClassDeclaration, SyntaxKind.ClassDeclaration);
        }

        private void AnalyzeClassDeclaration(SyntaxNodeAnalysisContext context)
        {
            var classDecl = (ClassDeclarationSyntax)context.Node;
            var className = classDecl.Identifier.Text;

            if (!className.EndsWith("Service"))
            {
                var diagnostic = Diagnostic.Create(Rule, classDecl.Identifier.GetLocation(), className);
                context.ReportDiagnostic(diagnostic);
            }
        }
    }
}
```

## Paso 3: Crear una prueba unitaria para validar el analizador

```csharp
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Testing;
using Microsoft.CodeAnalysis.CSharp.Testing;
using Microsoft.CodeAnalysis.Testing.Verifiers;
using System.Threading.Tasks;
using Xunit;

using Verify = Microsoft.CodeAnalysis.CSharp.Testing.XUnit.AnalyzerVerifier<NamingConventionAnalyzer.NamingConventionAnalyzer>;

namespace NamingConventionAnalyzer.Test
{
    public class NamingConventionAnalyzerTests
    {
        [Fact]
        public async Task DetectaClaseSinSufijoService()
        {
            var testCode = @"
                public class {|#0:UserHandler|}
                {
                }
            ";

            var expected = Verify.Diagnostic("NC001")
                .WithLocation(0)
                .WithArguments("UserHandler");

            await Verify.VerifyAnalyzerAsync(testCode, expected);
        }

        [Fact]
        public async Task NoMarcaClaseCorrecta()
        {
            var testCode = @"
                public class UserService
                {
                }
            ";

            await Verify.VerifyAnalyzerAsync(testCode);
        }
    }
}
```

## Paso 4: Compilar y probar

```bash
dotnet test
```

## Paso 5: Usar el analizador en otros proyectos

```bash
dotnet pack -c Release
dotnet add reference ../NamingConventionAnalyzer/bin/Release/NamingConventionAnalyzer.nupkg
```

## Buenas prácticas

- Utilizar `DiagnosticSeverity.Info`, `Warning` o `Error` según el impacto.
- Proveer sugerencias claras para el desarrollador.
- Usar atributos como `SupportedDiagnostics` para registrar múltiples reglas.
- Crear *code fixes* para permitir al usuario aplicar correcciones automáticamente.
- Publicar en NuGet con un prefijo de ID único (`Company.RuleId`) para evitar colisiones.

## Escenarios de uso comunes

- Detectar convenciones de nombres o estructuras de carpetas.
- Forzar uso de `ConfigureAwait(false)` en librerías.
- Validar uso de APIs internas o legacy.
- Evitar `DateTime.Now` en código que debería usar `DateTime.UtcNow`.

## Conclusión
Crear analizadores personalizados con **Roslyn** es una forma poderosa de reforzar la calidad del código desde dentro del **IDE**. Permite implementar políticas específicas del equipo, detectar errores antes de llegar al build, y educar progresivamente a los desarrolladores sobre buenas prácticas.

Integrado con pruebas automáticas y pipelines CI, **Roslyn** se convierte en una herramienta esencial para entornos profesionales que requieren código robusto, mantenible y alineado con las reglas internas.