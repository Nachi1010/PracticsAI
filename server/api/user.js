const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// יצירת חיבור לסופאבייס בצד שרת בלבד
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xsidbfyjeqwwtyqstzef.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaWRiZnlqZXF3d3R5cXN0emVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjIxODEsImV4cCI6MjA1NDc5ODE4MX0.JLx83ACWB2AobgNtBxoN3do3bUNZg7hltVxNNoC1VWI'
);

/**
 * בדיקת קיום טבלת registrations
 */
const checkRegistrationsTable = async () => {
  try {
    console.log('Checking if registrations table exists...');
    
    const { error } = await supabase
      .from('registrations')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.error('Registrations table does not exist:', error.message);
        return false;
      }
    }
    
    console.log('Registrations table exists, continuing...');
    return true;
  } catch (error) {
    console.error('Error checking registrations table:', error.message);
    return false;
  }
};

// נקודת קצה חדשה: יצירת טבלאות ומבני מידע נדרשים
router.get('/setup-db', async (req, res) => {
  try {
    // 1. Add user_id column to questionnaire_responses table
    const addUserIdColumn = await supabase.rpc('exec_sql', {
      query: `ALTER TABLE questionnaire_responses ADD COLUMN IF NOT EXISTS user_id UUID;`
    });
    
    // 2. Add contact_info column to questionnaire_responses table
    const addContactInfoColumn = await supabase.rpc('exec_sql', {
      query: `ALTER TABLE questionnaire_responses ADD COLUMN IF NOT EXISTS contact_info JSONB;`
    });
    
    // 3. Create questionnaire_progress table if it doesn't exist
    const createProgressTable = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS questionnaire_progress (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          user_id UUID NOT NULL,
          page INTEGER NOT NULL,
          responses JSONB NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `
    });
    
    // 4. Add a test user if needed
    const userId = req.query.user_id || '04dc2877-a27e-4a12-846b-4e580355afca';
    
    const { data: existingUser, error: findError } = await supabase
      .from('registrations')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('registrations')
        .insert([{
          id: userId,
          name: 'משתמש ניסיון',
          email: 'test@example.com',
          phone: '0501234567',
          created_at: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Error inserting test user:', insertError);
      } else {
        console.log('Test user inserted successfully');
      }
    }
    
    res.json({
      success: true,
      message: 'Database setup completed',
      userId
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    res.status(500).json({ error: 'Error setting up database', message: error.message });
  }
});

// בדיקת קיום הטבלה בעת טעינת המודול
checkRegistrationsTable();

/**
 * קבלת מזהה ייחודי למשתמש - יוצר אם לא קיים במערכת
 * GET /api/user/id
 */
router.get('/id', async (req, res) => {
  try {
    // יצירת מזהה חדש כברירת מחדל
    const userId = uuidv4();
    
    // הוספת המשתמש לטבלת registrations אם נדרש יצירת משתמש חדש
    // הערה: בפועל, משתמשים חדשים נוצרים בדרך כלל בתהליך ההרשמה
    
    return res.json({ userId });
  } catch (error) {
    console.error('Error generating user ID:', error);
    res.status(500).json({ error: 'Error generating user ID', message: error.message });
  }
});

/**
 * שמירת פרטי המשתמש
 * POST /api/user/info
 */
router.post('/info', async (req, res) => {
  try {
    const { userId, email, phone } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!email && !phone) {
      return res.status(400).json({ error: 'At least one contact method (email or phone) is required' });
    }
    
    // בדיקה אם המשתמש קיים כבר בטבלת הרישום
    const { data: existingUser, error: findError } = await supabase
      .from('registrations')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }
    
    // אם המשתמש לא קיים, יש לנסות למצוא אותו לפי אימייל או טלפון
    if (!existingUser) {
      let query = supabase.from('registrations').select('id');
      
      if (email) {
        query = query.eq('email', email);
      } else if (phone) {
        query = query.eq('phone', phone);
      }
      
      const { data: foundUser, error: searchError } = await query.maybeSingle();
      
      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }
      
      if (foundUser) {
        // אם נמצא משתמש, נחזיר את המזהה שלו במקום
        return res.json({ userId: foundUser.id, success: true });
      }
      
      // הוספת משתמש חדש במקרה שלא נמצא קיים
      // הערה: בפועל, משתמשים חדשים צריכים להיווצר דרך טופס ההרשמה
      // וכאן אנחנו רק משתמשים במשתמשים קיימים
      return res.status(404).json({ 
        error: 'User not found',
        message: 'המשתמש לא נמצא במערכת. נא להירשם תחילה דרך טופס ההרשמה.'
      });
    }
    
    // הוספה או עדכון של פרטי המשתמש (אופציונלי)
    // בפועל, עדכון זה יתבצע בתהליך נפרד במערכת המנהל
    
    return res.json({ success: true, userId });
  } catch (error) {
    console.error('Error saving user info:', error);
    res.status(500).json({ error: 'Error saving user info', message: error.message });
  }
});

/**
 * חיפוש משתמש לפי אימייל או טלפון
 * GET /api/user/find
 */
router.get('/find', async (req, res) => {
  try {
    const { email, phone } = req.query;
    
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }
    
    // חיפוש ישירות בטבלת registrations
    let query = supabase.from('registrations').select('id, email, phone');
    
    if (email) {
      query = query.eq('email', email);
    } else if (phone) {
      query = query.eq('phone', phone);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (!data) {
      return res.json({ found: false, userId: null });
    }
    
    return res.json({ found: true, userId: data.id });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Error finding user', message: error.message });
  }
});

/**
 * יצירת משתמש ניסיון
 * GET /api/user/create-test-user
 */
router.get('/create-test-user', async (req, res) => {
  try {
    const userId = req.query.user_id || '04dc2877-a27e-4a12-846b-4e580355afca';
    
    // בדיקה אם המשתמש קיים כבר
    const { data: existingUser, error: findError } = await supabase
      .from('registrations')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (existingUser) {
      return res.json({ 
        success: true, 
        userId, 
        message: 'User already exists',
        user: existingUser
      });
    }
    
    // משתמש לא קיים, יוצרים אותו
    const { data, error: insertError } = await supabase
      .from('registrations')
      .insert([{
        id: userId,
        name: 'משתמש ניסיון',
        email: 'test@example.com',
        phone: '0501234567',
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (insertError) {
      throw insertError;
    }
    
    return res.json({ 
      success: true, 
      userId,
      message: 'Test user created successfully',
      user: data[0]
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ error: 'Error creating test user', message: error.message });
  }
});

module.exports = router; 