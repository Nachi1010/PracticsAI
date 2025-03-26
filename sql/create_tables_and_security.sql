-- יצירת הטבלאות הנדרשות והגדרת אבטחת RLS

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'new',
  anon_key TEXT
);

-- טבלת התקדמות השאלון
CREATE TABLE IF NOT EXISTS questionnaire_progress (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page INTEGER NOT NULL,
  answers JSONB,
  contact_info JSONB,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, page)
);

-- טבלת הגשות שאלונים מלאות
CREATE TABLE IF NOT EXISTS questionnaire_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  contact_info JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'submitted'
);

-- יצירת אינדקסים לשיפור ביצועים
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_questionnaire_progress_user_id ON questionnaire_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_submissions_user_id ON questionnaire_submissions(user_id);

-- הפעלת אבטחת RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_submissions ENABLE ROW LEVEL SECURITY;

-- מחיקת מדיניות קיימת אם יש
DROP POLICY IF EXISTS "Users can only view and edit their own data" ON users;
DROP POLICY IF EXISTS "Users can only access their own progress" ON questionnaire_progress;
DROP POLICY IF EXISTS "Users can only access their own submissions" ON questionnaire_submissions;

-- יצירת מדיניות אבטחה: משתמשים יכולים לראות ולערוך רק את המידע שלהם
CREATE POLICY "Users can only view and edit their own data"
ON users
FOR ALL
USING (
  auth.uid()::text = id::text OR
  auth.uid()::text IN (
    SELECT id::text FROM users WHERE id::text = auth.uid()::text
  )
);

-- מדיניות אבטחה עבור טבלת התקדמות
CREATE POLICY "Users can only access their own progress"
ON questionnaire_progress
FOR ALL
USING (
  user_id::text = auth.uid()::text OR
  user_id::text IN (
    SELECT id::text FROM users WHERE id::text = auth.uid()::text
  )
);

-- מדיניות אבטחה עבור טבלת הגשות
CREATE POLICY "Users can only access their own submissions"
ON questionnaire_submissions
FOR ALL
USING (
  user_id::text = auth.uid()::text OR
  user_id::text IN (
    SELECT id::text FROM users WHERE id::text = auth.uid()::text
  )
); 