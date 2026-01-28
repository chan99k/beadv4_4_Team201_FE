# ADR 005: Backend Communication and Auth0 Integration

## Status
Accepted (Implemented)

## Context
The Giftify application requires a secure way to communicate with a Java/Spring backend while utilizing Auth0 for authentication. We need to decide where the authentication logic resides and how access tokens are managed and passed to the backend.

### Key Requirements:
1.  **Security**: Access tokens (JWT) should not be exposed to the browser.
2.  **Consistency**: Both Server Components and Client Components should be able to make authenticated requests.
3.  **Simplicity**: Backend should focus on being a Resource Server, validating incoming tokens.

## Decision
We utilize the `@auth0/nextjs-auth0` library to handle authentication flows and session management on the Next.js server.

### 1. Auth0 Delegation
- **Frontend (Next.js)**: Acts as the primary client for Auth0. It handles login, logout, and token exchange. It stores the session (including access and refresh tokens) in an encrypted cookie.
- **Backend (Resource Server)**: Acts as a Resource Server. It does not handle Auth0 redirect flows. Instead, it validates the JWT provided in the `Authorization: Bearer <token>` header against the Auth0 issuer.

### 2. Access Token Management
- **Server-Side (Server Components/Actions)**:
    - Use `auth0.getSession()` to retrieve the session on the server.
    - Pass the `accessToken` directly to the backend via `createAuthenticatedClient`.
- **Client-Side (Client Components)**:
    - To avoid exposing raw JWTs to the browser, client components do **not** call the backend directly.
    - Instead, they call a Next.js **Route Handler Proxy** at `/api/proxy/[...path]`.
    - The Proxy retrieves the token from the server-side session and attaches it to the request before forwarding it to the actual backend.

### 3. Backend Implementation Requirements
The backend must be configured to:
- Accept CORS requests from the frontend domain.
- Validate JWTs using the same Auth0 Domain and Audience configured in the frontend.
- Use the standard `SecurityFilterChain` to protect endpoints.

## Consequences

### Positive
- **No Token Leakage**: Access tokens are kept on the server (either in memory or in an encrypted server-only cookie).
- **Centralized Auth**: All authentication logic is encapsulated in the Next.js middleware and auth utilities.
- **Backend Portability**: The backend can remain agnostic of the specific frontend implementation as long as it receives a valid JWT.

### Negative / Trade-offs
- **Double Hop**: Client-side requests incur a small overhead by going through the Next.js proxy.
- **Complexity**: Developers must remember to use the proxy for client-side fetches rather than calling the backend URL directly.

## Environment Variables Mapping
Both environments must be kept in sync:

| Variable | Frontend (`.env.local`) | Backend (`application.yml`) |
| :--- | :--- | :--- |
| Auth0 Domain | `AUTH0_DOMAIN` | `spring.security.oauth2.resourceserver.jwt.issuer-uri` |
| Auth0 Audience | `AUTH0_AUDIENCE` | `spring.security.oauth2.resourceserver.jwt.audiences` |
| Backend URL | `NEXT_PUBLIC_API_URL` | N/A |
