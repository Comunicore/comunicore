-- name: UserGet :one
SELECT id, name, email, avatar_url, created_at
FROM users
WHERE id = $1;

-- name: UserGetByNameOrEmail :many
SELECT name, email
FROM users
WHERE name = $1 OR email = $2;

-- name: UserGetNameById :one
SELECT name
FROM users
WHERE id = $1;

-- name: UserCreate :one
INSERT INTO users (name, email)
VALUES ($1, $2)
RETURNING id, name, email, avatar_url, created_at;

-- name: UserUpdate :one
UPDATE users
SET name = $1, email = $2
WHERE id = $3
RETURNING id, name, email, avatar_url, created_at;

-- name: AuthCreate :exec
INSERT INTO auth_passwords (user_id, login, password_hash) VALUES ($1, $2, $3);
-- name: AuthUpdatePassword :exec
UPDATE auth_passwords SET password_hash = $2 WHERE user_id = $1;
-- name: AuthCreateSession :exec
INSERT INTO sessions (session_id, user_id) VALUES ($1, $2);
-- name: AuthGetUserAndPasswordHash :one
SELECT user_id, password_hash FROM auth_passwords WHERE login = $1;
-- name: AuthDeleteSession :exec
DELETE FROM sessions WHERE session_id = $1;
-- name: AuthDeleteAllUserSessions :exec
DELETE FROM sessions WHERE user_id = $1;
-- name: AuthGetUserIDBySessionID :one
SELECT user_id FROM sessions WHERE session_id = $1;

-- name: PostCreate :one
INSERT INTO posts (thread_id, user_id, content) VALUES ($1, $2, $3)
RETURNING id, thread_id, user_id, content, created_at;
-- name: PostListByThreadId :many
SELECT id, thread_id, user_id, content, created_at FROM posts
WHERE thread_id = $1 ORDER BY created_at DESC;

-- name: ThreadCreate :one
INSERT INTO threads (title, content, user_id, posts_count) VALUES ($1, $2, $3, 0)
RETURNING id, title, content, posts_count, user_id, created_at;
-- name: ThreadGetById :one
SELECT id, title, content, user_id, posts_count, created_at FROM threads WHERE id = $1;
-- name: ThreadPageByPageID :many
SELECT id, title, content, user_id, posts_count, created_at
FROM threads
ORDER BY id DESC LIMIT $1 OFFSET $2;
-- name: ThreadPagesBeforeThreadID :many
SELECT id, title, content, user_id, posts_count, created_at
FROM threads
WHERE id < $1
ORDER BY id DESC LIMIT $2;
-- name: ThreadPagesAfterThreadID :many
SELECT id, title, content, user_id, posts_count, created_at
FROM threads
WHERE id > $1
ORDER BY id DESC LIMIT $2;

-- name: ThreadTagInsert :exec
INSERT INTO thread_tags (thread_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING;

-- name: AnalyticsVisitBatchInsert :exec
INSERT INTO analytics_visit_batches (
    user_id, client_batch_id, active_duration_ms, visible_duration_ms,
    is_mobile, had_compose_activity, had_read_activity, batch_start_at, batch_end_at
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (client_batch_id) DO NOTHING;

-- name: AnalyticsAvgDurations :one
SELECT
    COALESCE(AVG(active_duration_ms), 0)::double precision AS avg_active_ms,
    COALESCE(AVG(visible_duration_ms), 0)::double precision AS avg_visible_ms,
    COALESCE(MAX(active_duration_ms), 0)::bigint AS max_active_ms
FROM analytics_visit_batches;

-- name: AnalyticsConnectionDensity :one
SELECT
    COALESCE(
        (SELECT COUNT(*)::double precision FROM posts) / NULLIF((
        SELECT COUNT(*)::double precision FROM (
            SELECT user_id FROM posts
            UNION
            SELECT user_id FROM threads
        ) AS u
    ), 0.0),
    0.0
    )::double precision AS density;

-- name: AnalyticsDropoffPercent :one
WITH user_stats AS (
    SELECT user_id,
           COUNT(*) AS post_count,
           MAX(created_at) AS last_post_at
    FROM posts
    GROUP BY user_id
),
eligible AS (
    SELECT * FROM user_stats WHERE post_count >= sqlc.arg(threshold_n)::int
)
SELECT
    CASE WHEN COUNT(*) = 0 THEN 0::float8
    ELSE 100.0 * COUNT(*) FILTER (
        WHERE last_post_at < NOW() - (sqlc.arg(inactive_days)::int * INTERVAL '1 day')
    )::float8 / COUNT(*)::float8
    END::float8 AS churn_percent
FROM eligible;

-- name: AnalyticsMobileSessionShares :one
SELECT
    CASE WHEN COUNT(*) FILTER (WHERE had_read_activity) = 0 THEN 0::float8
    ELSE 100.0 * COUNT(*) FILTER (WHERE had_read_activity AND is_mobile)::float8
         / COUNT(*) FILTER (WHERE had_read_activity)::float8
    END::float8 AS pct_mobile_readers,
    CASE WHEN COUNT(*) FILTER (WHERE had_compose_activity) = 0 THEN 0::float8
    ELSE 100.0 * COUNT(*) FILTER (WHERE had_compose_activity AND is_mobile)::float8
         / COUNT(*) FILTER (WHERE had_compose_activity)::float8
    END::float8 AS pct_mobile_writers,
    CASE WHEN COUNT(*) = 0 THEN 0::float8
    ELSE 100.0 * COUNT(*) FILTER (WHERE is_mobile)::float8 / COUNT(*)::float8
    END::float8 AS pct_mobile_sessions
FROM analytics_visit_batches;

-- name: AnalyticsMobileUserPercent :one
WITH u AS (
    SELECT user_id, BOOL_OR(is_mobile) AS used_mobile
    FROM analytics_visit_batches
    WHERE user_id IS NOT NULL
    GROUP BY user_id
)
SELECT
    CASE WHEN COUNT(*) = 0 THEN 0::float8
    ELSE 100.0 * COUNT(*) FILTER (WHERE used_mobile)::float8 / COUNT(*)::float8
    END::float8 AS pct_users_with_mobile
FROM u;

-- name: AnalyticsActivityHourDistribution :many
WITH hourly AS (
    SELECT EXTRACT(HOUR FROM batch_start_at AT TIME ZONE 'UTC')::int AS hr, COUNT(*) AS cnt
    FROM analytics_visit_batches
    GROUP BY 1
),
tot AS (SELECT COALESCE(SUM(cnt), 0)::float8 AS total FROM hourly)
SELECT hourly.hr AS hour_utc,
       CASE WHEN tot.total = 0 THEN 0::float8
       ELSE 100.0 * hourly.cnt::float8 / tot.total END::float8 AS share_percent
FROM hourly CROSS JOIN tot
ORDER BY hourly.hr;

-- name: AnalyticsTopTag :one
SELECT tag, COUNT(*)::bigint AS usage_count
FROM thread_tags
GROUP BY tag
ORDER BY usage_count DESC, tag ASC
LIMIT 1;

-- name: AnalyticsTopThreadInRange :one
SELECT t.id, t.title, COUNT(p.id)::bigint AS reply_count_in_range
FROM threads t
LEFT JOIN posts p ON p.thread_id = t.id
    AND p.created_at >= sqlc.arg(start_at)
    AND p.created_at < sqlc.arg(end_at)
GROUP BY t.id, t.title
ORDER BY reply_count_in_range DESC, t.id ASC
LIMIT 1;

-- name: AnalyticsTopUsersByPosts :many
SELECT u.id, u.name, COUNT(p.id)::bigint AS post_count
FROM users u
JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name
ORDER BY post_count DESC, u.id ASC
LIMIT 10;

-- name: AnalyticsPopularTagsByThreadCount :many
SELECT tag, COUNT(*)::bigint AS thread_count
FROM thread_tags
GROUP BY tag
ORDER BY thread_count DESC, tag ASC;

-- name: AnalyticsPostsActivityByDay :many
SELECT DATE(created_at) AS day, COUNT(*)::bigint AS posts_count
FROM posts
GROUP BY day
ORDER BY day;

-- name: AnalyticsTopUsersByThreads :many
SELECT u.id, u.name, COUNT(t.id)::bigint AS thread_count
FROM users u
JOIN threads t ON u.id = t.user_id
GROUP BY u.id, u.name
ORDER BY thread_count DESC, u.id ASC;

-- name: AnalyticsUsersWithPostsButNoThreads :many
SELECT u.id, u.name, COUNT(p.id)::bigint AS post_count
FROM users u
JOIN posts p ON u.id = p.user_id
LEFT JOIN threads t ON u.id = t.user_id
WHERE t.id IS NULL
GROUP BY u.id, u.name
ORDER BY post_count DESC, u.id ASC;
