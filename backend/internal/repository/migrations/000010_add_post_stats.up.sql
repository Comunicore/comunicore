-- ALTER TABLE users ADD COLUMN rank INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE users ADD COLUMN display_name TEXT;
-- update users set display_name = name where display_name is null;
-- ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;

CREATE TABLE IF NOT EXISTS posts_extras (
    post_id INTEGER PRIMARY KEY,
    likes_count   INTEGER NOT NULL DEFAULT 0,
    views_count   INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0
);
-- no posts.comments_count migration because all existing posts have 0 comments at the time of this migration
ALTER TABLE posts DROP COLUMN IF EXISTS comments_count;

CREATE OR REPLACE FUNCTION posts_bump_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO posts_extras (post_id, comments_count) VALUES (NEW.post_id, 1)
    ON CONFLICT (post_id) DO UPDATE SET comments_count = posts_extras.comments_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
