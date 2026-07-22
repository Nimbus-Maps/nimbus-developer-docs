---
sidebar_position: 5
title: Webhooks
slug: /document-purchase/webhooks
description: Subscribe to Document Purchase API webhooks and verify signatures.
---

# Document Purchasing API Webhook notifications

The Document Purchase API delivers document status changes to your webhook URL. A single order containing multiple documents can produce multiple webhook events.

## Endpoint Requirements

Your webhook endpoint must:

- Use HTTPS
- Be publicly accessible
- Accept JSON `POST` requests
- Respond with `200 OK` within 30 seconds
- Verify HMAC-SHA256 signatures

## Subscribe

```bash
curl -X POST "https://api.nimbusmaps.co.uk/docs/v1/subscribe" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_url": "https://your-domain.com/webhooks/nimbus-documents"
  }'
```

The response includes a `secret`. Store it immediately; it is returned only once and is required for signature verification.

## Event Payload

```json
{
  "eventId": "88867097-4322-436e-ac1a-435e1bd17a15",
  "eventType": "document.status_changed",
  "timestamp": "2026-01-15T14:34:52Z",
  "data": {
    "reference": "11edd5d5-3615-4c59-9539-01bd7bb2cfe0",
    "titleNumber": "AB123456",
    "documentDescription": "Official Copy of Title Register",
    "previousStatus": 1,
    "newStatus": 2,
    "statusDescription": "Completed",
    "message": null,
    "downloadUrl": "/Lookup/DownloadDocument?userDocumentReference=11edd5d5-3615-4c59-9539-01bd7bb2cfe0"
  }
}
```

Use `data.reference` as the `{document_id}` when calling `GET /download/{document_id}`.

## Signature Verification

Webhook requests include:

```http
X-Webhook-Signature: BASE64_HMAC_SHA256_SIGNATURE
X-Webhook-Event: document.status_changed
X-Webhook-Id: UNIQUE_EVENT_ID
```

To verify a signature:

1. Read the raw request body before JSON parsing.
2. Compute HMAC-SHA256 over the raw body using the subscription secret.
3. Base64-encode the digest.
4. Compare it with `X-Webhook-Signature` using a constant-time comparison.

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(rawBody, signature, secret) {
  if (!signature) return false;

  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  const expected = Buffer.from(expectedHash);
  const provided = Buffer.from(signature);

  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}
```

## Delivery Operations

Use the webhook audit endpoints to investigate delivery:

- `GET /webhooks/audit`
- `GET /webhooks/events/{event_id}`
- `GET /webhooks/statistics`
