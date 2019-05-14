---
templateKey: blog-post
title: Using Glass Mapper with Solr Sitecore 8
date: 2015-07-31T11:35:50.000Z
description: Using Glass Mapper with Solr Sitecore 8
featuredpost: false
featuredimage: /img/custom_search_class.png
tags:
  - Glass
  - Search
  - Sitecore
  - Solr
---
When using Solr search provider in Sitecore 8 and also using the excellent [Glass mapper](http://glass.lu/Mapper/Sc) for Sitecore the documentation on the Glass site walks you through creating a custom search result class with property attributes for search and glass [here](http://glass.lu/Mapper/Sc/Tutorials/Tutorial25)



![Custom Search Class](/img/custom_search_class.png)

The ID property has the attribute **\[IndexField("_id")]**, this attribute does not work with Solr and should be replaced with   **\[IndexField("_group")]**

<script src="https://gist.github.com/Wesley-Lomax/4dcfe6b613fe6159a462.js"></script>

A quick look at the SearchResultItem class in the Sitecore.ContentSearch dll shows why.

![SearchResultItem ](/img/searchresultitem.png)
