DROP TRIGGER IF EXISTS trg_posts_bump_thread_count ON posts;
DROP FUNCTION IF EXISTS threads_bump_posts_count();

ALTER TABLE posts RENAME TO comments;

ALTER TABLE threads ALTER COLUMN posts_count RENAME TO comments_count;

CREATE OR REPLACE FUNCTION threads_bump_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE threads SET comments_count = comments_count + 1 WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_comments_bump_thread_count ON comments;
CREATE TRIGGER trg_comments_bump_thread_count
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION threads_bump_comments_count();
