---
title: Sitecore 8 MVC site not showing on stats.aspx page
author: Wesley Lomax
type: post
featuredpost: false
date: 2015-11-20T13:25:27.000Z
url: /2015/11/20/sitecore-8-mvc-custom-site-not-showing-stats-aspx-page/
featured_image: http://blog.wesleylomax.co.uk/wp-content/uploads/2016/03/watches-1204696.jpg
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

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats.aspx-before.png" target="\_blank" data-rel="lightbox-image-0" data-rl\_title="" data-rl_caption="" title=""><img class="alignnone wp-image-104" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats.aspx-before.png?resize=640%2C174" alt="Stats.aspx before fix" width="640" height="174" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats.aspx-before.png?resize=1024%2C279 1024w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats.aspx-before.png?resize=300%2C82 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats.aspx-before.png?w=1280 1280w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

Then I checked **cache.aspx, [yourhostname]/sitecore/admin/cache.aspx**, to see if my caches for the sites were being created and they were.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Cache.aspx\_.png" target="\_blank" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-101 size-full" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Cache.aspx_.png?resize=640%2C137" alt="Cache.aspx" width="640" height="137" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Cache.aspx_.png?w=704 704w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Cache.aspx_.png?resize=300%2C64 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

So I opened the Sitecore debugger **[yourhostname]?sc\_debug=1&sc\_prof=1&sc\_trace=1&sc\_ri=1** to have a look whether my control was being cached and it was.

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/DebugMode.png" target="\_blank" data-rel="lightbox-image-2" data-rl\_title="" data-rl_caption="" title=""><img class="alignnone wp-image-102 size-full" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/DebugMode.png?resize=640%2C175" alt="DebugMode" width="640" height="175" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/DebugMode.png?w=851 851w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/DebugMode.png?resize=300%2C82 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

At this point I got in touch with Sitecore support to see if they knew what this issue was and as usual they delivered a fix.

After installing the fix I can see my custom mvc site on the stats page and the statistics for my controls.

<img class="alignnone wp-image-103 size-full" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats-with-Fix.png?resize=640%2C180" alt="Stats with Fix" width="640" height="180" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats-with-Fix.png?w=717 717w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Stats-with-Fix.png?resize=300%2C85 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" />

&nbsp;

If you are having the same problem get in touch with support and ask for Sitecore.Support.398176.dll and the associated config file.

&nbsp;