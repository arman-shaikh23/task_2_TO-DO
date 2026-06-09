# Security Architecture

This document details the security mechanisms implemented in TaskFlow, specifically regarding Authentication and Session Management.

## Authentication System

TaskFlow utilizes a dual-token architecture combined with Public Key Infrastructure (PKI) encryption to provide maximum security while remaining stateless.

### 1. PKI-Encrypted JSON Web Tokens (JWT) with RS256
**What it is:** The Access Token is a JWT. It uses **RS256 (RSA Signature with SHA-256)**, an asymmetric algorithm. This means the server signs the token using its **Private Key** and anyone can verify it using the **Public Key** (though in this architecture, only the server verifies it). Additionally, the payload is RSA-encrypted using the server's Public Key before being signed.
**What attack it prevents:** 
- **Token Interception/Data Leakage:** Even if intercepted, the payload is encrypted and cannot be read without the private key.
- **Algorithm Confusion:** Using a fixed algorithm (RS256) prevents "None" algorithm attacks or HMAC vs RSA confusion.

### 6. Input Sanitization & Regex Protection
**What it is:** All user-provided search queries are escaped before being used in MongoDB `$regex` queries.
**What attack it prevents:**
- **Regex Injection / ReDoS:** Prevents attackers from providing malicious regex patterns (like `((( ` or complex nested quantifiers) that could crash the server or cause a Denial of Service.

### 2. Short-Lived Access Tokens
**What it is:** The Access Token is configured to expire very quickly (15 minutes).
**What attack it prevents:** 
- **Token Hijacking:** If an attacker steals an Access Token, their window of opportunity to use it is extremely limited. Within 15 minutes, the token becomes useless, and they cannot get a new one without the Refresh Token.

### 3. Refresh Token Rotation (Whitelist)
**What it is:** A long-lived (7 days) Refresh Token is issued alongside the Access Token. This token is an opaque string stored securely in the database (`RefreshToken` model). When the Access Token expires, the client uses the Refresh Token to get a new pair. 
**Crucial Rotation Logic:** Upon use, the old Refresh Token is *deleted* from the database, and a completely *new* Refresh Token is issued. 
**What attack it prevents:**
- **Refresh Token Theft & Replay Attacks:** If an attacker steals a Refresh Token, they can use it to get an Access Token. However, because we use Rotation, the *legitimate* user will then try to use their (now deleted) Refresh Token later, which will fail. The system ensures a stolen token can only be used once.
- **Individual Session Hijacking:** Because active Refresh Tokens are stored in a database whitelist, a user can log out from a specific device, which deletes that specific Refresh Token from the database, instantly revoking that session.

### 4. JWT Revocation via Token Versioning
**What it is:** A `tokenVersion` integer field exists on the `User` model and is included inside the encrypted payload of every Access Token. On every request, the middleware checks if the token's version matches the database version.
**When it is used:** Password changes, account recovery, or global "log out everywhere" events. By incrementing the user's `tokenVersion` in the database, *all* currently issued Access Tokens instantly become invalid globally.
**What attack it prevents:**
- **Persistent Compromise:** If an attacker has compromised an account, the victim changing their password will instantly revoke the attacker's active access tokens, rather than waiting up to 15 minutes for them to expire.

### 5. HTTP-Only Cookies
**What it is:** Both the Access Token and Refresh Token are delivered to the client via `httpOnly` and `sameSite: "lax"` cookies. The JavaScript on the frontend cannot read or access these tokens.
**What attack it prevents:**
- **Cross-Site Scripting (XSS):** If a malicious script is injected into the frontend, it cannot read `document.cookie` to steal the JWTs, entirely preventing XSS-based token theft.
- **Cross-Site Request Forgery (CSRF):** `sameSite: "lax"` provides robust protection against standard CSRF attacks for state-changing API endpoints.

## When to use each approach in production

- **Token Versioning:** Best for global events. Use this when a user changes their password, resets their account, or explicitly clicks "Log out of all devices". It has a slight performance overhead (requires checking the DB on every request), but ensures immediate, global revocation without the need for a complex Redis blacklist infrastructure.
- **Refresh Token Whitelists:** Best for device-specific session management. Use this to allow a user to see "Active Devices" and revoke access to a specific device (e.g., "Log out of my iPad"). 
- **Short-Lived Access Tokens:** Best for high-security environments. Use this as a foundational layer so that even if a token is temporarily exposed, the damage is minimized.
