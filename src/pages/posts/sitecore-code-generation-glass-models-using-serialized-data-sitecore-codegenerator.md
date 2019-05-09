---
title: Sitecore Code Generation of Glass Models using serialized data with Sitecore.CodeGenerator
author: Wesley Lomax
type: post
date: 2017-10-12T19:23:45+00:00
url: /2017/10/12/sitecore-code-generation-glass-models-using-serialized-data-sitecore-codegenerator/
categories:
  - Glass
  - Sitecore
  - Unicorn
tags:
  - code generation
  - rainbow
  - T4
  - Unicorn
  - yaml

---
I was looking for a way to automatically generate Glass Models for my Sitecore Templates that had been serialized using <a href="https://github.com/kamsar/Unicorn" target="_blank" rel="noopener">Unicorn&#8217;s </a>[Rainbow][1] YAML serialization formatter and came across this post  by Sitecore MVP <a href="https://twitter.com/knifecore" target="_blank" rel="noopener">Robin Hermanussen</a> &#8211; <a href="http://hermanussen.eu/sitecore/wordpress/2015/04/generating-sitecore-code-without-tds/" target="_blank" rel="noopener">http://hermanussen.eu/sitecore/wordpress/2015/04/generating-sitecore-code-without-tds</a>

After reading the documents on <a href="https://github.com/hermanussen/sitecore.codegenerator#readme" target="_blank" rel="noopener">GitHub </a>it sounded perfect so I forked the repo and took a look at what the project was doing &#8211; <a href="https://github.com/hermanussen/sitecore.codegenerator" target="_blank" rel="noopener">https://github.com/hermanussen/sitecore.codegenerator</a>

My first step were :-

  1. Updated to .Net4.6.1
  2. Used Visual Studio 2017 with T4 templates for 2017 &#8211; <a href="https://github.com/hagronnestad/T4Toolbox/releases/tag/vs2017-b1" target="_blank" rel="noopener">https://github.com/hagronnestad/T4Toolbox/releases/tag/vs2017-b1</a>
  3. Used Sitecore Nuget Feed for Sitecore dlls.
  4. Targeting 8.2.170728 Sitecore 8.2 Update 5

Then I made some updates to the models that were being outputted using the T4 helpers from the tds-codegen project &#8211;  <a href="https://github.com/HedgehogDevelopment/tds-codegen" target="_blank" rel="noopener">https://github.com/HedgehogDevelopment/tds-codegen</a>

Changed to GlassGenerator :-

  1. Switched to Rainbow Provider
  2. Supported more Sitecore field types
  3. Changed file name to \*.cs instead of \*.gen.cs

Changes to GlassMappedClassTemplate :-

  1. Namespace uses the default namespace and the template location.
  2. Static Class for Template and Field Values
  3. Used static classes for SitecoreType TemplateId
  4. Used static classes for SitecoreField Name
  5. Added inheritance of IGlassBase interface

Here is the original output :-

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/5ccb78c6f1c61f79c356f624c495c57e">Gist</a>.
  </noscript>
</div>

And this is what Sitecore.CodeGenerator is outputting now with my changes:-

<div class="oembed-gist">
  <noscript>
    View the code on <a href="https://gist.github.com/Wesley-Lomax/d10e1fd599dfb33cd75903b263fb08e2">Gist</a>.
  </noscript>
</div>

&nbsp;

Have a play with the code &#8211; <a href="https://github.com/Wesley-Lomax/sitecore.codegenerator" target="_blank" rel="noopener">https://github.com/Wesley-Lomax/sitecore.codegenerator </a>and checkout Robins repo &#8211; <a href="https://github.com/hermanussen/sitecore.codegenerator" target="_blank" rel="noopener">https://github.com/hermanussen/sitecore.codegenerator</a> I&#8217;ve found it a great timesaver for boiler plate models for your renderings.

&nbsp;

 [1]: https://github.com/kamsar/Rainbow