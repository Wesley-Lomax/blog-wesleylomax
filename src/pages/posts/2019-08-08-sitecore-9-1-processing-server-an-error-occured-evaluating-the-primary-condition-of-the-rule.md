---
title: "Sitecore 9.1 Processing Server - An error occured evaluating the primary condition of the rule"
author: Wesley Lomax
type: post
featuredpost: false
featuredimage: /img/search.png
date: 2019-08-08T15:48:50.000Z
url: /2019-08-08-sitecore-9-1-processing-server-an-error-occured-evaluating-the-primary-condition-of-the-rule/
categories:
  - Sitecore
tags:
  - processing
  - exception
  - Sitecore 9.1.0
templateKey: blog-post
---

Reviewing a recently installed Sitecore 9.1.0 instance I found thousands of errors in the logs **ERROR [Path Analyzer] Error during aggregation.** and **ERROR [Path Analyzer] Cannot apply rule on the interaction**.

Full stack traces :-

```
4136 2019:08:08 06:35:17 ERROR [Path Analyzer] Error during aggregation.
Exception: System.AggregateException
Message: One or more errors occurred.
Source: Sitecore.Framework.Rules.Core
   at Sitecore.Framework.Rules.RuleEngine.Run(IEnumerable`1 rules, IEnumerable`1 factResolvers)
   at Sitecore.PathAnalyzer.Rules.RulesValidator.ValidateRule(Interaction interaction, String rulesXml, ConditionParameters parameters)
   at Sitecore.PathAnalyzer.Construction.TreeBuilder.IsApplicable(Interaction interaction, String rulesXml, ConditionParameters conditionParameters)
   at Sitecore.PathAnalyzer.Construction.TreeBuilder.Build(Interaction interaction)
   at Sitecore.PathAnalyzer.Processing.AggregationContextCollector.Collect(Interaction interaction)
   at Sitecore.PathAnalyzer.Processing.TreeAggregator.Aggregate(ItemBatch`1 batch)
   at Sitecore.PathAnalyzer.Processing.Agents.TreeAggregatorAgent.Execute()

Nested Exception

Exception: Sitecore.Framework.Rules.RuleExecutionException
Message: An error occured evaluating the primary condition of the rule.  See the inner exception for details.

Nested Exception

Exception: System.ArgumentNullException
Message: Value cannot be null.
Parameter name: value0
Source: Sitecore.Kernel
   at Sitecore.Diagnostics.Assert.ArgumentNotNull(Object argument, String argumentName)
   at Sitecore.PathAnalyzer.Rules.MapConditions.InteractionSiteNameCondition.Compare(String value0, String value1)
   at Sitecore.Framework.Rules.BinaryCondition.Evaluate(IRuleExecutionContext context)
   at Sitecore.Framework.Rules.RuleEngine.Run(IRule rule, IFactProvider factProvider)

```

```
4136 2019:08:08 06:35:18 ERROR [Path Analyzer] Cannot apply rule on the interaction.
Exception: System.AggregateException
Message: One or more errors occurred.
Source: Sitecore.Framework.Rules.Core
   at Sitecore.Framework.Rules.RuleEngine.Run(IEnumerable`1 rules, IEnumerable`1 factResolvers)
   at Sitecore.PathAnalyzer.Rules.RulesValidator.ValidateRule(Interaction interaction, String rulesXml, ConditionParameters parameters)
   at Sitecore.PathAnalyzer.Construction.TreeBuilder.IsApplicable(Interaction interaction, String rulesXml, ConditionParameters conditionParameters)

Nested Exception

Exception: Sitecore.Framework.Rules.RuleExecutionException
Message: An error occured evaluating the primary condition of the rule.  See the inner exception for details.

Nested Exception

Exception: System.ArgumentNullException
Message: Value cannot be null.
Parameter name: value0
Source: Sitecore.Kernel
   at Sitecore.Diagnostics.Assert.ArgumentNotNull(Object argument, String argumentName)
   at Sitecore.PathAnalyzer.Rules.MapConditions.InteractionSiteNameCondition.Compare(String value0, String value1)
   at Sitecore.Framework.Rules.BinaryCondition.Evaluate(IRuleExecutionContext context)
   at Sitecore.Framework.Rules.RuleEngine.Run(IRule rule, IFactProvider factProvider)


```
I could find nothing online but this method **Sitecore.PathAnalyzer.Rules.MapConditions.InteractionSiteNameCondition.Compare** led me to the **SiteNames** table in the reporting database, in there I found a row with SiteNameId 0 and an empty siteName after removing this row and restarting the processing server the errors where gone and the server started processing as expected.
