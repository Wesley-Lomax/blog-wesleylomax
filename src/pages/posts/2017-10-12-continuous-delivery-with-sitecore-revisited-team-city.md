---
title: Continuous Delivery with Sitecore Revisited – Team City
author: Wesley Lomax
type: post
featuredpost: false
featuredimage: /img/search.png
date: 2017-10-12T19:00:41.000Z
url: /2017/10/12/continuous-delivery-with-sitecore-revisited-team-city/
categories:
  - Continuous Delivery
  - Sitecore
tags:
  - dotCover
  - helix
  - Team City
  - Unicorn
templateKey: blog-post
---
<div id="toc_container" class="toc_wrap_right no_bullets">
  <p class="toc_title">
    Contents
  </p>
  
  <ul class="toc_list">
    <li>
      <a href="#Team_City_Step_1_8211_Restore_NuGet_Packages"><span class="toc_number toc_depth_1">1</span> Team City Step 1 &#8211; Restore NuGet Packages</a>
    </li>
    <li>
      <a href="#Team_City_Step_2_8211_GitVersion"><span class="toc_number toc_depth_1">2</span> Team City Step 2 &#8211; GitVersion </a><ul>
        <li>
          <a href="#Parameters_for_GitVersion"><span class="toc_number toc_depth_2">2.1</span> Parameters for GitVersion</a>
        </li>
      </ul>
    </li>
    
    <li>
      <a href="#Team_City_Step_3_8211_Build_Solution_and_Run_OctoPack"><span class="toc_number toc_depth_1">3</span> Team City Step 3 &#8211; Build Solution and Run OctoPack</a>
    </li>
    <li>
      <a href="#Team_City_Step_4_8211_Run_Unit_Tests_and_Code_Coverage_Analysis"><span class="toc_number toc_depth_1">4</span> Team City Step 4 &#8211; Run Unit Tests and Code Coverage Analysis</a>
    </li>
    <li>
      <a href="#Team_City_Step_5_8211_Package_Serialized_Items"><span class="toc_number toc_depth_1">5</span> Team City Step 5 &#8211; Package Serialized Items</a>
    </li>
    <li>
      <a href="#Team_City_Step_6_8211_Create_Release"><span class="toc_number toc_depth_1">6</span> Team City Step 6 &#8211; Create Release</a>
    </li>
    <li>
      <a href="#Team_City_Step_7_8211_Deploy_Release"><span class="toc_number toc_depth_1">7</span> Team City Step 7 &#8211; Deploy Release</a>
    </li>
    <li>
      <a href="#Team_City_Step_8_8211_Run_UI_Tests"><span class="toc_number toc_depth_1">8</span> Team City Step 8 &#8211; Run UI Tests</a>
    </li>
    <li>
      <a href="#Source_Control_Root"><span class="toc_number toc_depth_1">9</span> Source Control Root</a>
    </li>
    <li>
      <a href="#VCS_Labelling"><span class="toc_number toc_depth_1">10</span> VCS Labelling</a>
    </li>
    <li>
      <a href="#Team_City_Parameters"><span class="toc_number toc_depth_1">11</span> Team City Parameters</a>
    </li>
  </ul>
</div>

Last year I wrote two posts about Continuous Delivery with [Sitecore Continuous Delivery with Sitecore Part 1][1] and [Continuous Delivery with Sitecore Part 2][2]

Since then I&#8217;ve tweaked the deployment process and made significant changes to the solution being deployed, we refactored to be more inline with Sitecore&#8217;s <a href="http://helix.sitecore.net/" target="_blank" rel="noopener">Helix </a>standards, <a href="http://blog.wesleylomax.co.uk/2017/08/07/cardiff-sitecore-technical-user-group-august-2017/" target="_blank" rel="noopener">I gave a talk about this at the Sitecore User Group in Cardiff</a>, and changed our item serialization provider, so I wanted to share an update of how the process looks now.

The deployment tools are the same so we use <a href="https://www.jetbrains.com/teamcity/" target="_blank" rel="noopener">Team City</a> for CI and building our release and <a href="https://octopus.com/" target="_blank" rel="noopener">Octopus Deploy</a> to push the releases through our environments.

The overall process for the release build looks like this:-

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TeamCityProcess.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-675" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TeamCityProcess.png?resize=640%2C306" alt="" width="640" height="306" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TeamCityProcess.png?w=1353 1353w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TeamCityProcess.png?resize=300%2C143 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TeamCityProcess.png?resize=768%2C367 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TeamCityProcess.png?resize=1024%2C489 1024w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TeamCityProcess.png?w=1280 1280w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

Below  I will go into more detail about each step and pick out some of the key settings.

### <span id="Team_City_Step_1_8211_Restore_NuGet_Packages">Team City Step 1 &#8211; Restore NuGet Packages</span>

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep1.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-665" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep1.png?resize=640%2C353" alt="" width="640" height="353" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep1.png?w=1159 1159w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep1.png?resize=300%2C165 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep1.png?resize=768%2C423 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep1.png?resize=1024%2C565 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

This step uses the** _NuGet Installer_** runner and you need to provide the _**Path to Solution**_ parameter for your *.sln file so it can fetch your NuGet packages on the build server.

&nbsp;

### <span id="Team_City_Step_2_8211_GitVersion">Team City Step 2 &#8211; GitVersion<a href="http://blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep2.png" data-rel="lightbox-image-2" data-rl_title="" data-rl_caption="" title=""><br /> <img class="alignnone size-full wp-image-666" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep2.png?resize=640%2C304" alt="" width="640" height="304" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep2.png?w=969 969w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep2.png?resize=300%2C143 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep2.png?resize=768%2C365 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a></span>

GitVersion enables Easy Semantic Versioning in your release pipeline, I&#8217;ve gone in to more details in another post [here ][3] or you can checkout the GitHub repo for more details <https://github.com/GitTools/GitVersion>, this step requires the <a href="https://www.nuget.org/packages/GitVersionTask" target="_blank" rel="noopener">GitVersionTask Nuget package</a>.

The main setup for Team City is adding a _**Command Line**_ runner, the _**Command executable**_ is **_GitVersion_** and the **Command Parameters** are

`. /updateAssemblyInfo /output buildserver`

#### <span id="Parameters_for_GitVersion">Parameters for GitVersion</span>

GitVersion also requires you create several parameters so it can populate them when this task is executed, you can then use them for the rest of the build process

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/GitVersion-Parameters.png" data-rel="lightbox-image-3" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-721 size-full" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/GitVersion-Parameters.png?resize=640%2C167" alt="" width="640" height="167" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/GitVersion-Parameters.png?w=1062 1062w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/GitVersion-Parameters.png?resize=300%2C78 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/GitVersion-Parameters.png?resize=768%2C200 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/GitVersion-Parameters.png?resize=1024%2C267 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

_**system.Git_Branch**_ &#8211; Is your branch TeamCity is using for the build, you will get autocomplete on this as its a TeamCity parameter.

_**system.GitVersion.FullSemVer**_ &#8211; FullSemVer will also include build metadata: `{major}.{minor}.{patch}-{tag}+{buildmetadata}`

_**system.GitVersion.NuGetVersion**_ &#8211;  **NuGetVersion** variable to have the version formatted in a NuGet compatible way, so `1.0.1-rc.1+5` would become `1.0.1-rc0001`

_**system.GitVersion.SemVer**_ &#8211; SemVer will be in the format `{major}.{minor}.{patch}-{tag}`

&nbsp;

### <span id="Team_City_Step_3_8211_Build_Solution_and_Run_OctoPack">Team City Step 3 &#8211; Build Solution and Run OctoPack</span>

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep3.png" data-rel="lightbox-image-4" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-667" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep3.png?resize=640%2C594" alt="" width="640" height="594" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep3.png?w=927 927w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep3.png?resize=300%2C279 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep3.png?resize=768%2C713 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

This step uses the _**MSBuild**_ runner type, two parameters are passed to this_** /P:Configuration=Release**_ to run a release build and _**/p:OctoPackEnforceAddingFiles=true**_.

From the OctoPack documentation &#8211; <https://octopus.com/docs/packaging-applications/nuget-packages/using-octopack>

> If the `<files>` section exists, OctoPack by default won&#8217;t attempt to automatically add any extra files to your package, so you&#8217;ll need to be explicit about which files you want to include. You can override this behavior with `/p:OctoPackEnforceAddingFiles=true` which will instruct OctoPack to package a combination of files using its conventions, and those defined by your `<files>` section.

We are also running OctoPack here, you can see the checkbox enabled and using the TeamCity parameter _**%system.GitVersion.NuGetVersion%**_ for the build number that was populated in step two.

### <span id="Team_City_Step_4_8211_Run_Unit_Tests_and_Code_Coverage_Analysis">Team City Step 4 &#8211; Run Unit Tests and Code Coverage Analysis</span>

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/RunUnitTests.png" data-rel="lightbox-image-5" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-708" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/RunUnitTests.png?resize=640%2C400" alt="Run Unit Tests" width="640" height="400" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/RunUnitTests.png?w=1139 1139w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/RunUnitTests.png?resize=300%2C188 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/RunUnitTests.png?resize=768%2C480 768w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/RunUnitTests.png?resize=1024%2C640 1024w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/RunUnitTests.png?resize=400%2C250 400w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

We are using NUnit for our tests so we use the built in _**NUnit**_ runner task, plug in the path the the NUnit console tool referenced from NuGet, **_packages\NUnit.ConsoleRunner.3.6.1\tools\nunit3-console.exe._**

In the **_Run tests from_** field wildcards are your friend, Helix has a consistent project and folder structure you can use this consistency to ensure any new Feature or Foundation test project is picked up without having to make changes on the build server.  We dropped the code folder from the helix guidelines so our paths are as follows

`\Foundation\*\{YourCompany}.Foundation.*.Tests\bin\Release\{YourCompany}.Foundation.*.Tests.dll`
  
`\Feature\*\{YourCompany}.Feature.*.Tests\bin\Release\{YourCompany}.Feature.*.Tests.dll`
  
`\Feature\*\{YourCompany}.Feature.*.Intergration.Tests\bin\Release\{YourCompany}.Feature.*.Integration.Tests.dll`

We also run Code Coverage Analysis as part of this step with dotCover, again wild cards and a consistent naming convention are your friends as you tell dotCover which assemblies to run coverage against.

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/dotCover-Code-Coverage.png" data-rel="lightbox-image-6" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-717" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/dotCover-Code-Coverage.png?resize=640%2C243" alt="dotCover Code Coverage" width="640" height="243" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/dotCover-Code-Coverage.png?w=792 792w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/dotCover-Code-Coverage.png?resize=300%2C114 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/dotCover-Code-Coverage.png?resize=768%2C292 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

&nbsp;

### <span id="Team_City_Step_5_8211_Package_Serialized_Items">Team City Step 5 &#8211; Package Serialized Items</span>

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep5.png" data-rel="lightbox-image-7" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-669" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep5.png?resize=640%2C232" alt="" width="640" height="232" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep5.png?w=1325 1325w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep5.png?resize=300%2C109 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep5.png?resize=768%2C278 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep5.png?resize=1024%2C371 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

We are using <a href="https://github.com/kamsar/Unicorn" target="_blank" rel="noopener">Unicorn </a> by Sitecore MVP <a href="https://twitter.com/kamsar" target="_blank" rel="noopener">Kam Figy</a> for items serialization, this step uses the _**Push Packages**_ runner from the <a href="https://octopus.com/docs/api-and-integration/teamcity" target="_blank" rel="noopener">Team City plugin</a> by Octopus Deploy.

We are grabbing the serialized items on the build server and creating a zip file using the _**%system.GitVersion.NuGetVersion% **_parameter populated earlier by GitVersion Task.

`%system.teamcity.build.checkoutDir%/{SerilizaedItemsLocation}/** => SerializedItems.%system.GitVersion.NuGetVersion%.zip`

&nbsp;

### <span id="Team_City_Step_6_8211_Create_Release">Team City Step 6 &#8211; Create Release</span>

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Create-Release.png" data-rel="lightbox-image-8" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-709 size-full" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Create-Release.png?resize=640%2C464" alt="Create Octopus Deploy Release" width="640" height="464" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Create-Release.png?w=1085 1085w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Create-Release.png?resize=300%2C218 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Create-Release.png?resize=768%2C557 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Create-Release.png?resize=1024%2C743 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

This step is also from the <a href="https://octopus.com/docs/api-and-integration/teamcity" target="_blank" rel="noopener">Team City plugin from Octopus Deploy</a>, the _** OctopusDeploy: Create Release**_ runner as it sounds lets you create a release in Octopus directly from Team City, the project name should match the name you use in Octopus Deploy, the release number uses the**_ %system.GitVersion.NuGetVersion%_** parameter again.

We also pass additional parameters as follows, you can read more about them <a href="https://octopus.com/docs/api-and-integration/octo.exe-command-line/creating-releases" target="_blank" rel="noopener">here</a>

`--deploymenttimeout=00:40:00 --version=%system.GitVersion.NuGetVersion% --packageVersion=%system.GitVersion.NuGetVersion% --ignoreexisting`

&nbsp;

### <span id="Team_City_Step_7_8211_Deploy_Release">Team City Step 7 &#8211; Deploy Release</span>

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep7.png" data-rel="lightbox-image-9" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-671" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep7.png?resize=640%2C503" alt="" width="640" height="503" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep7.png?w=922 922w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep7.png?resize=300%2C236 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep7.png?resize=768%2C604 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

This step is also from the <a href="https://octopus.com/docs/api-and-integration/teamcity" target="_blank" rel="noopener">Team City plugin from Octopus Deploy</a>, the _** OctopusDeploy: Deploy Release**_ runner lets you deploy a Octopus release directly from Team City. Plug your _**Project**_ and **_Environment_** name from Octopus Deploy here to deploy the release created in the previous step.

&nbsp;

### <span id="Team_City_Step_8_8211_Run_UI_Tests">Team City Step 8 &#8211; Run UI Tests</span>

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep8.png" data-rel="lightbox-image-10" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-672" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep8.png?resize=640%2C513" alt="" width="640" height="513" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep8.png?w=843 843w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep8.png?resize=300%2C241 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCStep8.png?resize=768%2C616 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

This step use the _**NUnit **_ runner again, this time we execute another test library that runs selenium tests against the site we have just deployed. Plug in the path the the NUnit console tool reference from NuGet, eg _**packages\NUnit.ConsoleRunner.3.6.1\tools\nunit3-console.exe**_.
  
_**Path to application configuration file**_ is as it sounds the path to the config for your test assembly in the _**Run Tests from**_ field add the path to your test assembly.

&nbsp;

### <span id="Source_Control_Root">Source Control Root</span>

# <a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/VersionControlRoot.png" data-rel="lightbox-image-11" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-707" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/VersionControlRoot.png?resize=640%2C465" alt="Version Control Root" width="640" height="465" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/VersionControlRoot.png?w=817 817w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/VersionControlRoot.png?resize=300%2C218 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/VersionControlRoot.png?resize=768%2C558 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

Set this up to point to your source control repo in the _**Fetch URL **_ field and add your branch specifications, as this build is a release build we deploy our _**master **_branch_._

### <span id="VCS_Labelling">VCS Labelling</span>

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCLabelling.png" data-rel="lightbox-image-12" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-664" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCLabelling.png?resize=640%2C244" alt="" width="640" height="244" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCLabelling.png?w=816 816w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCLabelling.png?resize=300%2C114 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/07/TCLabelling.png?resize=768%2C293 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

This build feature allows you to label you the commit you have just created, this is then used by GitVersion when calculating the next release number.

### <span id="Team_City_Parameters">Team City Parameters</span>

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Team-City-Parameters.png" data-rel="lightbox-image-13" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-715 size-full" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Team-City-Parameters.png?resize=640%2C266" alt="Team City Parameters" width="640" height="266" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Team-City-Parameters.png?w=1343 1343w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Team-City-Parameters.png?resize=300%2C125 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Team-City-Parameters.png?resize=768%2C319 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Team-City-Parameters.png?resize=1024%2C425 1024w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/09/Team-City-Parameters.png?w=1280 1280w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

The rest of the parameters we have set up in Team City, mostly for GitVersion.

_**teamcity.git.fetchAllHeads**_ = true got around an issue we ran into calculating release numbers when we were deploying of something other than our master or develop branch.

Part two will follow detailing the Octopus Deploy setup.

&nbsp;

&nbsp;

 [1]: http://blog.wesleylomax.co.uk/2016/04/06/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-1/
 [2]: http://blog.wesleylomax.co.uk/2016/04/19/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-2/
 [3]: http://blog.wesleylomax.co.uk/2016/09/26/automatically-generating-semver-release-numbers-for-your-continuous-delivery-pipeline-with-gitversion-and-teamcity/