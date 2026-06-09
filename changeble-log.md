# Change Log

## Architecture Change: Migration from Express Session to PKI-Encrypted JWT

### Reason for Change
The original system utilized `express-session` combined with `connect-mongo` for managing user authentication and authorization. While this is a standard and robust approach, the specific security requirement was raised: **"if jwt is stolen then any hacker not steal our password or information"**.

Standard JWTs contain a base64 encoded payload, which is trivially decodable by anyone who intercepts the token, potentially leaking sensitive user IDs, emails, or roles.

### Implemented Changes
1. **Removed `express-session` and `connect-mongo`:** Transitioned away from stateful server-side sessions.
2. **Introduced JSON Web Tokens (JWT):** Adopted stateless authentication.
3. **Implemented Public Key Infrastructure (PKI):**
   - Built a custom `pki.js` utility using Node's native `crypto` module.
   - The server automatically generates a 2048-bit RSA key pair on startup if one doesn't exist.
   - The JWT payload (which contains the `userId`) is encrypted using the server's **Public Key** before being signed into the JWT.
   - When verifying the token in protected routes, the encrypted payload is decrypted using the server's **Private Key**.
4. **Added `cookie-parser`:** To read the JWT from the `taskflow.token` HTTP-only, secure cookie, maintaining the same UX and preventing XSS attacks from accessing the token.

### Security Benefits
- **Payload Confidentiality:** Even if a malicious actor intercepts the JWT token (e.g., via a network attack or compromised client), they cannot read the claims within the payload without the server's private key.
- **Statelessness:** Reduces database load by eliminating session lookups.

## Architecture Change: Advanced JWT Revocation & Refresh Token Rotation

### Implemented Changes
1. **Refresh Token Rotation:**
   - Implemented a dual-token system: a short-lived **Access Token** (15 minutes) and a long-lived **Refresh Token** (7 days).
   - Refresh tokens are stored in a database whitelist (`RefreshToken` model).
   - Added a `/api/auth/refresh` endpoint. When used, the old refresh token is deleted and a new one is issued (Rotation).
2. **JWT Revocation (Token Versioning):**
   - Added a `tokenVersion` field to the `User` model.
   - The version is checked by the auth middleware on every request.
   - When a user changes their password, `tokenVersion` is incremented, instantly revoking all active access tokens globally.

### Security Benefits
- Stolen access tokens are only useful for a maximum of 15 minutes.
- Stolen refresh tokens are mitigated by rotation (they can only be used once).
- Password changes instantly sever all unauthorized access.

## Security & Logic Fixes: Priority Sorting, Regex Sanitization, and RS256 Upgrade

### Implemented Changes
1. **Upgraded JWT Algorithm to RS256:**
   - Transitioned from HS256 (symmetric) to RS256 (asymmetric).
   - Tokens are now signed using the server's **Private Key** and verified using the **Public Key**.
   - This prevents "Algorithm Confusion" attacks and aligns with industry best practices for PKI-based systems.
2. **Fixed Priority Sorting Logic:**
   - Refactored the Task retrieval endpoint to use MongoDB **Aggregation**.
   - Implemented a numeric weight mapping for priorities: `High (3)`, `Medium (2)`, `Low (1)`.
   - Tasks are now correctly sorted by their importance rather than alphabetically.
3. **Implemented Regex Sanitization:**
   - Added a utility to escape special characters in search queries.
   - This mitigates **Regex Injection** and **Regular Expression Denial of Service (ReDoS)** attacks (e.g., when a user enters `(((`).

### Security Benefits
- **Asymmetric Signing:** Enhanced security by keeping the signing key (Private) separate from the verification key (Public).
- **Correct Data Integrity:** Users see tasks in the expected order of urgency.
- Improved Availability: The system is now resilient against malicious search inputs that could previously cause server-side errors or performance degradation.

## Quality Assurance: Unit Testing Suite with Jest

### Implemented Changes
1. **Integrated Jest Testing Framework:**
   - Installed `jest` in the backend.
   - Configured `npm test` script to support ES Modules via `--experimental-vm-modules`.
2. **Refactored Logic for Testability:**
   - Extracted core Todo filtering and sorting logic from the controller into `backend/utils/todoHelpers.js`.
   - This allows testing business logic without mocking the entire MongoDB/Express environment.
3. **Comprehensive Unit Test Suite:**
   - **`validators.test.js`:** Tests for password strength and pagination safety.
   - **`pki.test.js`:** Tests for RSA encryption and decryption of JWT payloads.
   - **`todoHelpers.test.js`:** Tests for regex escaping (ReDoS protection), filter building, and priority weights.

### Benefits
- **Regression Prevention:** Ensures that future changes to security or logic don't break existing functionality.
- Reliability: Empirically verified that the complex PKI encryption and regex sanitization work as expected.
- Code Quality: Refactoring for tests led to a cleaner, more modular utility structure.

## Security Improvement: Sensitive Key Protection

### Implemented Changes
1. **Ignored RSA Keys in Git:**
   - Added `backend/keys/` to the root `.gitignore` file.
   - Removed `private.pem` and `public.pem` from the git index using `git rm --cached`.
2. **Prevented Credential Leakage:**
   - This ensures that the server's private and public RSA keys are never pushed to GitHub or other remote repositories, preventing potential session hijacking or data decryption by unauthorized parties.


