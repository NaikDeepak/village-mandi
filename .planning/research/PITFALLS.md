# Common Pitfalls: Firebase & Auth Integration

## 1. SMS Fraud (Pumping)
- **The Risk:** Attackers use your OTP endpoint to send thousands of SMS messages to premium numbers, inflating your Firebase bill.
- **The Prevention:**
  - Implement `fastify-rate-limit` on the exchange endpoint.
  - Use Firebase's "App Check" to ensure requests come only from your valid apps.
  - Monitor Firebase usage alerts.

## 2. Race Conditions in User Creation
- **The Risk:** Two simultaneous login requests for a new user might attempt to create the same Postgres record twice.
- **The Prevention:**
  - Use a `UNIQUE` constraint on `phone` and `firebase_uid` in Postgres.
  - Use an `UPSERT` pattern (e.g., `INSERT ... ON CONFLICT DO UPDATE`).

## 3. Clock Skew in Token Verification
- **The Risk:** Server time being slightly behind Google's servers, causing "Token issued in the future" errors.
- **The Prevention:** `firebase-admin` usually handles a small grace period, but ensure your server uses NTP for time synchronization.

## 4. Stale Data in Internal JWT
- **The Risk:** If a user's role is changed in Postgres, their existing internal JWT still contains the old role until it expires.
- **The Prevention:**
  - Keep internal JWT expiry short (e.g., 1 hour to 1 day).
  - Or, implement a "Token Version" or "Role Revision" check in middleware for sensitive operations.

## 5. Firebase Admin Initialization
- **The Risk:** Initializing the SDK multiple times in a serverless environment or during Fastify reloads.
- **The Prevention:** Use the "Singleton" pattern or a Fastify plugin that checks `admin.apps.length` before initializing.
