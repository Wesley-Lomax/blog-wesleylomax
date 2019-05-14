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

```xml
<None Include="Web.CD.config">
```

Update the XML to look like this :

```xml
<None Include="Web.CD.config">
  <DependentUpon>Web.config</DependentUpon>
</None>
```
And you end up with nicely linked and stacked files

![WebCDNested](/img/WebCDNested.png)

The new config transform must be have **Build Action** of **Content** so it is deployed with your NuGet package.

![WebCDContent](/img/WebCDContent.png)

&nbsp;

The config transform in this example is straight forward I am going to change the session state to be **_Mongo_** instead of **_InProc._**

<script src="https://gist.github.com/Wesley-Lomax/a3b213a21e34f66048bc75a07919e9eb.js"></script>

With that in place and committed there are some changes to make to Octopus to use the new transform file

Create your variables with the appropriate scope, here I have added a new variable called **WebConfigTransform** that will be available in Octopus and set the value to **Web.CD.Config** for servers in the Role **ContentDelivery** for environments **UAT** and **LIVE**

![OctopusVariables](/img/OctopusVariables.png)

You can also have Octopus substitute variables in your transforms with variables defined in Octopus,  its not required in this example but useful when you are transforming ConnectionStrings.config for example more on it <http://docs.octopusdeploy.com/display/OD/Substitute+Variables+in+Files>

![SubstitueVariablesinFiles](/img/SubstitueVariablesinFiles.png)

&nbsp;

Finally tell Octopus which transform to apply to which config file and the appropriate file will be used per role as defined.

![ConfigTransform](/img/ConfigTransform.png)

Once you have this setup and created a new release check the output from your step with transforms and you with see Octopus switching in the appropriate transform per role.

Here is the output from my package deployment step on one of the Content Delivery Servers :-

<pre>Transforming 'C:\Octopus\Applications\Environment\Project\1.5.1\Web.config' 
using 'C:\Octopus\Applications\Environment\Project\1.5.1\Web.CD.config'.
Transforming 'C:\Octopus\Applications\Environment\Project\1.5.1\App_Config\ConnectionStrings.config' 
using 'C:\Octopus\Applications\Environment\Project\1.5.1\App_Config\ConnectionStrings.CD.config'.
</pre>

#### Cleanup afterwards

I have another step in my process to remove the transforms after they have been used so they are not left behind on the server using some PowerShell.

<script src="https://gist.github.com/Wesley-Lomax/f46f70de5619266573237cf750c306d2.js"></script>

#### Exclude CD transforms from local One-Click Publish Profile

You will also need to prevent these files being deployed during local development using One-Click Publish.

Find your projects *.pubxml file, should be in the \Properties\PublishProfiles directory  of your web project and add a new **PropertyGroup** element inside add a **ExcludeFilesFromDeployment** element and add a list of semicolon separated files to exclude.

``` xml
<PropertyGroup>
  <ExcludeFilesFromDeployment>
    Web.CD.config;
    $(ProjectDir)\App_Config\RewriteRules.CD.config;
    $(ProjectDir)\App_Config\Sitecore.CD.config;
    $(ProjectDir)\App_Config\ConnectionStrings.CD.config;
    $(ProjectDir)\App_Config\Include\Sitecore.Analytics.Tracking.CD.config
  </ExcludeFilesFromDeployment>
</PropertyGroup>
```

Your should end up with something like this.

<script src="https://gist.github.com/Wesley-Lomax/16d8da31883784e247337d780d6319e1.js"></script>

&nbsp;

#### References

<http://docs.octopusdeploy.com/display/OD/Configuration+files#Configurationfiles-ConfigurationTransformation>

<http://johan.driessen.se/posts/Applying-MSBuild-Config-Transformations-to-any-config-file-without-using-any-Visual-Studio-extensions>