---
sidebar_position: 1
title: Overview
slug: /document-purchase/overview
description: Overview of the Nimbus Document Purchase API.
---

# Document Purchasing API

The Nimbus Document Purchasing API lets integrations check document availability and pricing for a title, purchase HMLR and property-related documents, receive webhook delivery events, and download purchased files.

## Core Workflows

| Workflow | Start here |
|----------|------------|
| Set up credentials and make a first request | [Getting started](getting-started) |
| Compare authentication options | [Authentication](authentication) |
| Look up endpoint purposes and permissions | [Quick reference](quick-reference) |
| Implement document delivery | [Webhooks](webhooks) |
| Copy request examples | [Examples](examples) |
| Read the full implementation guide | [Integration guide](integration-guide) |
| Explore every endpoint | [OpenAPI reference](/api/document-purchase/) |

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.nimbusmaps.co.uk/docs/v1` |
| Pre-production | `https://api-preprod.nimbusmaps.xyz/docs/v1` |

## Main Steps

1. Authenticate with either delegated user flow or application client credentials.
2. Subscribe to webhook notifications.
3. Call `/check-availability` for the title number or title ID.
4. Call `/purchase` with the documents to buy.
5. Receive document status events and download completed documents.
