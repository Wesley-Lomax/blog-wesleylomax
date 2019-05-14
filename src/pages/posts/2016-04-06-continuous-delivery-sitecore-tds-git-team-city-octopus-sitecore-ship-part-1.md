---
title: Continuous Delivery with Sitecore, TDS, Git, Team City, Octopus and Sitecore Ship Part 1
author: Wesley Lomax
type: post
featuredpost: false
date: 2016-04-06T10:03:10.000Z
url: /2016/04/06/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-1/
featured_image: /img/courier-1214227_1920.jpg
categories:
  - Continuous Delivery
tags:
  - Continuous Delivery
  - Octopus Deploy
  - Sitecore Ship
  - TDS
  - Team City
templateKey: blog-post
---

<div id="toc_container" class="toc_wrap_right no_bullets">
  <p class="toc_title">
    Contents
  </p>
  
  <ul class="toc_list">
    <li>
      <a href="#What_is_ContinuousDelivery"><span class="toc_number toc_depth_1">1</span> What is Continuous Delivery?</a><ul>
        <li>
          <a href="#Software_Used"><span class="toc_number toc_depth_2">1.1</span> Software Used</a>
        </li>
      </ul>
    </li>
    
  <li>
   <a href="#Configure_TeamCity"><span class="toc_number toc_depth_1">2</span> Configure TeamCity</a><ul>
    <li>
     <ul>
        <li>
              <a href="#Key_Settings"><span class="toc_number toc_depth_3">2.0.1</span> Key Settings</a>
            </li>
            <li>
              <a href="#Key_Settings-2"><span class="toc_number toc_depth_3">2.0.2</span> Key Settings</a>
            </li>
            <li>
              <a href="#Key_Settings-3"><span class="toc_number toc_depth_3">2.0.3</span> Key Settings</a>
            </li>
            <li>
              <a href="#Key_Settings-4"><span class="toc_number toc_depth_3">2.0.4</span> Key Settings</a>
            </li>
            <li>
              <a href="#Key_Settings-5"><span class="toc_number toc_depth_3">2.0.5</span> Key Settings</a>
            </li>
            <li>
              <a href="#Key_Settings-6"><span class="toc_number toc_depth_3">2.0.6</span> Key Settings</a>
            </li>
            <li>
              <a href="#Key_Settings-7"><span class="toc_number toc_depth_3">2.0.7</span> Key Settings</a>
            </li>
          </ul>
        </li>
        
   <li>
     <a href="#References"><span class="toc_number toc_depth_2">2.1</span> References</a>
    </li>
   </ul>
 </li>
 </ul>
</div>

There have been many posts on this topic around the Sitecore community and I&#8217;ve used bits from a few different posts that I&#8217;ve added under the references heading [below][1].

This post details the process I&#8217;ve used recently  for deployments with Sitecore, Team Deployment for Sitecore (TDS), Git, TeamCity, Octopus Deploy and Sitecore Ship.

## <span id="What_is_ContinuousDelivery">What is Continuous Delivery?</span>

> Continuous Delivery is a software development discipline where you build software in such a way that the software can be released to production at any time.
>
> <a href="http://martinfowler.com/bliki/ContinuousDelivery.html" target="_blank" rel="noopener">Martin Fowler</a>

### <span id="Software_Used">Software Used</span>

- <a href="https://github.com/" target="_blank" rel="noopener">Git</a>
- <a href="https://www.jetbrains.com/teamcity/" target="_blank" rel="noopener">TeamCity</a>
- <a href="http://docs.octopusdeploy.com/display/OD/TeamCity" target="_blank" rel="noopener">TeamCity Plugin for Octopus deploy</a>
- <a href="https://octopus.com/" target="_blank" rel="noopener">Octopus Deploy</a>
- <a href="https://github.com/kevinobee/Sitecore.Ship" target="_blank" rel="noopener">Sitecore Ship</a>
- <a href="https://www.teamdevelopmentforsitecore.com/" target="_blank" rel="noopener">Team Development for Sitecore (TDS)</a>

I&#8217;ll assume you have TeamCity and the TeamCity Plugin for Octopus deploy but the guides are <a href="https://confluence.jetbrains.com/display/TCD9/Installing+and+Configuring+the+TeamCity+Server" target="_blank" rel="noopener">Install Team City</a> and <a href="http://docs.octopusdeploy.com/display/OD/TeamCity" target="_blank" rel="noopener">Install the Octopus Plugin for TeamCity</a>.

## <span id="Configure_TeamCity">Configure TeamCity</span>

###1. Setup the Version Control Software 

Here I have used Git adding the project Url, branch and credentials.

![TC-VCS](/img/TC-VCS.png)

#### <span id="Install&ConfigureTeamCity-KeySettings">Key Settings</span>

- Fetch Url &#8211; Url to the source control repository
- Authentication method &#8211; If you choose Password you will need an account with access to the source control repository.


###2. The TeamCity Build Steps look like this:-
  * Restore NuGet Packages

  ![RestoreNugetPacakages](/img/RestoreNugetPacakages.png)

#### <span id="Key_Settings-2">Key Settings</span>
- Runner Type &#8211; Choose Nuget Installer
- Path to Solution File &#8211; Click the Tree List Icon to browse to the sln file.
- Update Mode &#8211; Choose Update via packages.config file



###3. Build the Solution and Run OctoPack
  
![BuildSolution](/img/BuildSolution.png)

#### <span id="Key_Settings-3">Key Settings</span>

- Runner Type -MSBuild
- Build File Path- Click the Tree List Icon to browse to the sln file.
- MSBuild Version &#8211; Same as your solution.
- Command line parameters &#8211; Passing Configuration = Release as a parameter to MSBuild with **_/P:Configuration=Release_**
- Run OctoPack &#8211; Enable to create a package to use in Ocotpus
- OctoPack package version &#8211; Use the build number from the team City build with the _**%build.number%**_ parameter

###4. Run Unit Tests

![RunUnitTests-1](/img/RunUnitTests-1.png)

#### <span id="Key_Settings-4">Key Settings</span>

- Runner Type -NUnit
- Run Tests from- Path to your test project dll relative to your project root.

###5. Package up the TDS .update file using NuGet

![Nuget-Pack-TDS-Content-Update-Package-1](/img/Nuget-Pack-TDS-Content-Update-Package-1.png)

#### <span id="Key_Settings-5">Key Settings</span>

- Runner Type -NuGet Pack
- Specification Files- Use the Tree List Icon to browse to the nuspec file for the update package to create a NuGet package.
- Version &#8211; Use the build number from the team City build with the ***%build.number%*** parameter

###6.Create a release in Octopus Deploy

![Octopus-Create-Release](/img/Octopus-Create-Release.png)

#### <span id="Key_Settings-6">Key Settings</span>

- Runner Type -Octopus Deploy: Create Release
- Octopus Url &#8211; Url for the Octopus Server
- API Key &#8211; Generate yours from the Octopus server follow <a class="external-link" href="http://docs.octopusdeploy.com/display/OD/How+to+create+an+API+key" target="_blank" rel="nofollow noopener">these instructions</a>

###7. Deploy to required environment from Octopus.

- Deploy the newly created release in Octopus.

![Octopus-Deploy-Release](/img/Octopus-Deploy-Release.png)

#### <span id="Key_Settings-7">Key Settings</span>

- Runner Type -Octopus Deploy: Deploy Release
- Octopus Url &#8211; Url for the Octopus Server
- API Key &#8211; Use previously generated key.
- Release number &#8211; Use Team City Parameter &#8211; _**%latest%**_
- Deploy to &#8211; Required Environment from Octopus.</ol> </li> </ol>

Part 2 will Cover the Octopus Deploy process, variables and the PowerShell scripts to install the update packages created here.

### <span id="References"><a id="references"></a>References</span>

- <a href="http://www.bradcurtis.com/sitecore-automated-deployments-with-tds-web-deploy-and-sitecore-ship/" target="_blank" rel="noopener">http://www.bradcurtis.com/sitecore-automated-deployments-with-tds-web-deploy-and-sitecore-ship/</a>
- <a href="http://blog.marcduiker.nl/2015/10/31/ruling-the-continuous-integration-seas-with-sitecore-ship-part-2.html" target="_blank" rel="noopener">http://blog.marcduiker.nl/2015/10/31/ruling-the-continuous-integration-seas-with-sitecore-ship-part-2.html</a>
- <a href="https://github.com/kevinobee/Sitecore.Ship/wiki" target="_blank" rel="noopener">https://github.com/kevinobee/Sitecore.Ship/wiki</a>
- <a href="http://goblinrockets.com/2013/11/03/continuous-integration-deployment-with-sitecore/" target="_blank" rel="noopener">http://goblinrockets.com/2013/11/03/continuous-integration-deployment-with-sitecore/ </a>

[1]: #references