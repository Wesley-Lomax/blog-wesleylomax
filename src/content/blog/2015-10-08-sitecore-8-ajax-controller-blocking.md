---
title: Sitecore 8 Ajax Controller Blocking
author: Wesley Lomax
type: post
featuredpost: false
date: 2015-10-08T08:25:06.000Z
featuredimage: /img/Ajax-Controller-Blocking-Network-Tab.png
categories:
  - Ajax
  - Mvc
  - Sitecore
tags:
  - Bug
  - Controller
  - Session
  - Session State
  - Sitecore 8 Update 3
templateKey: blog-post
---
Ran in to an interesting problem recently in my current project, we are using the
  
publish/subscribe pattern in our JavaScript associated with the components we are building. Essentially its a design pattern to promote loose coupling and fits in well with Sitecore&#8217;s ability to provide highly modular applications you can read more about it <a href="http://blog.mgechev.com/2013/04/24/why-to-use-publishsubscribe-in-javascript/" target="_blank">here</a> and <a href="http://davidwalsh.name/pubsub-javascript" target="_blank">here</a>.

The problem came when one component published an event through some interaction on the site and the other subscribers would act upon this event by making ajax calls to the server to refresh the data and update the individual components.

I noticed the first call was performing as expected but subsequent calls were experiencing 500 ms waiting before the actual work was being performed. Each of these calls when made individually returned in < 10 ms.

&nbsp;

![Ajax Controller Blocking Network Tab](/img/Ajax-Controller-Blocking-Network-Tab.png)


Investigating the issue turns out it is a common problem with being caused by Session State Blocking

&nbsp;

  * > __Only one request at a time may have Read/Write access to a particular session (as determined by session id cookie) at a time. R/W access is default

  * > __Any additional requests requiring ANY session access will be blocked until the previous R/W request has completed

&nbsp;

<a href="http://johnculviner.com/asp-net-concurrent-ajax-requests-and-session-state-blocking/" target="_blank">This blog </a>does a great job of explaining the issue and providing a fix, which was to add the attribute

``` csharp
 [SessionState(System.Web.SessionState.SessionStateBehavior.ReadOnly)] 
 ```
So I tried this but the issue still persisted, so I broke out Dot Peek and had a look what was going on in the Sitecore dlls when this was happening and found that the Sitecore.Apps.TagInjection.DependencyResolver.TagInjectionControllerFactory was being used during the ajax calls.

![Tag Injection Controller Factory](/img/TagInjectionControllerFactory.png)

This Controller Factory in the GetControllerSessionBehavior method was hard coding the SessionStateBehavior to Default via the SessionStateBehavior enum and ignoring what had been set via the attribute on the controller.

![Get Controller Session Behavior](/img/GetControllerSessionBehavior.png)

At this point I raised the issue with the awesome guys at Sitecore support and the confirmed this behaviour is in fact a bug in Sitecore 8 Update 3 and have provided a fix via a dll and config file. The bug reference number is 449003 if you are seeing the same problem get in touch with the support team.