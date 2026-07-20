---
sidebar_position: 4
title: FAQ
slug: /property-search/faq
description: Common questions about data coverage, search capabilities, rate limits, and authentication for the Nimbus Property Search API.
---

# Property Search FAQ

Common questions about the Nimbus Property Search API — what data is available, how to query it, and what the limits are.

---

## Data Coverage

### Which countries and regions does the API cover?

England, Wales, and Scotland.

### What types of property does the API cover?

* All registered land titles: residential (houses, flats, bungalows, etc.), commercial, mixed-use, and bare land. Freeholds, Leaseholds and all Registers of Scotland interest types are included. Each title is categorised as `Residential`, `Commercial`, `Land`, or `Mixed`.
* Unregistered land and properties: UPRNs and planning applications for properties and plots of land which are not yet registered with HMLR or Registers of Scotland.
* Short leases: sub-7 year leaseholds which are not registered with Land Registry but are made available through our researched and contributed data.

---

## Data Types Available

### What information is returned for a property title?

Each title can include:

| Data type | Description |
|-----------|-------------|
| Address | Full address, postcode, UPRN linkage |
| Tenure & category | Freehold / leasehold; residential, commercial, land, mixed |
| Ownership | Owner name (companies only), owner type, Companies House number, administration status |
| Area measurements | Site area (acres, sq ft, sq m), building footprint, total floor area, site coverage % |
| Buildings | Height, eaves height, footprint, estimated year built |
| Leases | Tenant, rent per annum, lease term, break clauses, rent review dates |
| Sales history | Transaction dates, prices, price per sq ft |
| Planning applications | Reference, authority, application type, decision, key dates |
| Environmental constraints | 22 constraint types with boundary overlap percentage |
| EPC ratings | Energy performance certificate data (A–G) |
| VOA classification | Valuation Office Agency use codes and rateable values |
| Comparable deals | Linked sales and lettings transactions |
| Footfall | Estimated visitor counts by time period |
| Brochures | Archived PDF brochures for commercial and residential sales and lettings |

### What comparable deal data is available?

Commercial and residential sales, lettings, and investment transactions. Each deal record includes:

- Deal price, price per sq ft, price per acre, price per unit
- HPI-indexed price (House Price Index adjusted)
- Net yield (%)
- Lease term and use class
- Days on market
- Listing agent
- Transaction type (Sale or Letting)
- Property condition (New build, Second hand)
- Linked brochure PDFs where available

### What planning data is included?

Planning application reference numbers, local authority, application type, decision status, and key dates (submitted, decided, appeal). Decision statuses are normalised across all local authorities so they can be filtered consistently (e.g. `GRANTED`, `REFUSED`).

### What environmental constraints are supported?

22 constraint types are available. Each returned constraint includes the percentage of the title boundary that overlaps with the constraint:

- Agricultural Land Classification
- Ancient Woodland
- Area of Natural Beauty
- Battlefield
- Conservation Area
- Countryside and Right of Way
- Flood Zone
- Green Belt
- Historic Park and Garden
- Listed Building
- Local Nature Reserve
- London Other Open Space
- National Nature Reserve
- National Park
- Public Rights of Way
- Radon
- Ramsar
- Scheduled Monument
- Site of Special Scientific Interest
- Special Area of Conservation
- Special Protection Area
- Surface Water Flooding
- World Heritage Site

### Is footfall data available?

Yes, the API includes footfall numbers across England, Scotland and Wales. Footfall estimates are provided by grid cell with breakdowns across seven time periods: daily average, rush hours, office hours, Friday night-out, weekend daytime, night hours, and sleeping hours.

### Are EPC ratings available?

Yes. EPC data is linked via UPRN (Unique Property Reference Number). Properties with multiple units may carry multiple EPC records.

---

## Search Capabilities

### How do I search for properties?

Three methods are available:

1. **Direct lookup** — retrieve a title by its internal ID or Land Registry title number
2. **Structured query** — full Elasticsearch query DSL, supporting filters, ranges, nested queries, geo-spatial queries, and aggregations
3. **Natural language** — plain English queries (e.g. "commercial freeholds in Manchester over 5 acres") up to 500 characters that are automatically converted to a structured query

### Can I search by location?

Yes. Titles can be filtered by postcode, town, county, bounding box (latitude/longitude coordinates), or radial distance from a point.

### Can I filter by owner type?

Yes. The `ownerType` field supports filtering by `Company`, `Council`, `HousingAssociation`, or `Private`.

### Can I filter by tenure, property type, or area?

Yes — all three are indexed fields. Area filters accept range queries (e.g. sites between 1 and 5 acres). Property type and tenure are multi-value fields that can be matched exactly or with boolean logic.

### Can I run aggregations or analytics queries?

Yes. The API supports standard Elasticsearch aggregations alongside search results — for example, average deal price by use class, title count by tenure type, or price-per-sq-ft histogram distributions.

---

## API Limits

### How many results can I retrieve per request?

Up to **25 results** per request. Use the `from` parameter to paginate through larger result sets.

### Is there a total pagination limit?

Yes. The maximum accessible result offset is **10,000** (`from + size` must be ≤ 10,000). For result sets larger than this, narrow your query with additional filters or use aggregations to summarise the data.

### Is there a query timeout?

Yes — queries must complete within **5 seconds**. Complex nested queries over large result sets may need to be refined with additional filters. If a query times out, the API returns a `504 Gateway Timeout`.

### What are the rate limits?

Rate limits vary by subscription tier. Talk to your Nimbus account manager to understand your rate limits or upgrade to enable higher capacity.

---

## Data Limitations

### Are private owner names available?

No. For titles registered to private individuals in England, owner names are withheld in line with HM Land Registry privacy rules. These titles return `ownerType: ["Private"]` with no name. Company owners are returned in full, including Companies House registration number.

### Is every data point visible in the Nimbus web app available?

Not yet. Further location analysis data is still being added, including planning policy constraints, strategic land, energy and infrastructure and traffic data.

---

## Authentication & Access

### How does authentication work?

Two authentication methods are supported:

- **Subscription key** — pass your key as the `Ocp-Apim-Subscription-Key` request header. Simple to integrate; suitable for server-to-server use.
- **OAuth 2.0 (Microsoft Entra ID)** — preferred for multi-user or end-user-facing applications. Supports fine-grained access control via scopes.

### What OAuth scopes control access to data?

| Scope | Data accessible |
|-------|----------------|
| `search.titles` | Property title search and all title sub-resources |
| `search.comps` | Comparable deal search and all deal sub-resources |
| `search.address` | Address lookup |

Customers are provisioned with the scopes that their subscription covers.

### Is there a health check endpoint?

Yes — `GET /health` requires no authentication and returns the current API status. This can be used for uptime monitoring and integration health checks.

---

## Integration

### What format does the API return data in?

All endpoints return **JSON**. Geometry data (title boundaries, centroids) is returned in GeoJSON format.

### Is an OpenAPI specification available?

Yes — the full OpenAPI 3.0 specification is available in the [Property Search API Reference](/api/property-search/) section of this documentation. It can also be downloaded and used to generate client SDKs in any language.

### Is there a sandbox or test environment?

Yes — a pre-production environment is available at `https://api-preprod.nimbusmaps.xyz/search/v1`. Contact Nimbus to arrange test credentials.
