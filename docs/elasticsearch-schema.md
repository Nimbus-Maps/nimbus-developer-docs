---
sidebar_position: 4
---

# Field Reference

This document describes the available fields for property title searches.

**Coverage:** England, Wales, Scotland

---

## Core Fields

### Identification

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | UUID | Unique property identifier | `"4665bc0b-69d6-4e04-8117-48bb25dfba2c"` |
| `number` | String | Land Registry title number | `"LA135828"` |
| `number.keyword` | Keyword | Exact match version of title number | Use for exact lookups |

### Location

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `countryIsoCode` | String | Country code (ENG, SCT) | `"ENG"` |
| `countryIsoCode.keyword` | Keyword | Exact match for filtering | Use in `term` queries |

### Property Classification

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `tenure` | String | Property tenure type (Freehold, Leasehold, NotRegistered, OWNERSHIP, PROPRIETOR, Rent, SUPERIOR, TENANCY, TENANT, Unknown). Values in uppercase are Scottish-specific legal/legacy terms. | `"Freehold"` |
| `propertyCategory` | String | Property category: Residential, Commercial, Land, Mixed, Unknown | `"Residential"` |
| `propertyCategory.keyword` | Keyword | Exact match version | Use for filtering |
| `propertyType` | Array[String] | Property types | `["Detached", "House"]` |
| `propertyType.keyword` | Keyword | Exact match for each type | Use for filtering |

### Area Measurements

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `areaInAcres` | Number | Property area in acres | `0.023483` |
| `areaInSquareFeet` | Number | Property area in square feet | `1022.906872` |
| `areaInSquareMeters` | Number | Property area in square meters | `95.03125` |
| `buildingFootprint` | Number | Total building footprint area in square feet (sum of all buildings) | `463.321213719283` |
| `siteCoverage` | Number | Percentage of site covered by buildings | `48.75461637295974` |
| `totalFloorAreaSqFt` | Number | Total floor area across all floors in square feet | `723.33408` |
| `totalRentalIncome` | Number | Total annual rental income (sum of all lease `rentAnnually` values) | `0.0` |
| `sizeOfCommercialSpaceInSquareFeet` | Number | Size of commercial floor space in square feet | `1500.0` |
| `ownerType` | Array[String] | Owner categories for this title. English titles with no recorded owners will include `["Private"]`. | `["Company"]` |

---

## Address Object (`mainAddress`)

The `mainAddress` field is a nested object containing detailed address information.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `mainAddress.fullAddress` | Text | Full searchable address | `"30, Penarth Road, Bolton, BL3 5RJ"` |
| `mainAddress.fullAddress.keyword` | Keyword | Exact match version | For exact address matching |
| `mainAddress.buildingNumber` | String | Building number | `"30"` |
| `mainAddress.buildingName` | String | Building name (if any) | `"LAND AT TYNYWERN, MAERDY"` |
| `mainAddress.subBuildingNumber` | String | Sub-building number (e.g., flat number) | `"Flat 2"` |
| `mainAddress.street` | String | Street name (uppercase) | `"PENARTH ROAD"` |
| `mainAddress.street.keyword` | Keyword | Exact match version | For filtering |
| `mainAddress.locality` | String | Locality/area | `"Heaton"` |
| `mainAddress.town` | String | Town/city | `"BOLTON"` |
| `mainAddress.town.keyword` | Keyword | Exact match version | For filtering |
| `mainAddress.county` | String | County | `"Greater Manchester"` |

### Postcode Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `mainAddress.postcode.value` | String | Full postcode | `"BL3 5RJ"` |
| `mainAddress.postcode.value.keyword` | Keyword | Exact match | For filtering |
| `mainAddress.postcode.outcode` | String | Postcode outcode | `"BL3"` |
| `mainAddress.postcode.outcode.keyword` | Keyword | Exact match | For area filtering |

---

## Owners Array (`owners`)

The `owners` field is an array of owner objects. May be empty for privacy reasons.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `owners[].companyName` | String | Company name (for corporate owners) | `"THE NATIONAL ASSEMBLY FOR WALES"` |
| `owners[].companyNumber` | String | Companies House registration number | `"12345678"` |
| `owners[].companyAddress` | String | Registered company address | `"123 Main Street, London"` |
| `owners[].ownerCategory` | String | Category of owner (Company, Council, HousingAssociation, Private) | `"Company"` |
| `owners[].ownerInAdministration` | Boolean | Whether the owner company is in administration | `false` |
| `owners[].ownerLateFiling` | Boolean | Whether the owner company has late filings at Companies House | `false` |
| `owners[].titleId` | UUID | Reference to the title | `"4665bc0b-..."` |

---

## Geometry Object (`geometry`)

Geographic data for mapping and spatial queries.

| Field | Type | Description |
|-------|------|-------------|
| `geometry.area` | Number | Area in square meters |
| `geometry.centroid` | GeoPoint | Property centroid (lat/lon) |
| `geometry.centroid.lat` | Number | Latitude |
| `geometry.centroid.lon` | Number | Longitude |
| `geometry.multiPolygonGeometry.type` | String | GeoJSON geometry type ("multipolygon") |
| `geometry.multiPolygonGeometry.coordinates` | Array | Array of polygon coordinate arrays (GeoJSON format) |
| `geometry.titleId` | UUID | Reference to the title |

**Example GeoPoint Query:**
```json
{
  "query": {
    "geo_distance": {
      "distance": "5km",
      "geometry.centroid": {
        "lat": 53.5768,
        "lon": -2.4282
      }
    }
  }
}
```

---

## Constraints Array (`constraints`)

Planning and environmental constraints affecting the property.

| Field | Type | Description |
|-------|------|-------------|
| `constraints[].titleId` | UUID | Reference to the title |
| `constraints[].name` | String | Constraint type name (see enum below) |
| `constraints[].categoryName` | String | Constraint category or severity (varies by constraint type) |
| `constraints[].isOverlapping` | Boolean | Whether constraint overlaps with property |
| `constraints[].overlapPercentage` | Number | Percentage of property affected |

**Constraint Name Enum Values:**
- AgriculturalLandClassification
- AncientWoodland
- AreaOfNaturalBeauty
- Battlefield
- ConservationArea
- CountrysideAndRightOfWay
- FloodZone
- GreenBelt
- HistoricParkAndGarden
- ListedBuilding
- LocalNatureReserve
- LondonOtherOpenSpace
- NationalNatureReserve
- NationalPark
- PublicRightsOfWay
- Radon
- Ramsar
- ScheduledMonument
- SiteOfSpecialScientificInterest
- SpecialAreaOfConservation
- SpecialProtectionArea
- SurfaceWaterFlooding
- WorldHeritageSite

---

## Leases Array (`leases`)

Lease information for leasehold properties.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `leases[].titleId` | UUID | Reference to the title | `"4665bc0b-..."` |
| `leases[].leaseStartDate` | DateTime | Lease start date | `"1909-05-12T00:00:00Z"` |
| `leases[].leaseEndDate` | DateTime | Lease end date | `"2899-05-11T23:00:00Z"` |
| `leases[].leaseLength` | Integer | Lease length in years | `990` |
| `leases[].leaseType` | String | Type of lease (Business, Occupational, VirtualFreehold) | `"VirtualFreehold"` |
| `leases[].tenantInAdministration` | Boolean | Whether the tenant company is in administration | `false` |
| `leases[].tenantLateFiling` | Boolean | Whether the tenant company has late filings | `false` |
| `leases[].rent` | Number | Raw rent amount as recorded in the lease | `15000.0` |
| `leases[].rentAnnually` | Number | Annual rent amount | `15000.0` |
| `leases[].rentPerSquareFoot` | Number | Rent per square foot | `12.5` |
| `leases[].rentReviewDateText` | String | Rent review date as free text | `"2026-03-25"` |
| `leases[].breakClauseDescription` | String | Description of break clause terms | `"Mutual break at year 5"` |
| `leases[].breakClauseTermInMonths` | Integer | Break clause term length in months | `60` |
| `leases[].breakClauseFromDate` | String | Date from which the break clause applies | `"2028-01-01"` |
| `leases[].breakPenalty` | Number | Financial penalty for exercising the break clause | `5000.0` |

---

## Leaseholds Array (`leaseholds`)

Leasehold titles associated with this freehold title.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `leaseholds[].titleId` | UUID | The freehold title ID | `"4665bc0b-..."` |
| `leaseholds[].leaseholdTitleId` | UUID | The leasehold title ID | `"abc123-..."` |
| `leaseholds[].leaseholdTitleNumber` | String | The leasehold title number | `"EGL123456"` |
| `leaseholds[].companyName` | String | Leaseholder company name | `"ABC Limited"` |
| `leaseholds[].companyNumber` | String | Leaseholder company registration number | `"12345678"` |
| `leaseholds[].companyAddress` | String | Leaseholder company address | `"London"` |
| `leaseholds[].tenantInAdministration` | Boolean | Whether leaseholder is in administration | `false` |
| `leaseholds[].tenantLateFiling` | Boolean | Whether leaseholder has late filings | `false` |

---

## Sales Array (`sales`)

Property sale transactions.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `sales[].titleId` | UUID | Reference to the title | `"4665bc0b-..."` |
| `sales[].dateAcquired` | DateTime | Sale date | `"2024-05-02T23:00:00Z"` |
| `sales[].price` | Number | Sale price in GBP | `368500.0` |
| `sales[].pricePerSquareFoot` | Number | Price per square foot | `503.4529907430228` |

---

## Planning Array (`planning`)

Planning applications associated with the property.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `planning[].titleId` | UUID | Reference to the title | `"4665bc0b-..."` |
| `planning[].reference` | String | Planning application reference | `"C/99/1017"` |
| `planning[].authority` | String | Planning authority | `"Coventry LPA"` |
| `planning[].description` | String | Application description | `"Erection of two storey side extension to house."` |
| `planning[].dateSubmitted` | DateTime | Submission date | `"1999-10-22T00:00:00Z"` |
| `planning[].decision` | String | Planning decision text (varies by authority, may be null) | `"Approved with conditions"` |
| `planning[].decisionStatus` | String | Normalised decision status. Use this field for filtering rather than the raw decision text. Falls back to application status when no decision has been recorded. | `"GRANTED"` |
| `planning[].status` | String | Application status | `"DECIDED"` |
| `planning[].decisionDate` | DateTime | Date the decision was issued | `"2008-01-14T00:00:00Z"` |
| `planning[].applicationUrl` | String | URL to planning application details | `"https://..."` |
| `planning[].agentName` | String | Agent name | `"Ms K Whitfield"` |
| `planning[].agentCompany` | String | Agent company name | `"Smith Planning Ltd"` |
| `planning[].agentAddress` | String | Agent full address | `"1 High Street, London"` |
| `planning[].applicantName` | String | Applicant name | `"Mr C A Koziol"` |
| `planning[].applicantCompany` | String | Applicant company name | `"Acme Developments Ltd"` |
| `planning[].applicantAddress` | String | Applicant full address | `"2 Park Road, Manchester"` |
| `planning[].units` | Integer | Number of units | `1` |
| `planning[].year` | Integer | Year of application | `1999` |

---

## Buildings Array (`buildings`)

Buildings on the property.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `buildings[].id` | UUID | Building identifier | `"abc123-..."` |
| `buildings[].titleId` | UUID | Reference to the title | `"4665bc0b-..."` |
| `buildings[].builtYear` | String | Construction year or range | `"1980-1989"` |
| `buildings[].height` | Number | Building height in meters | `7.9` |
| `buildings[].eavesHeight` | Number | Eaves height in meters | `4.8` |
| `buildings[].heightAboveSea` | Number | Height above sea level in meters | `12.8` |
| `buildings[].footprintAreaSqFt` | Number | Building footprint area | `329.50211625656` |
| `buildings[].uprns[]` | Array | Unique Property Reference Numbers associated with building | See UPRN section |

---

## UPRNs Array (`uprns`)

Unique Property Reference Numbers for properties. Note: `uprnIdentifier` is a UUID identifier for the UPRN record, not the numeric UPRN value.

The same UPRN objects appear both at the top-level `uprns[]` array and nested within `buildings[].uprns[]`.

### Identity & Address

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `uprns[].uprnIdentifier` | UUID | UUID identifier for the UPRN record | `"2a13433e-3119-418d-b937-2bd199568038"` |
| `uprns[].address` | String | Full address string | `"9, Blackthorn Close, Cambridge, CB4 1FZ"` |
| `uprns[].buildingNumber` | String | Building number | `"9"` |
| `uprns[].buildingName` | String | Building name (if applicable) | `"Regent House"` |
| `uprns[].subBuildingNumber` | String | Sub-building or flat number | `"Flat 2"` |
| `uprns[].street` | String | Street name | `"BLACKTHORN CLOSE"` |
| `uprns[].locality` | String | Locality name | `"Kensington"` |
| `uprns[].town` | String | Town or city | `"CAMBRIDGE"` |
| `uprns[].county` | String | County | `"Cambridgeshire"` |
| `uprns[].postcode.value` | String | Full postcode | `"CB4 1FZ"` |
| `uprns[].postcode.outcode` | String | Postcode outcode | `"CB4"` |

### Measurements & Classification

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `uprns[].floor` | String | Floor level(s) as comma-separated string | `"0, 1"` |
| `uprns[].floorAreaSqFt` | Number | Floor area in square feet | `731.95` |
| `uprns[].rateableValue` | Number | Rateable value for business rates | `5000.0` |
| `uprns[].hasBuildings` | Boolean | Whether UPRN has associated buildings | `true` |
| `uprns[].useClass[]` | Array[String] | UK Planning Use Class codes (simple string array) | `["C3"]` |
| `uprns[].useClasses[]` | Array[Object] | Structured use class data with descriptions (see below) | — |
| `uprns[].useClasses[].code` | String | Planning use class code | `"C3"` |
| `uprns[].useClasses[].description` | String | Generic planning use class description | `"Single-family homes"` |
| `uprns[].useClasses[].classificationDescription` | String | Specific AddressBase/VOA classification description | `"Detached"` |

### Rooms, EPC & VOA

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `uprns[].rooms.beds` | Integer | Number of bedrooms | `2` |
| `uprns[].rooms.baths` | Integer | Number of bathrooms | `1` |
| `uprns[].rooms.receps` | Integer | Number of reception rooms | `2` |
| `uprns[].epc.currentRating` | String | Current EPC rating (A, A+, B, B+, C, C+, Carbon Neu, D, D+, E, E+, F, F+, G) | `"C"` |
| `uprns[].epc.potentialRating` | String | Potential EPC rating | `"B"` |
| `uprns[].vOA[].typeCode` | String | VOA special category code | `"203"` |
| `uprns[].vOA[].typeDescription` | String | VOA property type description | `"Offices (Inc Computer Centres)"` |

---

## Date Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `lastModified` | DateTime | Last modification timestamp | `"2025-11-15T10:43:35.9171574+00:00"` |

---

## Common Query Patterns

### Text Search on Address
```json
{
  "query": {
    "match": {
      "mainAddress.fullAddress": "Bolton"
    }
  }
}
```

### Exact Title Number Lookup
```json
{
  "query": {
    "match": {
      "number": "LA135828"
    }
  }
}
```

### Filter by Property Type and Area
```json
{
  "query": {
    "bool": {
      "must": [
        {"match": {"propertyCategory": "Residential"}}
      ],
      "filter": [
        {"term": {"tenure": "Freehold"}},
        {"range": {"areaInAcres": {"gte": 0.1, "lte": 1.0}}}
      ]
    }
  }
}
```

### Geographic Search (5km radius)
```json
{
  "query": {
    "geo_distance": {
      "distance": "5km",
      "geometry.centroid": {
        "lat": 53.5768,
        "lon": -2.4282
      }
    }
  }
}
```

### Geographic Bounding Box Search
```json
{
  "query": {
    "bool": {
      "must": [
        {"match": {"propertyCategory": "Commercial"}}
      ],
      "filter": [
        {
          "geo_bounding_box": {
            "geometry.centroid": {
              "top_left": {"lat": 53.6, "lon": -2.5},
              "bottom_right": {"lat": 53.5, "lon": -2.4}
            }
          }
        }
      ]
    }
  },
  "size": 25
}
```

### Properties with Recent Planning Approvals (Nested)
```json
{
  "query": {
    "nested": {
      "path": "planning",
      "query": {
        "bool": {
          "must": [
            {"match": {"planning.decisionStatus": "GRANTED"}},
            {"range": {"planning.dateSubmitted": {"gte": "2020-01-01"}}}
          ]
        }
      }
    }
  },
  "size": 10
}
```

---

## Performance Tips

1. **Use `.keyword` fields for filtering** — Much faster than analysed text fields
2. **Use filters for non-scoring criteria** — Filters are faster than `must`/`should` clauses when relevance scoring is not needed
3. **Avoid deep pagination** — Use `search_after` for iterating beyond the first page of results
4. **Use prefix/wildcard queries sparingly** — Can be slow on large datasets
5. **Set appropriate `size` values** — The API enforces a maximum of 25 results per request
