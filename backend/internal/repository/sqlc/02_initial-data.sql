INSERT INTO categories (id,name) VALUES (0,'default');
INSERT INTO categories (id,name) VALUES (1,'Программирование');
SELECT setval('categories_id_seq', (SELECT max(id) FROM categories), true);
