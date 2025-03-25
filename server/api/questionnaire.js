const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// יצירת חיבור לסופאבייס בצד שרת בלבד
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xsidbfyjeqwwtyqstzef.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaWRiZnlqZXF3d3R5cXN0emVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjIxODEsImV4cCI6MjA1NDc5ODE4MX0.JLx83ACWB2AobgNtBxoN3do3bUNZg7hltVxNNoC1VWI'
);

// ביצוע בדיקה שהקישור עובד
const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('questionnaire_responses').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Error testing Supabase connection:', error.message);
    return false;
  }
};

// בדיקת חיבור בעת טעינת המודול
testSupabaseConnection();

/**
 * בדיקה אם טבלת השאלונים קיימת וכוללת את העמודות הנדרשות
 */
const checkQuestionnaireTable = async () => {
  try {
    console.log('Checking if questionnaire table exists...');
    
    // Try direct query to see if the table exists
    const { error } = await supabase
      .from('questionnaire_responses')
      .select('id')
      .limit(1);
    
    // If no error or error not related to missing table, then table exists
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Table does not exist');
        return false;
      }
      
      // בדיקה אם השגיאה קשורה לעמודה חסרה
      if (error.code === 'PGRST204' || error.message.includes('column') || error.message.includes('user_id')) {
        console.error('Table exists but missing required columns:', error.message);
        return false;
      }
    }
    
    console.log('Table exists with all required columns, continuing...');
    return true;
  } catch (error) {
    console.error('Error checking table existence:', error);
    return false;
  }
};

/**
 * הגשת נתוני שאלון
 * POST /api/questionnaire/submit
 */
router.post('/submit', async (req, res) => {
  try {
    const { responses, userId, contactInfo } = req.body;
    
    if (!responses || !userId) {
      return res.status(400).json({ error: 'Responses and userId are required' });
    }
    
    // בדיקה אם הטבלה קיימת
    const tableExists = await checkQuestionnaireTable();
    
    if (!tableExists) {
      return res.status(500).json({ 
        error: 'Table does not exist or missing required columns',
        message: 'טבלת השאלונים לא קיימת או חסרות עמודות נדרשות. אנא צור קשר עם התמיכה.'
      });
    }
    
    // הכנת הנתונים להוספה - שימו לב למעבר מ-userId ל-user_id בשם העמודה
    const insertData = {
      user_id: userId,
      responses,
      created_at: new Date().toISOString()
    };
    
    // הוספת פרטי יצירת קשר אם הם קיימים
    if (contactInfo) {
      insertData.contact_info = contactInfo;
    }
    
    // הוספת הנתונים לסופאבייס
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .insert([insertData]);
      
    if (error) {
      throw error;
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ error: 'Error submitting questionnaire', message: error.message });
  }
});

/**
 * שמירת התקדמות השאלון
 * POST /api/questionnaire/progress
 */
router.post('/progress', async (req, res) => {
  try {
    const { userId, pageNumber, answers } = req.body;
    
    if (!userId || !pageNumber || !answers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Format answers for storing
    const formattedResponses = {};
    answers.forEach(answer => {
      formattedResponses[answer.questionId] = answer.answer;
    });
    
    // שימו לב למעבר מ-userId ל-user_id בשם העמודה
    // Store in Supabase with user_id and page info
    const { error } = await supabase
      .from('questionnaire_progress')
      .upsert([{
        user_id: userId,
        page: pageNumber,
        responses: formattedResponses,
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id,page' });
      
    if (error) {
      throw error;
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Error saving progress', message: error.message });
  }
});

module.exports = router; 