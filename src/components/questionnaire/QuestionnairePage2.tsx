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
        השאלות הבאות עוזרות לנו להבין את סגנון העבודה והחשיבה שלך כדי להתאים את הלמידה ולשבץ אותך בצוות המתאים
      </p>

      <Question
        id="problem_solving"
        title="כיצד אתה/את מתמודד/ת עם אתגרים מקצועיים מורכבים?"
        options={[
          { value: "analytical", label: "ניתוח שיטתי ובדיקה מתודית של האפשרויות" },
          { value: "intuitive", label: "הסתמכות על אינטואיציה וניסיון קודם" },
          { value: "collaborative", label: "התייעצות עם עמיתים וחשיבה משותפת" },
          { value: "research", label: "מחקר מעמיק ואיסוף מידע לפני קבלת החלטות" },
          { value: "iterative", label: "ניסוי וטעייה תוך למידה מהירה והסתגלות" }
        ]}
        selectedValue={getAnswerValue("problem_solving")}
        onChange={handleAnswerChange}
      />

      <Question
        id="team_preference"
        title="באיזו סביבת עבודה אתה/את פועל/ת בצורה הטובה ביותר?"
        options={[
          { value: "independent", label: "עבודה עצמאית עם חופש פעולה מלא" },
          { value: "team", label: "עבודה כחלק מצוות עם משימות מוגדרות" },
          { value: "leading", label: "הובלת צוות או פרויקט והנחיית אחרים" },
          { value: "hybrid", label: "שילוב בין עבודה עצמאית לעבודת צוות" },
          { value: "mentored", label: "עבודה תחת הנחיה וליווי של מנטור מקצועי" }
        ]}
        selectedValue={getAnswerValue("team_preference")}
        onChange={handleAnswerChange}
      />

      <Question
        id="learning_motivation"
        title="מה הגורם המניע העיקרי שלך להתפתחות מקצועית בתחום?"
        options={[
          { value: "curiosity", label: "סקרנות אינטלקטואלית וצמא לידע חדש" },
          { value: "career", label: "קידום הקריירה והשגת יעדים מקצועיים" },
          { value: "impact", label: "רצון ליצור השפעה משמעותית באמצעות טכנולוגיה" },
          { value: "innovation", label: "עניין בחדשנות ובפיתוח פתרונות חדשניים" },
          { value: "expertise", label: "שאיפה למצוינות ולמומחיות מקצועית" }
        ]}
        selectedValue={getAnswerValue("learning_motivation")}
        onChange={handleAnswerChange}
      />

      <Question
        id="ai_opinion"
        title="מהי עמדתך לגבי התפתחות הבינה המלאכותית והשפעתה העתידית?"
        options={[
          { value: "optimistic", label: "אופטימי/ת - רואה בעיקר הזדמנויות וקידמה" },
          { value: "cautious", label: "זהיר/ה - מכיר/ה בפוטנציאל לצד סיכונים אפשריים" },
          { value: "pragmatic", label: "פרגמטי/ת - מתמקד/ת ביישומים מעשיים ואתיקה" },
          { value: "transformative", label: "רואה בה כח משנה משחק בכל תחומי החיים" },
          { value: "professional", label: "גישה מקצועית - מעוניין/ת בעיקר בהיבטים הטכניים" }
        ]}
        selectedValue={getAnswerValue("ai_opinion")}
        onChange={handleAnswerChange}
      />

      <Question
        id="work_style"
        title="מהי השיטה המועדפת עליך להתקדמות בפרויקטים?"
        options={[
          { value: "structured", label: "תכנון מדוקדק ועבודה שיטתית לפי לוח זמנים" },
          { value: "agile", label: "עבודה בספרינטים עם גמישות להסתגל לשינויים" },
          { value: "focus", label: "ריכוז במשימה אחת עד להשלמתה לפני מעבר לבאה" },
          { value: "parallel", label: "עבודה במקביל על מספר משימות ופרויקטים" },
          { value: "outcome", label: "התמקדות בתוצאות הסופיות יותר מאשר בתהליך" }
        ]}
        selectedValue={getAnswerValue("work_style")}
        onChange={handleAnswerChange}
      />

      <Question
        id="feedback_approach"
        title="כיצד אתה/את מתייחס/ת למשוב ולביקורת מקצועית?"
        options={[
          { value: "embracing", label: "רואה בביקורת הזדמנות חיונית להשתפרות" },
          { value: "analytical", label: "בוחן/ת את הביקורת באופן אנליטי לפני הפנמתה" },
          { value: "selective", label: "מסנן/ת ומיישם/ת את המשוב הרלוונטי עבורי" },
          { value: "constructive", label: "מעדיף/ה לקבל ביקורת בונה עם הצעות מעשיות" },
          { value: "open", label: "פתוח/ה למשוב מכל מקור ומנסה ליישמו" }
        ]}
        selectedValue={getAnswerValue("failure_approach")}
        onChange={handleAnswerChange}
      />

      <Question
        id="innovation_approach"
        title="כיצד אתה/את מתמודד/ת עם החדשנות המתמדת בעולם הטכנולוגי?"
        options={[
          { value: "early_adopter", label: "מאמץ/ת במהירות טכנולוגיות וכלים חדשים" },
          { value: "selective", label: "בוחן/ת בקפידה אילו חידושים לאמץ לפי ערכם" },
          { value: "balancing", label: "משלב/ת בין טכנולוגיות חדשות לשיטות מוכחות" },
          { value: "conceptual", label: "מתעניין/ת בעיקר בקונספטים החדשניים והרעיונות" },
          { value: "practical", label: "מתמקד/ת ביישומים המעשיים של טכנולוגיות חדשות" }
        ]}
        selectedValue={getAnswerValue("creativity")}
        onChange={handleAnswerChange}
      />
    </div>
  );
};

export default QuestionnairePage2; 