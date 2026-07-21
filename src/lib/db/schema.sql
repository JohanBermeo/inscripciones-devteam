CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  availability_hours INTEGER NOT NULL CHECK (availability_hours BETWEEN 1 AND 40),
  specialty_area TEXT NOT NULL,
  current_semester INTEGER NOT NULL CHECK (current_semester BETWEEN 2 AND 14),
  linkedin_url TEXT,
  github_url TEXT,
  discord_username TEXT,
  motivation TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  user_agent_hash TEXT NOT NULL,
  submitted_at DATETIME DEFAULT (datetime('now', '-5 hours')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_submitted ON registrations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(status);
