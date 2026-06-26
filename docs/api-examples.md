---
sidebar_position: 3
---

# API Examples

Base URL: `https://api.nimbusmaps.co.uk/search/v1`

## Authentication

All requests (except `/health`) require authentication via one of:

```
Authorization: Bearer {ACCESS_TOKEN}
```
or
```
Ocp-Apim-Subscription-Key: YOUR_API_KEY
```

---

## GET /titles — Find Single Title

### Lookup by ID

```http
GET /titles?id=4665bc0b-69d6-4e04-8117-48bb25dfba2c HTTP/1.1
Host: api.nimbusmaps.co.uk
Ocp-Apim-Subscription-Key: YOUR_API_KEY
```

### Lookup by Title Number (English)

```http
GET /titles?number=LA135828&country=ENG HTTP/1.1
Host: api.nimbusmaps.co.uk
Ocp-Apim-Subscription-Key: YOUR_API_KEY
```

### Lookup by Title Number (Scottish)

```http
GET /titles?number=ROS8936&country=SCT HTTP/1.1
Host: api.nimbusmaps.co.uk
Ocp-Apim-Subscription-Key: YOUR_API_KEY
```

---

## POST /titles — Search Titles

### Simple Text Match

```json
{
  "query": {
    "match": {
      "mainAddress.fullAddress": "Bolton"
    }
  },
  "size": 10
}
```

### Boolean Query with Filters

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "mainAddress.town": "Cambridge" } }
      ],
      "filter": [
        { "range": { "areaInAcres": { "gte": 0.01, "lte": 1.0 } } }
      ]
    }
  },
  "size": 10
}
```

### Multi-Field Search

```json
{
  "query": {
    "multi_match": {
      "query": "30 Penarth Road Bolton",
      "fields": [
        "mainAddress.fullAddress^3",
        "mainAddress.street^2",
        "mainAddress.town^2",
        "number^5"
      ],
      "fuzziness": "AUTO"
    }
  },
  "size": 10
}
```

### Geographic Bounding Box

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "propertyCategory": "Commercial" } }
      ],
      "filter": [
        {
          "geo_bounding_box": {
            "geometry.centroid": {
              "top_left": { "lat": 53.6, "lon": -2.5 },
              "bottom_right": { "lat": 53.5, "lon": -2.4 }
            }
          }
        }
      ]
    }
  },
  "size": 25
}
```

### Property Distribution Analysis (Aggregations)

```json
{
  "query": {
    "match": { "mainAddress.town": "Cambridge" }
  },
  "size": 0,
  "aggs": {
    "by_tenure": { "terms": { "field": "tenure" } },
    "avg_area": { "avg": { "field": "areaInAcres" } },
    "price_ranges": {
      "histogram": { "field": "sales.price", "interval": 50000 }
    }
  }
}
```

### Search by Lease Characteristics (Nested)

```json
{
  "query": {
    "nested": {
      "path": "leases",
      "query": {
        "range": { "leases.rentAnnually": { "gte": 5000 } }
      }
    }
  },
  "size": 10
}
```

### Properties with Company Owners (Nested)

```json
{
  "query": {
    "nested": {
      "path": "owners",
      "query": {
        "exists": { "field": "owners.companyName" }
      }
    }
  },
  "size": 10
}
```

### Properties by Price per Square Foot (Nested + Sort)

```json
{
  "query": {
    "nested": {
      "path": "sales",
      "query": {
        "range": { "sales.pricePerSquareFoot": { "gte": 400, "lte": 600 } }
      }
    }
  },
  "sort": [
    {
      "sales.dateAcquired": {
        "order": "desc",
        "nested": { "path": "sales" }
      }
    }
  ],
  "size": 10
}
```

---

## POST /titles/nl-query — Natural Language Search

The natural language search endpoint accepts plain English queries and executes them automatically.

### Simple Location Search

```json
{ "query": "houses in Bolton", "size": 10 }
```

**Response:**
```json
{
  "queryDescription": "Searching for residential properties in Bolton",
  "results": {
    "hits": {
      "total": { "value": 1234, "relation": "eq" },
      "hits": [ ... ]
    }
  }
}
```

The response also includes an `elasticsearchQuery` field containing the generated query — useful for iterative refinement or for converting to a structured `POST /titles` request.

### Complex Criteria

```json
{ "query": "commercial properties in Cambridge over 2 acres", "size": 15 }
```

```json
{ "query": "freehold residential properties in London between 0.5 and 1 acre", "size": 20 }
```

```json
{ "query": "properties with listed building constraints in Oxford", "size": 10 }
```

**Tips:**
- Be specific about location (town, city, postcode area)
- Specify property type (residential, commercial, land)
- Use comparative terms for area ("over 3 acres", "between 0.5 and 1 acre")
- The `queryDescription` field shows exactly what was searched — use it to refine subsequent queries
- Queries are capped at 500 characters

---

## GET /address — Address Search

Finds matching addresses by free-text query and returns UPRN and Title UUIDs.

```http
GET /address?address=30+Penarth+Road+Bolton HTTP/1.1
Host: api.nimbusmaps.co.uk
Ocp-Apim-Subscription-Key: YOUR_API_KEY
```

**Response:**
```json
{
  "jsonapi": { "version": "1.0" },
  "data": [
    {
      "type": "searchIdResult",
      "attributes": {
        "uprnRef": { "id": "92403a5a-58da-4870-b021-762e673d34be" },
        "titleRef": { "id": "4665bc0b-69d6-4e04-8117-48bb25dfba2c", "tenure": "Leasehold" },
        "fullAddress": "30, Penarth Road, Bolton, BL3 5RJ",
        "latitude": 53.582,
        "longitude": -2.428
      }
    }
  ],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "totalResults": 1,
    "maxResults": 10
  }
}
```

Use the `titleRef.id` to call any `/titles/{titleId}/*` endpoint.

---

## Title Sub-resource Endpoints

All sub-resources follow the pattern `GET /titles/{titleId}/{resource}`.

### Planning Applications

```http
GET /titles/4665bc0b-69d6-4e04-8117-48bb25dfba2c/planning HTTP/1.1
```

**Response:**
```json
[{
  "reference": "C/99/1017",
  "authority": "Cambridge",
  "description": "Erection of two storey side extension to house.",
  "dateSubmitted": "1999-10-22T00:00:00Z",
  "decision": "Approved with conditions",
  "decisionStatus": "GRANTED"
}]
```

### Sales History

```http
GET /titles/4665bc0b-69d6-4e04-8117-48bb25dfba2c/sales HTTP/1.1
```

**Response:**
```json
[{ "dateAcquired": "2024-05-02T23:00:00Z", "price": 368500.0, "pricePerSquareFoot": 503.45 }]
```

### Footfall Estimates

```http
GET /titles/4665bc0b-69d6-4e04-8117-48bb25dfba2c/footfall HTTP/1.1
```

**Response:**
```json
{
  "titleId": "4665bc0b-69d6-4e04-8117-48bb25dfba2c",
  "indexId": "630949366352100863",
  "averages": {
    "daily": 380.0,
    "rushHours": 440.0,
    "weekendDaytime": 330.0
  },
  "monthly": [...]
}
```

---

## Notes

- All POST requests require `Content-Type: application/json`
- Maximum result size is 25 documents (`size` parameter)
- Query timeout is 5 seconds
- Total result pagination limit: `from + size ≤ 10,000`
