import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage3Content from '@/components/questionnaire/QuestionnairePage3';
import { Answer, ContactInfo } from '@/lib/types';
import { getUserId, getUserProgress, saveQuestionnaireProgress, submitQuestionnaire } from '@/lib/supabase';
import { toast } from 'sonner';
import ContactField from '@/components/questionnaire/ContactField';

const QuestionnairePage3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    comments: ''
  });
  
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
          setIsLoading(false);
          return;
        }
        
        // ניסיון לטעון מהשרת
        const { success, data, error } = await getUserProgress(id);
        
        if (success && data) {
          // אם יש תשובות שמורות
          if (data.answers && data.answers.length > 0) {
            setAnswers(data.answers);
            
            // טעינת פרטי התקשרות אם קיימים
            if (data.contact_info) {
              setContactInfo(data.contact_info);
            }
          } else {
            // אם אין תשובות, חזרה לעמוד הראשון
            navigate('/questionnaire');
            return;
          }
        } else if (error) {
          console.error('Error loading answers:', error);
          navigate('/questionnaire');
          return;
        }
      } catch (error) {
        console.error('Error initializing page 3:', error);
        navigate('/questionnaire');
        return;
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
  };
  
  const updateContactInfo = (newContactInfo: ContactInfo) => {
    setContactInfo(newContactInfo);
  };
  
  const validateContactInfo = (): boolean => {
    // וידוא שיש אימייל ומספר טלפון תקינים
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{8,9}$/;
    
    if (!contactInfo.email || !emailRegex.test(contactInfo.email)) {
      toast.error("אנא הזן/י כתובת אימייל תקינה");
      return false;
    }
    
    if (!contactInfo.phone || !phoneRegex.test(contactInfo.phone.replace(/[- ]/g, ''))) {
      toast.error("אנא הזן/י מספר טלפון תקין (10 ספרות המתחיל ב-0)");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const userId = await getUserId();
      
      // שמירת התקדמות של העמוד האחרון
      const { success: progressSuccess, error: progressError } = 
        await saveQuestionnaireProgress(userId, 3, answers, contactInfo);
      
      if (!progressSuccess || progressError) {
        throw new Error(progressError || 'אירעה שגיאה בשמירת התשובות');
      }
      
      // הגשה סופית של כל השאלון
      const { success: submitSuccess, error: submitError } = 
        await submitQuestionnaire(userId, answers, contactInfo);
      
      if (!submitSuccess || submitError) {
        throw new Error(submitError || 'אירעה שגיאה בהגשת השאלון');
      }
      
      // ניווט לדף תודה
      toast.success('השאלון הוגש בהצלחה! תודה על השתתפותך');
      setTimeout(() => {
        navigate('/thank-you', { state: { fromQuestionnaire: true } });
      }, 1500);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      toast.error(error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // חזרה לעמוד הקודם
  const handleBack = () => {
    navigate('/questionnaire/page/2');
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
            pageTitle="שאלון ערכי מוסף ופרטי קשר" 
            currentPage={3}
            totalPages={3}
          />
          
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <QuestionnairePage3Content 
              answers={answers} 
              updateAnswers={updateAnswers} 
            />
            
            <div className="my-12">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 text-right">
                פרטי התקשרות
              </h2>
              <p className="text-gray-600 mb-6 text-right">
                אנא מלא/י את פרטי ההתקשרות שלך כדי שנוכל ליצור איתך קשר בנוגע לתוצאות השאלון
              </p>
              <ContactField 
                contactInfo={contactInfo} 
                onChange={updateContactInfo} 
              />
            </div>
            
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
                {isSubmitting ? 'שולח...' : 'הגשת השאלון'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionnairePage3; 