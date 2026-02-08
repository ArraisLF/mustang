# Roadmap

Pending features for Projeto Mustang. Each task includes description, status, scope, effort estimate, dependencies, subtasks, and acceptance criteria.

## Effort Scale

| Size | Duration |
|------|----------|
| **S** | 1-2 days |
| **M** | 3-5 days |
| **L** | 1-2 weeks |
| **XL** | 2-4 weeks |

## Statuses

- **Ready for work** - Fully scoped, no open questions
- **Needs clarification** - Has open questions that must be resolved before starting

## Dependency Graph

```
1 Email System ✅ ──┬──► 2 Complete User Profile ──┬──► 3 Student Objectives ──┬──► 4 Questions System
                    │                               │                          │
7 File Upload ✅ ────┘                               │                          ├──► 5 Study Planner ──► 6 Focus Timer
                    │                               │
                    └──► 8 Password Reset (BE ✅)   └──► 15 User Journey Tracking (also depends on #3)

9 CI/CD Pipeline           (no deps)
10 User-Generated Posts    (no deps)
11 Notification System     (no deps)
12 Comments on Posts       (no deps)
14 Feed Search & Filters   (no deps)
```

---

## ~~1. Email System~~ ✅

| | |
|---|---|
| **Effort** | M |
| **Status** | Done |
| **Scope** | Backend |
| **Dependencies** | None |
| **PR** | [#14](https://github.com/ArraisLF/mustang-api/pull/14) |

**Description:** Transactional email support using Spring Boot Starter Mail (SMTP relay) with Thymeleaf templates. Includes welcome email, email verification (soft), and password reset flow.

### Subtasks

- [x] Choose and configure email provider (Spring Boot Starter Mail, SMTP relay)
- [x] Create email template engine (Thymeleaf HTML templates in pt-BR)
- [x] Implement email service with async sending (`@Async`)
- [x] Add welcome email on registration
- [x] Add email verification flow (token-based, 24h expiry)
- [x] Add rate limiting to prevent email abuse (3 req/15min per email per action)
- [x] Add password reset backend (token-based, 30min expiry)

### Acceptance criteria

- ~~New users receive a welcome email on registration~~ ✅
- ~~Email verification flow works end-to-end~~ ✅
- ~~Emails render correctly on major clients (Gmail, Outlook)~~ ✅

---

## 2. Complete User Profile

| | |
|---|---|
| **Effort** | L |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | #1 (email verification), #7 (file upload for avatar) |

**Description:** Full user profile page with avatar upload, editable personal info, and public profile view. Currently only `GET /api/users/me` exists with basic fields (firstName, lastName, email, avatarUrl). No profile page in the frontend, no edit endpoint, no avatar upload.

### Subtasks

- [ ] Backend: `PUT /api/users/me` endpoint for profile updates (firstName, lastName, bio, etc.)
- [ ] Backend: Add new fields to User entity (bio, location, targetExam, joinedAt)
- [ ] Backend: Flyway migration for new fields
- [ ] Backend: Avatar upload endpoint using file upload system (task #7)
- [ ] Frontend: Profile page (`/profile`) with user info display
- [ ] Frontend: Edit profile form with avatar picker
- [ ] Frontend: Public profile view (`/users/:id`)
- [ ] Frontend: Update Header component to link to profile

### Acceptance criteria

- User can view and edit their profile (name, bio, avatar, location)
- Avatar upload works and displays across the app (header, posts, profile)
- Other users can view public profiles

---

## 3. Student Objectives & Proficiency

| | |
|---|---|
| **Effort** | L |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | #2 |

**Description:** Allow students to set target exams ("concursos"), track upcoming exam dates, self-assess and system-assess proficiency per subject, and log study time. This is the core domain model that tasks 4, 5, and 6 build upon.

### Subtasks

- [ ] Backend: New `objectives` package
- [ ] Backend: Entities - `StudentObjective` (targetExam, examDate, status), `SubjectProficiency` (subject, score, lastUpdated), `StudyLog` (subject, duration, date)
- [ ] Backend: Flyway migrations for new tables
- [ ] Backend: CRUD endpoints for objectives (`/api/objectives`)
- [ ] Backend: Endpoints for proficiency data (`/api/proficiency`)
- [ ] Backend: Seed data with common Brazilian exam subjects (Direito Constitucional, Administrativo, Portugues, Raciocinio Logico, Informatica, etc.)
- [ ] Frontend: Objectives setup page / onboarding flow (pick target exams, subjects)
- [ ] Frontend: Proficiency dashboard with per-subject scores (progress bars or radar chart)
- [ ] Frontend: Wire into the "Estimador" tab in BottomNav
- [ ] Frontend: Study time summary on profile

### Acceptance criteria

- Student can add/remove target exams with dates
- Proficiency per subject is visible and updates based on question results (task 4)
- Study time is aggregated and shown on profile

---

## 4. Questions System

| | |
|---|---|
| **Effort** | XL |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | #3 |

**Description:** Question bank where students answer multiple-choice questions organized by subject. Results feed into the proficiency tracking from task 3. This is the core learning feature of the platform.

### Subtasks

- [ ] Backend: New `questions` package
- [ ] Backend: Entities - `Question` (statement, subject, source/exam, year, difficulty), `QuestionOption` (text, isCorrect, explanation), `QuestionAttempt` (userId, questionId, selectedOption, isCorrect, answeredAt)
- [ ] Backend: Flyway migrations
- [ ] Backend: `GET /api/questions` with filters (subject, difficulty, exam source, unanswered only)
- [ ] Backend: `POST /api/questions/{id}/answer` - submit answer, return result + explanation
- [ ] Backend: `GET /api/questions/stats` - user stats (total answered, accuracy by subject)
- [ ] Backend: Admin endpoints for question CRUD
- [ ] Backend: Proficiency recalculation on each answer (update SubjectProficiency from task 3)
- [ ] Frontend: Question practice page - show question, options, submit, see explanation
- [ ] Frontend: Subject/filter selector before starting practice
- [ ] Frontend: Results summary after a practice session
- [ ] Frontend: Wire into the "Biblioteca" tab in BottomNav
- [ ] Frontend: Stats visualization (accuracy %, questions answered per subject)

### Acceptance criteria

- Student can practice questions filtered by subject
- After answering, the correct answer and explanation are shown
- Proficiency scores update automatically based on answers
- Stats page shows accuracy and progress per subject

---

## 5. Study Planner

| | |
|---|---|
| **Effort** | L |
| **Status** | Needs clarification |
| **Scope** | Backend + Frontend |
| **Dependencies** | #3 |

**Description:** Based on the student's target exams and proficiency levels, generate a study plan broken down by subject and week. Weaker subjects get more time. The planner lives in the "Planos" tab.

### Open questions

- Should the plan be auto-generated or manually created by the student?
- How granular? (daily schedule vs. weekly subject allocation)
- Should it adapt automatically as proficiency changes?

### Subtasks

- [ ] Backend: New `planner` package
- [ ] Backend: Entities - `StudyPlan` (userId, createdAt, status), `StudyPlanEntry` (planId, subject, dayOfWeek, duration, order)
- [ ] Backend: Flyway migrations
- [ ] Backend: Plan generation algorithm (distribute hours based on proficiency gaps and exam weight)
- [ ] Backend: CRUD endpoints for plans (`/api/plans`)
- [ ] Backend: Endpoint to regenerate/adjust plan
- [ ] Frontend: Study planner page with weekly view
- [ ] Frontend: Visual schedule (calendar or timeline)
- [ ] Frontend: Manual adjustment (drag & drop or edit)
- [ ] Frontend: Wire into the "Planos" tab in BottomNav

### Acceptance criteria

- Student can generate a study plan based on their objectives
- Plan distributes time across subjects (more time on weaker areas)
- Student can manually adjust the plan
- Plan is visible as a weekly schedule

---

## 6. Focus Timer

| | |
|---|---|
| **Effort** | M |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | #5 |

**Description:** Pomodoro-style focus timer inside the study planner. When a student starts studying a subject, they can start a timer. Time is tracked and logged to their profile and proficiency data.

### Subtasks

- [ ] Backend: `POST /api/study-logs` - log a completed study session (subject, duration, startTime, endTime)
- [ ] Backend: `GET /api/study-logs/summary` - aggregated study time by subject, day, week
- [ ] Backend: Flyway migration for study_logs table (if not already covered in task 3)
- [ ] Frontend: Timer component (start, pause, resume, stop)
- [ ] Frontend: Pomodoro mode (25min focus + 5min break cycles, configurable)
- [ ] Frontend: Session complete screen with time logged
- [ ] Frontend: Study time stats on profile page (daily/weekly/monthly)
- [ ] Frontend: Integrate timer launch from study plan entries

### Acceptance criteria

- Student can start a focus timer for a specific subject
- Timer supports Pomodoro cycles
- Completed sessions are logged and visible in profile stats
- Study time shows in proficiency dashboard

---

## ~~7. File/Image Upload~~ ✅

| | |
|---|---|
| **Effort** | M |
| **Status** | Done |
| **Scope** | Backend + Frontend |
| **Dependencies** | None |
| **PRs** | [Backend #15](https://github.com/ArraisLF/mustang-api/pull/15), [Frontend #14](https://github.com/ArraisLF/mustang-frontend/pull/14) |

**Description:** File upload pipeline using Cloudflare R2 (S3-compatible, zero egress). Includes server-side image resize (max 1200px width), database tracking, REST endpoint, and reusable frontend hook/component.

### Subtasks

- [x] Backend: Cloudflare R2 via AWS S3 SDK (`software.amazon.awssdk:s3`)
- [x] Backend: New `storage` package with `StorageService` interface + `R2StorageService`
- [x] Backend: Upload endpoint `POST /api/uploads` (multipart, returns URL)
- [x] Backend: File validation (JPEG, PNG, GIF, WebP; max 5MB)
- [x] Backend: Image resize with Thumbnailator (max 1200px width, skips GIFs)
- [x] Backend: Flyway migration for `uploaded_files` table (V11)
- [x] Backend: `UploadedFile` entity, `UploadResponse` DTO, exception handlers
- [x] Frontend: `useFileUpload` hook (validation, progress tracking, error handling)
- [x] Frontend: `FileUploadInput` component (drag & drop, preview, progress bar)

### Acceptance criteria

- ~~Files can be uploaded and a public URL is returned~~ ✅
- ~~File type and size validation works~~ ✅
- ~~Uploaded files are accessible via returned URL~~ ✅

---

## 8. Password Reset Flow

| | |
|---|---|
| **Effort** | S |
| **Status** | Ready for work |
| **Scope** | Frontend only (backend done in #1) |
| **Dependencies** | #1 (email system) ✅ |

**Description:** Users currently have no way to recover a forgotten password. The backend endpoints and token system were implemented as part of Task #1 (Email System). Only the frontend pages remain.

### Subtasks

- [x] Backend: `POST /api/email/forgot-password` - sends reset email with token (done in #1)
- [x] Backend: `POST /api/email/reset-password` - validates token, updates password (done in #1)
- [x] Backend: Token entity with 30min expiry, reuses `email_tokens` table (done in #1)
- [x] Backend: Flyway migration (done in #1, V10)
- [ ] Frontend: "Esqueceu sua senha?" link on login form
- [ ] Frontend: Forgot password page (enter email)
- [ ] Frontend: Reset password page (enter new password, from email link)

### Acceptance criteria

- User can request a password reset via email
- ~~Reset link expires after a reasonable time (e.g., 1 hour)~~ ✅ (30min expiry)
- User can set a new password and login

---

## 9. CI/CD Pipeline

| | |
|---|---|
| **Effort** | S |
| **Status** | Ready for work |
| **Scope** | Infrastructure |
| **Dependencies** | None |

**Description:** No CI/CD exists. Add GitHub Actions for automated build, test, and deploy.

### Subtasks

- [ ] Backend workflow: checkout, setup Java 21, run `./mvnw verify` (includes contract tests with Testcontainers)
- [ ] Frontend workflow: checkout, setup Node, `npm ci`, `npm run lint`, `npm run build`
- [ ] Trigger on: push to main, pull requests
- [ ] Deploy step for Railway (if applicable)
- [ ] Add status badges to README

### Acceptance criteria

- PRs run automated build + tests for both frontend and backend
- Failing tests block merge
- Main branch auto-deploys to Railway

---

## 10. User-Generated Posts

| | |
|---|---|
| **Effort** | M |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | None |

**Description:** Currently only ADMIN users can create posts. Enable regular users to post in the feed, turning it into a community space where students can share tips, ask questions, and discuss.

### Subtasks

- [ ] Backend: Update SecurityConfig to allow USER role to POST `/api/feed`
- [ ] Backend: Add content moderation considerations (report button, admin review)
- [ ] Backend: Optional: post categories/tags for organization
- [ ] Frontend: Show CreatePostForm for all authenticated users (currently checks `role === 'ADMIN'`)
- [ ] Frontend: Add user post type distinction in feed (visual differentiation)
- [ ] Frontend: Report post button

### Acceptance criteria

- Authenticated users can create posts
- Posts show author info correctly
- Admin can still delete any post; users can delete their own

---

## 11. Notification System

| | |
|---|---|
| **Effort** | L |
| **Status** | Needs clarification |
| **Scope** | Backend + Frontend |
| **Dependencies** | None |

**Description:** In-app notification system for study reminders, new content alerts, likes on posts, etc.

### Open questions

- In-app only, or also push notifications (PWA)?
- Real-time (WebSocket) or polling?
- Which events trigger notifications?

### Subtasks

- [ ] Backend: New `notifications` package
- [ ] Backend: Notification entity (userId, type, message, read, createdAt)
- [ ] Backend: Flyway migration
- [ ] Backend: Notification service (create, mark read, list)
- [ ] Backend: REST endpoints (`/api/notifications`)
- [ ] Backend: Trigger notifications on events (likes, study reminders, etc.)
- [ ] Frontend: Notification bell icon in Header with unread count
- [ ] Frontend: Notification dropdown/page
- [ ] Frontend: Mark as read on view

### Acceptance criteria

- Users receive in-app notifications for relevant events
- Unread count is visible in header
- Notifications can be marked as read

---

## 12. Comments on Posts

| | |
|---|---|
| **Effort** | M |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | None |

**Description:** Allow users to comment on feed posts. Basic threaded discussion under each post.

### Subtasks

- [ ] Backend: Comment entity (id, feedItemId, userId, content, createdAt)
- [ ] Backend: Flyway migration
- [ ] Backend: `POST /api/feed/{id}/comments` - add comment
- [ ] Backend: `GET /api/feed/{id}/comments` - list comments (paginated)
- [ ] Backend: `DELETE /api/feed/{id}/comments/{commentId}` - delete own comment or admin
- [ ] Backend: CommentResponse DTO
- [ ] Backend: Add commentCount to FeedItemResponse
- [ ] Frontend: Comment section under each FeedPost (collapsible)
- [ ] Frontend: Comment input form
- [ ] Frontend: Comment list with author, timestamp, delete button

### Acceptance criteria

- Users can comment on posts
- Comments display with author info and timestamp
- Comment count is visible on post cards
- Users can delete their own comments; admins can delete any

---

## 14. Feed Search & Filters

| | |
|---|---|
| **Effort** | M |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | None |

**Description:** Add a search box and filter controls to the feed so users can filter posts by subject, type, and a free-text query. Currently the feed only supports chronological pagination with no filtering.

### Subtasks

- [ ] Backend: Add query parameters to `GET /api/feed` - `subject` (String), `type` (String), `q` (String, text search)
- [ ] Backend: Update `FeedItemRepository` with filtered query methods (keyset pagination + WHERE clauses)
- [ ] Backend: Text search on `title` and `content` fields (ILIKE or full-text search)
- [ ] Backend: Update `FeedService.getFeedPaginated()` to accept and apply filters
- [ ] Frontend: Search bar component at the top of the feed (text input with search icon)
- [ ] Frontend: Filter chips/buttons for post type (Dica, Noticia, Resultado, Publicacao)
- [ ] Frontend: Filter dropdown or chips for subject
- [ ] Frontend: Debounced text search (300ms delay before firing request)
- [ ] Frontend: Update `Feed` component to pass filters to API calls and reset pagination on filter change
- [ ] Frontend: Clear filters button / active filter indicators
- [ ] Frontend: Empty state for "no results" with filter context

### Acceptance criteria

- User can search posts by text (searches title and content)
- User can filter posts by type (TIP, NEWS, RESULT, POST)
- User can filter posts by subject
- Filters combine (e.g., type=TIP + subject="Direito Constitucional" + q="sumula")
- Pagination continues to work with active filters
- Clearing filters returns to the full feed

---

## 15. User Journey Tracking

| | |
|---|---|
| **Effort** | L |
| **Status** | Ready for work |
| **Scope** | Backend + Frontend |
| **Dependencies** | #2 (profile), #3 (objectives) |

**Description:** Track where each user is in their journey inside the app to gain insights on user behavior and identify drop-off points. The system defines a set of milestones (profile completed, goals set, first question answered, first study session, etc.) and records when each user reaches them. This data powers an admin analytics dashboard and can later drive personalized nudges (e.g., prompting a user to complete their profile).

### Subtasks

- [ ] Backend: New `journey` package
- [ ] Backend: `JourneyMilestone` enum - `REGISTERED`, `EMAIL_VERIFIED`, `PROFILE_COMPLETED`, `AVATAR_UPLOADED`, `OBJECTIVES_SET`, `FIRST_QUESTION_ANSWERED`, `FIRST_STUDY_SESSION`, `FIRST_POST_CREATED`, `FIRST_COMMENT`, `7_DAY_STREAK`, `30_DAY_STREAK`
- [ ] Backend: `UserMilestone` entity (userId, milestone, reachedAt)
- [ ] Backend: Flyway migration for `user_milestones` table
- [ ] Backend: `JourneyService` - record milestones, query user progress, compute journey stage
- [ ] Backend: Event listeners to automatically record milestones (e.g., on profile update check if profile is complete, on question answer check if it's the first)
- [ ] Backend: `GET /api/users/me/journey` - return current user's milestones and next suggested action
- [ ] Backend: `GET /api/admin/journey/stats` - aggregated funnel data (how many users reached each milestone)
- [ ] Backend: `GET /api/admin/journey/cohorts` - milestone completion rates by registration cohort (week/month)
- [ ] Frontend: Journey progress indicator on user profile (checklist or progress bar showing completed milestones)
- [ ] Frontend: Contextual nudges/banners (e.g., "Complete seu perfil", "Defina seus objetivos de estudo") based on missing milestones
- [ ] Frontend: Admin analytics page with funnel visualization (registration → profile → objectives → first question → active user)

### Acceptance criteria

- Milestones are recorded automatically as users interact with the platform
- User can see their own journey progress on their profile
- Admin dashboard shows a funnel view of how many users reached each milestone
- Cohort analysis shows milestone completion rates over time
- Nudges/banners appear for users who have not completed key milestones
