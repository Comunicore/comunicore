ALTER TABLE posts ADD CONSTRAINT post_uuid_unique UNIQUE (uuid);
ALTER TABLE posts ALTER COLUMN uuid SET DEFAULT uuidv7();
