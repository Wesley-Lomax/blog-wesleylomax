---
title: Sitecore Web Forms for Marketers Send Email Message – This action cannot be added. Your configuration does not support it.
author: Wesley Lomax
type: post
date: 2016-06-08T15:18:53.000Z
url: /2016/06/08/web-forms-marketers-send-email-message-action-cannot-added-configuration-not-support/
categories:
  - Sitecore
  - Web Forms For Marketers
tags:
  - Email
  - WFFM
templateKey: blog-post
---
When trying to add a new _**Save Action**_ to a **_Web Forms for Marketers_** form and you get an alert telling you **_This action cannot be added. Your configuration does not support it._**

&nbsp;

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Action-cannot-be-added.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-377" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Action-cannot-be-added.png?resize=507%2C513" alt="Action cannot be added" width="507" height="513" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Action-cannot-be-added.png?w=507 507w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Action-cannot-be-added.png?resize=296%2C300 296w" sizes="(max-width: 507px) 100vw, 507px" data-recalc-dims="1" /></a>

&nbsp;

Or your** Send Email Message** actions disappear from the item.

&nbsp;

<img class="alignnone size-full wp-image-379" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Save-Actions-Missing.png?resize=502%2C472" alt="Save Actions Missing" width="502" height="472" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Save-Actions-Missing.png?w=502 502w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Save-Actions-Missing.png?resize=300%2C282 300w" sizes="(max-width: 502px) 100vw, 502px" data-recalc-dims="1" />

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Not-Working.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-380" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Not-Working.png?resize=591%2C165" alt="Send Email Action Not Working" width="591" height="165" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Not-Working.png?w=591 591w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Not-Working.png?resize=300%2C84 300w" sizes="(max-width: 591px) 100vw, 591px" data-recalc-dims="1" /></a>

You should also see this message in your log files for all forms with the **Send Email Message** action.

<pre>WARN Web Forms for Marketers: the '{0E8906B3-99BA-421E-A74D-277ED17A32FD}' action cannot be usedException has been thrown by the target of an invocation.
WARN Web Forms for Marketers: the '{0E8906B3-99BA-421E-A74D-277ED17A32FD}' action cannot be usedException has been thrown by the target of an invocation.
WARN Web Forms for Marketers: the '{D4502A11-9417-4479-9F2A-485F45D2E2D0}' action cannot be usedException has been thrown by the target of an invocation.</pre>

&nbsp;

Make sure your MailServer settings are set correctly in the Web.config or where ever you patch them, its worth checking _**http://[yourhostname]/sitecore/admin/showconfig.aspx**_

`<setting name="MailServer" value="127.0.0.1"/>`
  
`<setting name="MailServerUserName" value=""/>`
  
`<setting name="MailServerPassword" value=""/>`
  
`<setting name="MailServerPort" value="25"/>`

&nbsp;

With valid settings the missing actions should show again and you will be able to add new **Send Email Message** actions to forms

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Working.png" data-rel="lightbox-image-2" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-381" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Working.png?resize=623%2C151" alt="Send Email Action Working" width="623" height="151" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Working.png?w=623 623w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/06/Send-Email-Action-Working.png?resize=300%2C73 300w" sizes="(max-width: 623px) 100vw, 623px" data-recalc-dims="1" /></a>

&nbsp;

&nbsp;