import { createClient } from '@supabase/supabase-js';
import { Answer, ContactInfo } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// הגדרות חיבור לסופאבייס
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xsidbfyjeqwwtyqstzef.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaWRiZnlqZXF3d3R5cXN0emVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjIxODEsImV4cCI6MjA1NDc5ODE4MX0.JLx83ACWB2AobgNtBxoN3do3bUNZg7hltVxNNoC1VWI';

// יצירת לקוח
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// מפתח עבור מזהה משתמש אנונימי
const USER_ID_KEY = 'practicsai_user_id';

// קבלת מזהה משתמש או יצירת אחד חדש
export async function getUserId(): Promise<string> {
  // בדיקה אם יש מזהה קיים באחסון
  let userId = localStorage.getItem(USER_ID_KEY);
  
  // אם לא נמצא מזהה, יצירת מזהה חדש
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
    
    // רישום משתמש חדש במערכת
    await registerNewUser(userId);
  }
  
  return userId;
}

// רישום משתמש חדש במערכת
async function registerNewUser(userId: string): Promise<void> {
  try {
    // בדיקה אם המשתמש כבר קיים
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
      
    // אם המשתמש לא קיים, יצירת רשומה חדשה
    if (!data) {
      await supabase
        .from('users')
        .insert([{
          id: userId,
          created_at: new Date().toISOString(),
          status: 'new',
        }]);
    }
  } catch (error) {
    console.error('Error registering new user:', error);
  }
}

// שמירת התקדמות בשאלון
export async function saveQuestionnaireProgress(
  userId: string,
  page: number,
  answers: Answer[],
  contactInfo?: ContactInfo
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('questionnaire_progress')
      .upsert({
        user_id: userId,
        page: page,
        answers: answers,
        contact_info: contactInfo || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id, page'
      });
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error saving progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'שגיאה בלתי ידועה'
    };
  }
}

// קבלת התקדמות שמורה של משתמש
export async function getUserProgress(userId: string): Promise<{
  success: boolean;
  data?: {
    current_page: number;
    answers?: Answer[];
    contact_info?: ContactInfo;
  },
  error?: string;
}> {
  try {
    // קבלת ההתקדמות האחרונה של המשתמש
    const { data, error } = await supabase
      .from('questionnaire_progress')
      .select('*')
      .eq('user_id', userId)
      .order('page', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    // אם אין נתונים
    if (!data || data.length === 0) {
      return { 
        success: true,
        data: {
          current_page: 0,
          answers: [],
        }
      };
    }
    
    // החזרת הנתונים
    return {
      success: true,
      data: {
        current_page: data[0].page,
        answers: data[0].answers || [],
        contact_info: data[0].contact_info
      }
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'שגיאה בלתי ידועה'
    };
  }
}

// הכנת SQL להגדרת אבטחת RLS בסופאבייס
export const RLS_POLICIES_SQL = `
-- מחיקת מדיניות קיימת
DROP POLICY IF EXISTS "User can only access their own data" ON "public"."questionnaire_progress";
DROP POLICY IF EXISTS "User can only access their own submissions" ON "public"."questionnaire_submissions";
DROP POLICY IF EXISTS "User can only access their own record" ON "public"."users";

-- הפעלת RLS על כל הטבלאות
ALTER TABLE "public"."questionnaire_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."questionnaire_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- הוספת מדיניות לטבלת התקדמות
CREATE POLICY "User can only access their own data"
ON "public"."questionnaire_progress"
FOR ALL
USING (auth.uid()::text = user_id OR user_id IN (SELECT id FROM public.users WHERE anon_key = auth.uid()::text));

-- הוספת מדיניות לטבלת הגשות
CREATE POLICY "User can only access their own submissions"
ON "public"."questionnaire_submissions"
FOR ALL
USING (auth.uid()::text = user_id OR user_id IN (SELECT id FROM public.users WHERE anon_key = auth.uid()::text));

-- הוספת מדיניות לטבלת משתמשים
CREATE POLICY "User can only access their own record"
ON "public"."users"
FOR ALL
USING (auth.uid()::text = id OR anon_key = auth.uid()::text);
`;

// Function to directly create questionnaire_responses table
export const createQuestionnaireTable = async () => {
  try {
    console.log('Checking if questionnaire table exists...');
    
    // First approach: Try direct query to see if the table exists
    try {
      const { error } = await supabase
        .from('questionnaire_responses')
        .select('id')
        .limit(1);
      
      // If no error or error not related to missing table, then table exists
      if (!error || (error.code !== '42P01' && !error.message.includes('does not exist'))) {
        console.log('Table exists, continuing...');
        return;
      } else {
        console.log('Table does not exist, will try to create it...');
      }
    } catch (queryError) {
      console.error('Error checking table existence:', queryError);
    }
    
    // Second approach: Try RPC if available
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('check_table_exists', {
        table_name: 'questionnaire_responses',
      });
      
      if (!rpcError && rpcData) {
        console.log('RPC confirms table exists');
        return;
      }
    } catch (rpcError) {
      console.log('RPC check failed, proceeding with table creation', rpcError);
    }
    
    console.log('Attempting to create table...');
    
    // Create table using RPC
    try {
      const { error } = await supabase.rpc('create_questionnaire_table');
      
      if (error) {
        console.log('RPC create table failed:', error);
        // We can't create tables directly using client-side code without RPC or Admin access
        // Show a message to the user
        alert(`לא ניתן ליצור את טבלת השאלונים אוטומטית. 
        אנא צור קשר עם מנהל המערכת ובקש ממנו ליצור טבלה בשם 'questionnaire_responses' 
        עם העמודות הבאות: id (serial primary key), responses (jsonb), created_at (timestamp with timezone)`);
      } else {
        console.log('Table created using RPC');
      }
    } catch (createError) {
      console.error('Failed to create table:', createError);
      // Show a warning to the user
      alert('לא הצלחנו ליצור את טבלת השאלונים. תשובותיך עשויות לא להישמר. אנא צור קשר עם התמיכה.');
    }
  } catch (error) {
    console.error('Error in questionnaire table creation process:', error);
  }
};

// הכנת SQL להגדרת אבטחת RLS בסופאבייס

// הגשת השאלון המלא (סופי)
export async function submitQuestionnaire(
  userId: string,
  answers: Answer[],
  contactInfo: ContactInfo
): Promise<{ success: boolean; error?: string }> {
  try {
    // שמירת הנתונים בטבלת התשובות
    const { error } = await supabase
      .from('questionnaire_submissions')
      .insert({
        user_id: userId,
        answers: answers,
        contact_info: contactInfo,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      });
      
    if (error) throw error;
    
    // עדכון סטטוס המשתמש
    await supabase
      .from('users')
      .update({ 
        status: 'completed_questionnaire',
        completed_at: new Date().toISOString() 
      })
      .eq('id', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'שגיאה בלתי ידועה'
    };
  }
}