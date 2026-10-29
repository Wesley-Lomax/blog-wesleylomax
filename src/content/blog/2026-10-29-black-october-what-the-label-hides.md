---
title: "Black October: what the label hides"
date: 2026-10-29T09:00:00.000Z
description: "Most of what circulated as 'Black October' doesn't hold up. What's actually confirmed, what it means for a regulated Azure estate, and the one query I'd run first."
featuredpost: true
author: Wesley Lomax
tags:
  - Security
  - Azure
  - Compliance
  - Supply chain
  - KQL
categories:
  - Azure
---

I've spent a fair bit of the last few weeks reading around the run of security disclosures in the third week of October, because a lot of it landed close to the work I do on regulated Azure estates. The name everyone has settled on is "Black October". Most of what circulated under that name doesn't hold up, and the parts that do are more useful than the label suggests.

Start with the name itself. It comes from a post on X in the early hours of 22 October, describing the previous 48 hours as the worst stretch of infrastructure disclosure in recent memory. When people went back for that post, it wasn't there. So the label that framed a week of coverage doesn't have a verified origin. That should have told us to check everything that followed. Most of it didn't get checked.

## What's actually confirmed

* PHP2Shell (the name that stuck) – two remote code execution flaws in PHP core, CVE-2026-109618 and CVE-2026-109619, both CVSS 9.2 and exploitable before authentication. Exploits were in use from 21 October and a public tool showed up quickly. Demonstrated against WordPress, Drupal and Joomla. Every PHP version since 5.4 is affected, and one estimate put around 70% of websites at risk.
* GitLab CVE-2026-110264 – unauthenticated RCE through a crafted Org-mode file, CVSS 10, versions back to 7.0.
* [LiteLLM 1.107.0](https://docs.litellm.ai/blog/security-incident-oct-21-2026) – the release pipeline was compromised. Malicious PyPI wheels were live for a little under two hours and the container tags for longer. The payload stole credentials and loaded a remote access tool. Their own incident report has the timeline.
* Railway and Zeabur – hosting platforms where developers keep environment variables, which is why these two matter more than they look. Railway confirmed attackers reached and partly decrypted customer secrets. Zeabur's second breach in two months exposed 3.2 million environment variable records across 321,810 accounts. Zeabur is shutting the platform down on 31 December.
* ConnectWise Cloud Backup, formerly SkyKick – an application credential was used to sign into Microsoft 365 tenants. Aimed at MSPs and, through them, at their customers.
* eMudhra – eight intermediate certificate authority keys turned out to be cryptographically weak. One of them had a key value of 4.
* A Node.js security release, a trojanised Rank Math PRO plugin, Cisco Expressway, Arista VeloCloud, and a group of [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) additions including Ivanti, PAN-OS, BeyondTrust, Plex, SiteGuard and Siemens. Several of those need forensic triage, which means hunting for evidence that someone was already in, not just patching.

## Two things the coverage got wrong

The first is that this was a disclosure wave, not an attack wave. The attacks and exposures underneath are months or years old, and several were worked on privately for a long time before anyone heard about them. The third week of October is when they got accounted for in public, all at once.

That distinction matters more than it sounds. A disclosure wave hits everybody simultaneously and is mostly a prioritisation problem. An attack wave picks its targets. If you treat the first as the second you end up with forty things on a list and no order to them, and the loudest item wins instead of the one with a real path into your estate.

The second is that some of the more alarming claims have nothing behind them. The viral lists counted anywhere between 10 and more than 40 incidents. "AI agent swarms hacking half the internet" has no source at all. A claim about AI agents being used against more than 400 Latin American banks rests on a single report, with no confirmation from any bank or regulator. What's documented is much narrower: one operator used an open source AI agent platform against more than 100 companies. One operator is still a real change in the economics of attack. It just isn't the version that got a million views.

## The part that will actually cost you money

Four of the incidents above are the same incident. A platform was holding a secret, and somebody else read it. Railway, Zeabur, LiteLLM, and the ConnectWise case.

Patching does nothing for a key that's already left. I think that's the failure mode people are underestimating at the moment, partly because it doesn't look like a vulnerability. It looks like a vendor you chose.

On an Azure estate that failure mode has a shape I recognise. A service principal with a client secret and no expiry set. A Key Vault key created a few years ago with no rotation policy behind it. An app setting holding a connection string, because whatever it needed to talk to didn't support a managed identity. None of that needs a new CVE to be a problem. October just made it worth looking at properly.

## The biggest UK outage that week wasn't an attack

On 20 October, UK banking apps, the courts' video platform, Royal Mail, Rightmove, DPD, BT and Screwfix were all disrupted. Revolut, Lloyds, HSBC, Barclays, Bank of Scotland, NatWest, Halifax and Nationwide were all reported. It started just after 07:00 and most services had recovered by the evening.

Nothing was breached. Power failed in `europe-west2-b` – one of three availability zones in Google Cloud's London region – at a third party facility. Google described the impact as affecting a "very small number" of customers. That was true, and so was the list of household names. Both statements describe the same day, which is why neither one is much use as a risk assessment on its own.

The shape of it is what interests me. A single availability zone, no second UK region to fall back on, and a dependency on power at somebody else's site. For anyone in a regulated business that's precisely the sort of thing operational resilience rules exist to ask about, and the [Critical Third Parties regime](https://www.bankofengland.co.uk/financial-stability/operational-resilience-of-the-financial-sector/critical-third-parties) now supervises the hyperscalers directly, with [material third party reporting arriving in March 2027](https://www.fca.org.uk/publications/policy-statements/ps26-2-operational-incident-third-party-reporting). Your outage doesn't have to be a breach to be a regulatory event.

## What I'd actually run

One query, because you can't reason about any of the rest of it without this, and I'll come back to the others properly over the next few weeks.

You can't work out which hosts ran LiteLLM 1.107.0 until you know what you've got and which of it can reach the internet. [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/samples/starter), across everything you can see:

```kusto
resources
| where type =~ "microsoft.compute/virtualmachines"
    or type =~ "microsoft.containerservice/managedclusters"
    or type =~ "microsoft.web/sites"
| project name, type, resourceGroup, subscriptionId, location,
          os = tostring(properties.storageProfile.osDisk.osType),
          tags
| order by type asc, name asc
```

That's usually the spreadsheet somebody ends up assembling by hand at the wrong moment, which is the point. The version you build in a hurry during an incident is the version that gets challenged.

## What I'd take from it

The engineering side of last week isn't the hard part. What a week like that asks is whether you can show, with evidence, what you ran and when, what could read your secrets, and what you actually depend on. They're the same questions a [PCI DSS v4.0.1](https://www.pcisecuritystandards.org/document_library/) assessment asks, and the same ones a third party register or an incident review asks.

Over the next few weeks I'm going to work through four of those questions properly, one at a time, with the config and the queries rather than the theory:

* Web application patching, and the gap between a thing being patched and a thing running the patched version
* Ingress and egress control, particularly the outbound half, which is where October's supply chain incidents actually happened
* Certificate and credential rotation, from trust stores through to Key Vault
* Management, auditability and rotation, which is what makes the other three provable rather than asserted

If any of that sounds like your estate, follow along, or [get in touch](/contact) if you'd rather not wait for me to get to it.

As always, this is what I ran into and read about in the field rather than a complete account of the week, and I'd rather be corrected than quoted.
