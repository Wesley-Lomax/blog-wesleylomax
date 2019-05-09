---
title: Taming the TreeList Macro for Sitecore Personalization Rules Engine Conditions
author: Wesley Lomax
type: post
date: 2015-11-06T13:21:34+00:00
url: /2015/11/06/taming-the-treelist-macro-for-sitecore-personalization-rules-engine-conditions/
featured_image: http://blog.wesleylomax.co.uk/wp-content/uploads/2016/03/forest-584354_1280.jpg
categories:
  - Rules Engine
  - Sitecore
tags:
  - Client
  - CMS
  - Sitecore
  - Tree List Macro

---
Ever wanted to allow your editors to select multiple items in a Rules Engine Condition? You are in luck Sitecore has a TreeList Macro you can use.

Too add it to a rule use the syntax below.

> <pre style="margin: 0in; font-family: Arial; font-size: 10.0pt; color: black;">where My Sitecore Item is [ItemId,TreeList,root=/sitecore/content,specific item]</pre>

&nbsp;

Which looks like this when you select it.

<img class="alignnone wp-image-110 size-full" title="TreeList Macro Rule" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Rule-Selection.png?resize=504%2C458" alt="TreeList Macro Rule Selection" width="504" height="458" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Rule-Selection.png?w=504 504w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Rule-Selection.png?resize=300%2C273 300w" sizes="(max-width: 504px) 100vw, 504px" data-recalc-dims="1" />

&nbsp;

This will give the editor a TreeList control starting at the /sitecore/content level, but what if you want to filter the displayed items or the items that can be selected from the TreeList?

There are parameters you can use to restrict which items will display and which items you can select similar to the TreeList field you would use in the CMS as detailed <a href="http://getfishtank.ca/blog/treelist-data-source-hidden-functionality" target="_blank">here</a> but the parameters names and behavior are different.

Here&#8217;s an example of a TreeList Macro configured to restrict selection and display &#8211;

<pre style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">where My Sitecore Item is [ItemId,TreeList,root=/sitecore/content&selection=Sample/Sample Item&display=Common/Folder|/Sample/Sample Item,specific item]</pre>

<a href="http://blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Template-FullNames.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title="">
  
</a><img class="alignnone wp-image-109 size-full" title="Rules Condition TreeList" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Rule-Config.png?resize=640%2C203" alt="TreeList Macro Rule Config" width="640" height="203" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Rule-Config.png?w=941 941w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Rule-Config.png?resize=300%2C95 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" />

You&#8217;ll notice the _**selection**_ and _**display **_parameters these allow you to restrict items using the defined templates to display in the TreeList and which items can be selected. How you define that is by using the full path of the Template Excluding _**/Templates **_from the path, you can add multiple templates using the pipe separator.

Here is the Rendered TreeList Macro with the filtering applied.

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Item-Selection.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-108 size-full" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Item-Selection.png?resize=640%2C362" alt="TreeList Macro Item Selection" width="640" height="362" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Item-Selection.png?w=791 791w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Item-Selection.png?resize=300%2C170 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

I could not find any documentation relating to how this control works but by digging around in the Sitecore.Kernel.dll I found where these parameters are evaluated against a templates collection using the FullName property.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Template-FullNames.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-121" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Template-FullNames.png?resize=640%2C365" alt="TreeList Macro Template FullNames" width="640" height="365" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Template-FullNames.png?w=1259 1259w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Template-FullNames.png?resize=300%2C171 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/TreeList-Macro-Template-FullNames.png?resize=1024%2C584 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>