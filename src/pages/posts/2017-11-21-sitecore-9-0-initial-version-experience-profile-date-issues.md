---
title: Sitecore 9.0 Initial Version Experience Profile Date Issues
author: Wesley Lomax
type: post
featuredpost: false
featuredimage: /img/search.png
date: 2017-11-21T16:21:05.000Z
url: /2017/11/21/sitecore-9-0-initial-version-experience-profile-date-issues/
categories:
  - Sitecore
  - xDB
tags:
  - Experience Profile
  - Sitecore 9.0
templateKey: blog-post
---
Having issues loading Experience Profile data in Sitecore Experience Platform 9.0 rev. 171002 (9.0 Initial Release)? You may be seeing these issues..

When loading the Experience Profile for the first time if you have some data you would expect it to load. In the screen shot below the search results were showing 3 but there was no data in the table.

![Initial-Load-no-results](/img/Initial-Load-no-results.png)

Opening up Chromes dev tools you can see there was an error in the console

<pre style="margin: 0in; font-family: Calibri; font-size: 11.0pt; color: #1c2933;"><span style="background: #EDF1F2;">Uncaught Error – Incorrect date format – it should be in the Sitecore Date or DateTime format. datepicker.js:174 </span></pre>

So looked like a date issue, I clicked the filter button and noticed there was no From Date being populated by default, adding a from date and clicking Apply I could get results but explaining this to customers was not ideal so I reported it via the support portal.

&nbsp;

During other testing I found another date issue. The dates below whilst looking valid would also throw the same javascript error.

<p style="margin: 0in; font-family: Calibri; font-size: 11.0pt; color: #1c2933;">
  <span style="background: #EDF1F2;">Uncaught Error – Incorrect date format – it should be in the Sitecore Date or DateTime format. datepicker.js:174</span>
</p>

&nbsp;

![Date-Issue](/img/Date-Issue.png)

&nbsp;

Sitecore support were really quick acknowledging these bugs and turning around fixes.

With the fixes applies I now get results on load of the Experience Profile and when filtering on different dates.

![Experience-Profile-Results](/img/Experience-Profile-Results.png)

&nbsp;

The public reference for these issues is 193487 if you need to contact support to request the fix.

&nbsp;

On <a href="https://twitter.com/lebeg/status/933250167314272256" target="_blank" rel="noopener">Twitter</a> user <a href="https://twitter.com/lebeg" target="_blank" rel="noopener">Vershalovich</a> also pointed out you can use the url _**{hostname}/sitecore/client/Applications/ExperienceProfile/dashboard**_ to access a dashboard without the date filter to get around this issue, a nice alternate option I did not know about.