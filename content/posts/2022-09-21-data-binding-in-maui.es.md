---
layout: post
title: "Data Binding en MAUI"
author: Christian Amado
date: 2022-09-21 20:32:00 -0400
category: [Desarrollo de software]
tags: [WinDev, MAUI, Windows 11]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo mostraré cómo utilizar la técnica de *Data Binding* en una aplicación **.NET MAUI** sobre **Windows 11**.

***Windows 11 Insider Preview Build 25206***

<!--more-->

*Data binding* en **XAML** es un mecanismo que permite vincular propiedades de dos objetos dentro de una página, o entre objetos visuales y datos subyacentes. Se declara usando una extensión de marcado llamada **Binding**. La declaración de *data binding* consiste en una serie de cláusulas que siguen la palabra clave **Binding** y se separan por comas (,). Las cláusulas pueden estar en cualquier orden y existen muchas combinaciones posibles.

## Preparar el proyecto
Primeramente, debemos crear el proyecto **.NET MAUI** y tenerlo listo para la plataforma **Windows 11**:
1. Creamos el proyecto en Visual Studio 2022:
![](/img/posts/2022/09/21/1.png)  

2. Colocamos un nombre descriptivo al proyecto nuevo:
![](/img/posts/2022/09/21/2.png)  

3. Seleccionamos el .NET Core que deseamos utilizar:
![](/img/posts/2022/09/21/3.png)  

4. En el archivo **MainPage.xaml** verificamos el código **XAML**:
```
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Maui_DataBinding.MainPage">

    <ScrollView>
        <VerticalStackLayout
            Spacing="25"
            Padding="30,0"
            VerticalOptions="Center">

            <Image
                Source="dotnet_bot.png"
                SemanticProperties.Description="Cute dot net bot waving hi to you!"
                HeightRequest="200"
                HorizontalOptions="Center" />

            <Label
                Text="Hello, World!"
                SemanticProperties.HeadingLevel="Level1"
                FontSize="32"
                HorizontalOptions="Center" />

            <Label
                Text="Welcome to .NET Multi-platform App UI"
                SemanticProperties.HeadingLevel="Level2"
                SemanticProperties.Description="Welcome to dot net Multi platform App U I"
                FontSize="18"
                HorizontalOptions="Center" />

            <Button
                x:Name="CounterBtn"
                Text="Click me"
                SemanticProperties.Hint="Counts the number of times you click"
                Clicked="OnCounterClicked"
                HorizontalOptions="Center" />

        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

5. Prestemos atención al código del botón **XAML**:
```
<Button
    x:Name="CounterBtn"
    Text="Click me"
    SemanticProperties.Hint="Counts the number of times you click"
    Clicked="OnCounterClicked"
    HorizontalOptions="Center" />
```

6. También verifiquemos al código del botón **C#**:
```
namespace Maui_DataBinding;

public partial class MainPage : ContentPage
{
	int count = 0;

	public MainPage()
	{
		InitializeComponent();
	}

	private void OnCounterClicked(object sender, EventArgs e)
	{
		count++;

		if (count == 1)
			CounterBtn.Text = $"Clicked {count} time";
		else
			CounterBtn.Text = $"Clicked {count} times";

		SemanticScreenReader.Announce(CounterBtn.Text);
	}
}
```

7. Ejecutamos el código con *F5* y veremos la aplicación Windows:
![](/img/posts/2022/09/21/4.png)  

Bien hasta aquí no hay nada extraño en ningún lado.

## DataBinding en .NET MAUI
**Data binding** es una técnica que permite vincular dos propiedades entre dos objetos, al menos uno de los cuales suele ser un objeto de interfaz de usuario. Estos dos objetos se llaman el destino y la fuente. **Data binding** facilita la actualización automática de los datos entre los objetos. 

Ahora vamos a adaptar nuestro código para que nuestra técnica funcione.  
1. En el constructor de la clase (en MainPage.xaml.cs) colocaremos el contexto de enlace:
```
public MainPage()
{
    InitializeComponent();
    BindingContext = this;
}
```
2. Debemos crear una nueva propiedad (para hacer uso del atributo *count*):
```
int count = 0;
    public int Count
    {
        get
        {
            return count;
        }
        set
        {
            count = value;
            OnPropertyChanged();
            OnPropertyChanged("CounterBtnText");
        }
    }
```

3. Ahora, debemos colocar la lógica en una propiedad para que se produzca el cambio (en este caso la propeidad será **CounterBtnText**):
```
public string CounterBtnText
{
    get
    {
        if (Count == 0)
            return "Click Here";
        if (Count == 1)
            return $"Clicked {Count} time";

        return $"Clicked {Count} times";
    }
}
```

4. Nuestro evento **Click** del botón sufre modificaciones debido a que la lógica está en la nueva propiedad:
```
private void OnCounterClicked(object sender, EventArgs e)
{
    Count++;
}
```

5. Por último modificamos nuestra definición del botón en el código **XAML** dentro del archivo **MainPage.xaml**:
```
<Button
    x:Name="CounterBtn"
    Text="{Binding CounterBtnText}"
    SemanticProperties.Hint="Counts the number of times you click"
    Clicked="OnCounterClicked"
    HorizontalOptions="Center" />
```

6. Ejecutamos la aplicación y nos queda así:
![](/img/posts/2022/09/21/5.png)  

¡Espero resulte útil!
