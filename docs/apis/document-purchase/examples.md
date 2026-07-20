---
sidebar_position: 7
title: Examples
slug: /document-purchase/examples
description: Example requests for the Nimbus Document Purchase API.
---

# Document Purchasing API Examples

Base URL: `https://api.nimbusmaps.co.uk/docs/v1`

## Check Availability

```bash
curl "https://api.nimbusmaps.co.uk/docs/v1/check-availability?title_number=AB123456" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Subscribe to Webhooks

```bash
curl -X POST "https://api.nimbusmaps.co.uk/docs/v1/subscribe" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_url": "https://your-domain.com/webhooks/nimbus-documents"
  }'
```

## Purchase Register and Title Plan

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

## Check Order Status

```bash
curl "https://api.nimbusmaps.co.uk/docs/v1/orders/770e8400-e29b-41d4-a716-446655440002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Download a Document

```bash
curl "https://api.nimbusmaps.co.uk/docs/v1/download/11edd5d5-3615-4c59-9539-01bd7bb2cfe0" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --output document.pdf
```

## Verify Ownership

```bash
curl -X POST "https://api.nimbusmaps.co.uk/docs/v1/verify-ownership" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title_number": "AB123456",
    "first_name": "Jane",
    "last_name": "Smith"
  }'
```
