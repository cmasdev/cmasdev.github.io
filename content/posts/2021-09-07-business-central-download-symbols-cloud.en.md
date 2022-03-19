---
layout: post
title: "Business Central: Download symbols from Sandbox"
author: Christian Amado
date: 2021-09-07 23:55:00 -0400
category: [Business Applications]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

Today I tried to download the Microsoft Dynamics 365 Business Central symbols but ran into errors and couldn't get it to work. First, I had errors to download the symbols in order to be able to debug the application.  

To prevent other people from having this problem, I share my experience solving the problem in this small How To? manual. which is my habit to write.  

<!--more-->

Let's do it...  

## ¿Cómo descargo los símbolos?
In Visual Studio, we create a project of type AL and then proceed to look for the command **AL: Download symbols** and click on it:  

![](/img/posts/2021/09/07/1.png)  

In Visual Studio Code, the device registration will appear. Therefore, we click the button:  

![](/img/posts/2021/09/07/2.png)  

We follow the steps on the screen until the following dialog appears:  

![](/img/posts/2021/09/07/3.png) 

Now, we will see the following error when we try to compile it:  

![](/img/posts/2021/09/07/4.png)  

We have two possible ways out to solve this. One of them is to use the username and password of the global administrator, but we will have a later problem (we will not be able to debug if the global administrator does not have an active Business Central license).  

In this way, the best solution is to give the necessary permissions to a user to carry out the tests (taking advantage of the fact that we are in an sandbox environment). So, we enter the [Microsoft Dynamics 365 Business Central] (https://businesscentral.dynamics.com) and proceed to enter the credentials of a user with **Full** license, we go to Users> Permissions Section:  

![](/img/posts/2021/09/07/5.png)  

In the first section we add the group **D365 Extension Management** and remove any relationship with the company:  

![](/img/posts/2021/09/07/6.png)  

We repeat the process for the next section, and select the set of permissions **D365 Extension Management ADMIN**:  

![](/img/posts/2021/09/07/7.png)  

In this way, we re-execute the command that we had to execute:  

![](/img/posts/2021/09/07/1.png)  

Now everything will turn out as we expect:  

![](/img/posts/2021/09/07/8.png) 

Then, we can do F5 (Debug) our extension and we will also obtain the expected result:  

![](/img/posts/2021/09/07/9.png)  

![](/img/posts/2021/09/07/10.png)  

In this way we have managed to download the Business Central Cloud symbols ;)
