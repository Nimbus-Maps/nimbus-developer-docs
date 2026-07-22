---
sidebar_position: 2
title: Errors
slug: /shared/errors
description: Common error handling guidance for Nimbus APIs.
---

# Errors

Nimbus APIs use standard HTTP status codes. Error bodies may include an API-specific code, message, details object, and request identifier.

## Common Status Codes

| Status | Meaning | Recommended action |
|--------|---------|--------------------|
| `400` | Invalid request | Check required parameters, request body shape, and field values. |
| `401` | Missing, invalid, or expired credentials | Re-authenticate or refresh the access token. |
| `403` | Authenticated but not permitted | Check OAuth scopes, app roles, or subscription entitlements. |
| `404` | Resource not found | Check IDs, title numbers, order IDs, or environment. |
| `409` | Conflict | Treat idempotently where appropriate, or wait for the existing operation to complete. |
| `429` | Rate limited | Retry with exponential backoff. |
| `500` | Server error | Retry transient failures and contact Nimbus if persistent. |

## Retry Guidance

Retry transient failures such as `429`, `500`, `502`, `503`, and `504` with exponential backoff and jitter. Do not automatically retry purchases unless your integration can safely detect duplicate requests or reconcile by order status.
