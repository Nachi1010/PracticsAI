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
        נשמח ללמוד על הרקע המקצועי שלך כדי להתאים את תוכנית הלימודים לניסיון והצרכים האישיים שלך
      </p>

      <Question
        id="experience_level"
        title="מהי רמת הניסיון שלך בתכנות או פיתוח תוכנה?"
        options={[
          { value: "beginner", label: "מתחיל/ה - ידע בסיסי או ניסיון של פחות משנה" },
          { value: "intermediate", label: "בינוני - 1-3 שנות ניסיון בתחום" },
          { value: "advanced", label: "מתקדם/ת - 3-6 שנות ניסיון מקצועי" },
          { value: "expert", label: "מומחה/ית - מעל 6 שנות ניסיון, כולל ניהול פרויקטים" },
          { value: "none", label: "אין לי רקע קודם בתכנות - מעוניין/ת להתחיל מאפס" }
        ]}
        selectedValue={getAnswerValue("experience_level")}
        onChange={handleAnswerChange}
      />

      <Question
        id="learning_goal"
        title="מהי המטרה העיקרית שלך בלימודי בינה מלאכותית (AI)?"
        options={[
          { value: "career", label: "פיתוח קריירה חדשה או הסבה מקצועית" },
          { value: "skill", label: "רכישת כלים משלימים לתפקיד הנוכחי שלי" },
          { value: "business", label: "פיתוח יכולות לקידום מיזם או עסק" },
          { value: "project", label: "יישום פתרונות AI בפרויקטים ספציפיים" },
          { value: "research", label: "מחקר, למידה והתעדכנות בטכנולוגיות מתקדם" }
        ]}
        selectedValue={getAnswerValue("learning_goal")}
        onChange={handleAnswerChange}
      />

      <Question
        id="tech_background"
        title="באיזה תחום מקצועי יש לך את הניסיון הרב ביותר?"
        options={[
          { value: "programming", label: "פיתוח תוכנה ותכנות" },
          { value: "data", label: "אנליטיקה, מידע או סטטיסטיקה" },
          { value: "design", label: "עיצוב דיגיטלי, חווית משתמש או UI/UX" },
          { value: "business", label: "תחום עסקי, ניהול, שיווק או מכירות" },
          { value: "other", label: "תחום אחר (הנדסה, רפואה, חינוך, וכו')" }
        ]}
        selectedValue={getAnswerValue("tech_background")}
        onChange={handleAnswerChange}
      />

      <Question
        id="time_commitment"
        title="כמה שעות שבועיות תוכל/י להקדיש ללימודים והתרגול?"
        options={[
          { value: "minimal", label: "עד 10 שעות בשבוע" },
          { value: "moderate", label: "10-20 שעות בשבוע" },
          { value: "significant", label: "20-30 שעות בשבוע" },
          { value: "extensive", label: "30-40 שעות בשבוע" },
          { value: "fulltime", label: "מעל 40 שעות בשבוע (משרה מלאה)" }
        ]}
        selectedValue={getAnswerValue("time_commitment")}
        onChange={handleAnswerChange}
      />

      <Question
        id="learning_style"
        title="איזו שיטת למידה מתאימה לך ביותר?"
        options={[
          { value: "practical", label: "למידה מעשית ותרגול פרויקטים אמיתיים" },
          { value: "theoretical", label: "הבנת התיאוריה והעקרונות לעומק" },
          { value: "guided", label: "הדרכה מובנית וצעד אחר צעד" },
          { value: "collaborative", label: "למידה בקבוצות ופרויקטים משותפים" },
          { value: "self_directed", label: "למידה עצמאית בקצב אישי" }
        ]}
        selectedValue={getAnswerValue("learning_style")}
        onChange={handleAnswerChange}
      />

      <Question
        id="project_interest"
        title="באיזה תחום יישומי של AI אתה/את מתעניין/ת במיוחד?"
        options={[
          { value: "nlp", label: "עיבוד שפה טבעית (NLP) ובוטים חכמים" },
          { value: "vision", label: "ראייה ממוחשבת ועיבוד תמונה" },
          { value: "generative", label: "יצירת תוכן באמצעות AI (תמונות, טקסט, קוד)" },
          { value: "data_science", label: "מדע הנתונים וניתוח מתקדם" },
          { value: "decision", label: "מערכות תומכות החלטה ואוטומציה עסקית" }
        ]}
        selectedValue={getAnswerValue("project_interest")}
        onChange={handleAnswerChange}
      />

      <Question
        id="challenges"
        title="מהו האתגר המרכזי שאתה/את צופה בלימודי AI?"
        options={[
          { value: "technical", label: "התמודדות עם המורכבות הטכנית והמתמטית" },
          { value: "time", label: "איזון בין הלימודים לעבודה או התחייבויות אחרות" },
          { value: "practical", label: "יישום הידע התיאורטי בפרויקטים מעשיים" },
          { value: "pace", label: "עמידה בקצב ההתפתחות המהיר של הטכנולוגיה" },
          { value: "focus", label: "בחירת התמחות או כיוון מקצועי ממוקד" }
        ]}
        selectedValue={getAnswerValue("challenges")}
        onChange={handleAnswerChange}
      />
    </div>
  );
};

export default QuestionnairePage1; 