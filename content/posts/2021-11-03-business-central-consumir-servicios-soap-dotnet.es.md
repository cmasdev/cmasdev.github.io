---
layout: post
title: "Business Central: Consumir servicios web SOAP desde .NET"
author: Christian Amado
date: 2021-11-03 19:05:24 -0400
category: [Aplicaciones de negocio]
tags: [Dynamics 365 Business Central, Visual Studio, C#, WPF]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo consumir un servicio desde Microsoft Dynamics 365 Business Central con Microsoft .NET.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5007779)</font>*

## En Microsoft Dynamics 365 Business Central
Primero, verificamos que el servicio de Microsoft Dynamics 365 esté habilitado para **SOAP**:  
![](/img/posts/2021/11/03/Soap1.png)  

Copiamos la dirección **URL de SOAP**, por la utilizaremos después:  
![](/img/posts/2021/11/03/Soap2.png)  

## En Visual Studio
Creamos una aplicación **WPF** o la que les facilite la vida:  
![](/img/posts/2021/11/03/Soap3.png)  

Configuramos el nuevo proyecto:  
![](/img/posts/2021/11/03/Soap4.png)  

Elegimos el *Framework a ser utilizado*:  
![](/img/posts/2021/11/03/Soap5.png)  

Agregamos el servicio al proyecto:  
![](/img/posts/2021/11/03/Soap6.png)  

Seleccionamos el tipo **WCF Web Service**:  
![](/img/posts/2021/11/03/Soap7.png)  

Agregamos la referencia (que copiamos más arriba):  
![](/img/posts/2021/11/03/Soap8.png)  

Configuramos la referencia al servicio y listo:  
![](/img/posts/2021/11/03/Soap9.png)  

Verificamos que en el proyecto se haya agregado todo:  
![](/img/posts/2021/11/03/Soap10.png)  

El codigo XAML visual es algo así
```
<Window x:Class="WpfBC.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:WpfBC"
        mc:Ignorable="d" Loaded="Window_Loaded"
        Title="MainWindow" Height="450" Width="800">
    <Grid>
        <DataGrid Name="DG1" ItemsSource="{Binding}" AutoGenerateColumns="True" >
        </DataGrid>
    </Grid>
</Window>
```

Enlazamos el DataGrid con el servicio SOAP que consumimos en la aplicacion WPF:
```
using System;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.ServiceModel.Security;
using System.Windows;

namespace WpfBC
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            string WSURL = "https://cmasdev:7047/BC190/WS/CRONUS%20Mexico%20S.A./Page/Plan_de_cuentas";
   
            //Creamos el enlace basico HTPPS
            BasicHttpsBinding binding = new BasicHttpsBinding();
            binding.Security.Mode = BasicHttpsSecurityMode.Transport;
            binding.Security.Transport.ClientCredentialType =
            HttpClientCredentialType.Windows;
            binding.MaxReceivedMessageSize = int.MaxValue;

            //Hacemos la llamada al servicio y como prueba salteamos el control SSL del Servidor
            ServicioPrueba.Plan_de_cuentas_PortClient ws = new
            ServicioPrueba.Plan_de_cuentas_PortClient(binding, new EndpointAddress(WSURL));
            ws.ClientCredentials.ServiceCertificate.SslCertificateAuthentication =
            new X509ServiceCertificateAuthentication()
            {
                CertificateValidationMode = X509CertificateValidationMode.None,
                RevocationMode = X509RevocationMode.NoCheck
            };

            try
            {
                //Obtenemos la lista de todos los registros. En este caso de prueba sin filtro.
                var lista = ws.ReadMultipleAsync(null, "", 0).Result;
                this.DG1.ItemsSource = lista.ReadMultiple_Result1;

            }
            catch (Exception ex)
            {
                //Si hay error mostramos un mensaje
                MessageBox.Show(ex.Message);
            }

        }
    }
}
```

Ejecutamos y...
![](/img/posts/2021/11/03/Soap11.png)  

¡Espero resulte útil!