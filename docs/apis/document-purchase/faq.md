---
sidebar_position: 8
title: FAQ
slug: /document-purchase/faq
description: Common questions about the Nimbus Document Purchase API.
---

# Document Purchasing API FAQ

## Which documents can be purchased?

The API supports HMLR register, title plan and other referred documents. `/check-availability` returns the document identifiers available for a specific title, including referred documents where applicable.

## Should I use delegated or application authentication?

Use delegated authentication when purchases must be tied to a human user. Use application authentication when your server performs purchases autonomously and you want billing and audit tied to a Nimbus service identity provisioned for the integration.

## Are webhook subscriptions per user?

Delegated webhook subscriptions are per user. Application flow subscriptions are tied to the service identity for the integration.

## When are tokens charged?

Tokens are deducted when a purchase request succeeds. If a purchase fails because of insufficient balance or validation errors, no tokens are charged.

## How long are downloaded documents available?

Download URLs are valid for 30 days from webhook delivery.

## Can I poll instead of using webhooks?

Use webhooks as the primary delivery mechanism. You can also call `/orders/{order_id}` to check status.
