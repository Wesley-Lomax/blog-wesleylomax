---
title: Continuous Delivery with Sitecore Revisited – Team City
author: Wesley Lomax
type: post
featuredpost: false
featuredimage: /img/TeamCityProcess.png
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

Since then I&#8217;ve tweaked the deployment process and made significant changes to the solution being deployed, we refactored to be more inline with Sitecore&#8217;s <a href="http://helix.sitecore.net/" target="_blank" rel="noopener">Helix </a>standards, <a href="https://blog.wesleylomax.co.uk/posts/2017-08-07-cardiff-sitecore-technical-user-group-august-2017/" target="_blank" rel="noopener">I gave a talk about this at the Sitecore User Group in Cardiff</a>, and changed our item serialization provider, so I wanted to share an update of how the process looks now.

The deployment tools are the same so we use <a href="https://www.jetbrains.com/teamcity/" target="_blank" rel="noopener">Team City</a> for CI and building our release and <a href="https://octopus.com/" target="_blank" rel="noopener">Octopus Deploy</a> to push the releases through our environments.

The overall process for the release build looks like this:-

![TeamCityProcess](/img/TeamCityProcess.png)

Below  I will go into more detail about each step and pick out some of the key settings.

### <span id="Team_City_Step_1_8211_Restore_NuGet_Packages">Team City Step 1 &#8211; Restore NuGet Packages</span>

![TCStep1](/img/TCStep1.png)

This step uses the** _NuGet Installer_** runner and you need to provide the _**Path to Solution**_ parameter for your *.sln file so it can fetch your NuGet packages on the build server.

&nbsp;

### <span id="Team_City_Step_2_8211_GitVersion">Team City Step 2 &#8211; GitVersion</span>

![TCStep2](/img/TCStep2.png)

GitVersion enables Easy Semantic Versioning in your release pipeline, I&#8217;ve gone in to more details in another post [here ][3] or you can checkout the GitHub repo for more details <https://github.com/GitTools/GitVersion>, this step requires the <a href="https://www.nuget.org/packages/GitVersionTask" target="_blank" rel="noopener">GitVersionTask Nuget package</a>.

The main setup for Team City is adding a _**Command Line**_ runner, the _**Command executable**_ is **_GitVersion_** and the **Command Parameters** are

`. /updateAssemblyInfo /output buildserver`

#### <span id="Parameters_for_GitVersion">Parameters for GitVersion</span>

GitVersion also requires you create several parameters so it can populate them when this task is executed, you can then use them for the rest of the build process

![GitVersion-Parameters](/img/GitVersion-Parameters.png)


**system.Git_Branch** &#8211; Is your branch TeamCity is using for the build, you will get autocomplete on this as its a TeamCity parameter.

**system.GitVersion.FullSemVer** &#8211; FullSemVer will also include build metadata: `{major}.{minor}.{patch}-{tag}+{buildmetadata}`

**system.GitVersion.NuGetVersion** &#8211;  **NuGetVersion** variable to have the version formatted in a NuGet compatible way, so `1.0.1-rc.1+5` would become `1.0.1-rc0001`

_**system.GitVersion.SemVer**_ &#8211; SemVer will be in the format `{major}.{minor}.{patch}-{tag}`

&nbsp;

### <span id="Team_City_Step_3_8211_Build_Solution_and_Run_OctoPack">Team City Step 3 &#8211; Build Solution and Run OctoPack</span>

![TCStep3](/img/TCStep3.png)

This step uses the _**MSBuild**_ runner type, two parameters are passed to this _**/P:Configuration=Release**_ to run a release build and _**/p:OctoPackEnforceAddingFiles=true**_.

From the OctoPack documentation &#8211; <https://octopus.com/docs/packaging-applications/nuget-packages/using-octopack>

> If the `<files>` section exists, OctoPack by default won&#8217;t attempt to automatically add any extra files to your package, so you&#8217;ll need to be explicit about which files you want to include. You can override this behavior with `/p:OctoPackEnforceAddingFiles=true` which will instruct OctoPack to package a combination of files using its conventions, and those defined by your `<files>` section.

We are also running OctoPack here, you can see the checkbox enabled and using the TeamCity parameter _**%system.GitVersion.NuGetVersion%**_ for the build number that was populated in step two.

### <span id="Team_City_Step_4_8211_Run_Unit_Tests_and_Code_Coverage_Analysis">Team City Step 4 &#8211; Run Unit Tests and Code Coverage Analysis</span>

![RunUnitTests](/img/RunUnitTests.png)

We are using NUnit for our tests so we use the built in _**NUnit**_ runner task, plug in the path the the NUnit console tool referenced from NuGet, **_packages\NUnit.ConsoleRunner.3.6.1\tools\nunit3-console.exe._**

In the **_Run tests from_** field wildcards are your friend, Helix has a consistent project and folder structure you can use this consistency to ensure any new Feature or Foundation test project is picked up without having to make changes on the build server.  We dropped the code folder from the helix guidelines so our paths are as follows

`\Foundation\*\{YourCompany}.Foundation.*.Tests\bin\Release\{YourCompany}.Foundation.*.Tests.dll`
  
`\Feature\*\{YourCompany}.Feature.*.Tests\bin\Release\{YourCompany}.Feature.*.Tests.dll`
  
`\Feature\*\{YourCompany}.Feature.*.Intergration.Tests\bin\Release\{YourCompany}.Feature.*.Integration.Tests.dll`

We also run Code Coverage Analysis as part of this step with dotCover, again wild cards and a consistent naming convention are your friends as you tell dotCover which assemblies to run coverage against.

![dotCover-Code-Coverage](/img/dotCover-Code-Coverage.png)

&nbsp;

&nbsp;

### <span id="Team_City_Step_5_8211_Package_Serialized_Items">Team City Step 5 &#8211; Package Serialized Items</span>

![TCStep5](/img/TCStep5.png)

We are using <a href="https://github.com/kamsar/Unicorn" target="_blank" rel="noopener">Unicorn </a> by Sitecore MVP <a href="https://twitter.com/kamsar" target="_blank" rel="noopener">Kam Figy</a> for items serialization, this step uses the _**Push Packages**_ runner from the <a href="https://octopus.com/docs/api-and-integration/teamcity" target="_blank" rel="noopener">Team City plugin</a> by Octopus Deploy.

We are grabbing the serialized items on the build server and creating a zip file using the _**%system.GitVersion.NuGetVersion%**_ parameter populated earlier by GitVersion Task.

`%system.teamcity.build.checkoutDir%/{SerilizaedItemsLocation}/** => SerializedItems.%system.GitVersion.NuGetVersion%.zip`

&nbsp;

### <span id="Team_City_Step_6_8211_Create_Release">Team City Step 6 &#8211; Create Release</span>

![Create-Release](/img/Create-Release.png)

This step is also from the <a href="https://octopus.com/docs/api-and-integration/teamcity" target="_blank" rel="noopener">Team City plugin from Octopus Deploy</a>, the _** OctopusDeploy: Create Release**_ runner as it sounds lets you create a release in Octopus directly from Team City, the project name should match the name you use in Octopus Deploy, the release number uses the**_ %system.GitVersion.NuGetVersion%_** parameter again.

We also pass additional parameters as follows, you can read more about them <a href="https://octopus.com/docs/api-and-integration/octo.exe-command-line/creating-releases" target="_blank" rel="noopener">here</a>

`--deploymenttimeout=00:40:00 --version=%system.GitVersion.NuGetVersion% --packageVersion=%system.GitVersion.NuGetVersion% --ignoreexisting`

&nbsp;

### <span id="Team_City_Step_7_8211_Deploy_Release">Team City Step 7 &#8211; Deploy Release</span>

![TCStep7](/img/TCStep7.png)

This step is also from the <a href="https://octopus.com/docs/api-and-integration/teamcity" target="_blank" rel="noopener">Team City plugin from Octopus Deploy</a>, the _**OctopusDeploy: Deploy Release**_ runner lets you deploy a Octopus release directly from Team City. Plug your _**Project**_ and **_Environment_** name from Octopus Deploy here to deploy the release created in the previous step.

&nbsp;

### <span id="Team_City_Step_8_8211_Run_UI_Tests">Team City Step 8 &#8211; Run UI Tests</span>

![TCStep8](/img/TCStep8.png)

This step use the _**NUnit**_ runner again, this time we execute another test library that runs selenium tests against the site we have just deployed. Plug in the path the the NUnit console tool reference from NuGet, eg _**packages\NUnit.ConsoleRunner.3.6.1\tools\nunit3-console.exe**_.
  
_**Path to application configuration file**_ is as it sounds the path to the config for your test assembly in the _**Run Tests from**_ field add the path to your test assembly.

&nbsp;

### <span id="Source_Control_Root">Source Control Root</span>

![VersionControlRoot](/img/VersionControlRoot.png)

Set this up to point to your source control repo in the _**Fetch URL**_ field and add your branch specifications, as this build is a release build we deploy our _**master**_ branch.

### <span id="VCS_Labelling">VCS Labelling</span>

![Team City Labelling](/img/TCLabelling.png)

This build feature allows you to label you the commit you have just created, this is then used by GitVersion when calculating the next release number.

### <span id="Team_City_Parameters">Team City Parameters</span>

![Team-City-Parameters](/img/Team-City-Parameters.png)

The rest of the parameters we have set up in Team City, mostly for GitVersion.

_**teamcity.git.fetchAllHeads = true**_ got around an issue we ran into calculating release numbers when we were deploying of something other than our master or develop branch.

Part two will follow detailing the Octopus Deploy setup.

 [1]: http://blog.wesleylomax.co.uk/2016/04/06/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-1/
 [2]: http://blog.wesleylomax.co.uk/2016/04/19/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-2/
 [3]: http://blog.wesleylomax.co.uk/2016/09/26/automatically-generating-semver-release-numbers-for-your-continuous-delivery-pipeline-with-gitversion-and-teamcity/