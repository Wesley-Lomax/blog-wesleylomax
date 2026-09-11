---
title: "PCI DSS v4.0.1 on Azure – three places I keep seeing estates fail their audit"
date: 2026-09-10T09:00:00.000Z
description: "PCI DSS v4.0.1 has been fully enforced for a while now. These are the three things I keep finding on regulated Azure estates that fail an audit – network segmentation, log retention and key rotation – and how I deal with each one in Azure."
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

I've spent most of the last couple of years working on regulated Azure estates, and PCI DSS comes up in nearly every conversation I have. v4.0.1 is the version being assessed against now. v4.0 replaced v3.2.1 back in March 2024, and the requirements that were marked "best practice until 31 March 2025" have been mandatory for about eighteen months. So this isn't really a question of getting ready any more, it's a question of what your next audit is going to turn up.

In my experience the estates that struggle don't struggle with the exotic stuff. They come unstuck on three fairly mundane things that are easy to leave sitting on their defaults, and just as easy for an assessor to check. I'll go through each one and the Azure config I use to deal with it.

One thing worth saying up front: every one of these costs you money as well as failing an audit. That keeps happening, and it's not a coincidence. Most of the compliance gaps and most of the cloud waste I find live in the same badly configured corner of the estate.

## Network segmentation that isn't really segmenting

Requirement 1 wants network security controls sitting between the cardholder data environment and everything that's out of scope. If you're using segmentation to keep things out of scope, and on Azure almost everyone is, then 11.4.5 also says you have to pen test those segmentation controls at least once a year, or every six months if you're a service provider. Segmentation you can't demonstrate isn't really doing anything for you.

The one I see most often is an estate relying on subnets and NSGs with no explicit deny, all sitting in a shared VNet. The bit people forget is that every NSG includes a default `AllowVnetInBound` rule at priority 65000. Depending on your network design, the VirtualNetwork address space can extend beyond the local subnet, meaning workloads may be able to communicate in ways architects did not intend. So you can have two subnets you're convinced are separated when they're not, because nothing you've written overrides that default. Putting a workload in its own subnet doesn't segment it. The default rule is still doing the talking.

The other one is an allow rule with a source of `*`, `0.0.0.0/0` or the `Internet` service tag, usually left behind after a migration when someone just wanted the thing working.

The way I deal with it is to explicitly define allowed traffic paths into the CDE and ensure they override Azure's broad VirtualNetwork defaults:

```bash
# Explicit deny baseline – this is what overrides the default AllowVnetInBound
az network nsg rule create \
  --resource-group rg-cde-prod --nsg-name nsg-cde-app \
  --name deny-all-inbound --priority 4096 \
  --direction Inbound --access Deny --protocol '*' \
  --source-address-prefixes '*' --destination-address-prefixes '*' \
  --destination-port-ranges '*'

# Then allow 443 only, and only from the App Gateway subnet
az network nsg rule create \
  --resource-group rg-cde-prod --nsg-name nsg-cde-app \
  --name allow-https-from-appgw --priority 200 \
  --direction Inbound --access Allow --protocol Tcp \
  --source-address-prefixes 10.20.1.0/24 \
  --destination-address-prefixes '*' --destination-port-ranges 443
```

I tend to use Application Security Groups rather than hard-coding IP ranges I'll only forget to maintain. I also enable network traffic logging and monitoring to provide evidence that segmentation controls are functioning as designed. While segmentation testing should include independent validation, traffic logs provide useful supporting evidence when demonstrating scope boundaries.

If you want to find the internet-facing holes across a whole estate, this Azure Resource Graph query does it. It's KQL, the same language as Log Analytics:

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

## Log retention that quietly stops at 30 days

This one catches people out because of a couple of defaults that don't line up with what PCI is asking for. PCI DSS requires at least twelve months of audit trail history to be retained, with the most recent three months immediately available for analysis.

A Log Analytics workspace doesn't keep logs anywhere near that long by default, and Microsoft Entra ID only holds sign-in and audit logs for 30 days in the directory itself. So this goes wrong in two ways. The workspace retention never gets bumped up to twelve months, and, the issue I see catch teams out most often, nobody ever routed the Entra sign-in logs anywhere, so the records that show who actually got into the CDE are gone after a month. When the assessor asks for twelve months of those, there's nothing to hand over.

I set it up the way the requirement is written, with interactive retention covering the three months you need to hand and archive covering the rest:

```bash
# 90 days immediately queryable – the "most recent three months"
az monitor log-analytics workspace update \
  --resource-group rg-monitoring --workspace-name law-central \
  --retention-time 90

# Per table: 90 days hot, 400 days total retention (comfortably over 12 months)
az monitor log-analytics workspace table update \
  --resource-group rg-monitoring --workspace-name law-central \
  --name SigninLogs --retention-time 90 --total-retention-time 400
```

Then make sure the Entra logs are actually going somewhere. Under **Entra ID → Diagnostic settings**, send `SignInLogs` and `AuditLogs` (plus the non-interactive and service principal ones if they're in scope) to the same workspace, and do the same on every in-scope resource. A subscription that isn't sending its logs is a PCI DSS logging failure waiting to be found.

This is a good example of the cost point I made at the start. Archive tier is a lot cheaper than interactive retention, so if you meet the twelve months by turning interactive retention right up everywhere, you're compliant but you're paying over the odds for it. Ninety days hot plus archive gets you the same audit outcome for a fraction of the cost. The twelve-month number isn't really the lever, where those months live is.

Workspace retention alone doesn't tell the whole story in modern Log Analytics. Interactive retention only covers the hot data that's immediately searchable. PCI DSS is concerned with the total period audit records are retained, regardless of whether they're held in an interactive or archive tier. That means you need to review both workspace retention and any table-level retention settings to confirm you're actually meeting the twelve-month requirement.

To find the tables that fall short:


```powershell
Get-AzOperationalInsightsTable `
    -ResourceGroupName "rg-monitoring" `
    -WorkspaceName "law-central" |
    Where-Object { $_.TotalRetentionInDays -lt 365 } |
    Select-Object `
        Name,
        RetentionInDays,
        TotalRetentionInDays
```

## Keys and secrets with no cryptoperiod behind them

Requirement 3 requires cryptographic keys protecting account data to be managed throughout their lifecycle, including rotation at the end of a defined cryptoperiod. PCI doesn't give you a number here, you set the cryptoperiod yourself, but an assessor will want to see it written down and actually enforced rather than left as a good intention.

Key Vault makes it very easy to create a key or a secret and then never look at it again, and that's usually what I find. Customer-managed keys created years ago with no rotation policy, secrets with no expiry set, and service principal credentials that never expire, often accompanied by overly broad permissions. That last one is the risk-and-waste overlap again, because it's an access control finding and a piece of unmonitored blast radius at the same time.

I'd rather rotation was a property of the vault than a reminder in someone's calendar, so I set a policy on the key itself:

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

For secrets, set an expiry and alert before it's reached. Honestly though, the best thing you can do here is arrange it so there's nothing to rotate in the first place. Use managed identities instead of service principal secrets wherever the integration supports it. A secret that doesn't exist can't drift past its cryptoperiod, and it can't leak.

## Pulling it together

None of this is clever work. It's a deny rule that never got added, a retention setting nobody changed, and a rotation policy that was never set, all left sitting on their defaults. What I keep coming back to is that on a regulated Azure estate the audit and the cloud bill are usually pointing at the same misconfiguration from different directions, and that overlap is a lot of why I find this work interesting in the first place.

If you've got an audit on the horizon and you're not confident these three are actually true in your estate, rather than just written down as true, that's the sort of thing I help fintech, payments and regulated SaaS teams with. Feel free to [get in touch](/contact).

As always, this is general guidance from what I've run into in the field, not a substitute for scoping things out properly with your own Qualified Security Assessor. 

Cryptoperiods, where your scope boundaries sit and which requirements actually apply all depend on your own environment.