# Technology Stack: Firebase & Auth Integration

This document outlines the recommended versions and rationale for the authentication stack as of early 2026.

## Core Libraries

| Library | Recommended Version | Purpose | Why Standard |
|---------|---------------------|---------|--------------|
| `firebase-admin` | `^13.0.0` (latest stable) | Server-side verification of Firebase tokens. | Authoritative SDK for Node.js from Google. Handles public key rotation automatically. |
| `@fastify/jwt` | `^9.0.0` (latest stable) | Internal session management and RBAC. | Native Fastify support, high performance, and excellent middleware integration. |
| `pg` / `knex` / `prisma` | (Existing) | User data persistence. | Preserves existing relational data model and role management. |

## Supporting Tools

| Tool | Purpose | Note |
|------|---------|------|
| `firebase` (client) | Client-side OTP handshake. | Required on Web/Mobile to trigger SMS. |
| `fastify-rate-limit` | Preventing SMS pumping. | Critical for cost control on the `/auth/verify` endpoint. |

## Rationale
- **Decoupling:** Using `@fastify/jwt` for internal requests means the backend doesn't depend on Firebase's availability for every single API call.
- **Security:** `firebase-admin` handles the complex crypto of verifying Google's RS256 signatures, reducing implementation errors.
- **Performance:** Local JWT verification is faster than hitting Firebase APIs or checking Firebase revocation lists on every request.

## Installation
```bash
npm install firebase-admin @fastify/jwt
```
