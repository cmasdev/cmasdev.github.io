---
layout: post
title: "Install Android Apps from APK in Windows 11"
author: Christian Amado
date: 2022-04-20 13:01:14 -0400
category: [Windows]
tags: [Windows 11, Windows Insider Preview, Android]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

In this article I will show how to install Android applications on Windows 11 thanks to **Windows Subsystem for Android** using Android tools and enabling certain options. In a [previous article](/posts/2022-04-13-enable-wsa/) we have seen how to enable the platform from the **Microsoft Store**.

***Windows 11 Insider Preview Build 22598***

<!--more-->

We must follow some steps to be able to have any Android application directly in Windows 11, remembering that to enable this we must have the region indicated as the United States.

# Prepare Windows Subsystem for Android
To prepare the platform we must follow these steps:
1. Start the application **Windows Subsystem for Android**
2. Set the **Developer Mode**:
![](/img/posts/2022/04/20/adb1.png)
3. Click on the option **Manage developr Settings**:
![](/img/posts/2022/04/20/adb2.png)
4. Enable the option **USB Debugging**:
![](/img/posts/2022/04/20/adb3.png)

# Prepare the Android SDK tools
## Prepare Android SDk Platform Tools
> Android SDK Platform-Tools is a component for the Android SDK. It includes tools that interface with the Android platform, primarily **adb** and **fastboot**. Although adb is required for Android app development, app developers will normally just use the copy Studio installs. This download is useful if you want to use adb directly from the command-line and don't have Studio installed. (If you do have Studio installed, you might want to just use the copy it installed because Studio will automatically update it.) fastboot is needed if you want to unlock your device bootloader and flash it with a new system image. This package used to contain **systrace**, but that has been obsoleted in favor of Studio Profiler, **gpuinspector.dev**, or **Perfetto**.

For this we must download the latest version available for Windows from [here](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)

## Locate the files
1. We must create a new folder in the main Windows directory and copy the unzipped folder. it would look like this:
![](/img/posts/2022/04/20/adb4.png)
2. Right click on the Windows icon on the taskbar or **Win**+**i**:
![](/img/posts/2022/04/20/adb5.png)
3. Select **Environment variables**:
![](/img/posts/2022/04/20/adb6.png)
4. Select **Path** variable and add a new record:
![](/img/posts/2022/04/20/adb7.png)
5. We add the location of the executable that we want to add to the variable:
![](/img/posts/2022/04/20/adb8.png)
6. We open the Windows command **CMD** or **PowerShell** and test **adb** command:
```
adb devices
```
![](/img/posts/2022/04/20/adb9.png)

## Connection to the device
1. We verify the IP of the device (in the settings of **Windows Subsystem for Android**):
![](/img/posts/2022/04/20/adb10.png)
2. We connect to the IP and the corresponding port:
```
adb connect 172.18.136.138:5555
```
## Installation on the device
1. We download an apk file, in this case the latest version of Angry Birds Dream Blast [here](https://www.apkmirror.com/apk/rovio-entertainment-corporation/angry-birds-dream-blast/angry-birds-dream-blast-1-40-1-release/angry-birds-dream-blast-1-40-1-android-apk-download/)
2. We install the downloaded package:
```
adb install "C:\Users\chris\Downloads\andry.apk"
```
3. We will see the icon attached to the start menu:
![](/img/posts/2022/04/20/adb11.png)
4. The app will look like this:
![](/img/posts/2022/04/20/adb12.png)

For every application that works for Android we must repeat these 4 previous steps. I'll take advantage of *HBO Max* to see the new Batman...

¡Enjoy it!
