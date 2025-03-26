import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage3Content from '@/components/questionnaire/QuestionnairePage3';
import { Answer, ContactInfo } from '@/lib/types';
import { getUserId, getUserProgress, saveQuestionnaireProgress, submitQuestionnaire } from '@/lib/supabase';
import { toast } from 'sonner';
import ContactField from '@/components/questionnaire/ContactField';

// מפתחות לאחסון מקומי
const ANSWERS_STORAGE_KEY = 'practicsai_questionnaire_answers';
const CONTACT_STORAGE_KEY = 'practicsai_contact_info';
const SUBMIT_ATTEMPTS_KEY = 'practicsai_submit_attempts';

// מספר ניסיונות הגשה שימורים במקומי
interface SubmitAttempt {
  timestamp: string;
  userId: string;
  answers: Answer[];
  contactInfo: ContactInfo;
}

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
          // שמירה באחסון מקומי
          localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(location.state.answers));
          
          // בדיקה אם יש פרטי קשר מאוחסנים
          const savedContact = localStorage.getItem(CONTACT_STORAGE_KEY);
          if (savedContact) {
            try {
              setContactInfo(JSON.parse(savedContact));
            } catch (e) {
              console.error('Error parsing saved contact info:', e);
            }
          }
          
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
              
              // בדיקה אם יש פרטי קשר מאוחסנים
              const savedContact = localStorage.getItem(CONTACT_STORAGE_KEY);
              if (savedContact) {
                try {
                  setContactInfo(JSON.parse(savedContact));
                } catch (e) {
                  console.error('Error parsing saved contact info:', e);
                }
              }
              
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
              
              // טעינת פרטי התקשרות אם קיימים
              if (data.contact_info) {
                setContactInfo(data.contact_info);
                localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(data.contact_info));
              }
              
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
        console.error('Error initializing page 3:', error);
        navigate('/questionnaire');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAnswers();
    
    // ניסיון לשלוח הגשות שנכשלו בעבר
    tryResendPendingSubmissions();
    
    // גלילה לראש העמוד
    window.scrollTo(0, 0);
  }, [location, navigate]);
  
  // ניסיון לשלוח הגשות שנכשלו בעבר
  const tryResendPendingSubmissions = async () => {
    try {
      const pendingSubmits = localStorage.getItem(SUBMIT_ATTEMPTS_KEY);
      if (pendingSubmits) {
        const attempts: SubmitAttempt[] = JSON.parse(pendingSubmits);
        if (Array.isArray(attempts) && attempts.length > 0) {
          console.log(`Found ${attempts.length} pending submissions, attempting to resend...`);
          
          // העתק של המערך המקורי כדי שנוכל לעדכן אותו במהלך הלולאה
          const remainingAttempts: SubmitAttempt[] = [];
          
          for (const attempt of attempts) {
            try {
              const { success, error } = await submitQuestionnaire(
                attempt.userId, 
                attempt.answers, 
                attempt.contactInfo
              );
              
              if (!success) {
                console.log(`Failed to resend submission for user ${attempt.userId}: ${error}`);
                remainingAttempts.push(attempt);
              } else {
                console.log(`Successfully resent submission for user ${attempt.userId}`);
              }
            } catch (e) {
              console.error('Error resending submission:', e);
              remainingAttempts.push(attempt);
            }
          }
          
          // עדכון הרשימה בלוקל סטורג' רק אם יש עדיין ניסיונות שנכשלו
          if (remainingAttempts.length > 0) {
            localStorage.setItem(SUBMIT_ATTEMPTS_KEY, JSON.stringify(remainingAttempts));
          } else {
            localStorage.removeItem(SUBMIT_ATTEMPTS_KEY);
          }
        }
      }
    } catch (e) {
      console.error('Error handling pending submissions:', e);
    }
  };
  
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
  
  const updateContactInfo = (newContactInfo: ContactInfo) => {
    setContactInfo(newContactInfo);
    
    // שמירת פרטי הקשר באחסון מקומי
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(newContactInfo));
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
  
  // שמירת הגשה לניסיון עתידי
  const saveSubmitAttempt = () => {
    try {
      // שמירת הניסיון הנוכחי לשליחה עתידית
      const attempt: SubmitAttempt = {
        timestamp: new Date().toISOString(),
        userId,
        answers,
        contactInfo
      };
      
      // טעינת ניסיונות קיימים אם יש
      let attempts: SubmitAttempt[] = [];
      const existingAttempts = localStorage.getItem(SUBMIT_ATTEMPTS_KEY);
      
      if (existingAttempts) {
        try {
          const parsed = JSON.parse(existingAttempts);
          if (Array.isArray(parsed)) {
            attempts = parsed;
          }
        } catch (e) {
          console.error('Error parsing existing attempts:', e);
        }
      }
      
      // הוספת הניסיון הנוכחי
      attempts.push(attempt);
      
      // שמירה מחדש במאגר מקומי
      localStorage.setItem(SUBMIT_ATTEMPTS_KEY, JSON.stringify(attempts));
      
      console.log('Saved submit attempt for future retry');
    } catch (e) {
      console.error('Error saving submit attempt:', e);
    }
  };
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // בדיקת תקינות פרטי הקשר
    if (!validateContactInfo()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // שמירה באחסון מקומי
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contactInfo));
      
      let submitSuccessful = false;
      
      try {
        // קבלת מזהה משתמש - וידוא שיש לנו מזהה תקין
        const id = userId || await getUserId();
        
        if (!id) {
          throw new Error("לא ניתן לקבל מזהה משתמש חוקי");
        }
        
        console.log(`Attempting to save progress and submit questionnaire for user ${id}`);
        
        // שמירת התקדמות של העמוד האחרון
        const { success: progressSuccess, error: progressError } = 
          await saveQuestionnaireProgress(id, 3, answers, contactInfo);
        
        if (!progressSuccess) {
          console.warn('Error saving progress to server:', progressError);
          // שמירת הניסיון לשליחה עתידית
          saveSubmitAttempt();
        }
        
        // הגשה סופית של כל השאלון - זה הכי חשוב!
        const { success: submitSuccess, error: submitError } = 
          await submitQuestionnaire(id, answers, contactInfo);
        
        if (!submitSuccess) {
          console.error('Error submitting questionnaire to server:', submitError);
          // שמירת הניסיון לשליחה עתידית
          saveSubmitAttempt();
          throw new Error(submitError || "אירעה שגיאה בהגשת השאלון לשרת");
        } else {
          submitSuccessful = true;
          console.log("Questionnaire submitted successfully to database!");
        }
      } catch (serverError) {
        console.error('Server communication error:', serverError);
        // שמירת הניסיון לשליחה עתידית
        saveSubmitAttempt();
        // ממשיכים למרות השגיאה כי שמרנו את הנתונים ב-localStorage
      }
      
      // הצגת הודעת הצלחה למשתמש
      if (submitSuccessful) {
        toast.success('השאלון הוגש בהצלחה! תודה על השתתפותך');
      } else {
        // אם ההגשה נכשלה, מציגים הודעה אבל עדיין מנווטים הלאה
        toast.warning('השאלון נשמר מקומית אך ייתכן שלא הוגש לשרת בהצלחה. ננסה לשלוח את פרטיך שוב בהמשך.');
      }
      
      // נשאיר את הנתונים באחסון המקומי גם אם ההגשה הצליחה, למקרה שיש צורך בשחזור
      
      // ניווט לדף תודה
      setTimeout(() => {
        navigate('/thank-you', { state: { fromQuestionnaire: true, contact: contactInfo } });
      }, 1500);
    } catch (error) {
      console.error('Error in submission process:', error);
      toast.error(error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה בתהליך ההגשה');
      setIsSubmitting(false);
    }
  };
  
  // חזרה לעמוד הקודם
  const handleBack = () => {
    navigate('/questionnaire/page/2', { state: { answers } });
  };
  
  return (
    <div className="min-h-screen bg-slate-50 bg-[url('/images/faq-bg.jpg')] bg-cover bg-center bg-fixed">
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-indigo-900/70 bg-radial-gradient -z-10"></div>
          
          <QuestionnaireHeader 
            mainTitle="שאלון התאמה לתכנית הבינה המלאכותית" 
            pageTitle="שאלון ערכי מוסף ופרטי קשר" 
            currentPage={3}
            totalPages={3}
          />
          
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
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
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionnairePage3; 