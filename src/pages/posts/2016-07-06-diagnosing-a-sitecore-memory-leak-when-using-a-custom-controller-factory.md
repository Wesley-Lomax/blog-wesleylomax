---
title: Diagnosing a Sitecore Memory Leak when using a Custom Controller Factory
author: Wesley Lomax
type: post
featuredpost: false
date: 2016-07-06T10:23:27.000Z
url: /2016/07/06/diagnosing-a-sitecore-memory-leak-when-using-a-custom-controller-factory/
categories:
  - Performance
  - Sitecore
tags:
  - '7.5'
  - '8.0'
  - '8.1'
  - dotMemory
templateKey: blog-post
---
<div id="toc_container" class="toc_wrap_right no_bullets">
  <p class="toc_title">
    Post Contents
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

![Total-Memory-Before-Fix](/img/Total-Memory-Before-Fix.png)

Click the snapshot and you will be taken to a screen showing lots of automatic memory profiling sections and figures.

&nbsp;

![Retained-Meory-Before-Fix](/img/Retained-Meory-Before-Fix.png)

&nbsp;

The breakdown of the **_Largest Retained Size_** objects has the Castle Windsor **_DefaultKernal_** namespace at the top of the list using 300MB of memory, clicking this give you the full breakdown of memory usage.

![Castle-Default-Kernel-Memory-Useage-Before-Fix](/img/Castle-Default-Kernel-Memory-Useage-Before-Fix.png)

The **_LifecycledComponentsReleasePolicy_** class is using most of the memory and in particular the **_instance2Burden_** dictionary has 17,519 entries taking up 314MB.

![LifecycledComponents-Before-Fix](/img/LifecycledComponents-Before-Fix.png)

&nbsp;

Inspecting these entries they were lots of Controllers registered to the Castle Windsor container, with a Lifecycle of Transient but the are not being released by the custom controller factory.

![Entry-Lifestyle](/img/Entry-Lifestyle.png)

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

![Total-Memory-Before-Fix](/img/Total-Memory-Before-Fix.png)

You can see around 300MB less memory is being used after adding the Sitecore fix.

Drilling down in to the detail with dotMemory you can confirm CastleWindsor is now releasing the Transient life-cycled controller references.

![Total-Memory-Before-Fix](/img/Retained-Meory-After-Fix.png)

&nbsp;

![Castle-Default-Kernel-Memory-Useage-After-Fix](/img/Castle-Default-Kernel-Memory-Useage-After-Fix.png)

![LifecycledComponents-After-Fix](/img/LifecycledComponents-After-Fix.png)