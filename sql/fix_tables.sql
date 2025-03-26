-- סקריפט לעדכון מבנה הטבלאות הקיימות בסופאבייס
-- מוסיף את העמודות החסרות מבלי ליצור מחדש את הטבלאות

-- הוספת עמודת status לטבלת registrations אם היא לא קיימת
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'registrations' 
                  AND column_name = 'status') THEN
        ALTER TABLE registrations ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- הוספת הגבלה על ערכי השדה status
DO $$
BEGIN
    -- בדיקה אם ההגבלה הזו כבר קיימת
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'registrations_status_check') THEN
        ALTER TABLE registrations ADD CONSTRAINT registrations_status_check
        CHECK (status IN ('pending', 'active', 'completed', 'rejected', 'registered'));
    END IF;
EXCEPTION
    -- במקרה של שגיאה נמשיך בכל זאת
    WHEN others THEN
        RAISE NOTICE 'Error adding constraint on status field: %', SQLERRM;
END $$;

-- הוספת עמודת updated_at לטבלת registrations אם היא לא קיימת
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'registrations' 
                  AND column_name = 'updated_at') THEN
        ALTER TABLE registrations ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- הוספת עמודת source לטבלת registrations אם היא לא קיימת
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'registrations' 
                  AND column_name = 'source') THEN
        ALTER TABLE registrations ADD COLUMN source TEXT DEFAULT 'unknown';
    END IF;
END $$;

-- הוספת עמודת user_id לטבלת questionnaire_responses אם היא לא קיימת
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'questionnaire_responses' 
                  AND column_name = 'user_id') THEN
        ALTER TABLE questionnaire_responses ADD COLUMN user_id UUID;
    END IF;
END $$;

-- הוספת עמודת contact_info לטבלת questionnaire_responses אם היא לא קיימת
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'questionnaire_responses' 
                  AND column_name = 'contact_info') THEN
        ALTER TABLE questionnaire_responses ADD COLUMN contact_info JSONB;
    END IF;
END $$;

-- הוספת עמודת status לטבלת questionnaire_responses אם היא לא קיימת
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'questionnaire_responses' 
                  AND column_name = 'status') THEN
        ALTER TABLE questionnaire_responses ADD COLUMN status TEXT DEFAULT 'submitted';
    END IF;
END $$;

-- הוספת עמודת contact_info לטבלת questionnaire_progress אם היא לא קיימת
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'questionnaire_progress' 
                  AND column_name = 'contact_info') THEN
        ALTER TABLE questionnaire_progress ADD COLUMN contact_info JSONB;
    END IF;
END $$;

-- הוספת מפתח זר מטבלת questionnaire_responses לטבלת registrations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'questionnaire_responses_user_id_fkey'
    ) THEN
        BEGIN
            ALTER TABLE questionnaire_responses
            ADD CONSTRAINT questionnaire_responses_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES registrations(id);
        EXCEPTION WHEN others THEN
            RAISE NOTICE 'Error adding foreign key constraint on questionnaire_responses.user_id: %', SQLERRM;
        END;
    END IF;
END $$;

-- הוספת מפתח זר מטבלת questionnaire_progress לטבלת registrations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'questionnaire_progress_user_id_fkey'
    ) THEN
        BEGIN
            ALTER TABLE questionnaire_progress
            ADD CONSTRAINT questionnaire_progress_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES registrations(id);
        EXCEPTION WHEN others THEN
            RAISE NOTICE 'Error adding foreign key constraint on questionnaire_progress.user_id: %', SQLERRM;
        END;
    END IF;
END $$;

-- פונקציה לעדכון/הוספה של התקדמות השאלון
CREATE OR REPLACE FUNCTION upsert_questionnaire_progress(
  p_user_id UUID,
  p_page INTEGER,
  p_answers JSONB,
  p_contact_info JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- ננסה קודם לעדכן רשומה קיימת
  UPDATE questionnaire_progress
  SET 
    answers = p_answers,
    updated_at = NOW(),
    page = p_page,
    contact_info = COALESCE(p_contact_info, contact_info)
  WHERE user_id = p_user_id;
  
  -- אם לא עדכנו שום רשומה, ניצור אחת חדשה
  IF NOT FOUND THEN
    INSERT INTO questionnaire_progress (user_id, page, answers, created_at, updated_at, contact_info)
    VALUES (p_user_id, p_page, p_answers, NOW(), NOW(), p_contact_info);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- פונקציה להגשת השאלון המלא
CREATE OR REPLACE FUNCTION submit_questionnaire(
  p_user_id UUID,
  p_answers JSONB,
  p_contact_info JSONB
)
RETURNS VOID AS $$
BEGIN
  -- הוספת רשומה חדשה לטבלת תשובות השאלון
  INSERT INTO questionnaire_responses 
    (user_id, answers, contact_info, created_at, status)
  VALUES 
    (p_user_id, p_answers, p_contact_info, NOW(), 'submitted');
  
  -- עדכון סטטוס המשתמש ל-completed
  UPDATE registrations
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- אופציונלי: מחיקת ההתקדמות מהטבלה הזמנית
  -- DELETE FROM questionnaire_progress WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql; 