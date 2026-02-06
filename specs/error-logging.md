# Client Error Logging

## Context

Capture frontend JavaScript errors for debugging and monitoring. Errors are logged to the database via a public API endpoint with rate limiting to prevent abuse.

## Requirements

- **Log client errors** (public endpoint): Accept error details from the frontend
- **Rate limiting**: Maximum 10 errors per minute per client IP address
- **Stored fields**: message, stack trace, page URL, user agent, error type, client IP, optional user ID
- **Error types**: `uncaught`, `unhandledrejection`, `react-boundary`

## Technical Approach

### Backend
- `ClientError` entity in `errors` package with `@CreationTimestamp` for `createdAt`
- `ClientErrorController` at `POST /api/errors` — public endpoint (no auth required)
- `ClientErrorService`:
  - `logError()` checks rate limit before saving
  - `checkRateLimit()` queries `ClientErrorRepository.countByClientIpAndCreatedAtAfter()` with 1-minute window
  - Throws `RateLimitExceededException` → HTTP 429
- Client IP extracted from request via `HttpServletRequest.getRemoteAddr()`

### Database
- Table `client_errors` (Flyway V7)
- Indexed on `created_at` and `client_ip` for rate limit queries

## DTOs

| DTO | Fields |
|-----|--------|
| `ClientErrorRequest` | `message` (@NotBlank, @Size(max=2000)), `stack` (@Size(max=10000)), `url` (@NotBlank, @Size(max=500)), `userAgent` (@Size(max=500)), `userId`, `errorType` (@NotBlank, @Pattern: uncaught\|unhandledrejection\|react-boundary), `timestamp` |
| `ClientErrorResponse` | `id` |

## Testing

- **Contract tests**: Rate limiting behavior — verify 429 response after exceeding 10 errors/min from same IP
