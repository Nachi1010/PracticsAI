require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// הגדרת שרת Express
const app = express();
const PORT = process.env.PORT || 3001;

// יצירת חיבור לסופאבייס בצד שרת בלבד
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xsidbfyjeqwwtyqstzef.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaWRiZnlqZXF3d3R5cXN0emVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjIxODEsImV4cCI6MjA1NDc5ODE4MX0.JLx83ACWB2AobgNtBxoN3do3bUNZg7hltVxNNoC1VWI'
);

// פונקציה לבדיקת חיבור לסופאבייס
async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    // בדיקה פשוטה - ניסיון גישה לטבלה
    const { error } = await supabase
      .from('registrations')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (e) {
    console.error('Supabase connection test failed:', e);
    return false;
  }
}

// ניהול CORS להגבלת גישה מאתרים לא מורשים
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// פרסור של JSON בגוף הבקשה - עם טיפול בשגיאות
app.use(express.json({ strict: false }));

// מידלוור לטיפול בשגיאות פרסור JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON:', err.message);
    return res.status(400).json({ error: 'Invalid JSON format', message: 'פורמט JSON לא תקין' });
  }
  next();
});

// בדיקת קיום קבצי API
const apiUserPath = path.join(__dirname, 'api', 'user.js');
const apiQuestionnairePath = path.join(__dirname, 'api', 'questionnaire.js');

const userApiExists = fs.existsSync(apiUserPath);
const questionnaireApiExists = fs.existsSync(apiQuestionnairePath);

console.log(`User API exists: ${userApiExists}`);
console.log(`Questionnaire API exists: ${questionnaireApiExists}`);

// הגדרת נתיבי API רק אם הקבצים קיימים
if (userApiExists) {
  app.use('/api/user', require('./api/user'));
}

if (questionnaireApiExists) {
  app.use('/api/questionnaire', require('./api/questionnaire'));
}

// שורש ה-API - בדיקת חיבור
app.get('/api', async (req, res) => {
  try {
    // בדיקת חיבור לסופאבייס
    const isConnected = await testSupabaseConnection();
    
    res.json({ 
      message: 'Server is running',
      environment: process.env.NODE_ENV || 'development',
      userApiAvailable: userApiExists,
      questionnaireApiAvailable: questionnaireApiExists,
      supabaseConnection: isConnected ? 'Connected' : 'Error connecting',
      dbSchema: {
        registrationsTable: 'Available',
        questionnaireResponsesTable: questionnaireApiExists ? 'Available' : 'Not configured'
      }
    });
  } catch (error) {
    console.error('Error in API root:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'שגיאה בבדיקת חיבור'
    });
  }
});

// טיפול בשגיאות
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'אירעה שגיאה במערכת'
  });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL ? 'Set from env' : 'Using default'}`);
  
  // בדיקה שהכל מוכן
  testSupabaseConnection().then(isConnected => {
    if (isConnected) {
      console.log('Supabase connection test: PASSED');
    } else {
      console.error('Supabase connection test: FAILED - check your database settings');
    }
  });
}); 