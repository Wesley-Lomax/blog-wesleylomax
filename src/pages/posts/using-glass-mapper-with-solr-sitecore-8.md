---
title: Using Glass Mapper with Solr Sitecore 8
author: Wesley Lomax
type: post
date: 2015-07-31T11:35:50+00:00
url: /2015/07/31/using-glass-mapper-with-solr-sitecore-8/
categories:
  - Glass
  - Search
  - Sitecore
  - Solr
tags:
  - Glass
  - Search
  - Sitecore
  - Solr

---
When using Solr search provider in Sitecore 8 and also using the excellent [Glass mapper][1] for Sitecore the documentation on the Glass site walks you through creating a custom search result class with property attributes for search and glass [here][2]

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/custom\_search\_class.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-38 size-full" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/custom_search_class.png?resize=516%2C281" alt="custom_search_class" width="516" height="281" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/custom_search_class.png?w=516 516w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/custom_search_class.png?resize=300%2C163 300w" sizes="(max-width: 516px) 100vw, 516px" data-recalc-dims="1" /></a>

The ID property has the attribute **[IndexField(&#8220;_id&#8221;)]**, this attribute does not work with Solr and should be replaced with   **[IndexField(&#8220;_group&#8221;)]**

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/4dcfe6b613fe6159a462">Gist</a>.
  </noscript>
</div>

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/4dcfe6b613fe6159a462">Gist</a>.
  </noscript>
</div>

A quick look at the SearchResultItem class in the Sitecore.ContentSearch dll shows why.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/SearchResultItem.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone wp-image-48 size-full" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/SearchResultItem.png?resize=640%2C406" alt="SearchResultItem" width="640" height="406" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/SearchResultItem.png?w=795 795w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/SearchResultItem.png?resize=300%2C190 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

&nbsp;

 [1]: http://glass.lu/Mapper/Sc
 [2]: http://glass.lu/Mapper/Sc/Tutorials/Tutorial25