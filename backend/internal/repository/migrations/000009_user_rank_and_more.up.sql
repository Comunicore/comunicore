ALTER TABLE users ADD COLUMN rank INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN display_name TEXT;
update users set display_name = name where display_name is null;
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
