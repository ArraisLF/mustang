# Feed & Posts

## Context

Social feed for study tips, news, exam results, and user-created posts. The feed is publicly readable but creating, deleting, and liking posts requires authentication.

## Requirements

- **List feed items** (public): Cursor-based paginated feed ordered by timestamp descending, includes like count and current user's like status. Supports `before`, `beforeId`, and `size` query params.
- **View single post** (public): Fetch individual post by ID
- **Create post** (authenticated): Title + content + optional media attachments (up to 10)
- **Delete own post** (authenticated): Only the author can delete; moves to history table (soft delete)
- **Toggle like** (authenticated): Like/unlike a post; denormalized `like_count` on FeedItem for performance
- **Media attachments**: IMAGE or VIDEO type, URL-based, with optional thumbnail and alt text
- **YouTube embed support**: Detect YouTube URLs and render embedded player

## Feed Item Types

| Type | Description |
|------|-------------|
| `TIP` | Study tips (seed data) |
| `NEWS` | News items (seed data) |
| `RESULT` | Exam results (seed data) |
| `POST` | User-created posts |

## Technical Approach

### Backend
- `FeedItem` entity with `@ManyToOne` author (User), `@OneToMany` media (PostMedia), `@OneToMany` likes (PostLike)
- `PostMedia` entity: `mediaType` (IMAGE/VIDEO), `url`, `thumbnailUrl`, `altText`, `displayOrder`
- `PostLike` entity: unique constraint on `(feed_item_id, user_id)`
- `FeedService` handles CRUD + like toggle with `@Transactional`
- Cursor-based pagination: two-query approach (ID query with LIMIT + entity fetch with JOINs) to avoid DISTINCT+LIMIT issues
- Cursor fields: `timestamp` (Instant) + `id` (String UUID) as tiebreaker for stable ordering
- `hasMore` detection: fetch `size + 1` rows, trim to `size` if overflow
- Efficient like queries: single query via `PostLikeRepository.findLikedFeedItemIds()` to avoid N+1
- Denormalized `like_count` column with `incrementLikeCount`/`decrementLikeCount` repository methods
- Soft delete: `FeedItemRepository.moveToHistory()` + `PostMediaRepository.moveToHistory()` insert into history tables before delete

### Frontend
- `Feed` component fetches paginated feed with infinite scroll via `useInfiniteScroll` hook (IntersectionObserver)
- New posts are prepended to the list optimistically; deleted posts are removed by ID without refetch
- `FeedPost` component renders individual post with media gallery, like/share/delete actions
- `CreatePostForm` component with media management (add, remove, reorder, type toggle, URL validation); passes created post data to parent
- `MediaGallery` sub-component handles carousel navigation, YouTube embeds, fullscreen viewer
- Optimistic UI updates for like action
- `types.js` provides media validation utilities and YouTube URL parsing

## DTOs

| DTO | Fields |
|-----|--------|
| `CreatePostRequest` | `title` (@NotBlank), `content` (@NotBlank, @Size(max=5000)), `media` (@Valid, @Size(max=10), list of MediaRequest) |
| `MediaRequest` | `type` (@NotNull, IMAGE/VIDEO), `url` (@NotBlank, @URL, @Size(max=2048)), `thumbnailUrl` (@URL, @Size(max=2048)), `altText` (@Size(max=500)) |
| `FeedItemResponse` | `id`, `title`, `content`, `authorName`, `authorId`, `type`, `media` (list of MediaResponse), `timestamp`, `likeCount`, `likedByCurrentUser` |
| `FeedPageResponse` | `items` (list of FeedItemResponse), `nextCursor` (ISO-8601 timestamp or null), `nextCursorId` (UUID or null), `hasMore` (boolean) |
| `MediaResponse` | `id`, `type`, `url`, `thumbnailUrl`, `altText`, `displayOrder` |

## Testing

- **Contract tests**: `FeedContractTest` covers:
  - GET feed returns seeded items with expected types
  - GET feed pagination: paged structure, size limit, cursor-based next page, last page detection, exhaustive pagination with no duplicates
  - POST creates post with auth (201), rejects without auth (401/403), validates input (400)
  - DELETE succeeds for owner (204), rejects non-owner (403), rejects unauthenticated (401/403), returns 404 for missing
