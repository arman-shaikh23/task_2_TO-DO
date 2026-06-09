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
