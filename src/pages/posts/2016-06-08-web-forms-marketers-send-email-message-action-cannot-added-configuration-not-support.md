---
title: Sitecore Web Forms for Marketers Send Email Message – This action cannot be added. Your configuration does not support it.
author: Wesley Lomax
type: post
featuredpost: false
featuredimage: /img/Action-cannot-be-added.png
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

![Action-cannot-be-added](/img/Action-cannot-be-added.png)

&nbsp;

Or your **Send Email Message** actions disappear from the item.

&nbsp;

![Save-Actions-Missing](/img/Save-Actions-Missing.png)

&nbsp;

![Send-Email-Action-Not-Working](/img/Send-Email-Action-Not-Working.png)

You should also see this message in your log files for all forms with the **Send Email Message** action.

<pre>
WARN Web Forms for Marketers: the '{0E8906B3-99BA-421E-A74D-277ED17A32FD}' 
action cannot be usedException has been thrown by the target of an invocation.

WARN Web Forms for Marketers: the '{0E8906B3-99BA-421E-A74D-277ED17A32FD}' 
action cannot be usedException has been thrown by the target of an invocation.

WARN Web Forms for Marketers: the '{D4502A11-9417-4479-9F2A-485F45D2E2D0}' 
action cannot be usedException has been thrown by the target of an invocation.
</pre>

&nbsp;

Make sure your MailServer settings are set correctly in the Web.config or where ever you patch them, its worth checking _**http://[yourhostname]/sitecore/admin/showconfig.aspx**_

```xml
<setting name="MailServer" value="127.0.0.1"/>  
<setting name="MailServerUserName" value=""/>  
<setting name="MailServerPassword" value=""/>  
<setting name="MailServerPort" value="25"/>
```

&nbsp;

With valid settings the missing actions should show again and you will be able to add new **Send Email Message** actions to forms

![Send-Email-Action-Working](/img/Send-Email-Action-Working.png)