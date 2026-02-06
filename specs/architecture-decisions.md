# Architecture Decision Records

## ADR-001: Stateless JWT Authentication

**Decision**: Use stateless JWT tokens for authentication instead of server-side sessions.

**Rationale**: Simplifies horizontal scaling (no shared session store needed), aligns with REST principles, and keeps the backend stateless. Tokens are self-contained with 1-hour expiry.

**Consequences**: Token revocation requires additional mechanisms (not implemented). Token refresh is handled by re-login.

---

## ADR-002: Package-by-Feature Structure

**Decision**: Organize backend code by feature (`auth/`, `user/`, `feed/`, `errors/`) rather than by layer (`controllers/`, `services/`, `repositories/`).

**Rationale**: Feature packages are more cohesive — all related code lives together. Easier to understand feature boundaries and extract services later if needed.

**Consequences**: Shared code goes in `common/` package (config, security, exceptions).

---

## ADR-003: DTO Pattern with Static `from()` Factory

**Decision**: Never return JPA entities from API endpoints. Use `<Feature>Response` DTOs with a static `from(Entity)` method.

**Rationale**: Prevents exposing internal entity structure, avoids lazy loading issues in serialization, and allows computing derived fields (e.g., `authorName` from User entity, `displayName` from firstName + lastName).

**Consequences**: Each feature needs Request and Response DTO classes. Slight boilerplate, offset by clear API contracts.

---

## ADR-004: Denormalized Like Count

**Decision**: Store `like_count` directly on `feed_items` table instead of computing via `COUNT(*)` on `post_likes`.

**Rationale**: Feed listing is a hot path — avoiding a JOIN or subquery per feed item significantly reduces query complexity. Like count is incremented/decremented atomically via dedicated repository methods.

**Consequences**: Must keep `like_count` in sync during like/unlike operations. Flyway V6 handles backfill of existing data.

---

## ADR-005: Soft Delete with History Tables

**Decision**: When deleting feed items, move records to `feed_item_history` and `post_media_history` tables instead of hard deleting.

**Rationale**: Preserves audit trail for moderation and data recovery. History tables mirror the structure of live tables with additional `deleted_at`, `deleted_by_user_id`, and `deleted_by_username` columns.

**Consequences**: Delete operations require native SQL queries to INSERT INTO history before DELETE. History tables grow over time (cleanup strategy TBD).

---

## ADR-006: Separate Test Source Sets (Unit vs Contract)

**Decision**: Unit tests in `src/test/` and contract/integration tests in `src/ctest/` as separate Maven source sets.

**Rationale**: Contract tests use Testcontainers (PostgreSQL) and are slower — separating them allows running fast unit tests independently (`./mvnw test`) while `./mvnw verify` runs both. Maven Surefire handles unit tests; Failsafe handles contract tests.

**Consequences**: Requires `build-helper-maven-plugin` to add `src/ctest/java` as a test source. Contract test classes must be named `*ContractTest.java`.
