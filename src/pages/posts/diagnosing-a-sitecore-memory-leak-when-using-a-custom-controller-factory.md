---
title: Diagnosing a Sitecore Memory Leak when using a Custom Controller Factory
author: Wesley Lomax
type: post
date: 2016-07-06T10:23:27+00:00
url: /2016/07/06/diagnosing-a-sitecore-memory-leak-when-using-a-custom-controller-factory/
categories:
  - Performance
  - Sitecore
tags:
  - '7.5'
  - '8.0'
  - '8.1'
  - dotMemory

---
<div id="toc_container" class="toc_wrap_right no_bullets">
  <p class="toc_title">
    Contents
  </p>
  
  <ul class="toc_list">
    <li>
      <a href="#The_Problem"><span class="toc_number toc_depth_1">1</span> The Problem</a>
    </li>
    <li>
      <a href="#Reproducing_theissue"><span class="toc_number toc_depth_1">2</span> Reproducing the issue</a>
    </li>
    <li>
      <a href="#Diagnosing_with_dotMemory"><span class="toc_number toc_depth_1">3</span> Diagnosing with dotMemory</a>
    </li>
    <li>
      <a href="#TheFix"><span class="toc_number toc_depth_1">4</span> The Fix</a>
    </li>
    <li>
      <a href="#Testing_the_Fix"><span class="toc_number toc_depth_1">5</span> Testing the Fix</a>
    </li>
  </ul>
</div>

## <span id="The_Problem">The Problem</span>

An application is using excessive amounts of memory causing slow response times and application pool recycles.

&nbsp;

## <span id="Reproducing_theissue">Reproducing the issue</span>

Generate some load for your application locally, I used <a href="http://jmeter.apache.org/" target="_blank">JMeter</a> , <a class="ProfileHeaderCard-nameLink u-textInheritColor js-nav " href="https://twitter.com/mhwelander" target="_blank">Martina Welander</a> has an excellent post on setting it up &#8211; <a href="https://mhwelander.net/2014/07/25/generating-sample-sitecore-analytics-data-with-jmeter" target="_blank">https://mhwelander.net/2014/07/25/generating-sample-sitecore-analytics-data-with-jmeter</a> to generate some sample traffic. This scenario does not require you to worry about cookies you just need some same load to reproduce the memory leak.

&nbsp;

## <span id="Diagnosing_with_dotMemory">Diagnosing with dotMemory</span>

Launch <a href="https://www.jetbrains.com/dotmemory/features/" target="_blank">dotMemory</a> from <a href="https://www.jetbrains.com/" target="_blank">JetBrains</a> when your load from JMeter has finished you can attach to the w3wp.exe  process from Local Sessions and Run the Profiler with the _**Control profiling manually**_ radio selected.

Once the Profiler is attached hit _**Get Snapshot**_

When the snapshot has finished processing you will end up with something like this

<img class="alignnone size-full wp-image-405" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Total-Memory-Before-Fix.png?resize=228%2C247" alt="Total Memory Before Fix" width="228" height="247" data-recalc-dims="1" />

Click the snapshot and you will be taken to a screen showing lots of automatic memory profiling sections and figures.

&nbsp;

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Retained-Meory-Before-Fix.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-404" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Retained-Meory-Before-Fix.png?resize=438%2C218" alt="Retained Memory Before Fix" width="438" height="218" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Retained-Meory-Before-Fix.png?w=438 438w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Retained-Meory-Before-Fix.png?resize=300%2C149 300w" sizes="(max-width: 438px) 100vw, 438px" data-recalc-dims="1" /></a>

&nbsp;

The breakdown of the **_Largest Retained Size_** objects has the Castle Windsor **_DefaultKernal_** namespace at the top of the list using 300MB of memory, clicking this give you the full breakdown of memory usage.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-Before-Fix.png" target="\_blank" data-rel="lightbox-image-1" data-rl\_title="" data-rl_caption="" title=""><img class="alignnone wp-image-399 size-full" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-Before-Fix.png?resize=640%2C489" alt="Castle Default Kernel Memory Useage Before Fix" width="640" height="489" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-Before-Fix.png?w=978 978w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-Before-Fix.png?resize=300%2C229 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-Before-Fix.png?resize=768%2C587 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

The **_LifecycledComponentsReleasePolicy_** class is using most of the memory and in particular the **_instance2Burden_** dictionary has 17,519 entries taking up 314MB.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-Before-Fix.png" target="\_blank" data-rel="lightbox-image-2" data-rl\_title="" data-rl_caption="" title=""><img class="alignnone wp-image-402 size-full" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-Before-Fix.png?resize=640%2C89" alt="LifecycledComponents Before Fix" width="640" height="89" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-Before-Fix.png?w=966 966w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-Before-Fix.png?resize=300%2C42 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-Before-Fix.png?resize=768%2C107 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

Inspecting these entries they were lots of Controllers registered to the Castle Windsor container, with a Lifecycle of Transient but the are not being released by the custom controller factory.

<img class="alignnone size-full wp-image-400" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Entry-Lifestyle.png?resize=455%2C191" alt="Entry Lifestyle" width="455" height="191" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Entry-Lifestyle.png?w=455 455w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Entry-Lifestyle.png?resize=300%2C126 300w" sizes="(max-width: 455px) 100vw, 455px" data-recalc-dims="1" />

&nbsp;

## <span id="TheFix">The Fix</span>

I found an article that describes this issue on the Sitecore Knowledge Base &#8211; <a href="https://kb.sitecore.net/articles/535948" target="_blank">https://kb.sitecore.net/articles/535948</a>

> When using a custom MVC controller factory on the Sitecore solution in a specific manner, the web site may experience excessive memory usage.
> 
> The issue is caused by specifics of Sitecore implementation of using custom MVC controllers.

You can read more of the technical details of the fix on the knowledge base site but there is a config file and dll to add to your solution to resolve the issue. The issue applies to Sitecore versions 7.5 Initial Release &#8211; 8.0 Update-6, 8.1 Initial Release+ if you are on Sitecore 8.0 Update-7 the issue is fixed.

_Note :- The dll has been complied with System.Web.Mvc 5.2.3  referenced, if your project is not using that version you can use a binding redirect to match your solutions version._

&nbsp;

## <span id="Testing_the_Fix">Testing the Fix</span>

Run the same load from <a href="http://jmeter.apache.org/" target="_blank">JMeter</a> through the site after adding the new config file and dll  to your solution.

_Note :- If you attach dotMemory to the w3wp.exe process when you are running the load test it slows things down significantly so you can wait to attach to the process until after the load has finished._

Once the Profiler is attached hit _**Get Snapshot**_

When the snapshot has finished processing you will be able to compere the memory used side by side with your original snapshot.

<img class="alignnone size-full wp-image-406" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Total-Memory-With-Fix.png?resize=233%2C263" alt="Total Memory With Fix" width="233" height="263" data-recalc-dims="1" />                    <a href="http://blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Total-Memory-Before-Fix.png" data-rel="lightbox-image-3" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-405" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Total-Memory-Before-Fix.png?resize=228%2C247" alt="Total Memory Before Fix" width="228" height="247" data-recalc-dims="1" /></a>

You can see around 300MB less memory is being used after adding the Sitecore fix.

Drilling down in to the detail with dotMemory you can confirm CastleWindsor is now releasing the Transient life-cycled controller references.

<img class="alignnone size-full wp-image-403" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Retained-Meory-After-Fix.png?resize=439%2C227" alt="Retained Memory After Fix" width="439" height="227" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Retained-Meory-After-Fix.png?w=439 439w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Retained-Meory-After-Fix.png?resize=300%2C155 300w" sizes="(max-width: 439px) 100vw, 439px" data-recalc-dims="1" />

&nbsp;

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-After-Fix.png" target="\_blank" data-rel="lightbox-image-4" data-rl\_title="" data-rl_caption="" title=""><img class="alignnone wp-image-398 size-full" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-After-Fix.png?resize=640%2C485" alt="Castle Default Kernel Memory Useage After Fix" width="640" height="485" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-After-Fix.png?w=960 960w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-After-Fix.png?resize=300%2C228 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/Castle-Default-Kernel-Memory-Useage-After-Fix.png?resize=768%2C582 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-After-Fix.png" target="\_blank" data-rel="lightbox-image-5" data-rl\_title="" data-rl_caption="" title=""><img class="alignnone wp-image-401 size-full" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-After-Fix.png?resize=640%2C91" alt="LifecycledComponents After Fix" width="640" height="91" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-After-Fix.png?w=947 947w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-After-Fix.png?resize=300%2C42 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/LifecycledComponents-After-Fix.png?resize=768%2C109 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>