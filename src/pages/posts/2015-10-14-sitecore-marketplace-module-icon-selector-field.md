---
title: Sitecore Marketplace Module – Icon Selector Field
author: Wesley Lomax
type: post
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

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Speak-UI.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-85 size-full" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Speak-UI.png?resize=640%2C420" alt="Icon - Speak UI" width="640" height="420" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Speak-UI.png?w=1212 1212w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Speak-UI.png?resize=300%2C197 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Speak-UI.png?resize=1024%2C672 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

The field also show a preview of the icon when it has been set in the CMS.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Selected.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-84 size-full" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Selected.png?resize=408%2C147" alt="Icon - Selected" width="408" height="147" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Selected.png?w=408 408w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/10/Icon-Selected.png?resize=300%2C108 300w" sizes="(max-width: 408px) 100vw, 408px" data-recalc-dims="1" /></a>

If you are using <a href="http://glass.lu/" target="_blank">Glass Mapper</a> the Module also includes an **_AbstractSitecoreFieldMapper_** for this field so you can add **_CustomIconField_** types to your models and  access  with _**@Model.Datasource.Icon.CssClass**_.

You can have a look at the code on <a href="https://github.com/Wesley-Lomax/icon-selector-field" target="_blank">GitHub</a> and there will be a post to come detailing the implementation.

&nbsp;