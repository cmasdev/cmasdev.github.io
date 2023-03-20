---
layout: post
title: "Django sobre WSL"
author: Christian Amado
date: 2023-03-19 21:01:00 -0400
category: [Desarrollo de software]
tags: [WinDev, Windows 11, WPF, C#, Telerik]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

En este artículo veremos cómo crar un Chat con la API de **ChatGPT** y **WPF** con controles **Telerik**. 

***Windows 11 Insider Preview Build 25314***

<!--more-->

En el articulo de [la semana pasada](/posts/2023-03-15-creating-chat-app-wpf-using-telerik/) hemos visto cómo crear una pequeña aplicación tipo Chat con **Telerik**. El viernes, [vimos cómo habilitar **ChatGPT**](/posts/2023-03-17-chatgpt-from-paraguay/) en Paraguay (teniendo en cuenta que no está habilitado oficialmente aún).

## Creando una aplicación
1. Abrimos **Visual Studio Professional 2022** (va servir la edición **Community**).

2. Agregamos los paquetes **NuGet** necesarios para nuestro proyecto:
![](/img/posts/2023/03/19/1.png)

3. Agregar configuraciones de la aplicación:
![](/img/posts/2023/03/19/2.png)

4. Adicionar las configuraciones en el archivo creado:
![](/img/posts/2023/03/19/3.png)

5. Vamos a trabajar con **RadChat** de **Telerik for WPF**, así que debemos agregar el modelo para **TextMessage**. Entonces, agregamos la clase en cuestión:
```
using System;
using Telerik.Windows.Controls.ConversationalUI;

namespace TelerikWpfChat
{
    public class TextMessageModel
    {
        public string Text { get; set; }
        public Author Author { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
```
6. Dentro del *Framework* que utiliza **Telerik Conversational UI** y **WPF** se hace muy común el uso de conversores para manipalutación de datos que se modifican a nivel visual. Entonces, aplicamos el conversor:
```
using Telerik.Windows.Controls.ConversationalUI;

namespace TelerikWpfChat
{
    public class MessageConverter : IMessageConverter
    {
        public MessageBase ConvertItem(object item)
        {
            var messageModel = (TextMessageModel)item;
            return new TextMessage(messageModel.Author, messageModel.Text, messageModel.CreationDate);
        }

        public object ConvertMessage(MessageBase message)
        {
            var textMessage = (TextMessage)message;
            return new TextMessageModel()
            {
                Author = textMessage.Author,
                Text = textMessage.Text,
                CreationDate = textMessage.CreationDate
            };
        }
    }
}
```
4. Creamos el *ViewModel* que va interactuar entre el **ChatGPT** y **WPF**. Tener en cuenta que aquí se encuentra la llamada a la API de **GPT**:
```
using System;
using System.Collections.ObjectModel;
using Telerik.Windows.Controls.ConversationalUI;
using System.Threading.Tasks;
using System.Net.Http;
using System.Windows.Threading;
using System.Windows;
using Newtonsoft.Json;

namespace TelerikWpfChat
{
    public class ChatViewModel
    {
        public ObservableCollection<TextMessageModel> Messages { get; set; }
        public Author CurrentAuthor { get; private set; }
        public Author OtherAuthor { get; private set; }

        public ChatViewModel()
        {
            this.CurrentAuthor = new Author("Christian");
            this.OtherAuthor = new Author("GPT");
            if (this.Messages == null)
                this.Messages = new ObservableCollection<TextMessageModel>();
        }

        internal async Task SendCurrentMessage(string prompt)
        {
            //Agregamos nuestra interacción
            this.Messages.Add(new TextMessageModel() { Text = prompt, Author = CurrentAuthor, CreationDate = DateTime.Now });

            //Llamamos a la API de GPT
            var result = await sendToGpt(prompt);

            if (result == null) 
            {
                MessageBox.Show("Error en la Matrix!");
                return;
            }

            //Obtenemos los resultados y le pasamos a la interfaz en un hilo separado
            await Dispatcher.CurrentDispatcher.BeginInvoke((Action)(() => {
                this.Messages.Add(new TextMessageModel() { Text = result, Author = OtherAuthor, CreationDate = DateTime.Now });
            }));        
        }

        private async Task<string> sendToGpt(string prompt)
        {
            var apiKey = Properties.Settings.Default.ApiGPTChat;
            var model = Properties.Settings.Default.Model;
            var maxTokens = 500;

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var url = "https://api.openai.com/v1/completions";


            var requestBody = new
            {
                prompt = prompt,
                model = model,
                temperature = 0.5,
                max_tokens = maxTokens,
                n = 1
            };

            var postJson = System.Text.Json.JsonSerializer.Serialize(requestBody);

            var response = await client.PostAsync(url,
                new StringContent(postJson,
                System.Text.Encoding.UTF8, "application/json"));
            var responseBody = await response.Content.ReadAsStringAsync();

            dynamic responseData = JsonConvert.DeserializeObject<dynamic>(responseBody);

            int lastChoice = responseData.choices.Count - 1;
            
            return responseData.choices[lastChoice].text;
        }
    }
}

```
5. Creamos el diseño de nuestro Chat inteligente:

```
<Window x:Class="TelerikWpfChat.MainWindow"
                xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation"
                xmlns:local="clr-namespace:TelerikWpfChat"
                Title="ChatGPT on WPF" Height="600" Width="800">
    <Grid>
            <telerik:RadChat Margin="10" CurrentAuthor="{Binding CurrentAuthor}" 
                             DataSource="{Binding Messages}" 
                             SendMessage="chat_SendMessage">
                <telerik:RadChat.DataContext>
                    <local:ChatViewModel />
                </telerik:RadChat.DataContext>
                <telerik:RadChat.MessageConverter>
                    <local:MessageConverter />
                </telerik:RadChat.MessageConverter>
            </telerik:RadChat>
    </Grid>
</Window>
```
![](/img/posts/2023/03/19/4.png)

6. Agregamos la llamada al evento que envía mensaje en nuestra página **WPF** (incluye trabajo asíncronos y multihilo):
```
using System.Windows;
using Telerik.Windows.Controls;
using Telerik.Windows.Controls.ConversationalUI;

namespace TelerikWpfChat
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void chat_SendMessage(object sender, SendMessageEventArgs e)
        {
            e.Handled = true;
            var chat = sender as RadChat;
            var model = (ChatViewModel)chat.DataContext;
            var mensaje = e.Message as TextMessage;

            chat.TypingIndicatorVisibility = Visibility.Visible;
            chat.TypingIndicatorText = "Esperando respuesta de " + model.OtherAuthor.Name;
            
            await model.SendCurrentMessage(mensaje.Text);

            chat.TypingIndicatorVisibility = Visibility.Collapsed;
            chat.TypingIndicatorText =string.Empty;

        }
    }
}
```
7. Volvemos a ejecutar con *F5* y disfrutamos del chat.

## ¿Cómo interactúa?
Jugando un poco con la *API* de **ChatGPT** logramos esta funcionalidad:
{{< raw >}}    
<video width=100% controls autoplay>
<source src="/img/posts/2023/03/19/chatgptWPF.mp4" type="video/mp4">
Your browser does not support the video tag.  
</video> 
{{< /raw >}}

El código fuente completo [se encuentra en GitHub](https://github.com/cmasdev/TelerikWpfChatGPT).

¡Espero resulte útil!
