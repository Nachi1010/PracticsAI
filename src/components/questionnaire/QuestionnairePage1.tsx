import React from 'react';
import Question from './Question';
import { Answer } from '@/lib/types';

interface QuestionnairePage1Props {
  answers: Answer[];
  updateAnswers: (newAnswers: Answer[]) => void;
}

const QuestionnairePage1: React.FC<QuestionnairePage1Props> = ({ answers, updateAnswers }) => {
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
        בדף זה נשאל על הרקע המקצועי שלך, נא להקפיד על תשובות מדויקות
      </p>

      <Question
        id="experience_level"
        title="מהי רמת הניסיון שלך בתכנות ופיתוח?"
        options={[
          { value: "beginner", label: "מתחיל/ה (פחות משנה של ניסיון)" },
          { value: "intermediate", label: "בינוני/ת (1-3 שנות ניסיון)" },
          { value: "advanced", label: "מתקדם/ת (3-6 שנות ניסיון)" },
          { value: "expert", label: "מומחה/ית (מעל 6 שנות ניסיון)" },
          { value: "none", label: "אין לי ניסיון קודם בתכנות" }
        ]}
        selectedValue={getAnswerValue("experience_level")}
        onChange={handleAnswerChange}
      />

      <Question
        id="learning_goal"
        title="מהי המטרה העיקרית שלך בלמידת AI?"
        options={[
          { value: "career", label: "פיתוח קריירה חדשה" },
          { value: "skill", label: "הוספת כלי למיומנויות הקיימות" },
          { value: "curiosity", label: "סקרנות וידע כללי" },
          { value: "project", label: "עבודה על פרויקט ספציפי" },
          { value: "business", label: "יצירת מיזם או עסק" }
        ]}
        selectedValue={getAnswerValue("learning_goal")}
        onChange={handleAnswerChange}
      />

      <Question
        id="tech_background"
        title="איזה רקע טכנולוגי יש לך?"
        options={[
          { value: "programming", label: "רקע בתכנות ופיתוח תוכנה" },
          { value: "data", label: "רקע בעבודה עם נתונים או סטטיסטיקה" },
          { value: "design", label: "רקע בעיצוב מוצר או UX" },
          { value: "business", label: "רקע עסקי או שיווקי" },
          { value: "none", label: "אין לי רקע טכנולוגי משמעותי" }
        ]}
        selectedValue={getAnswerValue("tech_background")}
        onChange={handleAnswerChange}
      />

      <Question
        id="time_commitment"
        title="כמה זמן אתה/את מתכוונת/מתכוון להקדיש ללמידה בשבוע?"
        options={[
          { value: "minimal", label: "פחות מ-10 שעות" },
          { value: "moderate", label: "10-20 שעות" },
          { value: "significant", label: "20-30 שעות" },
          { value: "extensive", label: "30-40 שעות" },
          { value: "fulltime", label: "יותר מ-40 שעות" }
        ]}
        selectedValue={getAnswerValue("time_commitment")}
        onChange={handleAnswerChange}
      />

      <Question
        id="learning_style"
        title="איזה סגנון למידה מתאים לך ביותר?"
        options={[
          { value: "practical", label: "למידה מעשית ופרויקטים" },
          { value: "theoretical", label: "הבנה תיאורטית מעמיקה" },
          { value: "guided", label: "הדרכה מובנית וצעד אחר צעד" },
          { value: "independent", label: "חקר עצמאי וניסוי" },
          { value: "social", label: "למידה קבוצתית ושיתוף פעולה" }
        ]}
        selectedValue={getAnswerValue("learning_style")}
        onChange={handleAnswerChange}
      />

      <Question
        id="project_interest"
        title="איזה סוג של פרויקטים בAI מעניינים אותך במיוחד?"
        options={[
          { value: "web", label: "אפליקציות ווב מבוססות AI" },
          { value: "nlp", label: "עיבוד שפה טבעית וטקסט" },
          { value: "vision", label: "ראייה ממוחשבת ועיבוד תמונה" },
          { value: "generative", label: "generative AI ליצירת תוכן (תמונות, טקסט, אודיו)" },
          { value: "automation", label: "אוטומציה ותהליכים חכמים" }
        ]}
        selectedValue={getAnswerValue("project_interest")}
        onChange={handleAnswerChange}
      />

      <Question
        id="challenges"
        title="מהם האתגרים העיקריים שאתה/את צופה בלמידת AI?"
        options={[
          { value: "technical", label: "מורכבות טכנית וידע מתמטי" },
          { value: "time", label: "הקדשת זמן מספק ללמידה" },
          { value: "practical", label: "יישום מעשי של הידע" },
          { value: "resources", label: "גישה למשאבים ולסביבת פיתוח" },
          { value: "direction", label: "מציאת כיוון או התמחות ספציפית" }
        ]}
        selectedValue={getAnswerValue("challenges")}
        onChange={handleAnswerChange}
      />
    </div>
  );
};

export default QuestionnairePage1; 