import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuestionnairePage1 from '@/components/questionnaire/QuestionnairePage1';
import { Header } from '@/components/layout/Header';
import { Answer } from '@/lib/types';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { saveQuestionnaireProgress } from '@/lib/supabase';
import { toast } from 'sonner';

const QuestionnairePage1Route: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchPreviousAnswers = async () => {
      setIsLoading(true);
      try {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
          navigate('/questionnaire');
          return;
        }
        
        setUserId(storedUserId);
        
        const storedAnswers = localStorage.getItem(`answers_${storedUserId}_page1`);
        if (storedAnswers) {
          setAnswers(JSON.parse(storedAnswers));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching previous answers:', error);
        setIsLoading(false);
      }
    };

    fetchPreviousAnswers();
  }, [navigate]);

  const handleUpdateAnswers = (newAnswers: Answer[]) => {
    setAnswers(newAnswers);
    
    if (userId) {
      localStorage.setItem(`answers_${userId}_page1`, JSON.stringify(newAnswers));
    }
  };

  const goBack = () => {
    navigate('/questionnaire');
  };

  const saveAndContinue = async () => {
    if (!userId) {
      navigate('/questionnaire');
      return;
    }

    if (answers.length < 3) {
      toast.error("יש למלא לפחות 3 שאלות", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);

    try {
      // שמירה מקומית תמיד
      localStorage.setItem(`answers_${userId}_page1`, JSON.stringify(answers));
      localStorage.setItem(`lastPage_${userId}`, '1');
      
      // שמירה בשרת במקביל - ללא הודעות למשתמש
      saveQuestionnaireProgress(userId, 1, answers)
        .catch(error => console.error('Background save error:', error));
      
      navigate('/questionnaire/page/2');
    } catch (error) {
      console.error('Error saving progress:', error);
      // במקרה של שגיאה בשמירה המקומית - עדיין ננסה להמשיך
      navigate('/questionnaire/page/2');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onMenuToggle={() => {}} />
        <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuToggle={() => {}} />
      
      <main className="flex-grow pb-20 px-4 relative overflow-hidden">
        {/* רקע מעוצב */}
        <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('/img/bg-pattern.svg')] opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto pt-8">
          <QuestionnaireHeader currentPage={1} totalPages={3} />
          
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8 relative">
            {/* כותרת הדף */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">ספר/י לנו עליך קצת</h2>
              <p className="text-gray-600 mt-2">בחר/י את התשובות שמתאימות לך ביותר</p>
            </div>
            
            <QuestionnairePage1 
              answers={answers} 
              updateAnswers={handleUpdateAnswers} 
            />
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={isSaving}
              className="bg-white hover:bg-gray-100 shadow-md"
            >
              חזרה
            </Button>
            
            <Button 
              onClick={saveAndContinue}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 shadow-md"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  טוען...
                </>
              ) : 'המשך לעמוד הבא'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionnairePage1Route; 