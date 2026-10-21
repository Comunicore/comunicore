-- only schema DDL queries. File used by sqlc AND e2e test setup
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    rank INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
-- used for password authentication
CREATE TABLE IF NOT EXISTS auth_passwords (
    user_id INTEGER PRIMARY KEY,
    login TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY,
    user_id INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    category_id INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    seo_meta jsonb DEFAULT NULL,
    files jsonb DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
-- actively changed fields for posts
CREATE TABLE IF NOT EXISTS posts_extras (
    post_id INTEGER PRIMARY KEY,
    likes_count   INTEGER NOT NULL DEFAULT 0,
    views_count   INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER, -- parent comment id for nested comments
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS post_tags (
    post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    PRIMARY KEY (post_id, tag)
);
CREATE INDEX IF NOT EXISTS post_tags_tag_idx ON post_tags (tag);
CREATE TABLE IF NOT EXISTS analytics_visit_batches (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
    client_batch_id UUID NOT NULL UNIQUE,
    active_duration_ms BIGINT NOT NULL CHECK (active_duration_ms >= 0),
    visible_duration_ms BIGINT NOT NULL CHECK (visible_duration_ms >= 0),
    is_mobile BOOLEAN NOT NULL,
    had_compose_activity BOOLEAN NOT NULL DEFAULT FALSE,
    had_read_activity BOOLEAN NOT NULL DEFAULT TRUE,
    batch_start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    batch_end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS analytics_visit_batches_start_at_idx ON analytics_visit_batches (batch_start_at);
CREATE INDEX IF NOT EXISTS analytics_visit_batches_user_id_idx ON analytics_visit_batches (user_id);

CREATE OR REPLACE FUNCTION posts_bump_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO posts_extras (post_id, comments_count) VALUES (NEW.post_id, 1)
    ON CONFLICT (post_id) DO UPDATE SET comments_count = posts_extras.comments_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_comments_bump_post_count ON comments;
CREATE TRIGGER trg_comments_bump_post_count
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION posts_bump_comments_count();
