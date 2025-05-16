---
layout: post
title: "Creando una aplicación tipo Chat en WPF usando Telerik"
author: Christian Amado
date: 2023-03-15 20:57:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, WPF, C#, Telerik]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo veremos cómo crear una aplicación de Chat en **WPF** con **Telerik**. (Antesala de todo el tema de [ChatGPT](https://openai.com/blog/chatgpt/))

***Windows 11 Insider Preview Build 25290***

<!--more-->

Es raro, que después de tantos años vuelva a escribir un artículo sobre WPF (el último fue [este](https://cmasdevnet.blogspot.com/2016/03/wpf-how-to-notificaciones-en-bandeja-de.html)) pero amerita hacerlo pues encontré un botón muy práctico para todo lo relacionado con este nuevo ¡BOOM! que es el ChatGPT.

El control en cuestión es [RadChat](https://docs.telerik.com/devtools/wpf/controls/radchat/overview) que es parte del [**ConversationalUI**](https://www.telerik.com/conversational-ui) de **Telerik**. Esto representa un Chat agnóstico para casi todas sus plataformas (aún no disponible para **WinUI** ni **Blazor** que me interesan muchísimo).

## Proyecto WPF
1. Vamos a crear un proyecto de tipo **WPF**:
![](/img/posts/2023/03/15/1.png)

2. Colocamos un nombre descriptivo:
![](/img/posts/2023/03/15/2.png)

3. Seguimos los pasos en pantalla.

4. Agregamos las librerías necesarias:
![](/img/posts/2023/03/15/3.png)

5. Insertamos el control **XAML**:
```
<Window x:Class="TelerikWpfChat.MainWindow"
                xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation"
                Title="MainWindow" Height="350" Width="525">
    <Grid>
        <telerik:RadChat Name="chat" SendMessage="chat_SendMessage" ></telerik:RadChat>
    </Grid>
</Window>
```
6. Probamos la aplicación:
![](/img/posts/2023/03/15/4.png)

7. Entonces, el código C# nos quedaría así:
```
using System.Windows;
using Telerik.Windows.Controls.ConversationalUI;

namespace TelerikWpfChat
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        //Creamos los objetos que interactúan en el Chat
        private Author currentAuthor;
        private Author externalAuthor;

        public MainWindow()
        {
            InitializeComponent();

            //Asignamos nombres
            currentAuthor = new Author("Christian");
            externalAuthor = new Author("External");
            this.chat.CurrentAuthor = currentAuthor;
        }

        private void chat_SendMessage(object sender, SendMessageEventArgs e)
        {
            e.Handled = true;
            //El texto que escribimos en el chat
            var updatedMessageText = (e.Message as TextMessage).Text;
            this.chat.AddMessage(this.chat.CurrentAuthor, updatedMessageText);

            //La respuesta que obtenemos acada interacción
            this.chat.CurrentAuthor = externalAuthor;
            this.chat.AddMessage(this.chat.CurrentAuthor, "¡No tengo respuestas aún!");
            
        }
    }
}
```

Listo, de esta forma logramos hacer un pequeño Chat (que puede convertirse en ChatBot). Y nos queda algo así:
![](/img/posts/2023/03/15/5.png)

¡Espero resulte útil!
