---
templateKey: blog-post
title: Sitecore Lucene Exception – Unable to create document builder
date: 2015-02-20T12:15:00.000Z
description: Sitecore Lucene Exception – Unable to create document builder
featuredpost: false
featuredimage: /img/chemex.jpg
tags:
  - '7.1'
  - Lucene
  - Sitecore
categories:
  - Lucene
  - Search
  - Sitecore
---
Ran it to an Error message today flooding a Sitecore 7.1 instance log files with thousands of

> Unable to create document builder (). Please check your configuration. We will fallback to the default for now.

Happily <a href="https://sitecoreblog.marklowe.ch/2014/05/unable-to-create-document-builder/" target="_blank">this </a>post pointed me in the right direction but my solution was slightly different I needed to add line below to the**\App_Config\Include\Sitecore.ContentSearch.Lucene.DefaultIndexConfiguration.config** must have been missed out in a previous upgrade.

<script src="https://gist.github.com/Wesley-Lomax/1d5341450eb7e1f38665.js"></script>
