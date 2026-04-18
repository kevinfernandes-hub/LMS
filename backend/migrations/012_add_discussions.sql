-- Discussions feature tables (idempotent)

CREATE TABLE IF NOT EXISTS discussions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at);

CREATE TABLE IF NOT EXISTS discussion_replies (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_author_id ON discussion_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_created_at ON discussion_replies(created_at);

-- Backfill missing columns if the tables existed in a partial form
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE discussion_replies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
