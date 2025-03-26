import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage2Content from '@/components/questionnaire/QuestionnairePage2';
import { Answer } from '@/lib/types';
import { getUserId, getUserProgress, saveQuestionnaireProgress } from '@/lib/supabase';
import { toast } from 'sonner';

// מפתח עבור שמירת התשובות באחסון המקומי
const ANSWERS_STORAGE_KEY = 'practicsai_questionnaire_answers';

const QuestionnairePage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  
  // טעינת תשובות קודמות אם יש
  useEffect(() => {
    async function loadAnswers() {
      setIsLoading(true);
      
      try {
        // קבלת מזהה משתמש
        const id = await getUserId();
        setUserId(id);
        
        // בדיקה אם יש תשובות בלוקיישן סטייט
        if (location.state?.answers) {
          setAnswers(location.state.answers);
          // שמירה באחסון מקומי
          localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(location.state.answers));
          setIsLoading(false);
          return;
        }
        
        // ניסיון לטעון מאחסון מקומי
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
          }
        }
        
        // ניסיון לטעון מהשרת אם אין באחסון מקומי
        try {
          const { success, data, error } = await getUserProgress(id);
          
          if (success && data) {
            // אם יש תשובות שמורות
            if (data.answers && data.answers.length > 0) {
              setAnswers(data.answers);
              // שמירה באחסון מקומי
              localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(data.answers));
              setIsLoading(false);
              return;
            }
          }
        } catch (serverError) {
          console.error('Error loading from server:', serverError);
        }
        
        // אם לא מצאנו תשובות בשום מקום, חזור לעמוד הראשון
        navigate('/questionnaire');
      } catch (error) {
        console.error('Error initializing page 2:', error);
        // אם יש שגיאה בכל זאת ננסה לעבור לעמוד הראשון
        navigate('/questionnaire');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAnswers();
    
    // גלילה לראש העמוד
    window.scrollTo(0, 0);
  }, [location, navigate]);
  
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
        const { success, error } = await saveQuestionnaireProgress(userId, 2, answers);
        
        if (!success || error) {
          console.warn('Server save warning:', error);
          // ממשיכים גם אם יש שגיאה בשמירה בשרת כי שמרנו מקומית
        }
      } catch (serverError) {
        console.error('Server save error:', serverError);
        // ממשיכים בכל מקרה כי יש לנו שמירה מקומית
      }
      
      // ניווט לעמוד הבא
      navigate('/questionnaire/page/3', { state: { answers } });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    navigate('/questionnaire/page/1', { state: { answers } });
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
            pageTitle="שאלון תכונות אישיות" 
            currentPage={2}
            totalPages={3}
          />
          
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <QuestionnairePage2Content 
              answers={answers} 
              updateAnswers={updateAnswers} 
            />
            <div className="flex justify-between mt-10">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="text-gray-600 hover:bg-gray-100"
              >
                חזרה לעמוד הקודם
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

export default QuestionnairePage2; 