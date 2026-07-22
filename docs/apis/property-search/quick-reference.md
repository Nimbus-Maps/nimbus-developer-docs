---
sidebar_position: 3
title: Quick Reference
slug: /property-search/quick-reference
---

# Property Search Quick Reference

## Essential Information

### API Base URL
```
https://api.nimbusmaps.co.uk/search/v1
```

### Authentication

**Method 1: OAuth 2.0**
- **Type:** Authorization Code Flow
- **Provider:** Microsoft Entra ID
- **Scopes:** `search.titles`, `search.comps`, `search.address`
- **Header:** `Authorization: Bearer {token}`

**Method 2: Subscription Key**
- **Type:** API subscription key
- **Header:** `Ocp-Apim-Subscription-Key: {key}`
- **Obtain:** Contact Nimbus to request a subscription key

### OAuth Endpoints
```
Authorization: https://login.microsoftonline.com/d2a91423-0dc1-4853-8515-7b7b7d262791/oauth2/v2.0/authorize
Token:         https://login.microsoftonline.com/d2a91423-0dc1-4853-8515-7b7b7d262791/oauth2/v2.0/token
```

## API Endpoints

### Address search

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/address` | Search addresses (returns title IDs and UPRNs) | Yes |

### Titles

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/titles` | Look up a title by ID or title number | Yes |
| POST | `/titles` | Search titles | Yes |
| POST | `/titles/nl-query` | Search titles using natural language | Yes |
| GET | `/titles/{titleId}/planning` | Planning applications | Yes |
| GET | `/titles/{titleId}/constraints` | Environmental and planning constraints | Yes |
| GET | `/titles/{titleId}/sales` | Sales history | Yes |
| GET | `/titles/{titleId}/leases` | Lease information | Yes |
| GET | `/titles/{titleId}/leaseholds` | Associated leasehold titles | Yes |
| GET | `/titles/{titleId}/geometry` | Geographic data | Yes |
| GET | `/titles/{titleId}/buildings` | Building information | Yes |
| GET | `/titles/{titleId}/epcs` | EPC ratings | Yes |
| GET | `/titles/{titleId}/properties` | Property data | Yes |
| GET | `/titles/{titleId}/use-classes` | Planning use classes | Yes |
| GET | `/titles/{titleId}/owners` | Owner information | Yes |
| GET | `/titles/{titleId}/voa` | VOA classifications | Yes |
| GET | `/titles/{titleId}/comps` | Comparable deals for this title | Yes |
| GET | `/titles/{titleId}/footfall` | Footfall estimates | Yes |
| GET | `/titles/{titleId}/brochures` | Brochures | Yes |

### Comps

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/comps` | Look up a comparable deal by ID | Yes |
| POST | `/comps` | Search comparable deals | Yes |
| POST | `/comps/nl-query` | Search comparable deals using natural language | Yes |
| GET | `/comps/{dealId}/sales` | Deal sales | Yes |
| GET | `/comps/{dealId}/leases` | Deal leases | Yes |
| GET | `/comps/{dealId}/listings` | Deal listings | Yes |
| GET | `/comps/{dealId}/brochures` | Deal brochures | Yes |

### Utilities

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/footfall/{indexId}` | Get footfall estimates by grid cell | Yes |
| GET | `/health` | Health check | No |

## Limits

| Limit | Value |
|-------|-------|
| Max results per request | 25 (`size` parameter) |
| Pagination ceiling | 10,000 total results (`from + size ≤ 10,000`) |
| Query timeout | 5 seconds |
| Daily request limit | Varies by subscription tier |

## Test Commands

**Health check:**
```bash
curl "https://api.nimbusmaps.co.uk/search/v1/health"
```

**Search with subscription key:**
```bash
curl -X POST "https://api.nimbusmaps.co.uk/search/v1/titles" \
  -H "Ocp-Apim-Subscription-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": {"match": {"mainAddress.town": "Cambridge"}}, "size": 5}'
```

**Search with OAuth token:**
```bash
curl -X POST "https://api.nimbusmaps.co.uk/search/v1/titles" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": {"match": {"mainAddress.town": "Cambridge"}}, "size": 5}'
```

## Key Documentation

- **[Getting Started](getting-started)** — authentication and your first request
- **[Field Reference](fields/titles)** — complete field reference
- **[API Examples](examples)** — working request/response examples
- **[API Reference](/api/property-search/)** — full interactive API reference

## Common Queries

**Exact Title Number:**
```json
{"query": {"term": {"number.keyword": "LA135828"}}}
```

**Postcode Prefix:**
```json
{"query": {"prefix": {"mainAddress.postcode.value.keyword": "BL3"}}}
```

**Free-text Address:**
```json
{
  "query": {
    "multi_match": {
      "query": "30 Penarth Road Bolton",
      "fields": ["mainAddress.fullAddress^3", "mainAddress.street^2", "number^5"]
    }
  }
}
```

**Property Type:**
```json
{"query": {"term": {"propertyType.keyword": "Detached"}}}
```

**Area Range:**
```json
{"query": {"range": {"areaInAcres": {"gte": 0.01, "lte": 1.0}}}}
```

## HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Return data |
| 400 | Bad Request | Check input validation |
| 401 | Unauthorized | Check token or API key |
| 403 | Forbidden | Check scope or permissions |
| 404 | Not Found | Property or deal does not exist |
| 429 | Rate Limited | Retry with backoff |
| 500 | Server Error | Contact support if persistent |
| 503 | Service Unavailable | Address search service temporarily unavailable |
| 504 | Gateway Timeout | Query too complex — try a more specific query |
