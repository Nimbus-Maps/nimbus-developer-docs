---
sidebar_position: 2
title: Getting Started
slug: /document-purchase/getting-started
description: Make your first Document Purchase API request.
---

# Getting started with the Document Purchasing API

Use this guide to obtain access, check document availability, and purchase documents.

## Get Access

Contact Nimbus and provide:

- Organization and integration name
- Target environment: pre-production, production, or both
- Authentication mode: delegated user flow, application flow, or both
- Required permissions: `docs.read`, `docs.purchase`, and/or `docs.webhooks.manage`
- Redirect URIs if you use delegated authorization code flow
- Webhook URL if you already know it

Nimbus will provide the Entra application details required for your integration.

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.nimbusmaps.co.uk/docs/v1` |
| Pre-production | `https://api-preprod.nimbusmaps.xyz/docs/v1` |

## Authenticate

All requests require a Bearer token issued for the Document API audience.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

For server-to-server integrations, acquire a client credentials token with the `/.default` scope:

```http
POST https://login.microsoftonline.com/d2a91423-0dc1-4853-8515-7b7b7d262791/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&grant_type=client_credentials
&scope=api://d5ddd66b-0c00-4c46-bb81-672727b71aa5/.default
```

Use the pre-production scope `api://f995e7f1-7a92-4c17-82a7-3187c5b158bf/.default` when targeting pre-production.

## Check Availability

```bash
curl "https://api.nimbusmaps.co.uk/docs/v1/check-availability?title_number=AB123456" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

The response includes available documents, pending applications, estimated token cost, and current balance.

## Purchase Documents

```bash
curl -X POST "https://api.nimbusmaps.co.uk/docs/v1/purchase" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title_number": "AB123456",
    "documents": ["register", "title_plan"],
    "customer_reference": "ORDER-123"
  }'
```

Purchases return an order ID immediately. Documents are delivered asynchronously by webhook when ready.

## Next Steps

- [Authentication](authentication)
- [Webhooks](webhooks)
- [Examples](examples)
- [OpenAPI reference](/api/document-purchase/)
