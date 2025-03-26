import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage1 from '@/components/questionnaire/QuestionnairePage1';
import { getUserId, getUserProgress, saveQuestionnaireProgress } from '@/lib/supabase';
import { Answer, UserStatus } from '@/lib/types';
import { toast } from 'sonner';

// מפתח עבור שמירת התשובות באחסון המקומי
const ANSWERS_STORAGE_KEY = 'practicsai_questionnaire_answers';

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
        // ניסיון לטעון תשובות מאחסון מקומי תחילה
        const savedAnswers = localStorage.getItem(ANSWERS_STORAGE_KEY);
        if (savedAnswers) {
          try {
            const parsedAnswers = JSON.parse(savedAnswers);
            if (Array.isArray(parsedAnswers)) {
              setAnswers(parsedAnswers);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing saved answers:', e);
            // המשך לטעינה מהשרת אם יש בעיה בפרסור
          }
        }
        
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
              // שמירה באחסון מקומי
              localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(data.answers));
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
    
    // שמירה באחסון מקומי בכל עדכון
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(updatedAnswers));
  };
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // שמירה באחסון מקומי לפני ניסיון שמירה בשרת
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
      
      // ניסיון שמירה בשרת
      try {
        const userId = await getUserId();
        const { success, error } = await saveQuestionnaireProgress(userId, 1, answers);
        
        if (!success || error) {
          console.warn('Server save warning:', error);
          // ממשיכים גם אם יש שגיאה בשמירה בשרת כי שמרנו מקומית
        }
      } catch (serverError) {
        console.error('Server save error:', serverError);
        // ממשיכים בכל מקרה כי יש לנו שמירה מקומית
      }
      
      // ניווט לעמוד הבא - שימוש בנתיב של HashRouter
      navigate('/questionnaire/page/2', { state: { answers } });
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error(error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה');
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
                onClick={handleSubmit}
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