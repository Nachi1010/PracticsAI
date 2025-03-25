import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireHeader from '@/components/QuestionnaireHeader';
import { Button } from '@/components/ui/button';
import QuestionnairePage1 from '@/components/questionnaire/QuestionnairePage1';
import { supabase } from '@/lib/supabase';
import { Answer } from '@/lib/types';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);
  
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
      'experience_level', 'learning_goal', 'tech_background', 
      'time_commitment', 'learning_style', 'project_interest', 'challenges'
    ];
    
    const answered = requiredQuestions.every(qId => 
      answers.some(a => a.questionId === qId)
    );
    
    if (!answered) {
      alert("אנא ענה/י על כל השאלות לפני שתמשיך/י");
      return;
    }
    
    // Navigate to next page
    navigate('/questionnaire/page2', { state: { answers } });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <QuestionnaireHeader 
        mainTitle="שאלון לנרשמי הקורס" 
        pageTitle="שאלות רקע מקצועי" 
      />
      
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <QuestionnairePage1 answers={answers} updateAnswers={updateAnswers} />
        
        <div className="mt-10 flex justify-between">
          <div></div> {/* Empty div for flex alignment */}
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

export default Questionnaire; 