---
title: Sitecore 8 MVC site not showing on stats.aspx page
author: Wesley Lomax
type: post
featuredpost: false
date: 2015-11-20T13:25:27.000Z
url: /2015/11/20/sitecore-8-mvc-custom-site-not-showing-stats-aspx-page/
featuredimage: /img/watches-1204696.jpg
categories:
  - Performance
  - Sitecore
tags:
  - Bug
  - cache
  - mvc
  - stats
  - support
templateKey: blog-post
---
My current project built with Sitecore 8 update 3 is well in to the build phase and I was starting to look at how components are performing and adding caching where applicable.

So I checked the **stats.aspx** admin page to make sure controls configured to be cached were being servered from the cache, **[yourhostname]/sitecore/admin/stats.aspx** , but my custom defined MVC site was not showing meaning I could not see the statistics for the sites controls.

![Stats.aspx-before](/img/Stats.aspx-before.png)

Then I checked **cache.aspx, [yourhostname]/sitecore/admin/cache.aspx**, to see if my caches for the sites were being created and they were.

![Cache.aspx_](/img/Cache.aspx_.png)

&nbsp;

So I opened the Sitecore debugger **[yourhostname]?sc\_debug=1&sc\_prof=1&sc\_trace=1&sc\_ri=1** to have a look whether my control was being cached and it was.

![Debug Mode](/img/DebugMode.png)

&nbsp;

At this point I got in touch with Sitecore support to see if they knew what this issue was and as usual they delivered a fix.

After installing the fix I can see my custom mvc site on the stats page and the statistics for my controls.

![Stats-with-Fix](/img/Stats-with-Fix.png)

&nbsp;

If you are having the same problem get in touch with support and ask for Sitecore.Support.398176.dll and the associated config file.

&nbsp;