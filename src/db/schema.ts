export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS employees (
  id              TEXT PRIMARY KEY,
  full_name       TEXT NOT NULL,
  personnel_code  TEXT NOT NULL,
  department      TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS referrals (
  id               TEXT PRIMARY KEY,
  employee_id      TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  letter_id        TEXT NOT NULL,
  title            TEXT NOT NULL,
  type             TEXT NOT NULL,
  priority         TEXT NOT NULL,
  status           TEXT NOT NULL,
  referral_date    TEXT NOT NULL,
  deadline         TEXT NOT NULL,
  return_date      TEXT,
  effective_delay  INTEGER NOT NULL DEFAULT 0,
  quality          INTEGER NOT NULL DEFAULT 0,
  knowledge        INTEGER NOT NULL DEFAULT 0,
  innovation       INTEGER NOT NULL DEFAULT 0,
  correction_count INTEGER NOT NULL DEFAULT 0,
  extra_curricular INTEGER NOT NULL DEFAULT 0,
  feedback         TEXT,
  evaluation_month TEXT,
  score            REAL NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS correspondence (
  id                  TEXT PRIMARY KEY,
  correspondence_type TEXT NOT NULL,
  employee_id         TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  related_referral_id TEXT REFERENCES referrals(id) ON DELETE SET NULL,
  letter_number       TEXT NOT NULL,
  subject             TEXT NOT NULL,
  sender_receiver     TEXT NOT NULL,
  date                TEXT NOT NULL,
  status              TEXT NOT NULL,
  description         TEXT,
  attachments         TEXT NOT NULL DEFAULT '[]',
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS monthly_evaluations (
  id                TEXT PRIMARY KEY,
  employee_id       TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month             TEXT NOT NULL,
  year              TEXT NOT NULL,
  accuracy          INTEGER NOT NULL DEFAULT 0,
  knowledge         INTEGER NOT NULL DEFAULT 0,
  knowledge_sharing INTEGER NOT NULL DEFAULT 0,
  convergence       INTEGER NOT NULL DEFAULT 0,
  participation     INTEGER NOT NULL DEFAULT 0,
  extra_curricular  INTEGER NOT NULL DEFAULT 0,
  org_system        INTEGER NOT NULL DEFAULT 0,
  innovation        INTEGER NOT NULL DEFAULT 0,
  total             INTEGER NOT NULL DEFAULT 0,
  percent           REAL NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (employee_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_referrals_employee ON referrals(employee_id);
CREATE INDEX IF NOT EXISTS idx_correspondence_employee ON correspondence(employee_id);
CREATE INDEX IF NOT EXISTS idx_monthly_employee ON monthly_evaluations(employee_id);
`;
