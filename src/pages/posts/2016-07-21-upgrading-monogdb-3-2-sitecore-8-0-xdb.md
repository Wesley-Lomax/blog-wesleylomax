---
title: Upgrading to MonogDB 3.2 for Sitecore 8.0 xDB
author: Wesley Lomax
type: post
featuredpost: false
date: 2016-07-21T14:52:17.000Z
url: /2016/07/21/upgrading-monogdb-3-2-sitecore-8-0-xdb/
categories:
  - MongoDB
  - Sitecore
  - xDB
tags:
  - MongoDB
  - Sitecore 8 Update 4
  - Sitecore 8.0
  - WiredTiger
templateKey: blog-post
---
If you are running Sitecore 8 Update 5 or less then you are likely running MongoDB 2.6 as the <a href="https://kb.sitecore.net/articles/087164" target="_blank" rel="noopener">compatibility table</a> states this is the only supported version since Sitecore XP 7.5.

However there are issues with <a href="https://www.mongodb.com/" target="_blank" rel="noopener">MongoDB </a>2.6 and Sitecore XP 7.5 and 8.0 that can lead to performance problems

&nbsp;

> Using this version of the Mongo C# driver may cause excessive connections being open to the xDB database, as well as performance degradation.

&nbsp;

> MongoDB 2.6 is scheduled for End Of Life after October, 2016 (<https://www.mongodb.com/blog/post/mongodb-2-6-end-of-life>). This would leave no supported MongoDB versions that are compatible with Sitecore 7.5 and early versions of Sitecore 8.0.

You can read in full <a href="https://kb.sitecore.net/articles/920798" target="_blank" rel="noopener">here</a>.

We were seeing issues with MongoDB under load, requests were backing up in the application and causing high CPU usage.

Just as there are benefits from updating the MongoDB.Driver version there are also performance benefits from upgrading to MongoDB 3.2

[<img class="alignnone wp-image-424" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/mongodb-30-1038x576.jpg?resize=640%2C355" alt="mongodb-30-1038x576" width="640" height="355" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/mongodb-30-1038x576.jpg?resize=1024%2C568 1024w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/mongodb-30-1038x576.jpg?resize=300%2C166 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/mongodb-30-1038x576.jpg?resize=768%2C426 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/07/mongodb-30-1038x576.jpg?resize=1038%2C576 1038w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" />][1]

So if you are on Sitecore 8.0 Update 4 or less and are not ready to upgrade to a higher version of Sitecore XP you can update the driver manually and use a new version of MongoDB.

&nbsp;

## Upgrading the MongoDB Driver

&nbsp;

  1. Update the <a href="https://www.nuget.org/packages/mongocsharpdriver/1.10.0" target="_blank" rel="noopener">Official .NET driver for MongoDB</a> to at least 1.10 using NuGet <pre class="brush: powershell; title: ; notranslate" title="">Install-Package mongocsharpdriver -Version 1.10.0</pre>

  2. Add bindingRedirects for the MongoDB Driver dlls <pre class="brush: xml; title: ; notranslate" title="">&lt;configuration&gt;
 &lt;runtime&gt;
 &lt;assemblyBinding&gt;
 ...
&lt;dependentAssembly&gt;
 &lt;assemblyIdentity name="MongoDB.Bson" publicKeyToken="f686731cfb9cc103" culture="Neutral" /&gt;&nbsp;
 &lt;bindingRedirect oldVersion="1.8.3.9" newVersion="1.10.0.62" /&gt;&nbsp;
 &lt;/dependentAssembly&gt;
 &lt;dependentAssembly&gt;
 &lt;assemblyIdentity name="MongoDB.Driver" publicKeyToken="f686731cfb9cc103" culture="Neutral" /&gt;&nbsp;
 &lt;bindingRedirect oldVersion="1.8.3.9" newVersion="1.10.0.62" /&gt;&nbsp;
 &lt;/dependentAssembly&gt;
  ...
 &lt;/assemblyBinding&gt;
 &lt;/runtime&gt;
&lt;/configuration&gt;
</pre>

## Upgrade MongoDB Database and Data

  1. Install a new version of MongoDB from <a href="https://www.mongodb.com/download-center?" target="_blank" rel="noopener">here</a>
  2. Open a Administrator CMD prompt
  3. Navigate to the 2.6 MongoDB install bin directory <pre class="brush: plain; title: ; notranslate" title="">cd C:\Program Files\MongoDB 2.6 Standard\bin </pre>

  4. Export all the 2.6 MongoDB data to disk so we can import it to the new WiredTiger storage engine <pre class="brush: plain; title: ; notranslate" title="">mongodump --out "C:\MongoDB\export"</pre>

  5. Stop your MongoDB 2.6 service
  6. Create the new folder structure for the WiredTired storage engine eg _C:\MongoDb\dataWT\db_  and _C:\MongoDb\dataWT\log_ **Note  **:- <tt class="docutils literal"><span class="pre">mongod</span></tt> with WiredTiger will not start with data files created with a different storage engine.
  7. Update your MongoDB config, **_mongod.cfg_**, file with the new properties for version 3.2, <a href="https://gist.github.com/Wesley-Lomax/d3f5e543bb82ee6c933bb96a37e66f6c" target="_blank" rel="noopener">here is a config file I used</a>.
  8. Start the new MongoDB 3.2 service.
  9. Open a Administrator CMD prompt
 10. Navigate to the new MongoDB install bin directory <pre class="brush: plain; title: ; notranslate" title="">cd C:\Program Files\MongoDB\Server\3.2\bin</pre>

 11. Run <pre class="brush: plain; title: ; notranslate" title="">mongorestore "C:\MongoDB\export" </pre>
    
    to import the old 2.6 Mongo DB data to the new WiredTiger format.</li> </ol> 
    
    When I ran through the process of upgrading a production instance the size of the MongoDB data folder was reduced from 4.5GB to 560MB, we also noticed improved performance of mongoDB  meaning threads were no longer backing up on the web server.
    
    ### References
    
    <li style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">
      <a href="https://docs.mongodb.com/manual/release-notes/3.0-upgrade/" target="_blank" rel="noopener">https://docs.mongodb.com/manual/release-notes/3.0-upgrade/<br /> </a>
    </li>
    <li style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">
      <a href="https://www.sitecoreblog.cz/en/sitecore-on-mongodb-3-0-what-should-you-know/" target="_blank" rel="noopener">https://www.sitecoreblog.cz/en/sitecore-on-mongodb-3-0-what-should-you-know/</a>
    </li>
    <li style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">
      <a href="https://blog.nomissolutions.com/labs/2015/04/07/write-performance-of-mongo-2-6-vs-mongo-3-0-wiredtiger/" target="_blank" rel="noopener">https://blog.nomissolutions.com/labs/2015/04/07/write-performance-of-mongo-2-6-vs-mongo-3-0-wiredtiger/</a>
    </li>
    <li style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">
      <a href="https://www.mongodb.com/blog/post/performance-testing-mongodb-30-part-1-throughput-improvements-measured-ycsb" target="_blank" rel="noopener">https://www.mongodb.com/blog/post/performance-testing-mongodb-30-part-1-throughput-improvements-measured-ycsb</a>
    </li>
    
    &nbsp;

 [1]: https://www.mongodb.com/blog/post/announcing-mongodb-30