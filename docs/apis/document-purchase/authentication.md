---
sidebar_position: 3
title: Authentication
slug: /document-purchase/authentication
description: OAuth authentication modes for the Nimbus Document Purchase API.
---

# Document Purchasing API Authentication

The Document Purchase API accepts OAuth 2.0 Bearer tokens issued by Microsoft Entra ID for the Document API audience. It supports both delegated user flow and application client credentials flow.

## Authentication Modes

| Mode | Use when | Billing and audit identity | Token claim |
|------|----------|----------------------------|-------------|
| Delegated user flow | Your server calls the API on behalf of an authenticated user. | The authenticated end user | `scp` |
| Application flow | Your server calls the API without a user present. | A Nimbus service identity provisioned for your integration | `roles` |

## Delegated User Flow

Use authorization code with PKCE for web applications. Request the scopes your integration needs:

- `api://<document-api-app-id>/docs.read`
- `api://<document-api-app-id>/docs.purchase`
- `api://<document-api-app-id>/docs.webhooks.manage`

Include OpenID Connect scopes such as `openid`, `profile`, `email`, and `offline_access` when you need user identity and refresh tokens.

## Application Flow

Use client credentials for autonomous server-to-server integrations. Request the `/.default` scope and Nimbus will grant app roles to your registration.

| Environment | Scope |
|-------------|-------|
| Pre-production | `api://f995e7f1-7a92-4c17-82a7-3187c5b158bf/.default` |
| Production | `api://d5ddd66b-0c00-4c46-bb81-672727b71aa5/.default` |

Tokens are valid for 1 hour. Cache tokens and refresh before expiry.

## Nimbus Tenant

Applications are registered in the Nimbus tenant:

```text
d2a91423-0dc1-4853-8515-7b7b7d262791
```

Contact Nimbus to create the app registration and assign the required delegated scopes or app roles.
