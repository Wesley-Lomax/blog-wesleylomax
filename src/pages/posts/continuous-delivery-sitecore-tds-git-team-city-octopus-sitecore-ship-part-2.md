---
title: Continuous Delivery with Sitecore, TDS, Git, Team City, Octopus and Sitecore Ship Part 2
author: Wesley Lomax
type: post
date: 2016-04-19T13:17:08+00:00
url: /2016/04/19/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-2/
featured_image: http://blog.wesleylomax.co.uk/wp-content/uploads/2016/04/freighter.jpg
categories:
  - Continuous Delivery
tags:
  - Config
  - Continuous Delivery
  - Octopus Deploy
  - PowerShell
  - Sitecore
  - Sitecore Ship

---
<div id="toc_container" class="toc_wrap_right no_bullets">
  <p class="toc_title">
    Contents
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

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Nuget-Feed.png" rel="attachment wp-att-288" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-288" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Nuget-Feed.png?resize=640%2C250" alt="Nuget Feed" width="640" height="250" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Nuget-Feed.png?w=989 989w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Nuget-Feed.png?resize=300%2C117 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Nuget-Feed.png?resize=768%2C301 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

See the TeamCity <a href="https://confluence.jetbrains.com/display/TCD9/NuGet#NuGet-UsingTeamCityasNuGetServer" target="_blank">documentation </a>for more details on how to set up TeamCity as a NuGet server and to get your URL.

&nbsp;

### <span id="Deploy_theSitecore_code_created_by_OctoPack_in_the_Build_Solution_step_on_TeamCity">Deploy the Sitecore code created by OctoPack in the Build Solution step on TeamCity.</span>

### <a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/DeploySiteCode-1.png" rel="attachment wp-att-289" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-289" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/DeploySiteCode-1.png?resize=640%2C1431" alt="Deploy Site Code Octopus Settings" width="640" height="1431" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/DeploySiteCode-1.png?w=923 923w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/DeploySiteCode-1.png?resize=134%2C300 134w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/DeploySiteCode-1.png?resize=768%2C1717 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/DeploySiteCode-1.png?resize=458%2C1024 458w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

#### <span id="Key_Settings"><strong>Key Settings:-</strong></span>

  1. Roles &#8211; _Content Management_ and _Content Delivery_ (i.e deploy code to all servers)
  2. Package Feed &#8211; The external feed added previously to the TeamCity Build server
  3. Package ID &#8211; Name of the code package to deploy. You can search the TeamCity feed in Octopus by going to Library -> External Feeds. Click the test button next to the feed you created.
  4. Install to &#8211; Root of Website directory configured in IIS.
  5. Target Files &#8211; List of files for Octopus to parse and replace with <a class="external-link" href="http://docs.octopusdeploy.com/display/OD/Substitute+Variables+in+Files" rel="nofollow">configured Octopus variables</a>.

&nbsp;

#### <span id="Deploy_the_NuGet_package_containing_the_update_file_of_your_TDS_items">Deploy the NuGet package containing the .update file of your TDS items.</span>

### <a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Deploy-TDS-Package.png" rel="attachment wp-att-283" data-rel="lightbox-image-2" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-283" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Deploy-TDS-Package.png?resize=640%2C381" alt="Deploy TDS Package" width="640" height="381" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Deploy-TDS-Package.png?w=933 933w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Deploy-TDS-Package.png?resize=300%2C178 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Deploy-TDS-Package.png?resize=768%2C457 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

#### <span id="Key_Settings-2"><strong>Key Settings:-</strong></span>

  1. Roles &#8211; _Content Management_ only the Content Management server requires the update package.
  2. Package Feed &#8211; The external feed added previously to the TeamCity Build server
  3. Package ID &#8211; Name of the TDS NuGet package to deploy.

&nbsp;

### <span id="Install_the_update_package_into_Sitecore_using_SitecoreShip_Curl_and_PowerShell">Install the .update package into Sitecore using Sitecore.Ship, Curl and PowerShell.</span>

&nbsp;

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Install-TDS-UpdatePacakge.png" rel="attachment wp-att-281" data-rel="lightbox-image-3" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-281" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Install-TDS-UpdatePacakge.png?resize=640%2C231" alt="Install TDS UpdatePacakge" width="640" height="231" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Install-TDS-UpdatePacakge.png?w=1270 1270w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Install-TDS-UpdatePacakge.png?resize=300%2C108 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Install-TDS-UpdatePacakge.png?resize=768%2C277 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Install-TDS-UpdatePacakge.png?resize=1024%2C369 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/e5c6ea1cc4663a4d37f1">Gist</a>.
  </noscript>
</div>

#### <span id="Key_Settings-3"><strong>Key Settings:-</strong></span>

  1. Roles &#8211; _Content Managemen_t only the Content Management server requires the update package.
  2. Run on &#8211; Set to deployment target means PowerShell script will be executed on the Octopus tentacle.
  3. Script Type &#8211; PowerShell

&nbsp;

_Note &#8211; Each Server where you wish to execute this script will need Curl installed &#8211; <a href="https://curl.haxx.se/download.html" target="_blank">https://curl.haxx.se/download.html</a>_

&nbsp;

### <span id="Run_a_Publish_in_Sitecore_using_SitecoreShip_Curl_and_PowerShell">Run a Publish in Sitecore using Sitecore.Ship, Curl and PowerShell.</span>

&nbsp;

### <a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Site-Publish.png" rel="attachment wp-att-284" data-rel="lightbox-image-4" data-rl\_title="" data-rl\_caption="" title=""><img class="size-full wp-image-284 alignleft" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Site-Publish.png?resize=640%2C391" alt="Site Publish" width="640" height="391" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Site-Publish.png?w=757 757w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/04/Site-Publish.png?resize=300%2C183 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

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

&nbsp;

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/ce0e6da7870d0cbcf820">Gist</a>.
  </noscript>
</div>

&nbsp;

#### <span id="Key_Settings-4">Key Settings:-</span> {#Install&ConfigureOctopusDeploy-KeySettings:-.2}

  1. Roles &#8211; _Content Management_ only need to execute the publish on the Content Management server.
  2. Run on &#8211; Set to deployment target means PowerShell script will be executed on the Octopus tentacle.
  3. Script Type &#8211; PowerShell

_Note &#8211; Each Server where you wish to execute this script will need Curl installed &#8211; <a href="https://curl.haxx.se/download.html" target="_blank">https://curl.haxx.se/download.html</a>_

&nbsp;

With the steps from this post and <a href="http://blog.wesleylomax.co.uk/2016/04/06/continuous-delivery-sitecore-tds-git-team-city-octopus-sitecore-ship-part-1/" target="_blank">Part 1</a> you will have a build process in place that will take your code, build it, run the unit tests, create the required NuGet packages and deploy them to the appropriate server roles, install the .update package and publish the changes. Happy Deployments!