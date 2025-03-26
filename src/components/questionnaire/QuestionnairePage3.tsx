import React from 'react';
import Question from './Question';
import { Answer } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionnairePage3Props {
  answers: Answer[];
  updateAnswers: (newAnswers: Answer[]) => void;
}

const QuestionnairePage3: React.FC<QuestionnairePage3Props> = ({ answers, updateAnswers }) => {
  const handleAnswerChange = (questionId: string, answer: string) => {
    updateAnswers([{ questionId, answer }]);
  };

  const getAnswerValue = (questionId: string) => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.answer || '';
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, questionId: string) => {
    updateAnswers([{ questionId, answer: e.target.value }]);
  };

  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-center mb-8 text-lg">
        לקראת סיום השאלון, נשמח לשמוע את עמדותיך בנושאים רחבים יותר הקשורים לתכנית ולעתיד המקצועי שלך
      </p>

      <Question
        id="future_vision"
        title="כיצד לדעתך תשתלב הבינה המלאכותית בתעשייה ובחברה בעשור הקרוב?"
        options={[
          { value: "gradually", label: "אימוץ הדרגתי עם דגש על אתיקה ורגולציה" },
          { value: "rapidly", label: "אימוץ מהיר שיחולל מהפכה בכל תחומי החיים" },
          { value: "specialized", label: "התמחות בתחומים ספציפיים בהם יש ערך מוסף ברור" },
          { value: "hybrid", label: "מודל היברידי של שיתוף פעולה בין אדם למכונה" },
          { value: "uncertain", label: "קשה לחזות, תלוי מאוד בהתפתחויות טכנולוגיות ואתיות" }
        ]}
        selectedValue={getAnswerValue("future_vision")}
        onChange={handleAnswerChange}
      />

      <Question
        id="ethical_dilemma"
        title="מהו האתגר האתי המשמעותי ביותר בהתפתחות ויישום של AI לדעתך?"
        options={[
          { value: "privacy", label: "שמירה על פרטיות ואבטחת מידע אישי" },
          { value: "bias", label: "מניעת הטיות ואפליה במערכות אוטומטיות" },
          { value: "transparency", label: "שקיפות ויכולת הסבר של החלטות אלגוריתמיות" },
          { value: "employment", label: "השפעה על שוק העבודה ומקומות תעסוקה" },
          { value: "control", label: "שמירה על בקרה אנושית במערכות אוטונומיות" }
        ]}
        selectedValue={getAnswerValue("ethical_dilemma")}
        onChange={handleAnswerChange}
      />

      <Question
        id="tech_interest"
        title="באיזו טכנולוגיה או כלי AI אתה/את מעוניין/ת להתמחות במיוחד?"
        options={[
          { value: "large_models", label: "מודלים גדולים של שפה ויצירת תוכן (LLMs)" },
          { value: "computer_vision", label: "ראייה ממוחשבת וניתוח תמונה" },
          { value: "ml_engineering", label: "הנדסת מערכות למידת מכונה ותשתיות AI" },
          { value: "decision_systems", label: "מערכות לקבלת החלטות ותמיכה עסקית" },
          { value: "multimodal", label: "מערכות מולטימודליות המשלבות טקסט, תמונה וקול" }
        ]}
        selectedValue={getAnswerValue("inspiration_source")}
        onChange={handleAnswerChange}
      />

      <Question
        id="research_interest"
        title="איזה תחום מחקר או ספרות מקצועית הכי מעניין אותך בהקשר לAI?"
        options={[
          { value: "foundations", label: "יסודות האלגוריתמים ומתמטיקה של למידת מכונה" },
          { value: "applications", label: "יישומים מעשיים וחקרי מקרה בתעשייה" },
          { value: "ethics", label: "אתיקה, משפט ורגולציה בבינה מלאכותית" },
          { value: "future", label: "מחקר עתידני ופיתוחים טכנולוגיים מתקדמים" },
          { value: "interdisciplinary", label: "מחקר בינתחומי המשלב AI עם תחומים אחרים" }
        ]}
        selectedValue={getAnswerValue("book_preference")}
        onChange={handleAnswerChange}
      />

      <Question
        id="challenge_response"
        title="כיצד אתה/את ניגש/ת ללמידה של טכנולוגיות חדשות ומורכבות?"
        options={[
          { value: "hands_on", label: "התנסות מעשית ישירה - לומד/ת תוך כדי עשייה" },
          { value: "structured", label: "למידה מובנית המתקדמת בשלבים הגיוניים" },
          { value: "community", label: "למידה בקהילה ושיתוף ידע עם עמיתים" },
          { value: "deep_dive", label: "העמקה יסודית בחומר התיאורטי לפני היישום" },
          { value: "project", label: "למידה מונעת-פרויקט סביב מטרה או תוצר מוגדר" }
        ]}
        selectedValue={getAnswerValue("challenge_response")}
        onChange={handleAnswerChange}
      />

      <Question
        id="career_goal"
        title="מהו היעד המקצועי שלך בתום התוכנית?"
        options={[
          { value: "role", label: "השתלבות בתפקיד מקצועי בתחום ה-AI" },
          { value: "startup", label: "הקמת מיזם או סטארטאפ בתחום הטכנולוגי" },
          { value: "integration", label: "שילוב כלי AI בארגון או בתפקיד הנוכחי שלי" },
          { value: "research", label: "המשך לימודים מתקדמים או עיסוק במחקר" },
          { value: "freelance", label: "פיתוח קריירה עצמאית כמומחה/ית בתחום" }
        ]}
        selectedValue={getAnswerValue("learning_insight")}
        onChange={handleAnswerChange}
      />

      <Question
        id="industry_preference"
        title="באיזה ענף או תעשייה היית רוצה ליישם את כישורי ה-AI שלך?"
        options={[
          { value: "tech", label: "תעשיית ההייטק וחברות טכנולוגיה" },
          { value: "healthcare", label: "רפואה, בריאות ומדעי החיים" },
          { value: "finance", label: "פיננסים, בנקאות וביטוח" },
          { value: "education", label: "חינוך, למידה והדרכה" },
          { value: "social", label: "שירותים חברתיים, ממשלה ומגזר ציבורי" }
        ]}
        selectedValue={getAnswerValue("adaptation")}
        onChange={handleAnswerChange}
      />

      {/* שאלה 1 עם טקסט חופשי */}
      <Card className="mb-6 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-slate-50">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-slate-100 border-b border-blue-200">
          <CardTitle className="text-lg text-blue-900 font-medium text-right">
            מהן הציפיות והיעדים האישיים שלך מתוכנית הלימודים? איך תרצה/י למדוד את ההצלחה שלך?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-opacity-50">
          <Label htmlFor="expectations" className="sr-only">ציפיות מהתוכנית</Label>
          <Textarea
            id="expectations"
            placeholder="תאר/י את המטרות האישיות שלך, הכישורים שאת/ה מעוניין/ת לפתח, ואיך תוכנית זו יכולה לסייע לך להשיג את יעדיך..."
            value={getAnswerValue("expectations")}
            onChange={(e) => handleTextareaChange(e, "expectations")}
            className="min-h-[120px] text-right dir-rtl"
          />
        </CardContent>
      </Card>

      {/* שאלה 2 עם טקסט חופשי */}
      <Card className="mb-6 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-slate-50">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-slate-100 border-b border-blue-200">
          <CardTitle className="text-lg text-blue-900 font-medium text-right">
            מידע נוסף לוועדת הקבלה - שתף/י מידע או ניסיון רלוונטי שלא בא לידי ביטוי בשאלות הקודמות
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-opacity-50">
          <Label htmlFor="additional_info" className="sr-only">מידע נוסף</Label>
          <Textarea
            id="additional_info"
            placeholder="זה המקום לספר על ניסיון ייחודי, פרויקטים, הישגים, או כל מידע אחר שיכול לתת תמונה מלאה יותר על הרקע והפוטנציאל שלך..."
            value={getAnswerValue("additional_info")}
            onChange={(e) => handleTextareaChange(e, "additional_info")}
            className="min-h-[120px] text-right dir-rtl"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnairePage3; 