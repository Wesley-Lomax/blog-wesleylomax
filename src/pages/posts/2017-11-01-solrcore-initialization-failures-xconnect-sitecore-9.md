---
title: SolrCore Initialization Failures – xConnect Sitecore 9
author: Wesley Lomax
type: post
featuredpost: false
featuredimage: /img/search.png
date: 2017-11-01T16:06:46.000Z
url: /2017/11/01/solrcore-initialization-failures-xconnect-sitecore-9/
categories:
  - Sitecore
  - Solr
  - xConnect
tags:
  - Sitecore 9.0
  - Solr 6.6.1
  - xConnect
templateKey: blog-post

---
Since <a href="https://www.sitecore.net/company/press-and-media/press-releases/2017/10/new-sitecore-experience-cloud-transforms-digital-experiences" target="_blank" rel="noopener">Sitecore 9 was released a few weeks back</a>, I&#8217;ve been digging into the new release and there are lots of new things to play with. One of the most interesting new features is xConnect, a framework of rich APIs and services that allows users to integrate customer interaction data collected by Sitecore with customer data from nearly any third-party system or channel.

xConnect brings with it a separately hosted IIS site, additional Solr cores and a couple of other applications more details are available in the <a href="https://doc.sitecore.net/developers/xp/index.htmlhttps://doc.sitecore.net/developers/xp/index.html" target="_blank" rel="noopener">Developer Center.</a>

The release of Sitecore 9 also brought a new way to install Sitecore the Sitecore Installation Framework (SIF), you can read more about that in the <a href="https://dev.sitecore.net/Downloads/Sitecore_Experience_Platform/90/Sitecore_Experience_Platform_90_Initial_Release.aspx" target="_blank" rel="noopener">installation guide</a>.

After installing Sitecore 9 locally using SIF, I wanted to make changes to the connection strings used in the installation rather than using a sql user I wanted to use the App Pool user so I removed the user id and password and added **Trusted_Connection=True;**

This change ended up breaking my Solr core for xDB called {siteprefix}_xdb, the logs pointed to a Solr error and opening Solr showed the message :-

<pre>SolrCore Initialization Failures 
{siteprefix}_xdb: org.apache.solr.common.SolrException:org.apache.solr.common.SolrException: Error opening new searcher 
Please check your logs for more information</pre>

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Initalization-Failure.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-758 " src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Initalization-Failure.png?resize=640%2C99" alt="" width="640" height="99" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Initalization-Failure.png?w=1710 1710w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Initalization-Failure.png?resize=300%2C46 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Initalization-Failure.png?resize=768%2C119 768w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Initalization-Failure.png?resize=1024%2C158 1024w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Initalization-Failure.png?w=1280 1280w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

So I checked my Solr logs &#8211; <a href="https://localhost:8983/solr/#/~logging" target="_blank" rel="noopener">https://localhost:8983/solr/#/~logging</a> and found some more details on the error.

&nbsp;

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Unable-to-create-core.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-760" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Unable-to-create-core.png?resize=640%2C49" alt="" width="640" height="49" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Unable-to-create-core.png?resize=1024%2C78 1024w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Unable-to-create-core.png?resize=300%2C23 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Unable-to-create-core.png?resize=768%2C58 768w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Unable-to-create-core.png?w=1280 1280w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

The stack trace was

<p style="margin: 0in; font-family: Calibri; font-size: 9.0pt; color: #333333;">
  null:org.apache.solr.common.SolrException: Unable to create core [{SitePrefix}_xdb] at org.apache.solr.core.CoreContainer.createFromDescriptor(CoreContainer.java:938)<br /> at org.apache.solr.core.CoreContainer.getCore(CoreContainer.java:1347)<br /> at org.apache.solr.servlet.HttpSolrCall.init(HttpSolrCall.java:268)<br /> at org.apache.solr.servlet.HttpSolrCall.call(HttpSolrCall.java:483)<br /> at org.apache.solr.servlet.SolrDispatchFilter.doFilter(SolrDispatchFilter.java:361)<br /> at org.apache.solr.servlet.SolrDispatchFilter.doFilter(SolrDispatchFilter.java:305)
</p>

&nbsp;

<p style="margin: 0in; font-family: Calibri; font-size: 9.0pt; color: #333333;">
  Caused by: java.nio.file.FileAlreadyExistsException: C:\solr\server\solr\{SitePrefix}_xdb\data\index\write.lock<br /> at java.base/sun.nio.fs.WindowsException.translateToIOException(Unknown Source)<br /> at java.base/sun.nio.fs.WindowsException.rethrowAsIOException(Unknown Source)<br /> at java.base/sun.nio.fs.WindowsException.rethrowAsIOException(Unknown Source)<br /> at java.base/sun.nio.fs.WindowsFileSystemProvider.newByteChannel(Unknown Source)<br /> at java.base/java.nio.file.Files.newByteChannel(Unknown Source)<br /> at java.base/java.nio.file.Files.createFile(Unknown Source)<br /> at org.apache.lucene.store.SimpleFSLockFactory.obtainFSLock(SimpleFSLockFactory.java:82)
</p>

&nbsp;

The stack trace was pretty explicit **_Caused by: java.nio.file.FileAlreadyExistsException: C:\solr\server\solr\{SitePrefix}_xdb\data\index\write.lock _**although I was not sure why they _**write.lock**_ file was present. So I deleted the file and restarted my Solr service and the _**write.loc**_k came back and the xDB core failed to start again.

&nbsp;

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Write-Lock.png" data-rel="lightbox-image-2" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-large wp-image-759" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Write-Lock.png?resize=640%2C153" alt="" width="640" height="153" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Write-Lock.png?w=944 944w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Write-Lock.png?resize=300%2C72 300w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/SolrCore-Write-Lock.png?resize=768%2C183 768w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

After some digging I found a config file I had missed out on updating for the _**Sitecore XConnect Search Indexer**_ service, the config file was here for my install

<p style="margin: 0in; font-family: Calibri; font-size: 11.0pt;">
  <strong><em>C:\inetpub\wwwroot\{siteprefix}.xconnect\App_data\jobs\continuous\IndexWorker\App_config\ConnectionStrings.config</em></strong>
</p>

Once I updated the collection connectionstring

 <code lang="xml">&lt;add name="collection" connectionString="data source=(local);Initial Catalog={siteprefix}_Xdb.Collection.ShardMapManager;Trusted_Connection=True;" /&gt;</code>

  * Restart the xConnect site: {siteprefix}.xconnect
  * Restart the _**Sitecore XConnect Search Indexer**_ windows service
  * Deleted the log **_write.lock_** file from the the {siteprefix}\_xdb and {siteprefix}\_xdb_rebuild cores data directories
  * Restarted my Solr service

After this everything was happy and my Solr cores came back online.

The last step is manaully triggering a rebuild of the xDB core via the service with the command _**<span class="pre">XConnectSearchIndexer</span> <span class="pre">-rr</span>**_ documented here &#8211; <a href="https://doc.sitecore.net/developers/xp/xconnect/xconnect-search-indexer/rebuild-index/rebuild-solr-index.html" target="_blank" rel="noopener">https://doc.sitecore.net/developers/xp/xconnect/xconnect-search-indexer/rebuild-index/rebuild-solr-index.html </a>and you should get a success message from the service.

&nbsp;

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Rebuild-Indexes.png" data-rel="lightbox-image-3" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-757" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Rebuild-Indexes.png?resize=640%2C81" alt="" width="640" height="81" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Rebuild-Indexes.png?resize=1024%2C129 1024w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Rebuild-Indexes.png?resize=300%2C38 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Rebuild-Indexes.png?resize=768%2C97 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/11/Rebuild-Indexes.png?w=1280 1280w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;