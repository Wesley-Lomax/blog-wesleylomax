---
title: Sitecore 9.0 Initial Version Experience Profile Date Issues
author: Wesley Lomax
type: post
date: 2017-11-21T16:21:05+00:00
url: /2017/11/21/sitecore-9-0-initial-version-experience-profile-date-issues/
categories:
  - Sitecore
  - xDB
tags:
  - Experience Profile
  - Sitecore 9.0

---
Having issues loading Experience Profile data in Sitecore Experience Platform 9.0 rev. 171002 (9.0 Initial Release)? You may be seeing these issues..

When loading the Experience Profile for the first time if you have some data you would expect it to load. In the screen shot below the search results were showing 3 but there was no data in the table.

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Initial-Load-no-results..png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-779" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Initial-Load-no-results..png?resize=640%2C294" alt="" width="640" height="294" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Initial-Load-no-results..png?resize=1024%2C471 1024w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Initial-Load-no-results..png?resize=300%2C138 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Initial-Load-no-results..png?resize=768%2C353 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Initial-Load-no-results..png?w=1280 1280w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Initial-Load-no-results..png?w=1920 1920w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

Opening up Chromes dev tools you can see there was an error in the console

<pre style="margin: 0in; font-family: Calibri; font-size: 11.0pt; color: #1c2933;"><span style="background: #EDF1F2;">Uncaught Error – Incorrect date format – it should be in the Sitecore Date or DateTime format. datepicker.js:174 </span></pre>

So looked like a date issue, I clicked the filter button and noticed there was no From Date being populated by default, adding a from date and clicking Apply I could get results but explaining this to customers was not ideal so I reported it via the support portal.

&nbsp;

During other testing I found another date issue. The dates below whilst looking valid would also throw the same javascript error.

<p style="margin: 0in; font-family: Calibri; font-size: 11.0pt; color: #1c2933;">
  <span style="background: #EDF1F2;">Uncaught Error – Incorrect date format – it should be in the Sitecore Date or DateTime format. datepicker.js:174</span>
</p>

&nbsp;

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Date-Issue.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-777" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Date-Issue.png?resize=561%2C268" alt="" width="561" height="268" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Date-Issue.png?w=651 651w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Date-Issue.png?resize=300%2C143 300w" sizes="(max-width: 561px) 100vw, 561px" data-recalc-dims="1" /></a>

&nbsp;

Sitecore support were really quick acknowledging these bugs and turning around fixes.

With the fixes applies I now get results on load of the Experience Profile and when filtering on different dates.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Experience-Profile-Results.png" data-rel="lightbox-image-2" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-780" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Experience-Profile-Results.png?resize=355%2C249" alt="" width="355" height="249" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Experience-Profile-Results.png?w=414 414w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Experience-Profile-Results.png?resize=300%2C210 300w" sizes="(max-width: 355px) 100vw, 355px" data-recalc-dims="1" /></a>

&nbsp;

The public reference for these issues is 193487 if you need to contact support to request the fix.

&nbsp;

On <a href="https://twitter.com/lebeg/status/933250167314272256" target="_blank" rel="noopener">Twitter</a> user <a href="https://twitter.com/lebeg" target="_blank" rel="noopener">Vershalovich</a> also pointed out you can use the url _**{hostname}/sitecore/client/Applications/ExperienceProfile/dashboard**_ to access a dashboard without the date filter to get around this issue, a nice alternate option I did not know about.