# Requirements: Village Mandi (v1.2 User Onboarding)

**Defined:** 2026-01-19
**Core Value:** Farmer-centric experience (Trust & Transparency). Controlled access ensures the marketplace remains trusted and manageable during expansion.

## v1.2 Requirements

Requirements for the User Onboarding & Invite System milestone.

### Onboarding & Access Control

- [ ] **ONBOARD-01**: User can register interest with Name, Phone (verified via Firebase), and Pincode
- [ ] **ONBOARD-02**: Unapproved users are blocked from accessing the main app (Blocking Gate UI)
- [ ] **ONBOARD-03**: Users receive feedback on their status (Pending/Rejected) when attempting to login
- [ ] **ONBOARD-04**: Registration form validates 6-digit India Pincode format

### Admin Management

- [ ] **ADMIN-01**: Admin can view a dashboard of pending user registrations (Waitlist)
- [ ] **ADMIN-02**: Admin can manually approve a pending user, granting them access
- [ ] **ADMIN-03**: Admin can reject a user with an optional reason
- [ ] **ADMIN-04**: Admin can perform bulk approvals/rejections (e.g., select multiple)

### Notifications

- [ ] **NOTIF-01**: Users receive an SMS notification when their request is approved

## v2 Requirements

Deferred to future releases.

### Automation & UX
- **AUTO-01**: Automated approval for users in pre-defined "Serviceable" pincodes
- **UX-01**: Pincode lookup API to auto-fill District/State
- **UX-02**: Waitlist leaderboard or referral tracking

## Out of Scope

| Feature | Reason |
|---------|--------|
| Social Login | Stick to Phone Auth to ensure high-quality contact data for delivery |
| Self-Service Deletion | Admin-only deactivation for v1.2 to simplify compliance |
| Waitlist Leaderboard | Unnecessary complexity for hyperlocal MVP |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ONBOARD-01 | Phase 28 | Pending |
| ONBOARD-02 | Phase 27 | Complete |
| ONBOARD-03 | Phase 27 | Complete |
| ONBOARD-04 | Phase 28 | Pending |
| ADMIN-01 | Phase 29 | Pending |
| ADMIN-02 | Phase 29 | Pending |
| ADMIN-03 | Phase 29 | Pending |
| ADMIN-04 | Phase 29 | Pending |
| NOTIF-01 | Phase 30 | Pending |

**Coverage:**
- v1.2 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-19*
