DROP TABLE IF EXISTS schedules;
CREATE TABLE IF NOT EXISTS  schedules(
 id SERIAL PRIMARY KEY,
 user_id INTEGER NOT NULL,
 day INTEGER NOT NULL,
 start_at VARCHAR NOT NULL,
 end_at VARCHAR NOT NUll 
);