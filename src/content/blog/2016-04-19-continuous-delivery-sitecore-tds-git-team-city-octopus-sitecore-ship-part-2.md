---
title: Continuous Delivery with Sitecore, TDS, Git, Team City, Octopus and Sitecore Ship Part 2
author: Wesley Lomax
type: post
featuredpost: false
date: 2016-04-19T13:17:08.000Z
url: /2016/04/19/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-2/
featuredimage: /img/freighter.jpg
categories:
  - Continuous Delivery
tags:
  - Config
  - Continuous Delivery
  - Octopus Deploy
  - PowerShell
  - Sitecore
  - Sitecore Ship
templateKey: blog-post
---

<div id="toc_container" class="toc_wrap_right no_bullets">
  <p class="toc_title">
    Post Contents
  </p>
  
  <ul class="toc_list">
    <li>
      <a href="#Continuous_Delivery_with_Sitecore_Part_2_8211_Octopus_Deploy_Setup"><span class="toc_number toc_depth_1">1</span> Continuous Delivery with Sitecore Part 2 &#8211; Octopus Deploy Setup</a><ul>
        <li>
          <a href="#Configure_Octopus_to_be_able_to_read_the_NuGet_feed_from_TeamCity"><span class="toc_number toc_depth_2">1.1</span> Configure Octopus to be able to read the NuGet feed from TeamCity.</a>
        </li>
        <li>
          <a href="#Deploy_theSitecore_code_created_by_OctoPack_in_the_Build_Solution_step_on_TeamCity"><span class="toc_number toc_depth_2">1.2</span> Deploy the Sitecore code created by OctoPack in the Build Solution step on TeamCity.</a><ul>
            <li>
              <a href="#Key_Settings"><span class="toc_number toc_depth_3">1.2.1</span> Key Settings:-</a>
            </li>
            <li>
              <a href="#Deploy_the_NuGet_package_containing_the_update_file_of_your_TDS_items"><span class="toc_number toc_depth_3">1.2.2</span> Deploy the NuGet package containing the .update file of your TDS items.</a>
            </li>
            <li>
              <a href="#Key_Settings-2"><span class="toc_number toc_depth_3">1.2.3</span> Key Settings:-</a>
            </li>
          </ul>
        </li>
        
  <li>
   <a href="#Install_the_update_package_into_Sitecore_using_SitecoreShip_Curl_and_PowerShell"><span class="toc_number toc_depth_2">1.3</span> Install the .update package into Sitecore using Sitecore.Ship, Curl and PowerShell.</a><ul>
  <li>
    <a href="#Key_Settings-3"><span class="toc_number toc_depth_3">1.3.1</span> Key Settings:-</a>
            </li>
          </ul>
        </li>
        
   <li>
          <a href="#Run_a_Publish_in_Sitecore_using_SitecoreShip_Curl_and_PowerShell"><span class="toc_number toc_depth_2">1.4</span> Run a Publish in Sitecore using Sitecore.Ship, Curl and PowerShell.</a><ul>
            <li>
              <a href="#Key_Settings-4"><span class="toc_number toc_depth_3">1.4.1</span> Key Settings:-</a>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>

## <span id="Continuous_Delivery_with_Sitecore_Part_2_8211_Octopus_Deploy_Setup">Continuous Delivery with Sitecore Part 2 &#8211; Octopus Deploy Setup</span>

&nbsp;

In Part 2 I&#8217;ll walk through the <a href="https://octopus.com/" target="_blank">Octopus Deploy</a> configuration where we use PowerShell, <a href="https://github.com/kevinobee/Sitecore.Ship" target="_blank">Sitecore.Ship</a> and Curl to install the Team Development for Sitecore Packages and publish the changes, if you are looking for the TeamCity configuration see <a href="http://blog.wesleylomax.co.uk/2016/04/06/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-1/" target="_blank">Part 1</a>

&nbsp;

### <span id="Configure_Octopus_to_be_able_to_read_the_NuGet_feed_from_TeamCity">Configure Octopus to be able to read the NuGet feed from TeamCity.</span>

&nbsp;

![Nuget-Feed](/img/Nuget-Feed.png)

See the TeamCity <a href="https://confluence.jetbrains.com/display/TCD9/NuGet#NuGet-UsingTeamCityasNuGetServer" target="_blank">documentation </a>for more details on how to set up TeamCity as a NuGet server and to get your URL.

&nbsp;

### <span id="Deploy_theSitecore_code_created_by_OctoPack_in_the_Build_Solution_step_on_TeamCity">Deploy the Sitecore code created by OctoPack in the Build Solution step on TeamCity.</span>

![DeploySiteCode-1](/img/DeploySiteCode-1.png)

&nbsp;

#### <span id="Key_Settings"><strong>Key Settings:-</strong></span>

1. Roles &#8211; _Content Management_ and _Content Delivery_ (i.e deploy code to all servers)
2. Package Feed &#8211; The external feed added previously to the TeamCity Build server
3. Package ID &#8211; Name of the code package to deploy. You can search the TeamCity feed in Octopus by going to Library -> External Feeds. Click the test button next to the feed you created.
4. Install to &#8211; Root of Website directory configured in IIS.
5. Target Files &#8211; List of files for Octopus to parse and replace with <a class="external-link" href="http://docs.octopusdeploy.com/display/OD/Substitute+Variables+in+Files" rel="nofollow">configured Octopus variables</a>.

&nbsp;

#### <span id="Deploy_the_NuGet_package_containing_the_update_file_of_your_TDS_items">Deploy the NuGet package containing the .update file of your TDS items.</span>

![Deploy-TDS-Package](/img/Deploy-TDS-Package.png)

&nbsp;

#### <span id="Key_Settings-2"><strong>Key Settings:-</strong></span>

1. Roles &#8211; _Content Management_ only the Content Management server requires the update package.
2. Package Feed &#8211; The external feed added previously to the TeamCity Build server
3. Package ID &#8211; Name of the TDS NuGet package to deploy.

&nbsp;

### <span id="Install_the_update_package_into_Sitecore_using_SitecoreShip_Curl_and_PowerShell">Install the .update package into Sitecore using Sitecore.Ship, Curl and PowerShell.</span>

&nbsp;

![Install-TDS-UpdatePacakge](/img/Install-TDS-UpdatePacakge.png)

&nbsp;

<script src="https://gist.github.com/Wesley-Lomax/e5c6ea1cc4663a4d37f1.js"></script>

#### <span id="Key_Settings-3"><strong>Key Settings:-</strong></span>

1. Roles &#8211; \_Content Managemen_t only the Content Management server requires the update package.
2. Run on &#8211; Set to deployment target means PowerShell script will be executed on the Octopus tentacle.
3. Script Type &#8211; PowerShell

&nbsp;

_Note &#8211; Each Server where you wish to execute this script will need Curl installed &#8211; <a href="https://curl.haxx.se/download.html" target="_blank">https://curl.haxx.se/download.html</a>_

&nbsp;

### <span id="Run_a_Publish_in_Sitecore_using_SitecoreShip_Curl_and_PowerShell">Run a Publish in Sitecore using Sitecore.Ship, Curl and PowerShell.</span>

&nbsp;

![Site-Publish](/img/Site-Publish.png)

<script src="https://gist.github.com/Wesley-Lomax/ce0e6da7870d0cbcf820.js"></script>

&nbsp;

#### <span id="Key_Settings-4">Key Settings:-</span> {#Install&ConfigureOctopusDeploy-KeySettings:-.2}

1. Roles &#8211; *Content Management* only need to execute the publish on the Content Management server.
2. Run on &#8211; Set to deployment target means PowerShell script will be executed on the Octopus tentacle.
3. Script Type &#8211; PowerShell

Note &#8211; Each Server where you wish to execute this script will need Curl installed &#8211; 
<a href="https://curl.haxx.se/download.html" target="_blank">https://curl.haxx.se/download.html</a>

&nbsp;

With the steps from this post and <a href="http://blog.wesleylomax.co.uk/2016/04/06/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-1/" target="_blank">Part 1</a> you will have a build process in place that will take your code, build it, run the unit tests, create the required NuGet packages and deploy them to the appropriate server roles, install the .update package and publish the changes. Happy Deployments!
