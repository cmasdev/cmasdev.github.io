---
layout: post
title: "Usando MAUI con Windows App SDK"
author: Christian Amado
date: 2022-11-02 23:42:00 -0400
category: [Desarrollo de software]
tags: [WinDev, MAUI, Windows 11, Windows App SDK]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo veremos cómo **.NET MAUI** interactúa con **Windows 11** sin necesidad de funciones extras ni código para llegar a ese resultado.

***Windows 11 Insider Preview Build 25236***

<!--more-->

Hemos visto en varios artículos anteriores, detalles sobre **.NET MAUI**, pero aquí me surge la necesidad de saber qué pasa en el caso de Windows cuando, por ejemplo, necesitamos acceder al sistema de archivos. ¿Qué pasa? Comparando con **Android** ¿Cómo se comporta? Seguí leyendo y veamos.

## Abrir imagen en Windows 11
Con estos pasos lograremos abrir un archivo y cargarlo en nuestro diseño.

1. Creamos el método que permite abrir los archivos en el Windows:
```
private async Task<FileResult> PickAndShow(PickOptions options)
{
    try
    {
        var result = await FilePicker.Default.PickAsync(options);
        if (result != null)
        {
            if (result.FileName.EndsWith("jpg", StringComparison.OrdinalIgnoreCase) ||
                result.FileName.EndsWith("png", StringComparison.OrdinalIgnoreCase))
            {
                using var stream = await result.OpenReadAsync();
                var image = ImageSource.FromStream(() => stream);
            }
        }

        return result;
    }
    catch (Exception ex)
    {
        throw ex;
    }

    return null;
}
```

2. Hacemos la llamada al método y el resultado lo exponemos en la imagen principal:
```
private async void OnCounterClicked(object sender, EventArgs e)
{
    var resultado = await PickAndShow(PickOptions.Images);

    imgLogo.Source = (ImageSource) new ImageSourceConverter().ConvertFromString(resultado.FullPath);
}
```

3. Hicimos un cambio en el XAML, colocamos un nombre a la imagen para poder reemplazar el *Source* de dicha imagen:
```
<Image
    x:Name="imgLogo"
    Source="dotnet_bot.png"
    SemanticProperties.Description="Cute dot net bot waving hi to you!"
    HeightRequest="200"
    HorizontalOptions="Center" />
```

4. Ejecutamos la aplicación y vemos los resultados:
![](/img/posts/2022/11/02/1.png)

![](/img/posts/2022/11/02/2.png)

![](/img/posts/2022/11/02/3.png)

## Abrir imagen en Android
Como todo esto lo hicimos con **.NET MAUI**, debemos hacer ¡NADA!

1. Ejecutamos en **Android** y...
![](/img/posts/2022/11/02/4.png)

![](/img/posts/2022/11/02/5.png)

![](/img/posts/2022/11/02/6.png)

Con una única línea de código pudimos realizar esta tarea sencilla sin necesidad de solicitar permisos ni nada desde la aplicación. esa es una de las ventajas que me gusta de **.NET MAUI**

¡Espero resulte útil!
