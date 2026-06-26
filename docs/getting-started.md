---
sidebar_position: 1
---

# Getting Started

The Nimbus Property Search API provides access to comprehensive UK property data — including land registry titles, planning applications, environmental constraints, sales history, EPC ratings, comparable deals, and more.

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.nimbusmaps.co.uk/search/v1` |
| Test | `https://api-preprod.nimbusmaps.xyz/search/v1` |

## Authentication

All endpoints except `/health` require authentication. Two methods are supported.

### Subscription Key

The simplest way to authenticate. Include your key in every request:

```
Ocp-Apim-Subscription-Key: YOUR_API_KEY
```

Contact Nimbus to request a subscription key.

### OAuth 2.0

For applications that authenticate on behalf of users, the API supports OAuth 2.0 Authorization Code Flow via Microsoft Entra ID.

**Authorization URL:**
```
https://login.microsoftonline.com/d2a91423-0dc1-4853-8515-7b7b7d262791/oauth2/v2.0/authorize
```

**Token URL:**
```
https://login.microsoftonline.com/d2a91423-0dc1-4853-8515-7b7b7d262791/oauth2/v2.0/token
```

**Available scopes:**

| Scope | Access granted |
|-------|---------------|
| `search.titles` | Search and retrieve property title information |
| `search.comps` | Search and retrieve comparable deal data |
| `search.address` | Search for addresses |

Include the token in every request:

```
Authorization: Bearer YOUR_TOKEN
```

## Your First Request

Verify the API is reachable with the health endpoint (no authentication required):

```bash
curl https://api.nimbusmaps.co.uk/search/v1/health
```

Then try a simple property search:

```bash
curl -X POST https://api.nimbusmaps.co.uk/search/v1/titles \
  -H "Ocp-Apim-Subscription-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "match": { "mainAddress.town": "Cambridge" }
    },
    "size": 5
  }'
```

## Understanding the Response

Search results contain a `hits` object with matching property records. Each record includes address, tenure, area, and associated data.

```json
{
  "hits": {
    "total": { "value": 15234, "relation": "eq" },
    "hits": [
      {
        "_id": "76a19144-1878-4973-817c-3703199a152c",
        "_source": {
          "id": "76a19144-1878-4973-817c-3703199a152c",
          "number": "CB153191",
          "tenure": "Freehold",
          "propertyCategory": "Residential",
          "mainAddress": {
            "fullAddress": "9, Blackthorn Close, Cambridge, CB4 1FZ"
          }
        }
      }
    ]
  }
}
```

Use the `id` from a search result to retrieve detailed sub-resources:

```bash
# Get planning applications for a title
curl "https://api.nimbusmaps.co.uk/search/v1/titles/76a19144-1878-4973-817c-3703199a152c/planning" \
  -H "Ocp-Apim-Subscription-Key: YOUR_API_KEY"
```

## Limits

| Limit | Value |
|-------|-------|
| Max results per request | 25 (`size` parameter) |
| Pagination ceiling | 10,000 total results (`from + size ≤ 10,000`) |
| Query timeout | 5 seconds |
| Daily request limit | Varies by subscription tier — contact Nimbus for details |

## Next Steps

- **[Quick Reference](quickstart)** — concise endpoint and query reference
- **[API Examples](api-examples)** — copy-pasteable request and response examples
- **[Field Reference](elasticsearch-schema)** — complete property data field descriptions
- **[API Reference](/api/)** — interactive documentation for every endpoint
