---
sidebar_position: 3
title: Rate Limits
slug: /shared/rate-limits
description: Rate limit guidance for Nimbus APIs.
---

# Rate Limits

Rate limits vary by API and subscription tier. Contact Nimbus if your integration needs higher throughput.

## Current Published Limits

| API | Limit |
|-----|-------|
| Property Search API | Varies by subscription tier |
| Document Purchase API | 60 requests per minute per user; 1,000 requests per hour per user |

## Client Behaviour

Handle `429 Rate Limited` responses with exponential backoff. Where rate limit headers are present, use them to pace requests:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
