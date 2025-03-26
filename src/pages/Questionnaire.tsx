import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage1 from '@/components/questionnaire/QuestionnairePage1';
import { getUserId, getUserProgress, saveQuestionnaireProgress } from '@/lib/supabase';
import { Answer, UserStatus } from '@/lib/types';
import { toast } from 'sonner';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isNew: true,
    hasProgress: false
  });
  
  // טעינת נתוני משתמש והתקדמות
  useEffect(() => {
    async function loadUserAndProgress() {
      setIsLoading(true);
      
      try {
        // קבלת מזהה משתמש
        const id = await getUserId();
        setUserId(id);
        
        // קבלת התקדמות שמורה
        const { success, data, error } = await getUserProgress(id);
        
        if (success && data) {
          // אם יש התקדמות שמורה
          if (data.current_page > 0) {
            setUserStatus({
              isNew: false,
              hasProgress: true,
              currentPage: data.current_page
            });
            
            // טעינת תשובות קודמות אם קיימות
            if (data.answers && data.answers.length > 0) {
              setAnswers(data.answers);
            }
          }
        } else if (error) {
          console.error('Error loading progress:', error);
        }
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserAndProgress();
    
    // גלילה לראש העמוד
    window.scrollTo(0, 0);
  }, []);
  
  const updateAnswers = (newAnswers: Answer[]) => {
    // החלפת תשובות קיימות או הוספת חדשות
    const updatedAnswers = [...answers];
    
    newAnswers.forEach(newAnswer => {
      const index = updatedAnswers.findIndex(a => a.questionId === newAnswer.questionId);
      if (index >= 0) {
        updatedAnswers[index] = newAnswer;
      } else {
        updatedAnswers.push(newAnswer);
      }
    });
    
    setAnswers(updatedAnswers);
  };
  
  const handleContinue = async () => {
    // בדיקה שכל השאלות הנדרשות נענו
    const requiredQuestions = [
      'experience_level', 'learning_goal', 'tech_background', 
      'time_commitment', 'learning_style', 'project_interest', 'challenges'
    ];
    
    const answered = requiredQuestions.every(qId => 
      answers.some(a => a.questionId === qId)
    );
    
    if (!answered) {
      toast.error("אנא ענה/י על כל השאלות לפני שתמשיך/י");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // שמירת התקדמות במסד הנתונים
      const { success, error } = await saveQuestionnaireProgress(userId, 1, answers);
      
      if (!success) {
        throw new Error(error || 'שגיאה בשמירת ההתקדמות');
      }
      
      // מעבר לדף הבא
      navigate('/questionnaire/page2', { state: { answers } });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error("אירעה שגיאה בשמירת ההתקדמות. אנא נסה/י שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <QuestionnaireHeader 
            mainTitle="שאלון התאמה לתכנית הבינה המלאכותית" 
            pageTitle="שאלון רקע מקצועי" 
            currentPage={1}
            totalPages={3}
          />
          
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <QuestionnairePage1 
              answers={answers} 
              updateAnswers={updateAnswers} 
            />
            <div className="flex justify-between mt-10">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:bg-gray-100"
              >
                חזרה לדף הבית
              </Button>
              <Button 
                onClick={handleContinue}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 hover:from-blue-700 hover:to-blue-900"
              >
                {isSubmitting ? 'אנא המתן...' : 'המשך לעמוד הבא'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Questionnaire; 