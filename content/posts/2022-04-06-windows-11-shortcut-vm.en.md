---
layout: post
title: "Create shortcut to virtual machine"
author: Christian Amado
date: 2022-04-06 19:21:43 -0400
category: [Windows]
tags: [Windows 11, Windows Insider Preview, Hyper-V]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

The most practical and useful thing for a user is to find what they are looking for quickly and easily. That is why I will show the steps to create a shortcut to a virtual machine in Hyper-V.  

***Windows 11 Insider Preview Build 22593***

<!--more-->

First we must go to our Hyper-V virtual machine manager and obtain the name of the desired virtual machine (Ubuntu, in this case):
![](/img/posts/2022/04/06/hyperv1.png)  

We go to the Windows desktop, *right click* > *New* > *Create shortcut*:
![](/img/posts/2022/04/06/hyperv2.png)  

We add the following file location:  
```
vmconnect.exe localhost "Ubuntu"
```
- The program name is **vmconnect.exe**  
- **localhost** because this is our local virtual machine
- **Ubuntu** is the name of the virtual machine

![](/img/posts/2022/04/06/hyperv3.png)  

We put a descriptive name to our shortcut:
![](/img/posts/2022/04/06/hyperv4.png)  

We will see the shortcut created on the desktop:
![](/img/posts/2022/04/06/hyperv5.png)  

Finally, we test the shortcut:
![](/img/posts/2022/04/06/hyperv6.png)  

Happy virtualization!