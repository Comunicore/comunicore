CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO categories (id,name) VALUES (0,'default');
INSERT INTO categories (id,name) VALUES (1,'Программирование');
SELECT setval('categories_id_seq', (SELECT max(id) FROM categories), true);

ALTER TABLE posts ADD COLUMN category_id INTEGER NOT NULL DEFAULT 0;
