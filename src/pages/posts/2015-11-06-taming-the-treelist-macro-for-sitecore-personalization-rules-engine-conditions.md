---
title: Taming the TreeList Macro for Sitecore Personalization Rules Engine Conditions
author: Wesley Lomax
type: post
featuredpost: false
date: 2015-11-06T13:21:34.000Z
url: /2015/11/06/taming-the-treelist-macro-for-sitecore-personalization-rules-engine-conditions/
featuredimage: /img/forest-584354_1280.jpg
categories:
  - Rules Engine
  - Sitecore
tags:
  - Client
  - CMS
  - Sitecore
  - Tree List Macro
templateKey: blog-post
---
Ever wanted to allow your editors to select multiple items in a Rules Engine Condition? You are in luck Sitecore has a TreeList Macro you can use.

Too add it to a rule use the syntax below.

> <pre style="margin: 0in; font-family: Arial; font-size: 10.0pt; color: black;">where My Sitecore Item is [ItemId,TreeList,root=/sitecore/content,specific item]</pre>

&nbsp;

Which looks like this when you select it.

![TreeList-Macro-Rule-Selection](/img/TreeList-Macro-Rule-Selection.png)

&nbsp;

This will give the editor a TreeList control starting at the /sitecore/content level, but what if you want to filter the displayed items or the items that can be selected from the TreeList?

There are parameters you can use to restrict which items will display and which items you can select similar to the TreeList field you would use in the CMS as detailed <a href="http://getfishtank.ca/blog/treelist-data-source-hidden-functionality" target="_blank">here</a> but the parameters names and behavior are different.

Here&#8217;s an example of a TreeList Macro configured to restrict selection and display &#8211;

<pre style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">where My Sitecore Item is [ItemId,TreeList,root=/sitecore/content&selection=Sample/Sample Item&display=Common/Folder|/Sample/Sample Item,specific item]</pre>

![TreeList-Macro-Template-FullNames](/img/TreeList-Macro-Template-FullNames.png)
  
![TreeList-Macro-Rule-Config](/img/TreeList-Macro-Rule-Config.png)

You&#8217;ll notice the _**selection**_ and _**display **_parameters these allow you to restrict items using the defined templates to display in the TreeList and which items can be selected. How you define that is by using the full path of the Template Excluding _**/Templates **_from the path, you can add multiple templates using the pipe separator.

Here is the Rendered TreeList Macro with the filtering applied.

![TreeList-Macro-Item-Selection](/img/TreeList-Macro-Item-Selection.png)

&nbsp;

I could not find any documentation relating to how this control works but by digging around in the Sitecore.Kernel.dll I found where these parameters are evaluated against a templates collection using the FullName property.

![TreeList-Macro-Template-FullNames](/img/TreeList-Macro-Template-FullNames.png)