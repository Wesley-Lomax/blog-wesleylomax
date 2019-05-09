---
templateKey: blog-post
title: Using Glass Mapper with Solr Sitecore 8
date: 2015-07-31T11:35:50.000Z
description: Using Glass Mapper with Solr Sitecore 8
featuredpost: false
featuredimage: /img/chemex.jpg
tags:
  - Glass
  - Search
  - Sitecore
  - Solr
---
When using Solr search provider in Sitecore 8 and also using the excellent [Glass mapper](http://glass.lu/Mapper/Sc) for Sitecore the documentation on the Glass site walks you through creating a custom search result class with property attributes for search and glass [here](http://glass.lu/Mapper/Sc/Tutorials/Tutorial25)

<img class="alignnone wp-image-38 size-full" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/custom_search_class.png?resize=516%2C281" alt="custom_search_class" width="516" height="281" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/custom_search_class.png?w=516 516w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/custom_search_class.png?resize=300%2C163 300w" sizes="(max-width: 516px) 100vw, 516px" data-recalc-dims="1" />

The ID property has the attribute **\[IndexField("_id")]**, this attribute does not work with Solr and should be replaced with   **\[IndexField("_group")]**

<script src="https://gist.github.com/Wesley-Lomax/4dcfe6b613fe6159a462.js"></script>

A quick look at the SearchResultItem class in the Sitecore.ContentSearch dll shows why.

<img class="alignnone wp-image-48 size-full" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/SearchResultItem.png?resize=640%2C406" alt="SearchResultItem" width="640" height="406" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/SearchResultItem.png?w=795 795w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/07/SearchResultItem.png?resize=300%2C190 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" />
