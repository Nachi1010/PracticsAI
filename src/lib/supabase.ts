import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://xsidbfyjeqwwtyqstzef.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaWRiZnlqZXF3d3R5cXN0emVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjIxODEsImV4cCI6MjA1NDc5ODE4MX0.JLx83ACWB2AobgNtBxoN3do3bUNZg7hltVxNNoC1VWI'
);

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