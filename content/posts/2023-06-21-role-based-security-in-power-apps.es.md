---
layout: post
title: "Seguridad basada en Roles en Power Apps"
author: "Christian Amado"
date: 2023-06-21 00:00:00 -04:00
categories: [Aplicaciones de negocio]
tags: [PowerApps]
thumbnail-img: /img/posts/thumbnails/powerapps.png
cover-img: /img/posts/cover/powerapps.svg
---

En este artículo veremos cómo bloquear elementos con la seguridad basada en roles en **Microsoft Power Apps** para permitir incrementar la seguridad de nuestras aplicaciones.

<!--more-->

En ocasiones necesitamos habilitar páginas y/o elementos (botones, paneles, controles en general) según políticas de seguridad. Por ejemplo, el control de *Agregar Clientes* o *Modificar Límite de crédito* sólo debe ser visible para Adminsitradores y/o gerentes.

Es ahí donde entra en juego esta funcionalidad que se divide en dos grandes configuraciones. La primera, en el portal de Azure y, la otra, en **Power Apps**.

# Configuración en Azure
1. En el portal de Azure, nos dirigimos a **Grupos de Seguridad** dentro de **Microsoft Entra (antes llamado Azure Active Directory)**:
![](https://i.ibb.co/LJT6KPs/role-security-pa-1.png)

2. Selecionamos la opción **Grupo**:
![](https://i.ibb.co/dL1RJH5/role-security-pa-2.png)

3. Creamos un nuevo grupo:
![](https://i.ibb.co/R7DRZpw/role-security-pa-3.png)

4. Colocamos los valores necesarios:
![](https://i.ibb.co/rcf8gWk/role-security-pa-4.png)
Tener en cuenta que los propietarios y miembros son opcionales pero uno de ellos debe tener miembros para poder funcionar,

5. Copiamos el elemento *Object Id*
![](https://i.ibb.co/sWJN5CW/role-security-pa-5.png)

6. Listo, hemos terminado la configuración de **Microsoft Azure**

# Desarrollo en Power Apps
1. Agregar los conectores necesarios para el funcionamiento:
![](https://i.ibb.co/nbDnZsx/role-security-pa-6.png)

2. Crear dos botones para las pruebas:
![](https://i.ibb.co/yhHvthQ/role-security-pa-7.png)

3. En el Evento **OnStart** de la aplicación Canvas de **Power Apps** colocar el sigueinte código:
```
ClearCollect(AdminUsers,Office365Groups.ListGroupMembers("41474cce-cb2c-41f8-b66c-7c2d683c0dba").value);

If(User().Email in AdminUsers.mail ,Set(VerAdmin,true), Set(VerAdmin, false));
```
La clave *guid* dentro de *CrearCollect* es el *Object Id* que se copió del item 5 de la **configuración de Azure**

4. En el paso anterior, se creó la variable *VerAdmin* entonces colocamos eso como la propiedad *Visible* del **Button 2**:
![](https://i.ibb.co/fXgGf3W/role-security-pa-8.png)

5. Publicamos y probamos la App (con mi cuenta administrador):
![](https://i.ibb.co/Qr5PSg9/role-security-pa-9.png)

6. Probamos la misma aplicación con un usuario:
![](https://i.ibb.co/tbLQprT/role-security-pa-10.png)

De esta manera, hemos visto cómo aplicar seguridad basada en roles en **Microsoft Power Apps**

¡Espero resulte de utilidad!
