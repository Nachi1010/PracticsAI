import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage2Content from '@/components/questionnaire/QuestionnairePage2';
import { Answer } from '@/lib/types';

const QuestionnairePage2 = () => {
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
  
  const handleContinue = async () => {
    // Check if all required questions are answered
    const requiredQuestions = [
      'problem_solving', 'team_preference', 'learning_motivation', 
      'ai_opinion', 'work_style', 'failure_approach', 'creativity'
    ];
    
    const answered = requiredQuestions.every(qId => 
      answers.some(a => a.questionId === qId)
    );
    
    if (!answered) {
      alert("אנא ענה/י על כל השאלות לפני שתמשיך/י");
      return;
    }
    
    // Navigate to next page
    navigate('/questionnaire/page3', { state: { answers } });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <QuestionnaireHeader 
        mainTitle="שאלון לנרשמי הקורס" 
        pageTitle="שאלות מנטליות" 
      />
      
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <QuestionnairePage2Content answers={answers} updateAnswers={updateAnswers} />
        
        <div className="mt-10 flex justify-between">
          <Button
            onClick={() => navigate('/questionnaire')}
            variant="outline"
            className="border-blue-600 text-blue-700 hover:bg-blue-50"
          >
            חזרה לשלב הקודם
          </Button>
          
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2.5 px-8 rounded-xl hover:opacity-90 transition-opacity duration-300 font-bold text-base"
            disabled={isSubmitting}
          >
            המשך לשלב הבא
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage2; 