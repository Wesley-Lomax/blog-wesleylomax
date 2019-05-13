---
title: Sitecore Marketplace Module – Icon Selector Field
author: Wesley Lomax
type: post
featuredpost: false
date: 2015-10-14T09:40:18.000Z
url: /2015/10/14/sitecore-marketplace-module-icon-selector-field/
categories:
  - Marketplace
  - Sitecore
tags:
  - Glass
  - Marketplace
  - SPEAK
templateKey: blog-post
---
My First Sitecore Marketplace Module has just been released! You can check it out here <a href="https://marketplace.sitecore.net/Modules/I/Icon_Selector_Field.aspx?sc_lang=en" target="_blank">Icon Selector Field</a>.

It allows content editors to select CSS font icons via a custom field that include a <a href="https://doc.sitecore.net/speak" target="_blank">SPEAK UI</a> Dialog for searching and selecting icons.

![Icon-Speak-UI](/img/Icon-Speak-UI.png)

The field also show a preview of the icon when it has been set in the CMS.

![Icon-Selected](/img/Icon-Selected.png)

If you are using <a href="http://glass.lu/" target="_blank">Glass Mapper</a> the Module also includes an **_AbstractSitecoreFieldMapper_** for this field so you can add **_CustomIconField_** types to your models and  access  with _**@Model.Datasource.Icon.CssClass**_.

You can have a look at the code on <a href="https://github.com/Wesley-Lomax/icon-selector-field" target="_blank">GitHub</a> and there will be a post to come detailing the implementation.

&nbsp;