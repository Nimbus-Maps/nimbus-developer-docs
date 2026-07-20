---
sidebar_position: 1
title: Authentication
slug: /shared/authentication
description: Authentication patterns used across Nimbus developer APIs.
---

# Authentication

Nimbus APIs use OAuth 2.0 Bearer tokens issued by Microsoft Entra ID. Some APIs may also support subscription keys for server-to-server use.

## OAuth 2.0

Use OAuth when your integration needs scoped access, end-user auditability, or application-level app roles.

| Flow | Use when | Token claim |
|------|----------|-------------|
| Authorization code | Your application calls Nimbus on behalf of a signed-in user. | `scp` |
| Client credentials | Your server calls Nimbus using its own application identity. | `roles` |

Request only the permissions your integration needs. For API-specific scopes, see the relevant getting started guide.

## Subscription Keys

The Property Search API also supports subscription key authentication. Include the key in each request:

```http
Ocp-Apim-Subscription-Key: YOUR_API_KEY
```

Contact Nimbus to request credentials for your integration and target environment.
