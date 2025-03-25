import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage3Content from '@/components/questionnaire/QuestionnairePage3';
import { Answer } from '@/lib/types';
import { supabase, createQuestionnaireTable } from '@/lib/supabase';

const QuestionnairePage3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Get answers from location state or redirect to first page
    if (location.state?.answers) {
      setAnswers(location.state.answers);
    } else {
      navigate('/questionnaire');
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [location, navigate]);
  
  const updateAnswers = (newAnswers: Answer[]) => {
    // Replace answers with same questionId or add new ones
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
  
  const handleSubmit = async () => {
    // Check if all required questions are answered
    const requiredQuestions = [
      'future_vision', 'ethical_dilemma', 'inspiration_source', 
      'book_preference', 'challenge_response', 'learning_insight', 'adaptation'
    ];
    
    const answered = requiredQuestions.every(qId => 
      answers.some(a => a.questionId === qId)
    );
    
    if (!answered) {
      alert("אנא ענה/י על כל השאלות לפני שתגיש/י");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure the table exists before inserting
      await createQuestionnaireTable();
      
      // Format answers for database
      const formattedAnswers = answers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.answer;
        return acc;
      }, {} as Record<string, string>);
      
      // Store in Supabase
      const { error } = await supabase
        .from('questionnaire_responses')
        .insert([{
          responses: formattedAnswers,
          created_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      alert("השאלון הוגש בהצלחה!");
      navigate('/thank-you', { state: { fromQuestionnaire: true } });
      
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert("אירעה שגיאה בהגשת השאלון. אנא נסה/י שוב");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <QuestionnaireHeader 
        mainTitle="שאלון לנרשמי הקורס" 
        pageTitle="שאלות עם ערך מוסף" 
      />
      
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <QuestionnairePage3Content answers={answers} updateAnswers={updateAnswers} />
        
        <div className="mt-10 flex justify-between">
          <Button
            onClick={() => navigate('/questionnaire/page2', { state: { answers } })}
            variant="outline"
            className="border-blue-600 text-blue-700 hover:bg-blue-50"
          >
            חזרה לשלב הקודם
          </Button>
          
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2.5 px-8 rounded-xl hover:opacity-90 transition-opacity duration-300 font-bold text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? '...מגיש' : 'הגש שאלון'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage3; 