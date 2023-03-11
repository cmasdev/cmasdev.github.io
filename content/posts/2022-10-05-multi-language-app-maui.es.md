---
layout: post
title: "Aplicación multilingüe en MAUI"
author: Christian Amado
date: 2022-10-05 17:48:00 -0400
category: [Desarrollo de software]
tags: [WinDev, MAUI, Windows 11]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo crear una aplicación **.NET MAUI** multilingüe sobre **Windows 11** utilizando archivos de recursos.

***Windows 11 Insider Preview Build 22621***

<!--more-->

En un [artículo anterior](/posts/2022-09-21-data-binding-in-maui/) hemos creado un proyecto donde vimos cómo utilizar la técnica de *Data binding* (usaremos ese mismo proyecto).

Necesitamos crear archivos de recuros y enlazarlos al XAML para que éstos funcionen. Vamos a enfocarnos en el idioma inglés (ya que el proyecto viene así).

## Crear archivos de recursos
Para empezar con la localización, 

1. Crear una carpeta con el nombre *Localization* (puede tener cualquier nombre) y colocarla dentro de la carpeta *Resources*:
![](/img/posts/2022/10/05/1.png)

2. Dentro de dicha carpeta, se crear el archivo de tipo Recurso(.resx):  
![](/img/posts/2022/10/05/2.png)

3. Completamos las filas con los registros necesarios (deben ser nombres descriptivos sin espacios ni caracteres especiales):
![](/img/posts/2022/10/05/3.png)

4. Repetimos el paso 2, pero le colocamos las iniciales del idioma que queremos utilizar (en mi caso **es**) y completamos las fials con las traducciones:
![](/img/posts/2022/10/05/4.png)

5. ¡Listo! Es hora de código **XAML** y **C#**

## Localizar aplicaciones .NET MAUI
Aquí es donde se realiza el trabajo, los cuatro(4) primeros pasos corresponden a configuraciones generales, es decir, que se realizan de la misma forma para todos los proyectos multilingüe que queramos. Luego, el código **XAML** ya puede variar según cada caso.

1. Instalar el paquete **NuGet** con el nombre **Microsoft.Extensions.Localization** (lo puedes descargar [aquí](https://www.nuget.org/packages/Microsoft.Extensions.Localization)):

2. Crear (en la raíz del proyecto) el archivo **ServiceHelper.cs** que permite identificar cada plataforma y obtener el servicio (relacionado a la *Dependency Injection*):
```
namespace Maui_DataBinding
{
    public static class ServiceHelper
    {
        public static TService GetService<TService>() => Current.GetService<TService>();

        public static IServiceProvider Current =>
#if WINDOWS
            MauiWinUIApplication.Current.Services;
#elif ANDROID
            MauiApplication.Current.Services;
#elif IOS || MACCATALYST
            MauiUIApplicationDelegate.Current.Services;
#else
            null;
#endif
```

3. Crear una extension de método para poder utilizarla en cualquier página **XAML** que necesitemos:
```
using Maui_DataBinding.Resources.Localization;
using Microsoft.Extensions.Localization;

namespace Maui_DataBinding
{
    [ContentProperty(nameof(Key))]
    public class LocalizeExtension : IMarkupExtension
    {
        IStringLocalizer<AppLocalize> _localizer;

        public string Key { get; set; } = string.Empty;

        public LocalizeExtension()
        {
            _localizer = ServiceHelper.GetService<IStringLocalizer<AppLocalize>>();
        }

        public object ProvideValue(IServiceProvider serviceProvider)
        {
            string localizedText = _localizer[Key];
            return localizedText;
        }

        object IMarkupExtension.ProvideValue(IServiceProvider serviceProvider) => ProvideValue(serviceProvider);
    }
}
```

4. Por último, el el archivo **MauiProgram.cs** se agregar el servicio de Localización:
```
builder.Services.AddLocalization();
```
La clase completa, queda así:
```
using Microsoft.Extensions.Logging;

namespace Maui_DataBinding;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

        builder.Services.AddLocalization();

#if DEBUG
        builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
```

5. Modificamos nuestro código XAML, donde agregamos el espacio de nombre de nuestro proyecto y agregamos las extensiones en las propiedades de texto:
```
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:Maui_DataBinding"
             x:Class="Maui_DataBinding.MainPage">

    <ScrollView>
        <VerticalStackLayout
            Spacing="25"
            Padding="30,0"
            VerticalOptions="Center">

            <Image
                Source="dotnet_bot.png"
                SemanticProperties.Description="{local:Localize Key=BotImage}"
                HeightRequest="200"
                HorizontalOptions="Center" />

            <Label
                Text="{local:Localize Key=HelloText}"
                SemanticProperties.HeadingLevel="Level1"
                FontSize="32"
                HorizontalOptions="Center" />

            <Label
                Text="{local:Localize Key=WelcomeText}"
                SemanticProperties.HeadingLevel="Level2"
                SemanticProperties.Description="{local:Localize Key=WelcomeDescriptionText}"
                FontSize="18"
                HorizontalOptions="Center" />

            <Button
                x:Name="CounterBtn"
                Text="{Binding CounterBtnText}"
                SemanticProperties.Hint="{local:Localize Key=ButtonTextHint}"
                Clicked="OnCounterClicked"
                HorizontalOptions="Center" />

            <Button
                x:Name="LangBtn"
                Text="Change language"
                Clicked="OnLangBtnClicked"
                HorizontalOptions="Center" />

        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

6. En vista, que hemos modificado el código **C#** para la técnica de *Data Binding*, debemos modificarla también:
```
public string CounterBtnText
{
    get
    {
        if (Count == 0)
            return AppLocalize.ButtonTextInitial;
        if (Count == 1)
            return AppLocalize.ButtonTextSingular.Replace("{Count}", Count.ToString());

        return AppLocalize.ButtonTextPlural.Replace("{Count}", Count.ToString());
    }
}
```

7. **EXTRA** aquí se muestra como cambiar el idioma sin reiniciar la aplicación:
```
private void OnLangBtnClicked(object sender, EventArgs e)
{
    (App.Current as App).MainPage.Dispatcher.Dispatch(() =>
    {
        Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("es-PY");
        Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo("es-PY");
        (App.Current as App).MainPage = new AppShell();
    });
}
```

8. Ejecutamos la aplicación presionando *F5* y veremos en Inglés así:
![](/img/posts/2022/10/05/5.png)

9. Hacemo clic en el botón "Change language" y debemos ver el español:
![](/img/posts/2022/10/05/6.png)

¡Espero resulte útil!
