---
title: Transforming Sitecore config files per role with Octopus Deploy
author: Wesley Lomax
type: post
featuredpost: false
date: 2016-06-02T14:09:37.000Z
url: /2016/06/02/transforming-sitecore-config-files-per-role-with-octopus-deploy/
featured_image: http://blog.wesleylomax.co.uk/wp-content/uploads/2016/06/chains-1289812_1920.jpg
categories:
  - Continuous Delivery
  - Sitecore
tags:
  - Config
  - Continuous Delivery
  - Octopus Deploy
  - PowerShell
  - Sitecore
templateKey: blog-post
---
When using Octopus Deploy to deploy Sitecore solutions that are scaled i.e. have one or more Content Delivery or Content Management servers, there are configuration changes that need to be made for each role. For example a Content Delivery server does not require a connection string for the master database or setting out of process session state for Content Delivery servers.

Config transforms are an obvious way to accomplish this but they are usually setup per environment, however with a little tweaking and some built in Octopus functionality we can achieve config transforms per server role.

Add a new config file to your solution I have added Web.CD.config.

Next, unload your project, and edit the .csproj file. To fix the linking linking of the files. This is done simply by adding a DependentUpon element inside each Item. Let&#8217;s say you have this:

<pre class="brush: xml; title: ; notranslate" title="">&lt;None Include="Web.CD.config" /&gt;
</pre>

<p style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">
  <code></code>Update the XML to look like this :
</p>

<pre class="brush: xml; title: ; notranslate" title="">&lt;None Include="Web.CD.config" &gt;
 &lt;DependentUpon&gt;Web.config&lt;/DependentUpon&gt;
&lt;/None&gt;
</pre>

And you end up with nicely linked and stacked files

<img class="alignnone wp-image-352" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/WebCDNested.png?resize=253%2C72" alt="WebCDNested" width="253" height="72" data-recalc-dims="1" />

The new config transform must be have **Build Action** of **Content** so it is deployed with your NuGet package.

<img class="alignnone size-full wp-image-351" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/WebCDContent.png?resize=294%2C188" alt="WebCDContent" width="294" height="188" data-recalc-dims="1" />

&nbsp;

The config transform in this example is straight forward I am going to change the session state to be **_Mongo_** instead of **_InProc._**

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/a3b213a21e34f66048bc75a07919e9eb">Gist</a>.
  </noscript>
</div>

With that in place and committed there are some changes to make to Octopus to use the new transform file

Create your variables with the appropriate scope, here I have added a new variable called **WebConfigTransform** that will be available in Octopus and set the value to **Web.CD.Config** for servers in the Role **ContentDelivery** for environments **UAT** and **LIVE**

<img class="alignnone size-full wp-image-358" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/OctopusVariables.png?resize=640%2C139" alt="Octopus Variable" width="640" height="139" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/OctopusVariables.png?w=681 681w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/OctopusVariables.png?resize=300%2C65 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" />

You can also have Octopus substitute variables in your transforms with variables defined in Octopus,  its not required in this example but useful when you are transforming ConnectionStrings.config for example more on it <http://docs.octopusdeploy.com/display/OD/Substitute+Variables+in+Files>

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/SubstitueVariablesinFiles.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-361" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/SubstitueVariablesinFiles.png?resize=640%2C117" alt="SubstitueVariablesinFiles" width="640" height="117" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/SubstitueVariablesinFiles.png?w=732 732w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/SubstitueVariablesinFiles.png?resize=300%2C55 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

Finally tell Octopus which transform to apply to which config file and the appropriate file will be used per role as defined.

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/ConfigTransform.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-348" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/ConfigTransform.png?resize=640%2C218" alt="ConfigTransform" width="640" height="218" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/ConfigTransform.png?w=746 746w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/05/ConfigTransform.png?resize=300%2C102 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

Once you have this setup and created a new release check the output from your step with transforms and you with see Octopus switching in the appropriate transform per role.

Here is the output from my package deployment step on one of the Content Delivery Servers :-

<pre>Transforming 'C:\Octopus\Applications\Environment\Project\1.5.1\Web.config' using 'C:\Octopus\Applications\Environment\Project\1.5.1\Web.CD.config'.

Transforming 'C:\Octopus\Applications\Environment\Project\1.5.1\App_Config\ConnectionStrings.config' using 'C:\Octopus\Applications\Environment\Project\1.5.1\App_Config\ConnectionStrings.CD.config'.</pre>

#### 

#### 

#### Cleanup afterwards

I have another step in my process to remove the transforms after they have been used so they are not left behind on the server using some PowerShell.

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/f46f70de5619266573237cf750c306d2">Gist</a>.
  </noscript>
</div>

#### 

#### Exclude CD transforms from local One-Click Publish Profile

You will also need to prevent these files being deployed during local development using One-Click Publish.

Find your projects *.pubxml file, should be in the \Properties\PublishProfiles directory  of your web project and add a new **PropertyGroup** element inside add a **ExcludeFilesFromDeployment** element and add a list of semicolon separated files to exclude.

<pre class="brush: xml; title: ; notranslate" title="">&lt;PropertyGroup&gt;
  &lt;ExcludeFilesFromDeployment&gt;Web.CD.config;$(ProjectDir)\App_Config\RewriteRules.CD.config;$(ProjectDir)\App_Config\Sitecore.CD.config;$(ProjectDir)\App_Config\ConnectionStrings.CD.config;$(ProjectDir)\App_Config\Include\Sitecore.Analytics.Tracking.CD.config&lt;/ExcludeFilesFromDeployment&gt;
  &lt;/PropertyGroup&gt;
</pre>

Your should end up with something like this.

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/16d8da31883784e247337d780d6319e1">Gist</a>.
  </noscript>
</div>

&nbsp;

#### References

<http://docs.octopusdeploy.com/display/OD/Configuration+files#Configurationfiles-ConfigurationTransformation>

<http://johan.driessen.se/posts/Applying-MSBuild-Config-Transformations-to-any-config-file-without-using-any-Visual-Studio-extensions>