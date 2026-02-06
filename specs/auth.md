# Authentication & Registration

## Context

Stateless JWT authentication for the Mustang platform. Users authenticate with email/password to access protected features like creating posts and liking content.

## Requirements

- **Login**: Authenticate by email and password, receive JWT token + user info
- **Register**: Create account with email, password, firstName, lastName
  - Username auto-generated from `firstName.lastName` (normalized, accents removed, uniqueness handled via counter suffix)
  - Auto-login after registration (returns JWT token immediately)
- **JWT token**: HS512 algorithm, 1-hour expiry, contains email (subject) and userId (claim)
- **Session persistence**: Token and user data stored in `localStorage`, validated on app load via `jwt-decode`
- **Logout**: Clears localStorage and Axios auth header

## Technical Approach

### Backend
- `AuthController` at `/api/auth` with `login` and `register` endpoints
- `AuthService` handles authentication via Spring `AuthenticationManager` and user creation
- `CustomUserDetailsService` loads users by email for Spring Security
- `JwtTokenProvider` generates and validates tokens (HS512, `Keys.secretKeyFor`)
- `JwtAuthenticationFilter` extracts Bearer token from requests and sets `SecurityContextHolder`
- Password encoding: BCrypt via `BCryptPasswordEncoder`
- `SecurityConfig` defines public vs authenticated endpoint rules

### Frontend
- `AuthContext` provides global auth state (`user`, `token`, `login`, `register`, `logout`, `loading`)
- `LoginForm` and `RegisterForm` components with client-side validation
- `ProtectedRoute` component redirects unauthenticated users to `/login`
- Axios `Authorization` header set globally after login

## DTOs

| DTO | Fields |
|-----|--------|
| `AuthRequest` | `email` (@NotBlank, @Email), `password` (@NotBlank) |
| `RegisterRequest` | `email` (@NotBlank, @Email), `password` (@NotBlank, @Size(min=6)), `firstName` (@NotBlank, @Size(max=100)), `lastName` (@NotBlank, @Size(max=100)) |
| `AuthResponse` | `accessToken`, `user` (UserResponse) |
| `UserResponse` | `id`, `email`, `username`, `firstName`, `lastName`, `displayName` (computed), `avatarUrl` |

## Testing

- **Unit tests**: AuthService logic (login, register, username generation)
- **Contract tests**: Auth endpoints (login success/failure, register success/duplicate email, token validation)
- Seed user for testing: `user@mustang.com` / `password` (created by `DataInitializer`)
