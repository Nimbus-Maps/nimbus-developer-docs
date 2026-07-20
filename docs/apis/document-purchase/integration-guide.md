---
sidebar_position: 6
title: Integration Guide
slug: /document-purchase/integration-guide
description: Authentication, webhook, purchase, download, testing, and production guidance for integrating with the Nimbus Document Purchase API.
---

# Document Purchase Integration Guide

## Overview

This guide covers both authentication modes supported by the Nimbus Document Purchase API.

**Delegated user flow** — your server calls the API on behalf of an authenticated end user. Every purchase is tied to a specific user identity. Uses OAuth 2.0 On-Behalf-Of (OBO) with Entra ID.

**Application (S2S) flow** — your server calls the API using its own identity, with no end-user credentials. Uses OAuth 2.0 client credentials grant with Entra ID. Purchases and audit records are tied to a Nimbus service identity provisioned for your integration.

---

## Table of Contents

- [Authentication Architecture](#authentication-architecture)
- [Application (S2S) Flow](#application-s2s-flow)
  - [Prerequisites for S2S](#prerequisites-for-s2s)
  - [Acquiring a Client Credentials Token](#acquiring-a-client-credentials-token)
  - [Calling the API](#calling-the-api-s2s)
  - [Service Identity and Billing](#service-identity-and-billing)
- [Delegated User Flow](#delegated-user-flow)
- [Prerequisites: What You Need from Nimbus](#prerequisites-what-you-need-from-nimbus)
- [Azure AD App Registration Setup](#azure-ad-app-registration-setup)
- [Implementation Steps](#implementation-steps)
  - [Step 1: Authenticate Your End Users](#step-1-authenticate-your-end-users)
  - [Step 2: Subscribe to Webhooks](#step-2-subscribe-to-webhooks)
  - [Step 3: Check Document Availability](#step-3-check-document-availability)
  - [Step 4: Purchase Documents](#step-4-purchase-documents)
  - [Step 5: Receive Webhook Notifications](#step-5-receive-webhook-notifications)
- [Code Examples](#code-examples)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Production Checklist](#production-checklist)

---

## Authentication Architecture

The API accepts two types of OAuth 2.0 Bearer tokens issued by Entra ID for the same audience (`api://{document-api-app-id}`):

| | Delegated user flow | Application (S2S) flow |
|---|---|---|
| Grant type | Authorization code / device code | Client credentials |
| Token claim | `scp` | `roles` |
| User required | Yes | No |
| Billing/audit identity | The authenticated end user | A Nimbus service identity provisioned per integration |
| Webhook subscriptions | Per user | Per integration (one shared identity) |

Both token types are validated by APIM before the request reaches the API. APIM strips all `Jupiter-APIM-*` headers from inbound requests and reinjects trusted auth context based on the validated token.

---

## Application (S2S) Flow

Use this flow when your system needs to call the API autonomously, without an end user authenticating in real time.

### Prerequisites for S2S

Contact Nimbus and provide:
- **Organization and integration name** — used to create a named Nimbus service identity for billing and audit
- **Environment** — pre-production, production, or both
- **Required app roles** — `docs.read`, `docs.purchase`, and/or `docs.webhooks.manage`

Nimbus will:
1. Create an Entra ID application registration in the Nimbus tenant and provide you with a **Client ID** and **Client Secret**
2. Grant the requested app roles on the Document API to your app registration
3. Provision a Nimbus service identity (user reference) that will be used for all billing, Ledger audit, and Legacy API calls made by your integration

### Acquiring a Client Credentials Token

```http
POST https://login.microsoftonline.com/d2a91423-0dc1-4853-8515-7b7b7d262791/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id={your-client-id}
&client_secret={your-client-secret}
&grant_type=client_credentials
&scope=api://{document-api-app-id}/.default
```

**Scope values by environment:**

| Environment | Scope |
|---|---|
| Pre-production | `api://f995e7f1-7a92-4c17-82a7-3187c5b158bf/.default` |
| Production | `api://d5ddd66b-0c00-4c46-bb81-672727b71aa5/.default` |

Tokens are valid for 1 hour. Implement token caching and refresh before expiry to avoid acquiring a new token on every request.

### Calling the API (S2S)

Call any endpoint using the token as a Bearer token, exactly as in the delegated flow:

```http
GET /docs/v1/check-availability?title_number=AB123456
Authorization: Bearer {app-access-token}
```

The response shape is identical to the delegated flow.

### Service Identity and Billing

All requests authenticated with the application flow use the Nimbus service identity provisioned for your integration. This means:

- **Token balance** — checked and deducted against the service identity's company account
- **Ledger audit** — all purchases are recorded under the service identity, not an end user
- **Webhook subscriptions** — created under the service identity; one subscription covers all requests from your integration
- **Document orders** — ownership in the Legacy API is attributed to the service identity

If you need per-human audit within your own system, record the end-user context on your side before calling the API. Do not forward arbitrary caller-supplied user identifiers to Nimbus.

---

## Delegated User Flow

Use this flow when each API call must be tied to a specific authenticated end user.



## Prerequisites: What You Need from Nimbus

Before implementing, you must receive the following from Nimbus:

### 1. Azure AD Configuration Details

**IMPORTANT:** Your Azure AD app registration must be created by Nimbus in the **Nimbus tenant** (`d2a91423-0dc1-4853-8515-7b7b7d262791`). You cannot create this app registration in your own tenant because the OAuth scopes are defined in the Nimbus tenant where the Document API app registration exists.

| Item | Description | Example |
|------|-------------|---------|
| **Azure Tenant ID** | The Nimbus Azure AD tenant ID (fixed) | `d2a91423-0dc1-4853-8515-7b7b7d262791` |
| **Your Client ID** | Azure AD App Registration ID for your application (created by Nimbus in the Nimbus tenant) | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| **Document API Application ID** | The Document API's Azure AD app ID (for scope reference) | Pre-production: `aaa610c3-9375-4a50-8383-26a0b59f7ea2`<br />Production: `d5ddd66b-0c00-4c46-bb81-672727b71aa5` |

### 2. API Endpoints

| Environment | URL |
|-------------|-----|
| **Production** | `https://api.nimbusmaps.co.uk/docs/v1` |
| **Pre-production** | `https://api-preprod.nimbusmaps.xyz/docs/v1` |

### 3. Required OAuth Scopes

For the **delegated user flow**, your application must request these scopes when authenticating users:

- `api://<document-api-app-id>/docs.read` — check availability, view orders
- `api://<document-api-app-id>/docs.purchase` — purchase documents
- `api://<document-api-app-id>/docs.webhooks.manage` — manage webhook subscriptions

For the **application (S2S) flow**, request `api://<document-api-app-id>/.default` and Nimbus will grant the appropriate app roles to your registration.

### 4. Webhook Endpoint Requirements

Your webhook endpoint must:
- Use **HTTPS** (not HTTP)
- Be publicly accessible on the internet
- Accept POST requests with JSON payload
- Respond with `200 OK` within 30 seconds
- Verify HMAC-SHA256 signatures

---

## Azure AD App Registration Setup

**IMPORTANT:** Your Azure AD app registration will be created by Nimbus in the Nimbus tenant. You cannot create this yourself. Contact Nimbus to request an app registration and provide the following information:

**Information to provide to Nimbus:**
- **Organization name:** Your company/organization name
- **Application name:** What your application should be called (e.g., "Acme Property Platform")
- **Redirect URIs:** One or more redirect URIs for your application (required for authorization code flow)
- **Environment:** Which environment(s) you need access to (pre-production, production)

### 1. App Registration (Performed by Nimbus)

Nimbus will create your app registration in the Nimbus tenant with:

1. **Name:** Your specified application name
2. **Supported account types:** Accounts in the Nimbus organizational directory (single tenant)
3. **Redirect URIs:** Your specified redirect URIs
4. **API permissions:** Delegated permissions for `docs.read` and `docs.purchase`
5. **Admin consent:** Pre-authorized (no user consent required)

Once created, Nimbus will provide you with your **Client ID**.

### 2. Using Your App Registration

Once Nimbus provides your Client ID, you can use it to authenticate users. The app registration has been pre-configured with:

✅ **API Permissions:** Delegated permissions to the Document API
- `docs.read` - Check availability, view orders
- `docs.purchase` - Purchase documents

✅ **Admin Consent:** Pre-granted (users do not need to consent)

✅ **Authentication:** Configured with your specified redirect URIs

You do not need to perform any configuration in the Azure Portal - your app is ready to use.

---

## Implementation Steps

### Step 1: Authenticate Your End Users

Your application must authenticate users and obtain access tokens with the required scopes.

**Note:** Users must authenticate against the **Nimbus tenant** (`d2a91423-0dc1-4853-8515-7b7b7d262791`). If your users are not already guest users in the Nimbus tenant, contact Nimbus to have them added.

#### Option A: Authorization Code Flow with PKCE (Recommended)

**Recommended for most scenarios.** Uses Proof Key for Code Exchange (PKCE) for enhanced security.

```http
GET https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/authorize?
  client_id={your-client-id}
  &response_type=code
  &redirect_uri={your-redirect-uri}
  &scope=openid profile email offline_access api://{document-api-app-id}/docs.read api://{document-api-app-id}/docs.purchase
  &state={random-state}
  &code_challenge={code-challenge}
  &code_challenge_method=S256
  &response_mode=query
```

**Token Exchange:**
```http
POST https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id={your-client-id}
&code={authorization-code}
&redirect_uri={your-redirect-uri}
&grant_type=authorization_code
&code_verifier={code-verifier}
&scope=openid profile email offline_access api://{document-api-app-id}/docs.read api://{document-api-app-id}/docs.purchase
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "0.ARoAI5Sp0twNOUiF...",
  "id_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "scope": "openid profile email offline_access api://d5ddd66b-0c00-4c46-bb81-672727b71aa5/docs.read api://d5ddd66b-0c00-4c46-bb81-672727b71aa5/docs.purchase"
}
```

**Scope Explanation:**
- `openid`, `profile`, `email` - **OpenID Connect scopes** for user identity information (returned in `id_token`)
- `offline_access` - **OAuth 2.0 scope** to receive a `refresh_token` for token renewal without re-authentication
- `api://{document-api-app-id}/docs.read`, `docs.purchase` - **Document API scopes** for accessing the Nimbus API (permissions included in `access_token`)

**Important:** All scopes must be included in both the authorization request AND the token exchange request.

#### Option B: Device Code Flow (For CLI/Desktop Apps)

Ideal for command-line tools and desktop applications.

```http
POST https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/devicecode
Content-Type: application/x-www-form-urlencoded

client_id={your-client-id}
&scope=openid profile email offline_access api://{document-api-app-id}/docs.read api://{document-api-app-id}/docs.purchase
```

Follow the device code flow instructions to complete authentication.

**Note:** The Python code example below demonstrates the device code flow.

### Step 2: Subscribe to Webhooks

**⚠️ IMPORTANT:** Webhook subscription is **per user**. Each user who makes purchases must have a webhook subscription. You can use the same webhook URL for all users, or user-specific URLs.

**Endpoint:** `POST /subscribe`

**Headers:**
```http
Authorization: Bearer {user-access-token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "webhook_url": "https://your-domain.com/webhooks/nimbus-documents"
}
```

**Response:**
```json
{
  "subscription_id": "8f8d2e40-1234-5678-9abc-def012345678",
  "webhook_url": "https://your-domain.com/webhooks/nimbus-documents",
  "secret": "a7b3c9d2e5f8g1h4i7j0k3l6m9n2o5p8q1r4s7t0u3v6w9x2y5z8"
}
```

**⚠️ CRITICAL:** Save the `secret` immediately. It's returned only once and is required to verify webhook signatures.

**Best Practices:**
- Subscribe users on first purchase attempt, or during onboarding
- Store the webhook secret securely (encrypted database, key vault)
- Handle `409 Conflict` responses (subscription already exists)
- Map webhook secret to user ID for signature verification

### Step 3: Check Document Availability

Before purchasing, check which documents are available and their costs.

**Endpoint:** `GET /check-availability`

**Headers:**
```http
Authorization: Bearer {user-access-token}
```

**Query Parameters:**
- `title_number` (string, required*): UK Land Registry title number (e.g., "AB123456")
- `title_id` (UUID, required*): Internal title UUID

*Exactly one must be provided.

**Example Request:**
```http
GET /check-availability?title_number=AB123456
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Example Response:**
```json
{
  "data": {
    "title_status": "Title number is valid.",
    "title_status_code": "VALID",
    "title_number": "AB123456",
    "pending_applications": [],
    "referred_to_documents": [],
    "register": {
      "type": "Register",
      "type_code": "REGISTER",
      "availability": "available for immediate download",
      "availability_code": "IMMEDIATE",
      "backdated": false,
      "token_cost": 7,
      "previously_purchased": null
    },
    "title_plan": {
      "type": "Plan",
      "type_code": "TITLEPLAN",
      "availability": "available for immediate download",
      "availability_code": "IMMEDIATE",
      "backdated": false,
      "token_cost": 7,
      "previously_purchased": null
    }
  },
  "total_token_cost_estimate": 14,
  "current_balance": 150
}
```

**Response Fields:**
- `token_cost` - Cost in tokens for this document
- `current_balance` - User's current token balance
- `availability_code` - `IMMEDIATE`, `BACKDATED`, or `NOT_AVAILABLE`
- `previously_purchased` - If document was already purchased (nullable)

### Step 4: Purchase Documents

**Endpoint:** `POST /purchase`

**Headers:**
```http
Authorization: Bearer {user-access-token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title_number": "AB123456",
  "documents": ["register", "title_plan"],
  "customer_reference": "YOUR-ORDER-REF-12345"
}
```

**Request Fields:**
- `title_number` (string, required): Title number to purchase documents for
- `documents` (array, required): Document types to purchase
  - Valid values: `"register"`, `"title_plan"`, or referenced document IDs
- `customer_reference` (string, optional): Your internal reference for this order

**Example Response:**
```json
{
  "order_id": "770e8400-e29b-41d4-a716-446655440002",
  "status": "PROCESSING",
  "title_number": "AB123456",
  "documents_ordered": ["register", "title_plan"],
  "total_tokens_charged": 14,
  "new_balance": 136,
  "estimated_delivery": "2026-01-15T14:35:00Z"
}
```

**Response Fields:**
- `order_id` - Unique identifier for this order (UUID)
- `status` - Current order status: `PROCESSING`, `PENDING_PAYMENT`, `COMPLETED`, `FAILED`
- `total_tokens_charged` - Tokens deducted from user's balance
- `new_balance` - User's balance after purchase
- `estimated_delivery` - Estimated webhook delivery time (typically within seconds/minutes)

**Important Notes:**
- Purchase returns immediately with an order ID
- Documents are delivered asynchronously to your webhook
- Tokens are deducted immediately upon successful purchase
- If purchase fails (e.g., insufficient balance), no tokens are charged

### Step 5: Receive Webhook Notifications

When a document status changes, the API sends a POST request to your webhook URL. Each event is **per-document** — a single order containing two documents will produce two separate webhook events.

**Webhook Payload Example:**
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

**Key fields:**
- `data.reference` — the `UserDocument` GUID; pass this to `GET /download/{document_reference}` to retrieve the file
- `data.titleNumber` — the Land Registry title number
- `data.statusDescription` — human-readable status (e.g. `"Completed"`)
- `data.downloadUrl` — relative download path (convenience reference)

**Webhook Headers:**
```http
Content-Type: application/json
X-Webhook-Signature: {base64_hmac_sha256_signature}
X-Webhook-Event: document.status_changed
X-Webhook-Id: {unique_event_id}
```

#### Verifying Webhook Signatures

**CRITICAL:** Always verify webhook signatures to prevent spoofing attacks.

**Signature Algorithm:** HMAC-SHA256

**Steps:**
1. Read the raw request body (before JSON parsing)
2. Compute HMAC-SHA256 of the raw body using your subscription's `secret`
3. Base64-encode the result and compare with the `X-Webhook-Signature` header (constant-time comparison)

**Signature verification — Node.js:**
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(rawBody, signature, secret) {
  if (!signature) return false;

  // Signature is plain Base64-encoded HMAC-SHA256 of the raw body (no prefix)
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  const expected = Buffer.from(expectedHash);
  const provided = Buffer.from(signature);

  if (expected.length !== provided.length) return false;

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(provided, expected);
}

// Webhook handler (Express)
app.post('/webhooks/documents', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const secret = getSubscriptionSecret(); // Retrieve from secure storage

  if (!verifyWebhookSignature(req.body.toString(), signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = JSON.parse(req.body);
  // payload.data.reference — UserDocument GUID for download
  // payload.data.titleNumber — Land Registry title number
  processDocumentStatusChange(payload);

  res.status(200).json({ received: true });
});
```

#### Downloading Documents

Download URLs are valid for **30 days** from webhook delivery.

**Endpoint:** `GET /download/{document_id}`

**Headers:**
```http
Authorization: Bearer {user-access-token}
```

**Response:**
- Binary stream (PDF, typically)
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="OC_AB123456_20260115.pdf"`

**Example:**
```bash
curl -H "Authorization: Bearer {token}" \
     https://api.nimbusmaps.co.uk/docs/v1/download/{document_id} \
     --output document.pdf
```

---

## Code Examples

### Python Implementation

```python
import os
import hmac
import hashlib
import requests
from typing import Dict, List, Optional
from msal import PublicClientApplication

class NimbusDocumentClient:
    """Client for Nimbus Document Purchase API

    This example uses device code flow for user authentication.
    """

    def __init__(
        self,
        client_id: str,
        tenant_id: str,
        document_api_app_id: str,
        api_base_url: str = "https://api.nimbusmaps.co.uk/docs/v1"
    ):
        self.api_base_url = api_base_url
        self.scopes = [
            f"api://{document_api_app_id}/docs.read",
            f"api://{document_api_app_id}/docs.purchase"
        ]

        # Using PublicClientApplication for device code flow
        self.msal_app = PublicClientApplication(
            client_id=client_id,
    def acquire_token_by_device_code(self) -> str:
        """
        Acquire token using device code flow (for CLI/desktop apps)
        """
        flow = self.msal_app.initiate_device_flow(scopes=self.scopes)

        if "user_code" not in flow:
            raise ValueError("Failed to create device flow")

        print(flow["message"])

        result = self.msal_app.acquire_token_by_device_flow(flow)

        if "access_token" in result:
            return result["access_token"]
        else:
            raise ValueError(f"Authentication failed: {result.get('error_description')}")

    def subscribe(self, user_token: str, webhook_url: str) -> Dict:
        """
        Subscribe to webhook notifications
        """
        response = requests.post(
            f"{self.api_base_url}/subscribe",
            headers={
                "Authorization": f"Bearer {user_token}",
                "Content-Type": "application/json"
            },
            json={"webhook_url": webhook_url}
        )
        response.raise_for_status()

        data = response.json()

        # IMPORTANT: Store the secret securely
        self._store_webhook_secret(data["subscription_id"], data["secret"])

        return data

    def check_availability(self, user_token: str, title_number: str) -> Dict:
        """
        Check document availability for a title
        """
        response = requests.get(
            f"{self.api_base_url}/check-availability",
            headers={"Authorization": f"Bearer {user_token}"},
            params={"title_number": title_number}
        )
        response.raise_for_status()
        return response.json()

    def purchase_documents(
        self,
        user_token: str,
        title_number: str,
        documents: List[str],
        customer_reference: Optional[str] = None
    ) -> Dict:
        """
        Purchase documents for a title
        """
        payload = {
            "title_number": title_number,
            "documents": documents
        }

        if customer_reference:
            payload["customer_reference"] = customer_reference

        response = requests.post(
            f"{self.api_base_url}/purchase",
            headers={
                "Authorization": f"Bearer {user_token}",
                "Content-Type": "application/json"
            },
            json=payload
        )
        response.raise_for_status()
        return response.json()

    def download_document(self, user_token: str, document_id: str) -> bytes:
        """
        Download a document
        """
        response = requests.get(
            f"{self.api_base_url}/download/{document_id}",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        response.raise_for_status()
        return response.content

    @staticmethod
    def verify_webhook_signature(payload: str, signature: str, secret: str) -> bool:
        """
        Verify webhook HMAC signature

        Args:
            payload: Raw request body (JSON string)
            signature: X-Nimbus-Signature header value
            secret: Webhook secret from subscription

        Returns:
            True if signature is valid, False otherwise
        """
        import base64
        # Signature is plain Base64-encoded HMAC-SHA256 of the raw body (no prefix)
        expected_signature = base64.b64encode(
            hmac.new(
                secret.encode('utf-8'),
                payload.encode('utf-8'),
                hashlib.sha256
            ).digest()
        ).decode('ascii')

        # Constant-time comparison
        return hmac.compare_digest(signature, expected_signature)

    def _store_webhook_secret(self, subscription_id: str, secret: str):
        """
        Store webhook secret securely
        DO NOT hardcode or commit to source control
        """
        # Store in database, AWS Secrets Manager, etc.
        pass


# Flask webhook handler example
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhooks/nimbus-documents', methods=['POST'])
def handle_webhook():
    # Get raw body for signature verification
    raw_body = request.get_data(as_text=True)
    signature = request.headers.get('X-Webhook-Signature')

    # Retrieve the subscription secret (same secret for all events)
    secret = get_subscription_secret()

    # Verify signature
    if not NimbusDocumentClient.verify_webhook_signature(raw_body, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 401

    payload = request.json
    # payload['data']['reference'] — UserDocument GUID for download
    # payload['data']['titleNumber'] — Land Registry title number
    # payload['data']['statusDescription'] — e.g. "Completed"
    try:
        process_document_status_change(payload)
        return jsonify({'received': True}), 200
    except Exception as e:
        print(f"Webhook processing failed: {e}")
        return jsonify({'error': 'Processing failed'}), 500

def get_subscription_secret() -> str:
    # Retrieve from database, key vault, or environment variable
    return "secret-from-secure-storage"

def process_document_status_change(payload: dict):
    # Download document, store, notify users, etc.
    pass


# Example usage
if __name__ == "__main__":
    client = NimbusDocumentClient(
        client_id="your-client-id",
        tenant_id="d2a91423-0dc1-4853-8515-7b7b7d262791",
        document_api_app_id="d5ddd66b-0c00-4c46-bb81-672727b71aa5"  # Production
    )

    # Authenticate user
    user_token = client.acquire_token_by_device_code()

    # Subscribe to webhooks
    subscription = client.subscribe(user_token, "https://your-domain.com/webhooks/nimbus-documents")
    print(f"Subscribed: {subscription['subscription_id']}")

    # Check availability
    availability = client.check_availability(user_token, "AB123456")
    print(f"Balance: {availability['current_balance']} tokens")
    print(f"Cost: {availability['total_token_cost_estimate']} tokens")

    # Purchase documents
    purchase = client.purchase_documents(
        user_token,
        title_number="AB123456",
        documents=["register", "title_plan"],
        customer_reference="ORDER-123"
    )
    print(f"Order ID: {purchase['order_id']}")
    print(f"Status: {purchase['status']}")
```

---

## Error Handling

### HTTP Status Codes

| Status | Code | Description | Action |
|--------|------|-------------|--------|
| 400 | `INVALID_REQUEST` | Invalid request parameters | Fix request parameters |
| 401 | `UNAUTHORIZED` | Missing/invalid token | Re-authenticate user |
| 401 | `TOKEN_EXPIRED` | Access token expired | Refresh token |
| 402 | `INSUFFICIENT_BALANCE` | Insufficient tokens | User needs to purchase more tokens |
| 403 | `FORBIDDEN` | Insufficient scopes | Request token with required scopes |
| 404 | `NOT_FOUND` | Resource not found | Check title number or order ID |
| 409 | `SUBSCRIPTION_CONFLICT` | Subscription already exists | OK - subscription is active |
| 409 | `DOCUMENTS_IN_PROGRESS` | Documents already being ordered | Wait for existing order to complete |
| 429 | `RATE_LIMIT_EXCEEDED` | Rate limit exceeded | Implement exponential backoff |
| 500 | `INTERNAL_ERROR` | Server error | Retry with exponential backoff |
| 502 | `EXTERNAL_SERVICE_ERROR` | HMLR service unavailable | Retry after delay |

### Error Response Format

```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance to complete purchase",
    "details": {
      "required": 14,
      "available": 5
    },
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Retry Strategy

Implement exponential backoff for transient errors:

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryable = [429, 500, 502, 503, 504].includes(error.response?.status);

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      const delayMs = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}
```

---

## Testing

### Development Testing

Use the **pre-production environment** for development and testing:

**Pre-production API:** `https://api-preprod.nimbusmaps.xyz/docs/v1`

**Pre-production Document API App ID:** `aaa610c3-9375-4a50-8383-26a0b59f7ea2`

**Scopes for pre-production:**
```
api://aaa610c3-9375-4a50-8383-26a0b59f7ea2/docs.read
api://aaa610c3-9375-4a50-8383-26a0b59f7ea2/docs.purchase
```

### Testing Webhook Locally

Use a tool like **ngrok** to expose your local webhook endpoint:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use this as your webhook URL in the subscribe call
```

### Integration Test Checklist

- [ ] User authentication with correct scopes
- [ ] Webhook subscription (store secret securely)
- [ ] Check availability for valid title
- [ ] Check availability for invalid title (expect 404)
- [ ] Purchase with sufficient balance
- [ ] Purchase with insufficient balance (expect 402)
- [ ] Duplicate purchase (expect 409)
- [ ] Webhook signature verification
- [ ] Document download
- [ ] Error handling for all error codes

---

## Production Checklist

### Security

- [ ] Store webhook secrets encrypted in database
- [ ] Verify webhook signatures on all incoming webhooks
- [ ] Use HTTPS for all API calls and webhook endpoints
- [ ] Implement rate limiting on your webhook endpoint
- [ ] Log security events (authentication failures, invalid signatures)

### Authentication

- [ ] Implement proper OAuth 2.0 authorization flow (not username/password)
- [ ] Request only required scopes (`docs.read`, `docs.purchase`)
- [ ] Implement token refresh logic (tokens expire after 1 hour)
- [ ] Handle token expiration gracefully (re-authenticate user)
- [ ] Store tokens securely (encrypted, not in plain text)

### Error Handling

- [ ] Implement exponential backoff for retries
- [ ] Log all API errors with request IDs
- [ ] Handle all HTTP error codes appropriately
- [ ] Monitor error rates and alert on anomalies
- [ ] Provide user-friendly error messages

### Monitoring

- [ ] Monitor webhook delivery failures
- [ ] Track API response times
- [ ] Alert on rate limit warnings (X-RateLimit-Remaining header)
- [ ] Monitor token balance for users
- [ ] Log all document purchases for audit trail

### Resilience

- [ ] Implement webhook retry logic (handle temporary failures)
- [ ] Store webhook payloads for replay if processing fails
- [ ] Handle duplicate webhook deliveries idempotently
- [ ] Implement circuit breaker for API calls
- [ ] Handle API maintenance windows gracefully

### Documentation

- [ ] Document your integration for your team
- [ ] Document webhook endpoint for DevOps
- [ ] Create runbook for common issues
- [ ] Document token management process

---

## Rate Limits

- **60 requests per minute** per user
- **1,000 requests per hour** per user

Monitor rate limit headers:
- `X-RateLimit-Limit` - Requests allowed per window
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Time when limit resets (Unix timestamp)

---

## Appendix

| Scope / Role | Description | Required For |
|-------|-------------|--------------|  
| `docs.read` | Read document availability and order status | `/check-availability`, `/orders/{order_id}`, `/download/{document_id}`, webhook audit |
| `docs.purchase` | Purchase documents and verify ownership | `/purchase`, `/verify-ownership` |
| `docs.webhooks.manage` | Manage webhook subscriptions | `/subscribe`, `DELETE /subscriptions/{id}` |
| `offline_access` | Receive refresh token (delegated flow only) | Token refresh |

### Glossary

- **OBO (On-Behalf-Of):** OAuth 2.0 delegated flow where a service calls another service on behalf of a user
- **Client credentials:** OAuth 2.0 application flow where a service authenticates using its own identity (no user)
- **Service identity:** A Nimbus technical user provisioned per S2S integration, used for billing and audit in the application flow
- **Token:** JWT access token for authentication
- **Scope:** Delegated permission granted to access specific API operations
- **App role:** Application permission granted to an Entra app registration (used in the client credentials flow)
- **Webhook:** HTTP callback for asynchronous event notifications
- **HMAC:** Hash-based Message Authentication Code for signature verification
- **Title Number:** UK Land Registry property identifier (e.g., AB123456)
- **Token Balance:** Number of tokens available for document purchases (7 tokens per document)
