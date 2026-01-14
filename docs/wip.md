# Work In Progress (WIP)

> **Short-term memory**: Track tasks for the current epic. Once the epic is complete, move completed items to `completed.md` and clear this file.

---

## Current Epic: EPIC-2 — Authentication & Access

### Tasks

- [x] **Admin Authentication** — Email/Password login for system management
  - [x] Backend: Auth routes (register, login, logout, me)
  - [x] Backend: Password hashing (bcrypt/argon2)
  - [x] Backend: JWT token generation and validation
  - [x] Backend: httpOnly cookie handling
  - [x] Frontend: Admin login page
  - [x] Frontend: Auth context/state management
  - [x] Frontend: Protected route wrapper

- [x] **Buyer Authentication** — Phone + OTP login
  - [x] Backend: OTP generation and storage
  - [x] Backend: OTP verification endpoint
  - [x] Backend: Phone number validation
  - [x] Frontend: Phone input page
  - [x] Frontend: OTP verification page
  - [x] Integration: SMS/WhatsApp OTP delivery (or mock for dev)

- [x] **Access Control** — Role-based route protection
  - [x] Backend: Role middleware (ADMIN, BUYER)
  - [x] Backend: Protected API routes
  - [x] Frontend: Role-based navigation
  - [x] Frontend: Unauthorized redirect handling
  - [x] Invite-only flag enforcement for buyers

- [x] **Session Management**
  - [x] Token refresh mechanism
  - [x] Logout and session invalidation
  - [x] "Remember me" functionality (optional)

---

## Summary

| Category | Completed | Pending | Total |
|----------|-----------|---------|-------|
| Admin Authentication | 7 | 0 | 7 |
| Buyer Authentication | 6 | 0 | 6 |
| Access Control | 5 | 0 | 5 |
| Session Management | 3 | 0 | 3 |
| **Total** | **21** | **0** | **21** |

---

## Notes

- Per PRD: No farmer authentication or role-editing UI
- Admin uses Email/Password, Buyer uses Phone/OTP
- Auth implementation: Custom Fastify auth with JWT (httpOnly cookies)
- Buyers are invite-only (requires flag in user record)

### Security TODOs (for OTP integration)

When integrating real SMS/WhatsApp OTP (e.g., MSG91), address these:

- [ ] **Rate limiting on OTP requests** - Prevent spam by adding cooldown (e.g., 1 OTP per 60 seconds per phone)
- [ ] **Max OTP attempts** - Lock account after 3-5 failed OTP attempts to prevent brute-force
- [ ] **OTP hashing** - Consider hashing OTP in database (low priority due to 10-min expiry)

---

*Last updated: 2026-01-14*
