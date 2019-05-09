---
title: Customize how field values are stored and queried in Solr with Sitecore 8
author: Wesley Lomax
type: post
date: 2015-12-10T12:07:48.000Z
url: /2015/12/10/customize-how-field-values-are-stored-solr-sitecore-8/
categories:
  - Search
  - Sitecore
  - Solr
tags:
  - Analyzer
  - Filter
  - Sitecore 8 Update 3
  - Solr
  - Solr-5.3.1
templateKey: blog-post
---
The default configuration for Solr with Sitecore 8 will happily find and index all of the data in your fields using the dynamicFields defined in the schema file.

Here is an example of a dynamic field configuration for a text field.

<pre class="brush: xml; title: ; notranslate" title="">&lt;dynamicField name="*_t" type="text_general" indexed="true" stored="true" /&gt;</pre>

Text fields are defined in the **Sitecore.ContentSearch.Solr.DefaultIndexConfiguration.config **file and Sitecore field types of **&#8220;html|rich text|single-line text|multi-line text|text|memo|image|reference&#8221;** are defined as text field types and processed as dynamic fields of type text when they are indexed by Solr

<pre class="brush: xml; title: ; notranslate" title="">&lt;typeMatch typeName="text" type="System.String" fieldNameFormat="{0}_t" cultureFormat="_{1}" settingType="Sitecore.ContentSearch.SolrProvider.SolrSearchFieldConfiguration, Sitecore.ContentSearch.SolrProvider" /&gt;</pre>

The default configuration for the Solr dynamic fields use the **text_general** Field Type and their language variants for the other languages e.g. **text_de** and these Field Types use the **solr.StandardTokenizerFactory** that splits the text field into tokens, treating whitespace and punctuation as delimiters. An example from the documentation :-

> **In:** &#8220;Please, email john.doe@foo.com by 03-09, re: m37-xq.&#8221;
> 
> **Out:** &#8220;Please&#8221;, &#8220;email&#8221;, &#8220;john.doe&#8221;, &#8220;foo.com&#8221;, &#8220;by&#8221;, &#8220;03&#8221;, &#8220;09&#8221;, &#8220;re&#8221;, &#8220;m37&#8221;, &#8220;xq&#8221;

This is how the data looks in Solr when a field is processed by the **StandardTokenizerFactory**

<img class="alignnone size-full wp-image-128" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Before-changes.png?resize=409%2C280" alt="Before changes" width="409" height="280" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Before-changes.png?w=409 409w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/11/Before-changes.png?resize=300%2C205 300w" sizes="(max-width: 409px) 100vw, 409px" data-recalc-dims="1" />

But what if you do not want the field value split in to tokens? Well that&#8217;s pretty straight forward as well&#8230;

If you wish to have more control over how the fields and their values are indexed and queried in Solr you can take advantage of <a href="https://cwiki.apache.org/confluence/display/solr/Tokenizers" target="_blank">Tokenizers</a> and <a href="https://cwiki.apache.org/confluence/display/solr/About+Filters" target="_blank">Filters</a>.

In your schema.xml file for the Solr core you wish to modify add a new field definition before the list of dynamic fields, the field name should be as it would be defined in solr for example.

<pre class="brush: xml; title: ; notranslate" title="">&lt;field name="your_field_name_here_t" type="lowercase" indexed="true" stored="true" /&gt;</pre>

Here I have used the **lowercase** Field type defined in the schema file as :-

<pre class="brush: xml; title: ; notranslate" title="">&lt;!-- lowercases the entire field value, keeping it as a single token. --&gt;
 &lt;fieldType name="lowercase" class="solr.TextField" positionIncrementGap="100"&gt;
 &lt;analyzer&gt;
 &lt;tokenizer class="solr.KeywordTokenizerFactory" /&gt;
 &lt;filter class="solr.LowerCaseFilterFactory" /&gt;
 &lt;/analyzer&gt;
 &lt;/fieldType&gt;
</pre>

The key change is the use of the **KeywordTokenizerFactory** this change means the field will be stored in the index and queried as the entire field value.

If you make changes to the schema.xml file you will need to restart your solr instance and re-index the core you have made changes to. Once this is complete you can use the schema browser for solr **_http://localhost:8080/solr/#/{your core name}/schema-browser_** and view the newly defined field to see you changes, notice the **Field Type** now shows as _**lowercase** _and the **_Index Analyzer_** and **_Query Analyzer_** have changed, use the **_Load Term Info_** button to see the changes to the values store by Solr

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/12/Updated-Field-Definition1.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-179" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/12/Updated-Field-Definition1.png?resize=640%2C473" alt="Updated Field Definition" width="640" height="473" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/12/Updated-Field-Definition1.png?w=971 971w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2015/12/Updated-Field-Definition1.png?resize=300%2C222 300w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

Filters and Tokenizers provide a powerful way to manipulate the data stored and queried through Solr.