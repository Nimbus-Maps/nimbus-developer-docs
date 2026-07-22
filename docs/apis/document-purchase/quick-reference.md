---
sidebar_position: 4
title: Quick Reference
slug: /document-purchase/quick-reference
description: Endpoint and permission reference for the Nimbus Document Purchase API.
---

# Document Purchase Quick Reference

## Essential Information

### API Base URL

```text
https://api.nimbusmaps.co.uk/docs/v1
```

### Authentication

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Endpoints

### Documents

| Method | Endpoint | Purpose | Permission |
|--------|----------|---------|------------|
| GET | `/check-availability` | Check available documents, pending applications, token costs, and current balance. | `docs.read` |
| POST | `/purchase` | Purchase register, title plan, or referred documents. | `docs.purchase` |
| GET | `/download/{document_id}` | Download a purchased document. | `docs.read` |
| POST | `/verify-ownership` | Verify ownership of a title. | `docs.purchase` |

### Orders

| Method | Endpoint | Purpose | Permission |
|--------|----------|---------|------------|
| GET | `/orders/{order_id}` | Check order status and document delivery state. | `docs.read` |

### Webhooks

| Method | Endpoint | Purpose | Permission |
|--------|----------|---------|------------|
| POST | `/subscribe` | Subscribe to document status webhook notifications. | `docs.webhooks.manage` |
| DELETE | `/subscriptions/{subscription_id}` | Cancel a webhook subscription. | `docs.webhooks.manage` |
| GET | `/webhooks/audit` | Review webhook delivery audit logs. | `docs.webhooks.manage` |
| GET | `/webhooks/events/{event_id}` | Inspect an individual webhook event delivery. | `docs.webhooks.manage` |
| GET | `/webhooks/statistics` | View webhook delivery statistics. | `docs.webhooks.manage` |

### Health

| Method | Endpoint | Purpose | Permission |
|--------|----------|---------|------------|
| GET | `/health` | Health check. | None |

## Document Identifiers

Common document purchase identifiers:

- `register`
- `title_plan`
- Referred document IDs returned by `/check-availability`

## Rate Limits

| Limit | Value |
|-------|-------|
| Per minute | 60 requests per user |
| Per hour | 1,000 requests per user |

## Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue workflow. |
| 202 | Accepted | Order or document processing is still underway. |
| 400 | Invalid request | Check parameters or request body. |
| 401 | Unauthorized | Refresh or replace the token. |
| 402 | Insufficient balance | Add tokens before purchasing. |
| 403 | Forbidden | Check scopes or app roles. |
| 404 | Not found | Check title, document, or order ID. |
| 409 | Conflict | Subscription or document order already exists. |
| 429 | Rate limited | Retry with backoff. |

## Key Documentation

- [Getting started](getting-started)
- [Authentication](authentication)
- [Webhooks](webhooks)
- [Examples](examples)
- [OpenAPI reference](/api/document-purchase/)
