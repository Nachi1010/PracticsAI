import React from 'react';
import Question from './Question';
import { Answer } from '@/lib/types';

interface QuestionnairePage2Props {
  answers: Answer[];
  updateAnswers: (newAnswers: Answer[]) => void;
}

const QuestionnairePage2: React.FC<QuestionnairePage2Props> = ({ answers, updateAnswers }) => {
  const handleAnswerChange = (questionId: string, answer: string) => {
    updateAnswers([{ questionId, answer }]);
  };

  const getAnswerValue = (questionId: string) => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.answer || '';
  };

  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-center mb-8 text-lg">
        בדף זה נשאל שאלות מנטליות, נא לסמן את התשובה שמשקפת אותך בצורה הטובה ביותר
      </p>

      <Question
        id="problem_solving"
        title="כיצד אתה/את ניגש/ת לפתרון בעיות מורכבות?"
        options={[
          { value: "analytical", label: "ניתוח מתודי ושיטתי" },
          { value: "intuitive", label: "הסתמכות על אינטואיציה וניסיון" },
          { value: "collaborative", label: "שיתוף פעולה וחשיבה קבוצתית" },
          { value: "research", label: "מחקר ואיסוף מידע מקיף" },
          { value: "creative", label: "פתרונות יצירתיים והתנסות" }
        ]}
        selectedValue={getAnswerValue("problem_solving")}
        onChange={handleAnswerChange}
      />

      <Question
        id="team_preference"
        title="איך אתה/את מעדיף/ה לעבוד?"
        options={[
          { value: "independently", label: "באופן עצמאי לחלוטין" },
          { value: "team", label: "כחלק מצוות קבוע" },
          { value: "leading", label: "כמוביל/ה בצוות" },
          { value: "hybrid", label: "שילוב בין עבודה עצמאית לצוותית" },
          { value: "flexible", label: "גמיש/ה, תלוי בפרויקט ובדרישות" }
        ]}
        selectedValue={getAnswerValue("team_preference")}
        onChange={handleAnswerChange}
      />

      <Question
        id="learning_motivation"
        title="מה מניע אותך ללמוד ולהתפתח מקצועית?"
        options={[
          { value: "curiosity", label: "סקרנות אינטלקטואלית" },
          { value: "financial", label: "הזדמנויות קריירה ותגמול כלכלי" },
          { value: "impact", label: "היכולת ליצור השפעה ושינוי" },
          { value: "passion", label: "אהבה לתחום הספציפי" },
          { value: "challenge", label: "אתגר ותחושת הישג" }
        ]}
        selectedValue={getAnswerValue("learning_motivation")}
        onChange={handleAnswerChange}
      />

      <Question
        id="ai_opinion"
        title="מהי דעתך על התפתחות ה-AI בשנים האחרונות?"
        options={[
          { value: "excited", label: "נלהב/ת מההתפתחות המרגשת" },
          { value: "concerned", label: "מודאג/ת מההשלכות החברתיות" },
          { value: "balanced", label: "רואה הזדמנויות ואתגרים במקביל" },
          { value: "skeptical", label: "ספקני/ת לגבי הקצב והיקף השינוי" },
          { value: "pragmatic", label: "מתמקד/ת בשימושים מעשיים ובערך" }
        ]}
        selectedValue={getAnswerValue("ai_opinion")}
        onChange={handleAnswerChange}
      />

      <Question
        id="work_style"
        title="מהו סגנון העבודה שלך?"
        options={[
          { value: "structured", label: "מאורגן ומתוכנן מראש" },
          { value: "flexible", label: "גמיש ומסתגל לשינויים" },
          { value: "deadline", label: "עובד/ת טוב תחת לחץ זמן" },
          { value: "perfectionist", label: "מדייק/ת בפרטים ושואף/ת לשלמות" },
          { value: "pragmatic", label: "פרקטי/ת ומתמקד/ת בתוצאות" }
        ]}
        selectedValue={getAnswerValue("work_style")}
        onChange={handleAnswerChange}
      />

      <Question
        id="failure_approach"
        title="כיצד אתה/את מתייחס/ת לכישלון?"
        options={[
          { value: "learning", label: "הזדמנות ללמידה והשתפרות" },
          { value: "setback", label: "מכשול זמני בדרך להצלחה" },
          { value: "analysis", label: "משהו לנתח ולהבין את שורש הבעיה" },
          { value: "motivation", label: "גורם מניע לעבוד קשה יותר" },
          { value: "redirection", label: "אות להערכה מחדש והכוונה מחודשת" }
        ]}
        selectedValue={getAnswerValue("failure_approach")}
        onChange={handleAnswerChange}
      />

      <Question
        id="creativity"
        title="איך אתה/את מאפיין/ת את היצירתיות שלך?"
        options={[
          { value: "idea", label: "מייצר/ת רעיונות חדשים בקלות" },
          { value: "problem", label: "מוצא/ת פתרונות יצירתיים לבעיות" },
          { value: "artistic", label: "מתבטא/ת באופן אמנותי" },
          { value: "innovative", label: "משלב/ת רעיונות קיימים בדרכים חדשות" },
          { value: "logical", label: "מעדיף/ה לוגיקה וסדר על פני יצירתיות" }
        ]}
        selectedValue={getAnswerValue("creativity")}
        onChange={handleAnswerChange}
      />
    </div>
  );
};

export default QuestionnairePage2; 