DROP TRIGGER IF EXISTS trg_comments_bump_thread_count ON comments;
DROP FUNCTION IF EXISTS threads_bump_comments_count();

ALTER TABLE comments RENAME TO posts;

ALTER TABLE threads RENAME COLUMN comments_count TO posts_count;

CREATE OR REPLACE FUNCTION threads_bump_posts_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE threads SET posts_count = posts_count + 1 WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_posts_bump_thread_count ON posts;
CREATE TRIGGER trg_posts_bump_thread_count
AFTER INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION threads_bump_posts_count();
