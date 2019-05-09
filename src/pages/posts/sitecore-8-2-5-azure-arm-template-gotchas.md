---
title: Sitecore 8.2.5 Azure ARM Template Gotchas
author: Wesley Lomax
type: post
date: 2017-10-04T11:40:08+00:00
url: /2017/10/04/sitecore-8-2-5-azure-arm-template-gotchas/
categories:
  - Azure
  - Sitecore
tags:
  - 8.2.5
  - ARM
  - Azure

---
I am a bit (a lot) late to the Sitecore Azure PaaS party, Sitecore has supported deployments to Azure using Web Apps since  Sitecore XP 8.2 Update-1 (rev. 161115) but have been playing around with the Quick Start templates provided by Sitecore [https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates.][1]

I wanted to get up and running an XP0 instance of 8.2.5 so jumped to the repo  &#8211; <https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates/tree/master/Sitecore%208.2.5/xp0> , for development, and had a read of the guide here &#8211;[https://doc.sitecore.net/cloud/working\_with\_sitecore\_azure\_toolkit/deployment/deploy\_a\_new\_sitecore\_environment\_to\_azure\_app\_service][2] and had a look at Sitecore MVP <a href="https://twitter.com/rhabraken" target="_blank" rel="noopener">Rob Habraken</a> blog post &#8211; <https://www.robhabraken.nl/index.php/2622/sitecore-8-2-1-on-azure-web-apps/> to get me up to speed and in a position to start the install.

After following the documentation and getting the Sitecore 8.2 rev. 170728_single.scwdp.zip package uploaded to Azure blob storage. I then started customizing the Sample PowerShell install script you can see it here &#8211; <a href="https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates" target="_blank" rel="noopener">https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates</a>

I tried a couple of variations for `$ArmTemplateUrl` before finding the below worked.

<div>
  <div>
    <code>$ArmTemplateUrl = "https://raw.githubusercontent.com/Sitecore/Sitecore-Azure-Quickstart-Templates/master/Sitecore%208.2.5/xp0/azuredeploy.json";&lt;br />
</code>
  </div>
</div>

The rest of the required replacements in the script were self explanatory

`$Name = "RESOURCE_GROUP_NAME";`
  
`$location = "AZURE_DATA_CENTER_NAME";`
  
`$AzureSubscriptionId = "AZURE_SUBSCRIPTION_ID";`

I then set about customizing the <a href="https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates/blob/master/Sitecore%208.2.5/xp0/azuredeploy.parameters.json" target="_blank" rel="noopener">azuredeploy.parameters.json</a> file, this was mosltly well documented here &#8211; <https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates/tree/master/Sitecore%208.2.5/xp0>

<div>
  <div>
    I was unsure of <code>setCompatibilityLevelMsDeployPackageUrl </code>and could not find any documentation, so had a dig through the deployment template, <a href="https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates/blob/master/Sitecore%208.2.5/xp0/azuredeploy.json" target="_blank" rel="noopener">https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates/blob/master/Sitecore%208.2.5/xp0/azuredeploy.json</a>  for references to the parameter. In there was a default value so I added that to the <em><strong>azuredeploy.parameters.json</strong></em> file.
  </div>
  
  <div>
  </div>
  
  <div>
    <code>"setCompatibilityLevelMsDeployPackageUrl":{</code>
  </div>
  
  <div>
    <code>"value": "https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates/releases/download/v1.5.0/SetCompatibilityLevel.scwdp.zip"</code>
  </div>
  
  <div>
    <code>},</code>
  </div>
  
  <div>
  </div>
</div>

With everything populated I was in a position to run the PowerShell script, the first problem I came across was &#8211;

`Get-AzureRMResource : Run Login-AzureRmAccount to login`

Even though I had been prompted to login to my Azure account, turns out I needed to upgrade my Azure PowerShell tools  to 4.4.0 once I ran the msi available here &#8211; <https://github.com/Azure/azure-powershell/releases> that error went away.[
  
][3] 

My next error was a 403 access denied to the scwdp I earlier uploaded to the Azure Blob storage

<pre>Failed to download package.

AppGallery Deploy Failed: 'System.Net.WebException: The remote server returned an error: (403)</pre>

If you get this check you have the correct url for your Shared Access Signature and that the Start Time and Expiry Time are valid.

With these couple of issue resolved and the awesome templates provided by Sitecore I had my _**ProvisingState: success**_ message

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/DeploymentSuccess.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-large wp-image-737" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/DeploymentSuccess.png?resize=640%2C123" alt="" width="640" height="123" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/DeploymentSuccess.png?resize=1024%2C196 1024w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/DeploymentSuccess.png?resize=300%2C57 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/DeploymentSuccess.png?resize=768%2C147 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/DeploymentSuccess.png?w=1280 1280w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

and a freshly installed version of Sitecore.NET 8.2 (rev. 170728) hosted as an Azure Web App.

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/PaaS-Sitecore.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-large wp-image-738" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/PaaS-Sitecore.png?resize=640%2C494" alt="" width="640" height="494" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/PaaS-Sitecore.png?resize=1024%2C791 1024w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/PaaS-Sitecore.png?resize=300%2C232 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/PaaS-Sitecore.png?resize=768%2C594 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/PaaS-Sitecore.png?w=1280 1280w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/10/PaaS-Sitecore.png?w=1920 1920w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

I have to say I am very impressed with the offering and cant wait to dig in deeper to Sitecore&#8217;s PaaS offering.

&nbsp;

 [1]: https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates
 [2]: https://doc.sitecore.net/cloud/working_with_sitecore_azure_toolkit/deployment/deploy_a_new_sitecore_environment_to_azure_app_service
 [3]: https://github.com/Azure/azure-powershell/releases