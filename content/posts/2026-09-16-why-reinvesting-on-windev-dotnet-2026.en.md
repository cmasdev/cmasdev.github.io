---
layout: post
title: "Why I'm reinvesting in Windows Development with .NET in 2026"
author: "Christian Amado"
date: 2026-09-16 14:30:00 -03:00
category: [Software Development]
tags: [WinDev,Windows 11,Windows App SDK,AI,Azure]
thumbnail-img: /img/posts/thumbnails/win11.png
cover-img: /img/posts/cover/win11.png
share_img: /img/posts/shared/windows.jpg
---

For many .NET developers, the last several years have been dominated by
web development, APIs, cloud computing, containers, and, more recently,
AI.

That evolution makes sense.

Modern .NET has become an excellent platform for building backend
services, cloud-native applications, web APIs, and distributed systems.
But there is another area of the .NET ecosystem that I believe deserves
more attention: **Windows development**.

I've worked with Microsoft technologies and .NET for many years, and in
2026 I've decided to invest more time again in building software
specifically for Windows.

Not because I want to return to the desktop development of the past.

Quite the opposite.

I want to explore what it means to build a **modern Windows application
with the .NET ecosystem we have today**.

## Desktop Development Didn't Disappear

Web applications solved many important problems.

They simplified deployment, made applications accessible from almost
anywhere, and enabled teams to build software that works across
operating systems and devices.

But that doesn't mean every application should become a web application.

There are still scenarios where a native desktop application makes
sense.

Applications may need deep integration with the operating system, access
to local resources, interaction with hardware, offline capabilities,
background processing, native notifications, window management, or
simply a user experience designed specifically for Windows.

The interesting question, therefore, isn't:

**"Is desktop development dead?"**

I think a much better question is:

**"When does a native Windows application provide a better solution than
a web application?"**

That's the question I want to explore.

## Windows Development Has Changed

Building a Windows application today doesn't necessarily mean choosing
the same technologies we used 10 or 15 years ago.

Microsoft currently recommends **WinUI 3 with the Windows App SDK** for
new native Windows desktop applications.

WinUI 3 provides the native UI framework, while the Windows App SDK
provides APIs and capabilities for areas such as application lifecycle,
windowing, notifications, deployment, and other Windows platform
features.

For .NET developers, the technology stack is particularly interesting:

**C# + .NET + Windows App SDK + WinUI 3 + XAML**

WinUI 3 isn't a web framework and it isn't a cross-platform abstraction.
It is designed specifically for native Windows desktop applications.

That distinction is important.

Sometimes cross-platform is exactly what a project needs.

Sometimes it isn't.

If Windows is the target platform, I want to understand what we gain by
embracing the platform instead of abstracting it away.

## Why This Is Interesting as a .NET Developer

The part that interests me most isn't simply learning another UI
framework.

It's being able to combine Windows development with the modern .NET
ecosystem.

A Windows application doesn't have to exist as an isolated desktop
executable.

The same architectural concepts we use elsewhere in .NET can be applied
here:

-   Dependency Injection
-   asynchronous programming
-   HTTP clients
-   configuration
-   logging
-   telemetry
-   background services
-   cloud APIs
-   authentication
-   testing

And, depending on the application, Azure services can naturally become
part of that architecture.

This changes the way I think about desktop development.

Instead of seeing the desktop application as the entire system, I can
see it as one component of a larger architecture.

The Windows application provides the native user experience.

.NET provides the application platform.

Cloud services provide capabilities when they are needed.

And now there is another increasingly interesting component.

## Windows + .NET + AI

AI creates some particularly interesting possibilities for native
applications.

Most of the current conversation around AI development naturally focuses
on web applications, agents, APIs, and cloud services.

But AI capabilities don't have to live exclusively inside a browser.

Imagine a native application that can combine AI with local files,
Windows capabilities, cloud services, application context,
notifications, or device resources.

Some AI workloads may execute remotely.

Others may increasingly execute locally.

And some applications will probably combine both approaches.

For a .NET developer, this creates an interesting intersection:

**Windows + .NET + AI**

That's an area I want to explore much more deeply.

But rather than only reading documentation or experimenting with
isolated samples, I want to approach it differently.

I want to build something.

## Learning by Building

Over the next few months, I'm going to build a Windows application from
the ground up.

The goal isn't to create another "Hello World" application.

I want to use the project to explore the decisions that appear when
building a real application.

We'll start with the fundamentals:

**.NET, Windows App SDK, WinUI 3 and XAML.**

Then gradually introduce the things a production application actually
needs:

**navigation, Dependency Injection, configuration, HTTP communication,
local persistence, application architecture, Windows APIs, asynchronous
operations, logging and telemetry.**

After establishing that foundation, I'll explore integration with
**Azure and AI capabilities**.

The code will evolve alongside the articles.

That means some architectural decisions may change.

Some experiments may fail.

And I expect that some assumptions I have today will be different by the
end of the project.

That's exactly the point.

## One Project, Not Twenty Samples

I don't want to create a new repository for every article.

Instead, I'm going to maintain a single project and evolve it throughout
the series.

For now, I'm calling it:

**ModernWindowsDev**

Each article will introduce a concept, explain the reasoning behind it,
and then apply it to the same application.

This should make it possible to follow not only individual technical
examples, but also how the architecture evolves as the application
becomes more complex.

The project will be available on GitHub so that the code can be explored
alongside the articles.

## What I Want to Learn

I already have many years of experience working with .NET.

That's actually one of the reasons I'm interested in doing this.

I don't want to approach Windows development as if everything I've
learned elsewhere suddenly stops applying.

Instead, I want to answer questions such as:

How much of modern .NET application architecture translates naturally to
WinUI 3?

Where should platform-specific Windows code live?

How should a WinUI application be structured as it grows?

When does native Windows integration provide a meaningful advantage?

How should local and cloud capabilities be combined?

And eventually:

**What does a good AI-enabled Windows application architecture look
like?**

I don't know whether every answer will be what I expect today.

That's what makes the project worth doing.

## What's Next

This article is the starting point.

Next, I'll create the application itself and explore the basic
architecture of a modern Windows application using **.NET, Windows App
SDK and WinUI 3**.

From there, we'll progressively turn a small application into something
much closer to a production architecture.

Windows development didn't disappear.

.NET certainly didn't stop evolving.

And with the arrival of new AI capabilities, I think the intersection
between **Windows, .NET and AI** is becoming interesting again.

It's time to build and find out.