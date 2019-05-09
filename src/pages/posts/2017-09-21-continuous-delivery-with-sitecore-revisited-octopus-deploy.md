---
title: Continuous Delivery with Sitecore Revisited – Octopus Deploy
author: Wesley Lomax
type: post
date: -001-11-30T00:00:00.000Z
draft: true
url: /?p=711
categories:
  - Continuous Delivery
  - Sitecore
tags:
  - Octopus Deploy
  - PowerShell
templateKey: blog-post
---
Following on from the steps we use for Continuous Delivery on Team City ADD LINK in this post I will explain the steps we use in Octopus deploy.

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep10.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-662" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep10.png?resize=640%2C533" alt="" width="640" height="533" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep10.png?w=768 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep10.png?resize=300%2C250 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep9.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-661" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep9.png?resize=640%2C676" alt="" width="640" height="676" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep9.png?w=747 747w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep9.png?resize=284%2C300 284w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep8.png" data-rel="lightbox-image-2" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-660" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep8.png?resize=640%2C546" alt="" width="640" height="546" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep8.png?w=772 772w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep8.png?resize=300%2C256 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep8.png?resize=768%2C656 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep7.png" data-rel="lightbox-image-3" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-659" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep7.png?resize=587%2C513" alt="" width="587" height="513" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep7.png?w=587 587w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep7.png?resize=300%2C262 300w" sizes="(max-width: 587px) 100vw, 587px" data-recalc-dims="1" /></a> <a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep6.png" data-rel="lightbox-image-4" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-658" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep6.png?resize=587%2C513" alt="" width="587" height="513" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep6.png?w=587 587w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep6.png?resize=300%2C262 300w" sizes="(max-width: 587px) 100vw, 587px" data-recalc-dims="1" /></a> <a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep5.png" data-rel="lightbox-image-5" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-657" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep5.png?resize=640%2C508" alt="" width="640" height="508" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep5.png?w=764 764w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep5.png?resize=300%2C238 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep4.png" data-rel="lightbox-image-6" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-656" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep4.png?resize=640%2C429" alt="" width="640" height="429" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep4.png?w=833 833w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep4.png?resize=300%2C201 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep4.png?resize=768%2C514 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep3.png" data-rel="lightbox-image-7" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-655" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep3.png?resize=640%2C1363" alt="" width="640" height="1363" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep3.png?w=702 702w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep3.png?resize=141%2C300 141w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep3.png?resize=481%2C1024 481w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep2.png" data-rel="lightbox-image-8" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-654" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep2.png?resize=640%2C499" alt="" width="640" height="499" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep2.png?w=652 652w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep2.png?resize=300%2C234 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1b.png" data-rel="lightbox-image-9" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-653" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1b.png?resize=640%2C341" alt="" width="640" height="341" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1b.png?w=981 981w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1b.png?resize=300%2C160 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1b.png?resize=768%2C409 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1a.png" data-rel="lightbox-image-10" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-652" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1a.png?resize=640%2C532" alt="" width="640" height="532" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1a.png?w=824 824w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1a.png?resize=300%2C249 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusStep1a.png?resize=768%2C638 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a> <a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusProcess.png" data-rel="lightbox-image-11" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-651" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusProcess.png?resize=640%2C881" alt="" width="640" height="881" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusProcess.png?w=1096 1096w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusProcess.png?resize=218%2C300 218w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusProcess.png?resize=768%2C1057 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/OctopusProcess.png?resize=744%2C1024 744w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

<https://thesoftwaredudeblog.wordpress.com/2016/05/24/building-a-continuous-integration-environment-for-sitecore-part-8-using-unicorn-for-sitecore-item-syncronization/>

&nbsp;

<http://www.sitecorenutsbolts.net/2016/03/14/Octopus-Deploy-Step-for-Unicorn-Sync/>

&nbsp;

<https://github.com/kamsar/Unicorn>

&nbsp;

Unicorn Step for sync over https &#8211; <https://gist.github.com/Wesley-Lomax/e3e8ebd3e39e13e2129847e434be24f6>

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

/P:Configuration=Release

/p:OctoPackEnforceAddingFiles=true

&nbsp;

&nbsp;

&nbsp;

&nbsp;

packages\NUnit.ConsoleRunner.3.6.1\tools\nunit3-console.exe

&nbsp;

\RCN.Tests\bin\Release\RCN.Tests.dll

\Foundation\*\RCN.Foundation.\*.Tests\bin\Release\RCN.Foundation.\*.Tests.dll

\Feature\*\RCN.Feature.\*.Tests\bin\Release\RCN.Feature.\*.Tests.dll

\Feature\*\RCN.Feature.\*.Intergration.Tests\bin\Release\RCN.Feature.\*.Integration.Tests.dll

&nbsp;

+:assembly=RCN.Business

+:assembly=RCN.Web

+:assembly=RCN.Core

+:assembly=RCN.Foundation.*

+:assembly=RCN.Feature.*

&nbsp;

&nbsp;

&nbsp;

%system.teamcity.build.checkoutDir%/{SerilizedItemsLocation}/** => SerializedItems.%system.GitVersion.NuGetVersion%.zip

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

Step Gist &#8211; <https://gist.github.com/Wesley-Lomax/670450bea853e762e3ff19a304956186.js>

&nbsp;

&nbsp;

&nbsp;

&nbsp;

Write-Host &#8220;Deleting backup copies older than three release versions.&#8221;

gci C:\Backup -Recurse -Filter *.zip | where{-not $_.PsIsContainer}| sort CreationTime -desc| select -Skip 3 | Remove-Item -Force

&nbsp;

&nbsp;

&nbsp;

Write-Host &#8220;Stopping RCNAppPool&#8221;

Stop-WebAppPool -Name RCNAppPool

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

$files = @(&#8216;Web.CD.config&#8217;,&#8217;ConnectionStrings.CD.config&#8217;,&#8217;ConnectionStrings.CM.config&#8217;)

&nbsp;

$installDirectory = $OctopusParameters[&#8220;Octopus.Action[Deploy Site].Output.Package.InstallationDirectoryPath&#8221;] 

&nbsp;

Get-ChildItem -Path $installDirectory -Include $files  -Recurse | foreach { $_.Delete()}

&nbsp;

&nbsp;

&nbsp;

&nbsp;

Remove-Item  #{Website.Folder}\App_Config\Include\Unicorn\Unicorn.DataProvider.config

&nbsp;

&nbsp;

&nbsp;

&nbsp;

Write-Host &#8220;Starting AppPool&#8221;

Start-WebAppPool -Name AppPool

&nbsp;

&nbsp;

<https://gist.github.com/Wesley-Lomax/c42bebe3c1c8f68896b7cad3ca981d31>

&nbsp;

&nbsp;

<https://gist.github.com/Wesley-Lomax/e3e8ebd3e39e13e2129847e434be24f6>

&nbsp;

&nbsp;

&nbsp;

$SiteUrl = $OctopusParameters[&#8220;Mainsite.RCN&#8221;] 

$PublishMode = $OctopusParameters[&#8220;PublishMode&#8221;] 

$CmsUrl = &#8220;<https://$SiteUrl/services/publish/$PublishMode>&#8221;

&nbsp;

$CurlPath = &#8220;C:\Tools\curl-7.48\bin\curl.exe&#8221;

&nbsp;

$CurlCommand= &#8220;$CurlPath &#8211;request POST &#8211;silent &#8211;form &#8220;&#8221;source=master&#8221;&#8221; &#8220;&#8221;languages=en&#8221;&#8221; $CmsUrl&#8221;

&nbsp;

Write-Output &#8220;INFO: Starting Invoke-Expression: $CurlCommand&#8221;

Invoke-Expression $CurlCommand

&nbsp;

&nbsp;