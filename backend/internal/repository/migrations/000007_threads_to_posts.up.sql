DROP TRIGGER IF EXISTS trg_comments_bump_thread_count ON comments;
DROP FUNCTION IF EXISTS threads_bump_comments_count;

ALTER TABLE threads RENAME TO posts;

ALTER TABLE thread_tags RENAME TO post_tags;
ALTER TABLE post_tags RENAME COLUMN thread_id TO post_id;
CREATE INDEX IF NOT EXISTS post_tags_tag_idx ON post_tags (tag);
DROP INDEX IF EXISTS thread_tags_tag_idx;

ALTER TABLE comments RENAME COLUMN thread_id TO post_id;

CREATE OR REPLACE FUNCTION posts_bump_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_comments_bump_post_count ON comments;
CREATE TRIGGER trg_comments_bump_post_count
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION posts_bump_comments_count();
