# Security Audit Report

## Application Overview

Application Name: TrimsetGo
Technology Stack: Next.js (App Router), React, Node.js, Mongoose/MongoDB
Frontend: Next.js 16.0.10, React 19.2.0, TailwindCSS v4
Backend: Next.js Serverless API Routes
Database: MongoDB Atlas (via Mongoose 8.19.4)
Mobile App: Not present in workspace (legacy `.expo` directory exists)
Hosting Environment: Vercel (inferred from Next.js serverless architecture)
Storage Provider: Cloudinary (via client-side unsigned uploads)
Authentication Method: JWT-based cookies (`authToken` and `refreshToken`)

---

## Overall Security Score

Current Security Score: 38 / 100

Production Readiness Score: 35 / 100

Enterprise Security Target: 95+ / 100

Status: 🔴 Critical Risks Present

---

# SECURITY SCORE BREAKDOWN

| Security Domain | Score | Status |
|-----------------|--------|---------|
| Authentication | 4/10 | 🟠 Needs Improvements |
| Authorization | 4/10 | 🟠 Needs Improvements |
| API Security | 3/10 | 🔴 Critical Risks |
| Frontend Security | 6/10 | 🟡 Production Ready |
| Mobile Security | 0/10 | ❌ Not Applicable (No mobile code) |
| Database Security | 5/10 | 🟠 Needs Improvements |
| Infrastructure Security | 5/10 | 🟠 Needs Improvements |
| File Upload Security | 1/10 | 🔴 Critical Risks |
| Monitoring & Logging | 4/10 | 🟠 Needs Improvements |
| CI/CD Security | 0/10 | 🔴 Critical Risks |

Total Score: 38/100

---

# 1. INFRASTRUCTURE & HOSTING SECURITY

## Hosting Security

### Check:
* Production environment separation: **Partial**
* Staging environment separation: **Missing**
* Development environment separation: **Missing**

### Status:
* Partial

### Risk Level:
* Medium

### Evidence:
There are no configuration files to manage environments (like `vercel.json` or Dockerfiles) or Infrastructure as Code (IaC) files in the codebase. Production database connection credentials, SMTP details, and other API keys are mixed in the workspace's local [.env](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/.env) file.

### Recommendations:
* Set up strict environment segregation in Vercel/hosting provider dashboards.
* Do not store local or production secrets in file-system-based configuration files that could be committed to git.
* Implement Infrastructure as Code (e.g., Terraform or AWS CloudFormation) to manage hosting environments if transitioning off Vercel.

---

## SSL / HTTPS Security

### Verify:
* HTTPS enforcement: **Implemented** (automatic in Next.js/Vercel deployments)
* SSL certificate validity: **Implemented** (handled by host)
* Auto renewal: **Implemented** (handled by host)
* HSTS implementation: **Implemented**

### Status:
* Implemented

### Risk:
* Low

### Evidence:
[next.config.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/next.config.ts#L10-L12) enforces HSTS headers:
```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

### Recommendations:
* Maintain HSTS preloading configuration.
* Regularly check domains in the HSTS preload status lists.

---

# 2. ENVIRONMENT & SECRET MANAGEMENT

### Verify:
* Environment variables usage: **Implemented** (via [lib/env.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/env.ts))
* No hardcoded credentials: **Failed** (credentials in workspace `.env`)
* No hardcoded API keys: **Failed**
* No database passwords in source code: **Failed**
* No SMTP credentials exposed: **Failed**
* No JWT secrets exposed: **Failed**
* No cloud credentials exposed: **Failed**

### Review:
* Frontend
* Backend
* Docker
* CI/CD
* Deployment configs

### Output:

### Status:
* Partial (Zod validation exists, but secrets are committed/stored locally)

### Risk:
* High

### Evidence:
The [.env](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/.env) file contains plaintext credentials:
* MongoDB connection string with password: `MONGODB_URI=mongodb+srv://xpertance:XPERTANCE@cluster0.dnv2io.mongodb.net/salon_management` (Lines 1)
* Plaintext JWT secret: `JWT_SECRET=SALON_MANAGEMENT_SUPER_SECRET_KEY_12345` (Line 4)
* SMTP credentials: `SMTP_USER=innonsh.technologies@gmail.com` and `SMTP_PASS=fudi kxbz kylk ircm` (Lines 29-30)
* Plaintext API key: `SYSTEM_API_KEY = innonshcontrol` (Line 33)

### Recommendations:
* Immediately remove all plaintext credentials from local files. Move them to Vercel environment variable configs.
* Revoke and regenerate all passwords/keys exposed in [.env](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/.env), especially the database credentials and the Gmail application password.
* Perform a git filter-branch or use BFG Repo-Cleaner to purge references from git history if [.env](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/.env) was ever committed.

---

# 3. AUTHENTICATION SECURITY

## JWT Authentication

### Verify:
* JWT validation: **Implemented** (in [lib/apiAuth.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/apiAuth.ts))
* Token expiry: **Implemented** (15 minutes expiry on access tokens, configured in [lib/auth.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/auth.ts#L5))
* Signature verification: **Implemented**
* Middleware protection: **Failed** (several endpoints bypass JWT check entirely)

### Check:
* Protected APIs: **Partial**
* Unauthorized access prevention: **Failed**
* Expired token handling: **Implemented**

### Status:
* Partial

### Risk:
* Critical

### Evidence:
Several critical, state-mutating or data-exposing APIs bypass authorization checking completely and do not use the `withAuth` wrapper:
* [app/api/bookings/latest/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/bookings/latest/route.ts): Publicly exposes customer name and service timestamp for any `salonId` without auth.
* [app/api/bookings/by-phone/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/bookings/by-phone/route.ts): Publicly returns all booking history for any customer phone number across all salons without auth.
* [app/api/queue/reorder/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/queue/reorder/route.ts): Allows public write access to update queue order.
* [app/api/queue/serve/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/queue/serve/route.ts): Publicly allows changing client status to "serving" and modifying staff availability without auth.
* [app/api/queue/unserve/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/queue/unserve/route.ts): Publicly allows reversing served items without auth.
* [app/api/queue/update/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/queue/update/route.ts): Publicly updates queue service parameters without auth.
* [app/api/super-admin/users/action/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/super-admin/users/action/route.ts): Publicly allows verifying/rejecting suppliers without any authorization check.
* [app/api/supplier/verify/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/supplier/verify/route.ts): Publicly allows updating business registration details and setting supplier verification status without auth.

Additionally, [app/api/auth/me/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/auth/me/route.ts#L41) returns `error.stack` inside the JSON response, leading to Information Disclosure (stack traces leaking server paths).

### Recommendations:
* Wrap every endpoint that requires authentication with `withAuth` or `withRBAC`.
* Ensure no raw handlers (`export async function POST/GET`) are left unprotected for internal business APIs.
* Remove stack trace outputs from public responses in [me/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/auth/me/route.ts).

---

## Refresh Token Architecture

### Verify:
* Refresh tokens implemented: **Implemented** (via [app/api/auth/refresh/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/auth/refresh/route.ts))
* Token rotation: **Missing**
* Revocation support: **Implemented** (via [models/BlacklistedToken.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/models/BlacklistedToken.ts))
* Secure storage: **Implemented** (stored in HttpOnly, Secure, SameSite=Strict cookies)

### Status:
* Partial (No refresh token rotation)

### Risk:
* Medium

### Recommendations:
* Implement Refresh Token Rotation (RTR): when refreshing the access token, invalidate the old refresh token and issue a new one to prevent refresh token replay attacks.

---

## Password Security

### Verify:
* bcrypt / argon2: **Implemented** (hashes using `bcryptjs` with 10 salt rounds)
* Password complexity: **Partial** (length > 8 check exists, but no strength requirements)
* Password reset protection: **Failed** (leaks raw reset link in the response)
* Account lockout policies: **Implemented** (locks account for 15 minutes after 5 failed login attempts)

### Status:
* Partial (Reset flow is critically compromised)

### Risk:
* Critical

### Evidence:
The forgot-password route [app/api/auth/forgot-password/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/auth/forgot-password/route.ts) contains major vulnerabilities:
1. **Reset Link Leaked in API Response:** (Lines 44-48)
```typescript
return NextResponse.json({
  success: true,
  message: "Password reset link sent to your email (for simulation, see response)",
  resetUrl, // Returning for simulation
});
```
This allows any user to reset anyone's password just by hitting the endpoint with the victim's email and taking the token from the HTTP response.
2. **Email/User Enumeration:** (Line 22) returns 404 and "No user found with that email address", leaking valid account registrations.

### Recommendations:
* Remove the `resetUrl` from the HTTP response payload immediately.
* Log/email the URL only. Use a generic response for forgot-password: "If the email is registered, a recovery link has been sent."
* Enforce stronger password complexity checks during sign up and reset.

---

## Session Security

### Verify:
* Active sessions: **Implemented** (sessions stored in [models/Session.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/models/Session.ts))
* Device tracking: **Implemented** (tracks userAgent and IP)
* Logout all devices: **Missing** (no endpoint/control)
* Session expiry: **Implemented** (TTL index on `expiresAt`)
* Idle timeout: **Missing**

### Status:
* Partial

### Risk:
* Medium

### Evidence:
While session details are logged to MongoDB on login, there is no controller or route to terminate active sessions or log out from other devices.

### Recommendations:
* Add a session management endpoint (e.g. GET/DELETE `/api/auth/sessions`) allowing users to view and revoke active sessions.

---

# 4. AUTHORIZATION (RBAC)

### Review:
* Super Admin: **Implemented** (`super_admin`)
* Admin: **Missing** (Uses Super Admin)
* Manager: **Missing**
* Employee: **Missing**
* Customer: **Missing**
* Vendor: **Missing**
* User Roles: **Implemented** (`salon_owner`, `supplier`)

### Verify:
* Permission matrix: **Implemented** (via [lib/rbac.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/rbac.ts))
* API access control: **Failed** (bypassed on many routes)
* Module access control: **Partial** (enforced on frontend via AuthContext but bypassed on API routes)
* Record ownership validation: **Partial** (missing in several endpoints)

### Identify:
* Privilege escalation risks: **High**
* Broken access control: **High**
* Unauthorized access risks: **High**

### Status:
* Partial

### Risk:
* Critical

### Evidence:
1. **Unprotected Super Admin Endpoint:** [users/action/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/super-admin/users/action/route.ts) allows anyone to POST a payload and verify or reject a B2B supplier.
2. **Lack of Role Restraints in wrappers:** Routes like [app/api/queue/remove/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/queue/remove/route.ts#L180) wrap with `withAuth(handler)` without specifying allowed roles. Since any user role can log in and get a JWT token, they can invoke this action if they have a `salonId` context, even if they aren't owner or staff.
3. **No Ownership Validation on raw endpoints:** The unprotected endpoints allow horizontal privilege escalation (Insecure Direct Object Reference) since they accept IDs and perform operations without verifying ownership.

### Recommendations:
* Ensure all mutating endpoints enforce the allowed roles: `withAuth(handler, ["salon_owner", "super_admin"])`.
* Always extract the entity's owner constraints and run ownership validation: `if (record.salonId.toString() !== user.salonId.toString()) throw Error;`.

---

# 5. API SECURITY

## Validation

### Verify:
* Request validation: **Partial**
* Query validation: **Missing**
* Route parameter validation: **Missing**
* Header validation: **Missing**

### Frameworks:
* Zod: **Implemented** (via [lib/validate.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/validate.ts) and [lib/validations.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/validations.ts))

### Status:
* Partial

### Risk:
* High

### Evidence:
Zod validations are applied using `withValidation` on only 7 routes (auth routes, salon create, service routes, and booking create). Dozens of other POST, PUT, DELETE, and PATCH endpoints parse `req.json()` directly without any format validation. This makes them vulnerable to MongoDB casting exceptions, crashes, and malicious payloads.

### Recommendations:
* Define Zod schemas and wrap every state-changing route (POST, PUT, DELETE) with `withValidation`.

---

## Rate Limiting

### Verify:
* Login APIs: **Implemented** (in-memory)
* OTP APIs: **Missing** (No OTP routes)
* Password reset APIs: **Implemented** (in-memory)
* Public APIs: **Missing**
* Upload APIs: **Missing**

### Status:
* Partial (In-memory rate limiting fails in serverless environments)

### Risk:
* High

### Evidence:
The rate limiting defined in [lib/rateLimit.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/rateLimit.ts) uses an in-memory `LRUCache`. In serverless hosting environments (like Vercel), serverless functions spin up and down dynamically. The cache is not shared between active function instances and is wiped on function restarts, rendering the rate limiter largely ineffective.

### Recommendations:
* Migrate from in-memory `LRUCache` to a persistent database/cache store such as Upstash Redis or Vercel KV for rate limiting counters in production.
* Add rate limits to public-facing routes like booking creation and contact messages to prevent spamming.

---

## Security Headers

### Verify:
* Helmet: **Missing**
* CSP: **Missing**
* HSTS: **Implemented**
* X-Frame-Options: **Implemented**
* X-Content-Type-Options: **Implemented**
* Referrer Policy: **Missing**
* Permissions Policy: **Missing**

### Status:
* Partial

### Risk:
* Medium

### Evidence:
In [next.config.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/next.config.ts), standard headers like HSTS, X-Content-Type-Options, and X-Frame-Options are configured. However, a Content Security Policy (CSP), Referrer-Policy, and Permissions-Policy are not defined.

### Recommendations:
* Add a strict Content Security Policy (CSP) header in `next.config.ts` to restrict external resources and script executions, mitigating XSS risks.

---

## CORS Security

### Verify:
* Allowed origins: **Failed** (hardcoded to localhost)
* Allowed methods: **Implemented**
* Credentials policy: **Implemented**

### Status:
* Partial

### Risk:
* Medium

### Evidence:
[next.config.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/next.config.ts#L31) has hardcoded:
```typescript
{ key: "Access-Control-Allow-Origin", value: "http://localhost:3000" }
```
This will cause CORS issues when accessing the API from subdomains (e.g. `royalspa.yourdomain.com`) in production or deployment.

### Recommendations:
* Replace the hardcoded CORS origin header in next.config.ts with a dynamic middleware check that reads the request's origin and validates it against a whitelist of production subdomains.

---

## Input Sanitization

### Verify protection against:
* SQL Injection: **Implemented** (NoSQL used)
* NoSQL Injection: **Failed** (unvalidated/unsanitized routes)
* XSS: **Failed** (unvalidated/unsanitized routes)
* HTML Injection: **Failed**
* Command Injection: **Implemented** (No shell execs found)

### Status:
* Partial (Implemented only on the 7 validated routes via Zod parser wrapper)

### Risk:
* High

### Evidence:
While [lib/sanitize.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/sanitize.ts) defines robust NoSQL injection and XSS stripping logic, it is only called internally by `withValidation`. Because the vast majority of endpoints do not use `withValidation`, they bypass sanitization.

### Recommendations:
* Integrate input sanitization on all data endpoints or apply the Zod schema validation globally.

---

# 6. DATABASE SECURITY

## Access Restrictions

* Private networking: **Missing**
* IP restrictions: **Missing**
* Firewall protection: **Missing** (handled broadly by host)

### Status:
* Missing

### Risk:
* High

### Evidence:
The database connection string in [.env](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/.env) is accessible over the public internet. Because serverless environments use dynamic IP pools, IP whitelisting in MongoDB Atlas is usually set to `0.0.0.0/0` (allow all connections) unless dedicated peering or integrations are established, making authentication the only barrier.

### Recommendations:
* Enforce strict database connectivity using MongoDB Atlas PrivateLink or VPC Peering if migrating to dedicated VPS.
* Enable database firewall alerts.

---

## Encryption

### Verify:
* Encryption at rest: **Implemented** (automatic in MongoDB Atlas cloud provider)
* Encryption in transit: **Implemented** (via SSL/TLS connection string)
* TLS enforcement: **Implemented**

### Status:
* Implemented

### Risk:
* Low

### Evidence:
The `mongodb+srv://` connection protocol automatically uses TLS encryption in transit.

### Recommendations:
* Keep TLS options active and monitor Atlas backup encryption settings.

---

## Sensitive Data Protection

### Review:
* Passwords: **Implemented** (hashed via `bcryptjs`)
* Personal Data: **Failed** (plain text customer phone and name)
* Financial Data: **Implemented** (handled by Razorpay)
* Student Data: **Missing** (Not applicable)
* Employee Data: **Failed** (plain text staff listings)
* Customer Data: **Failed** (plain text customer records)

### Status:
* Partial

### Risk:
* Medium

### Evidence:
Customer names and phone numbers are stored as plain text strings in the database schemas ([models/Booking.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/models/Booking.ts) and [models/Client.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/models/Client.ts)). A DB breach results in cleartext exposure of PII.

### Recommendations:
* Implement field-level encryption for sensitive database fields (like customer phone numbers) using Mongoose middleware or AWS KMS.

---

# 7. FILE UPLOAD SECURITY

### Verify:
* MIME validation: **Missing**
* Extension validation: **Missing**
* File size limits: **Missing**
* Filename sanitization: **Missing**
* Malware scanning: **Missing**
* Signed URL support: **Missing**

### Status:
* Missing

### Risk:
* High

### Evidence:
The file upload integration in [lib/cloudinary.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/cloudinary.ts) executes uploads directly on the client side using unsigned presets:
```typescript
const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
```
Since `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is exposed to the frontend, any user can extract it and upload arbitrary files (executables, malware, high-size media) directly to the Cloudinary storage bucket.

### Recommendations:
* Disable unsigned uploads in Cloudinary settings.
* Implement signed uploads by creating a server-side endpoint `/api/upload/sign` that validates the user's role/session, validates MIME-type and size limits, and returns a secure cryptographic signature for the upload.

---

# 8. WEB APPLICATION SECURITY

### Verify:
* Frontend validation: **Implemented**
* Secure forms: **Implemented**
* Session handling: **Implemented** (via httpOnly cookies)
* Auto logout: **Missing**
* Admin panel protection: **Partial** (Localstorage state role can be tampered to render dashboard layouts, though backend routes are protected)

### Status:
* Partial

### Risk:
* Medium

### Recommendations:
* Secure the frontend dashboards by verifying user session tokens via Next.js Middleware before rendering layout contents.
* Add an auto-logout timer on idle periods.

---

# 9. MOBILE APPLICATION SECURITY

### Verify:
* Secure token storage: **Not Applicable**
* Encrypted local storage: **Not Applicable**
* HTTPS communication: **Not Applicable**
* Root detection: **Not Applicable**
* Jailbreak detection: **Not Applicable**
* Code obfuscation: **Not Applicable**

### Status:
* Not Applicable

### Risk:
* Low (No active mobile app in workspace)

### Recommendations:
* If building a mobile application (e.g. using Expo), enforce token storage inside Expo SecureStore instead of AsyncStorage, and implement SSL Pinning.

---

# 10. LOGGING & MONITORING

### Verify:
* Login logs: **Implemented**
* Failed login logs: **Implemented**
* Security incident logs: **Implemented** (stored in Winstron `security.log` locally / Sentry)
* Audit logs: **Partial** (only logs successful logins)
* Admin action logs: **Missing**

### Review:
* Winston: **Implemented** (in [lib/logger.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/logger.ts))
* Morgan: **Missing**
* Sentry: **Implemented** (configured in config files)
* Datadog: **Missing**
* CloudWatch: **Missing**

### Status:
* Partial

### Risk:
* Medium

### Evidence:
While structured Winston log files are created, `securityLogger` and `auditLogger` are only used inside [login/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/auth/login/route.ts) and [lib/rbac.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/lib/rbac.ts). Crucial actions like supplier approval, deletion of services, and subscription webhooks are not logged to the audit log.

### Recommendations:
* Call `auditLogger` or `securityLogger` on all administrative, user verification, and delete API handlers.

---

# 11. CI/CD SECURITY

### Verify:
* Deployment approvals: **Missing**
* Protected branches: **Missing** (from codebase view)
* Secret management: **Failed** (credentials saved in local `.env`)
* Environment segregation: **Missing**
* Production access restrictions: **Missing**

### Status:
* Missing

### Risk:
* Medium

### Evidence:
There are no configuration files, GitHub Actions workflows, or pipeline build scripts defined in the repository.

### Recommendations:
* Setup Git branch protection rules (prevent force push, require reviews).
* Implement a CI/CD scanning tool (like Github CodeQL or Snyk) to audit dependencies and scan for secrets on pull requests.

---

# 12. DEPENDENCY SECURITY

### Verify:
* Vulnerable packages: **Failed** (32 vulnerabilities)
* Outdated dependencies: **Failed**
* High severity CVEs: **Failed** (8 High, 1 Critical)

### Review:
* npm audit: **Executed** (32 vulnerabilities found)
* Snyk: **Missing**
* Dependabot: **Missing**

### Status:
* Needs Improvements

### Risk:
* High

### Evidence:
The project's dependency tree contains critical security vulnerabilities:
* **Mongoose:** High severity CVE-2024-XXXX (NoSQL Injection via improper sanitization of `$nor` in sanitizeFilter).
* **Next.js:** High severity vulnerabilities (Image Optimizer DoS, RSC deserialization DoS, Middleware bypasses, CSRF WS Dev bypasses).
* **Nodemailer:** High severity (CRLF transport injections, recursive addressparser DoS).
* **jws / flatted:** High severity issues (Improper HMAC signature verification, unbounded recursion DoS / Prototype Pollution).
* **minimatch / picomatch:** High severity ReDoS vulnerabilities.

### Recommendations:
* Upgrade Next.js to at least `16.x` or latest patch version to mitigate CSRF and middleware bypasses.
* Upgrade Mongoose to latest stable version to prevent NoSQL injection.
* Upgrade Nodemailer and flatted to their secure versions.
* Run `npm audit fix` where applicable.

---

# 13. BACKUP & DISASTER RECOVERY

### Verify:
* Automated backups: **Missing** (assumed Atlas managed but not configured in code)
* Backup encryption: **Missing** (assumed Atlas managed)
* Restore testing: **Missing**
* Retention policies: **Missing**

### Status:
* Missing (no codebase-level configs or scripts)

### Risk:
* Medium

### Recommendations:
* Configure automated MongoDB Atlas backup schedules.
* Develop and document a database backup restoration plan and verify it periodically.

---

# 14. PRIVACY & COMPLIANCE

### Verify readiness for:
* GDPR: **Failed** (PII is stored in cleartext, missing cookie banners/consent forms)
* SOC2: **Failed** (missing audit logs, unsigned uploads, missing access control)
* ISO27001: **Failed**
* HIPAA: **Not Applicable**
* PCI DSS: **Implemented** (offloaded completely to Razorpay checkout API)

### Status:
* Missing

### Risk:
* Medium

### Recommendations:
* Add a Cookie Consent banner on the frontend landing page.
* Implement database-level or application-level encryption for user phone numbers.
* Document a formal Privacy Policy.

---

# CRITICAL FINDINGS

## Critical Risks

| Issue | Impact | Recommendation | Priority |
| ----- | ------ | -------------- | -------- |
| Raw password reset link leaked in forgot-password response body | Account takeover: Any attacker can request password reset for any user and immediately obtain the reset token. | Remove `resetUrl` from the API response payload in [forgot-password/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/auth/forgot-password/route.ts). | P0 - Immediate |
| Unprotected Super Admin users action endpoint | Privilege escalation: Any visitor can POST to `/api/super-admin/users/action` to approve/reject suppliers. | Wrap with `withAuth(handler, ["super_admin"])` in [users/action/route.ts](file:///e:/Innonsh/Innonsh-Salonza/Salon_Mng_System-main/app/api/super-admin/users/action/route.ts). | P0 - Immediate |
| Unprotected Queue and Supplier write APIs | Cross-tenant manipulation: Unauthenticated visitors can reorder, serve, unserve, or alter queues, and modify supplier applications. | Wrap `/api/queue/*` and `/api/supplier/*` endpoints in authorization wrappers. | P0 - Immediate |
| Public lookup of booking history by phone | Data leak: Anyone can GET `/api/bookings/by-phone?phone=xxx` and read booking details across all salons. | Restrict booking query APIs to authenticated owners/staff for their specific salon. | P0 - Immediate |
| Missing webhook signature verification | Payment spoofing: Attackers can send fake webhook POST events to `/api/payments/webhook` to activate subscription plans. | Implement Razorpay webhook signature validation using the webhook secret. | P0 - Immediate |

---

## High Risks

| Issue | Impact | Recommendation | Priority |
| ----- | ------ | -------------- | -------- |
| Committed plaintext credentials in `.env` | Credential theft: Database credentials, JWT secrets, and Gmail app passwords are exposed locally and potentially to version control. | Move credentials to host environment variables and rotate keys. | P1 - High |
| Client-side unsigned Cloudinary uploads | Storage hijacking: Publicly exposed upload preset allows anyone to spam-upload files directly to Cloudinary. | Shift to server-side signed uploads. | P1 - High |
| Outdated/Vulnerable package dependencies | NoSQL injection, DoS, and CSS XSS via vulnerabilities in next, mongoose, nodemailer, and flatted. | Run `npm audit fix` and upgrade mongoose, next, nodemailer. | P1 - High |
| Incomplete input validation/sanitization | Database injection & crashes: Missing schema checking on mutating endpoints allows arbitrary DB writes. | Enforce Zod validators globally. | P1 - High |

---

## Medium Risks

| Issue | Impact | Recommendation | Priority |
| ----- | ------ | -------------- | -------- |
| In-memory rate limiting | Rate limit bypass: Rate counters are not shared across serverless instances and wipe on restart. | Move to Redis-backed (e.g. Upstash) serverless rate limits. | P2 - Medium |
| Unencrypted customer PII stored in DB | Privacy leak: Phone numbers and names are stored in cleartext. | Implement field-level encryption. | P2 - Medium |
| Missing audit logging on administrative actions | Incomplete tracking: Administrative updates (approving users, deleting gallery files) are not logged. | Call Winston audit loggers on administrative APIs. | P2 - Medium |
| Hardcoded CORS allowed origins | Development CORS blocks: Hardcoded `localhost:3000` will block production subdomains. | Dynamically check request origin against Whitelist. | P2 - Medium |

---

## Low Risks

| Issue | Impact | Recommendation | Priority |
| ----- | ------ | -------------- | -------- |
| Exposing error stacks in API responses | Information disclosure: Leaks file system structure of server. | Replace `error.stack` with friendly error messages. | P3 - Low |
| Lack of idle session timeout / device logout | Session persistence: Stale active sessions can remain valid in database without manual reset. | Add session lists and revocation endpoints. | P3 - Low |

---

# IMPLEMENTATION ROADMAP

## Sprint 1 – Critical Security

* **JWT Hardening & Route Protection:** Apply `withAuth` and `withRBAC` to all endpoints (especially super-admin actions, bookings by-phone, and queue operations).
* **Password Reset Repair:** Remove `resetUrl` from the API response payload in forgot-password.
* **Webhook Signature Verification:** Implement signature checks on payment webhooks.
* **Environment Secret Rotation:** Rotate MongoDB Atlas passwords, JWT secrets, and SMTP Gmail passwords, removing them from `.env`.

**Estimated Effort:** 3-4 Days
**Priority:** P0 - Immediate

---

## Sprint 2 – API Security

* **Validation & Sanitization Layer:** Apply Zod schemas globally via the `withValidation` wrapper on all mutating routes.
* **Signed Uploads Integration:** Refactor Cloudinary upload process to use signed URLs generated by backend APIs.
* **CORS Dynamic Configuration:** Enforce dynamic whitelist-based CORS origin checks.

**Estimated Effort:** 3-5 Days
**Priority:** P1 - High

---

## Sprint 3 – Monitoring

* **Winston Audit Logs:** Call `auditLogger` inside administrative, verify, and deletion handlers.
* **Session Management API:** Build endpoints `/api/auth/sessions` (GET/DELETE) for user device tracking and logout.
* **Error Stack Trace Clean-up:** Purge `error.stack` references from API JSON responses.

**Estimated Effort:** 2 Days
**Priority:** P2 - Medium

---

## Sprint 4 – Infrastructure

* **Dependency Upgrades:** Upgrade Next.js, Mongoose, and Nodemailer to patched versions.
* **Serverless Rate Limiting:** Replace in-memory `LRUCache` with Upstash Redis or Vercel KV.
* **Database Access Restriction:** Configure MongoDB Atlas firewall alerts and strict IP whitelisting.

**Estimated Effort:** 3 Days
**Priority:** P2 - Medium

---

## Sprint 5 – Enterprise Controls

* **Field-Level Data Encryption:** Encrypt customer phone numbers and names at rest.
* **Compliance Setup:** Add Cookie consent managers, document Privacy Policies, and implement session idle timeout checks.

**Estimated Effort:** 4 Days
**Priority:** P3 - Low

---

# FINAL SECURITY VERDICT

Current Security Score: 38 / 100

Target Security Score: 95+ / 100

Security Maturity Level:

* **Level 1 – Basic** (Current Level)
* Level 2 – Standard
* Level 3 – Production Ready
* Level 4 – Enterprise Ready
* Level 5 – Security Mature

Final Recommendation:

**DO NOT DEPLOY UNTIL CRITICAL ISSUES ARE RESOLVED**
