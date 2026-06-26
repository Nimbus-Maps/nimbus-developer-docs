---
sidebar_position: 5
---

# Comparable Deals Field Reference

This document describes the available fields for comparable deal searches.

## Root Deal Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique deal identifier |
| `titleId` | UUID | Linked HMLR title identifier |
| `uprnId` | UUID | Linked UPRN identifier |
| `comparableType` | Keyword | `Land`, `Residential`, `Commercial` |
| `comparableStatus` | Keyword | `RegisteredSale`, `QuotingPrice`, `Availability` |
| `dealType` | Keyword | `Investment`, `VacantPossession`, `OccupationalLease`, `BusinessLease`, `Residential`, `Lease`, `Sale`, `Unknown` |
| `ownershipType` | Keyword | `Freehold`, `Leasehold`, `VirtualFreehold`, `Unknown` |
| `propertyType` | Keyword array | Property types such as `Detached` or `Offices` |
| `siteSizeInAcres` | Number | Site area in acres |
| `mixedUse` | Boolean | Whether this is a mixed-use deal |
| `validationStatus` | String | Deal validation status |

## Deal Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `dealData.dealDate` | Date | Transaction date |
| `dealData.endDate` | Date | Lease end date |
| `dealData.leaseTerm` | Integer | Lease term in years |
| `dealData.dealPrice` | Number | Transaction price in GBP |
| `dealData.indexedPrice` | Number | HPI-adjusted price in GBP |
| `dealData.premiumPrice` | Number | Premium price in GBP |
| `dealData.isPremium` | Boolean | Premium deal flag |
| `dealData.dealPricePerSquareFoot` | Number | Price per square foot |
| `dealData.dealPricePerAcre` | Number | Price per acre |
| `dealData.dealPricePerUnit` | Number | Price per unit |
| `dealData.numberOfUnits` | Integer | Number of units |
| `dealData.siteAreaInSquareMeters` | Number | Site area in square meters |
| `dealData.siteAreaInSquareFeet` | Number | Site area in square feet |
| `dealData.totalFloorAreaInSquareFeet` | Number | Total floor area in square feet |
| `dealData.dealAddress` | Text | Full deal address; use `match` for towns, cities, and postcode text |
| `dealData.transactionType` | Keyword | `Sale` or `Letting` |
| `dealData.propertyType` | String | Comma-separated property type summary |
| `dealData.propertyTypeArray` | Keyword array | Property type values |
| `dealData.propertyCondition` | Keyword | `Newbuild`, `Secondhand`, `Unknown` |
| `dealData.useClass` | Keyword array | Planning use class codes |
| `dealData.useClasses` | String | Use class codes with descriptions |
| `dealData.voaCode` | Keyword array | VOA category codes |
| `dealData.daysOnMarket` | Integer | Days on market |
| `dealData.netYield` | Number | Net yield percentage |
| `dealData.listingAgent` | String | Listing agent summary |
| `dealData.countryIsoCode` | Keyword | `ENG` or `SCT` |
| `dealData.lastModified` | Date | Last indexed timestamp |
| `dealData.dealGeometry.centroid` | Geo point | Deal centroid for geo queries |
| `dealData.dealGeometry.area` | Number | Geometry area in square meters |

## Query Examples

Commercial sales over one million pounds:

```json
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "comparableType": "Commercial" } },
        { "term": { "dealData.transactionType": "Sale" } },
        { "range": { "dealData.dealPrice": { "gte": 1000000 } } }
      ]
    }
  },
  "sort": [{ "dealData.dealDate": { "order": "desc" } }],
  "size": 10
}
```

Investment yield analysis:

```json
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "comparableType": "Commercial" } },
        { "term": { "dealType": "Investment" } },
        { "range": { "dealData.netYield": { "gte": 6 } } }
      ]
    }
  },
  "size": 10
}
```

Deals linked to a title:

```json
{
  "query": {
    "term": { "titleId": "cb534ec8-6059-49ad-b40d-3e836a91c36e" }
  },
  "size": 25
}
```
