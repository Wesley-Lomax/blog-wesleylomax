---
title: Sitecore ECM Unable to remove variant not created in default language
author: Wesley Lomax
type: post
date: 2015-04-21T14:27:28.000Z
url: /2015/04/21/sitecore-ecm-unable-to-remove-variant-not-created-in-default-language/
categories:
  - Email Campaign Manager
  - Sitecore
tags:
  - ECM
  - Language Version
templateKey: blog-post
---
Unable to remove message variant using Sitecore Email Campaign Manager when variant has been not created in default language.

Steps to reproduce :-

<ol id="aui-3-5-1-4_5726">
  <li id="aui-3-5-1-4_5730">
    Create new message in ECM
  </li>
  <li id="aui-3-5-1-4_5728">
    Proceed to message step. Ensure language is not EN default language.
  </li>
  <li id="aui-3-5-1-4_5751">
    Click action drop down to add variant.
  </li>
  <li id="aui-3-5-1-4_5725">
    On variant B Click action drop down select remove variant.
  </li>
</ol>

The page reloads but variant still exists, I had to create a version in the default language EN prior to deleting the selected variant.

This issue was found using Sitecore with 7.1 and Email Campaign Manager 2.1 140214 it was confirmed as a bug via Sitecore support ticket number 434146 and the workaround above was suggested until this gets resolved in the product.

&nbsp;