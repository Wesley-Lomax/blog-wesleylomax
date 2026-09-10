---
title: "PCI DSS v4.0.1 is fully enforced now — here's where Azure estates actually fail it"
date: 2026-09-10T09:00:00.000Z
description: "The future-dated PCI DSS v4.0.1 requirements stopped being 'best practice' 18 months ago. Three places Azure estates quietly fail an audit — network segmentation, log retention and key rotation — and the exact config that fixes each."
featuredpost: true
author: Wesley Lomax
tags:
  - PCI DSS
  - Azure
  - Compliance
  - Log Analytics
  - Key Vault
categories:
  - Azure
---

If you're still treating PCI DSS v4.0.1 as something you're "getting ready for," you've missed the point at which it mattered. v4.0 fully superseded v3.2.1 in March 2024, and the future-dated requirements — the ones marked *best practice until 31 March 2025* — became mandatory over 18 months ago. v4.0.1 (the clarifying revision) is the version your QSA is assessing against today. There is no runway left.

So this isn't a "get ready in time" post. It's a "your next audit" post. And in my experience the estates that fail don't fail on exotic requirements — they fail on three unglamorous things that are easy to leave in a default state and easy for an auditor to check. Here they are, with the Azure config that actually satisfies each.

A useful thing to notice up front: every one of these is *also* a cost or waste problem, not just a compliance one. That's not a coincidence. Most compliance gaps and most cloud waste live in the same misconfigured corner of the estate.

## 1. Network segmentation that isn't actually segmenting

**The requirement.** PCI DSS Requirement 1 wants network security controls between the cardholder data environment (CDE) and everything out of scope. If you use segmentation to reduce scope — and on Azure almost everyone does — Requirement 11.4.5 also says you have to *penetration test the segmentation controls at least every 12 months* (every six months if you're a service provider). Segmentation you can't prove is segmentation you don't have.

**Where estates fail.** The single most common one: relying on subnets and NSGs *without an explicit deny*, inside a shared VNet. Every NSG ships with default rules, and one of them — `AllowVnetInBound`, priority 65000 — permits all traffic between anything in the same VNet (and peered VNets). So two subnets you *think* are segmented can talk freely, because nothing overrides that default. "It's in its own subnet" is not segmentation. The default rule is.

The second: allow rules with a source of `*`, `0.0.0.0/0`, or the `Internet` service tag, usually left over from "let's just get it working" during a migration.

**The config that fixes it.** Put the CDE behind an explicit deny baseline and open only what's required, from named sources:

```bash
# Explicit deny baseline — overrides the default AllowVnetInBound
az network nsg rule create \
  --resource-group rg-cde-prod --nsg-name nsg-cde-app \
  --name deny-all-inbound --priority 4096 \
  --direction Inbound --access Deny --protocol '*' \
  --source-address-prefixes '*' --destination-address-prefixes '*' \
  --destination-port-ranges '*'

# Then allow only 443, only from the App Gateway subnet
az network nsg rule create \
  --resource-group rg-cde-prod --nsg-name nsg-cde-app \
  --name allow-https-from-appgw --priority 200 \
  --direction Inbound --access Allow --protocol Tcp \
  --source-address-prefixes 10.20.1.0/24 \
  --destination-address-prefixes '*' --destination-port-ranges 443
```

Use Application Security Groups to express "these workloads" instead of hard-coding IP ranges you'll forget to maintain, and turn on NSG flow logs — you'll want them for Requirement 10 anyway, and they're what a segmentation pen test reads to confirm the deny is real.

You can find the internet-open holes across the whole estate in one Azure Resource Graph query (it's KQL — the same language as Log Analytics):

```kusto
resources
| where type == "microsoft.network/networksecuritygroups"
| mv-expand rule = properties.securityRules
| where rule.properties.direction == "Inbound"
    and rule.properties.access == "Allow"
    and rule.properties.sourceAddressPrefix in ("*", "0.0.0.0/0", "Internet")
| project nsgName = name, ruleName = tostring(rule.name),
          ports = rule.properties.destinationPortRange,
          resourceGroup, subscriptionId
```

## 2. Log retention that quietly stops at 30 days

**The requirement.** Requirement 10.5.1 is specific and unforgiving: retain audit log history for **at least 12 months**, with **at least the most recent three months immediately available** for analysis.

**Where estates fail.** A Log Analytics workspace defaults to a short interactive retention, and Microsoft Entra ID keeps sign-in and audit logs for only **30 days** in the directory itself. So two things go wrong: the workspace retention is left at the default and never reaches 12 months, and — the one auditors love to catch — the Entra sign-in logs that prove *who accessed the CDE* were never routed anywhere, so they're gone after a month. You cannot produce 12 months of the exact records that demonstrate access control.

**The config that fixes it.** Split it the way the requirement is written — interactive retention for the "immediately available" three months, archive tier for the long tail:

```bash
# 90 days immediately queryable (the "most recent 3 months")
az monitor log-analytics workspace update \
  --resource-group rg-monitoring --workspace-name law-central \
  --retention-time 90

# Per table: keep SigninLogs 90 days hot, 400 days total (> 12 months)
az monitor log-analytics workspace table update \
  --resource-group rg-monitoring --workspace-name law-central \
  --name SigninLogs --retention-time 90 --total-retention-time 400
```

Then make sure the Entra logs actually arrive: in **Entra ID → Diagnostic settings**, stream `SignInLogs`, `AuditLogs` (and `NonInteractiveUserSignInLogs`, `ServicePrincipalSignInLogs` if in scope) to that workspace. Do the same for every in-scope resource's diagnostic settings — a subscription that isn't sending activity or resource logs is a silent 10.5.1 failure.

**The cost angle.** This is the clearest example of compliance and cost being one decision. Archive tier is a fraction of the price of interactive retention. An estate that satisfies 10.5.1 by cranking *interactive* retention to 400 days everywhere is both compliant and needlessly expensive; the same estate using 90 days interactive + archive is compliant *and* cheaper. The "12 months" number isn't the lever — where those months live is.

Find the workspaces that fall short:

```kusto
resources
| where type == "microsoft.operationalinsights/workspaces"
| extend retentionDays = toint(properties.retentionInDays)
| where retentionDays < 365
| project name, retentionDays, resourceGroup, subscriptionId
```

## 3. Keys and secrets with no defined cryptoperiod

**The requirement.** Requirement 3 expects keys protecting stored account data to be changed **at the end of a defined cryptoperiod** (3.6.1.2, 3.7.4). PCI doesn't hand you a number — *you* define the cryptoperiod — but an auditor will expect that period to be documented *and enforced*, not aspirational.

**Where estates fail.** Key Vault makes it trivially easy to create a key or secret and never think about it again. The failures are predictable: customer-managed keys created three years ago with no rotation policy, secrets with no expiry date, and — the one that's a cost *and* risk problem at once — service principal credentials that never expire, sitting over-permissioned and unrotated. That stale, over-permissioned identity is both an access-control finding and unmonitored blast radius.

**The config that fixes it.** Set an actual rotation policy on the keys, so rotation is a property of the vault and not a calendar reminder someone owns:

```bash
az keyvault key rotation-policy update \
  --vault-name kv-cde-prod --name cmk-storage \
  --value '{
    "lifetimeActions": [
      { "trigger": { "timeAfterCreate": "P335D" },
        "action":  { "type": "Rotate" } },
      { "trigger": { "timeBeforeExpiry": "P30D" },
        "action":  { "type": "Notify" } }
    ],
    "attributes": { "expiryTime": "P1Y" }
  }'
```

For secrets, always set `expires` and alert before expiry. But the strongest control here is to have *nothing to rotate*: prefer **managed identities** over service-principal secrets wherever the integration supports them. A secret that doesn't exist can't drift past its cryptoperiod, can't leak, and can't show up as a finding — the cheapest control is the one you deleted.

## The through-line

None of this is advanced. It's a deny rule you didn't add, a retention setting you didn't change, and a rotation policy you didn't set — each left in a default state that reads as "waste" to finance and "finding" to a QSA at the same time. That's the whole thesis of how I work: on a regulated Azure estate, the compliance review and the cost review are usually looking at the same misconfiguration from two directions.

If your next audit is on the horizon and you're not confident these three are actually true in your estate — not documented as true, *actually* true — that's exactly the conversation I have with fintech, payments and regulated SaaS teams. [Get in touch](/contact).

*This is general guidance from field experience, not a substitute for a scoping conversation with your own QSA — cryptoperiods, scope boundaries and applicable requirements depend on your environment.*
