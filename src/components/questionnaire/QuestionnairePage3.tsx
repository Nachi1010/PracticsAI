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
        בדף זה נשאל שאלות בעלות ערך מוסף, אין תשובות נכונות או שגויות - סמן לפי תחושתך האישית
      </p>

      <Question
        id="future_vision"
        title="איך אתה/את רואה את עתיד ה-AI בעוד 10 שנים?"
        options={[
          { value: "integrated", label: "שילוב מלא בכל היבט של חיינו" },
          { value: "regulated", label: "מוסדר ומפוקח יותר מבחינה אתית" },
          { value: "specialized", label: "התמחות בתחומים ספציפיים" },
          { value: "limited", label: "מוגבל יותר ממה שאנשים מצפים כיום" },
          { value: "transformative", label: "יחולל שינוי מהפכני בחברה האנושית" }
        ]}
        selectedValue={getAnswerValue("future_vision")}
        onChange={handleAnswerChange}
      />

      <Question
        id="ethical_dilemma"
        title="מהו לדעתך האתגר האתי המשמעותי ביותר בתחום ה-AI?"
        options={[
          { value: "privacy", label: "פרטיות ואיסוף נתונים" },
          { value: "bias", label: "הטיות ואפליה במערכות AI" },
          { value: "autonomy", label: "אוטונומיה ובקרה אנושית" },
          { value: "accountability", label: "אחריותיות ושקיפות" },
          { value: "job_displacement", label: "אובדן משרות ושינויים בשוק העבודה" }
        ]}
        selectedValue={getAnswerValue("ethical_dilemma")}
        onChange={handleAnswerChange}
      />

      <Question
        id="inspiration_source"
        title="מה מקור ההשראה העיקרי שלך?"
        options={[
          { value: "nature", label: "טבע ותופעות טבעיות" },
          { value: "people", label: "אנשים ומנהיגים מעוררי השראה" },
          { value: "arts", label: "אמנות, ספרות ומוזיקה" },
          { value: "challenges", label: "אתגרים והתגברות על קשיים" },
          { value: "innovation", label: "חדשנות וטכנולוגיה" }
        ]}
        selectedValue={getAnswerValue("inspiration_source")}
        onChange={handleAnswerChange}
      />

      <Question
        id="book_preference"
        title="איזה סוג ספרים אתה/את מעדיף/ה לקרוא?"
        options={[
          { value: "fiction", label: "ספרות בדיונית ופנטזיה" },
          { value: "nonfiction", label: "ספרי עיון ותוכן מקצועי" },
          { value: "biography", label: "ביוגרפיות וסיפורים אישיים" },
          { value: "science", label: "מדע ומחקר" },
          { value: "philosophy", label: "פילוסופיה ומחשבה" }
        ]}
        selectedValue={getAnswerValue("book_preference")}
        onChange={handleAnswerChange}
      />

      <Question
        id="challenge_response"
        title="כשאתה/את נתקל/ת באתגר לא מוכר, מה התגובה הראשונית שלך?"
        options={[
          { value: "excitement", label: "התרגשות והתלהבות מההזדמנות" },
          { value: "planning", label: "תכנון ואסטרטגיה מפורטת" },
          { value: "consultation", label: "התייעצות עם אחרים" },
          { value: "research", label: "מחקר ולמידה מעמיקה" },
          { value: "intuition", label: "הסתמכות על אינסטינקטים ואינטואיציה" }
        ]}
        selectedValue={getAnswerValue("challenge_response")}
        onChange={handleAnswerChange}
      />

      <Question
        id="learning_insight"
        title="מהי התובנה החשובה ביותר שלמדת מכישלון?"
        options={[
          { value: "perseverance", label: "חשיבות ההתמדה והנחישות" },
          { value: "adaptation", label: "היכולת להסתגל ולהיות גמיש" },
          { value: "preparation", label: "ערך התכנון וההכנה המוקדמת" },
          { value: "support", label: "חשיבות התמיכה החברתית" },
          { value: "perspective", label: "שמירה על פרספקטיבה נכונה" }
        ]}
        selectedValue={getAnswerValue("learning_insight")}
        onChange={handleAnswerChange}
      />

      <Question
        id="adaptation"
        title="איך אתה/את מתמודד/ת עם שינויים טכנולוגיים מהירים?"
        options={[
          { value: "eager", label: "מאמץ/ת בהתלהבות טכנולוגיות חדשות" },
          { value: "selective", label: "בוחר/ת בקפידה אילו שינויים לאמץ" },
          { value: "gradual", label: "מאמץ/ת בהדרגה לפי הצורך" },
          { value: "reluctant", label: "נשאר/ת עם מה שעובד עד שיש צורך בשינוי" },
          { value: "balanced", label: "שומר/ת על איזון בין חדשנות ליציבות" }
        ]}
        selectedValue={getAnswerValue("adaptation")}
        onChange={handleAnswerChange}
      />

      {/* שאלה 1 עם טקסט חופשי */}
      <Card className="mb-6 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-slate-50">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-slate-100 border-b border-blue-200">
          <CardTitle className="text-lg text-blue-900 font-medium text-right">
            מה הציפיות שלך מהקורס? פרט/י
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-opacity-50">
          <Label htmlFor="expectations" className="sr-only">ציפיות מהקורס</Label>
          <Textarea
            id="expectations"
            placeholder="הקלד/י את ציפיותיך מהקורס כאן..."
            value={getAnswerValue("expectations")}
            onChange={(e) => handleTextareaChange(e, "expectations")}
            className="min-h-[120px] text-right dir-rtl"
          />
        </CardContent>
      </Card>

      {/* שאלה 2 עם טקסט חופשי - שונתה לפי הבקשה */}
      <Card className="mb-6 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-slate-50">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-slate-100 border-b border-blue-200">
          <CardTitle className="text-lg text-blue-900 font-medium text-right">
            מה עוד כדאי שמחלקת הגיוס שלנו תדע? משהו נוסף שחשוב לך לומר?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-opacity-50">
          <Label htmlFor="additional_info" className="sr-only">מידע נוסף</Label>
          <Textarea
            id="additional_info"
            placeholder="כאן מקלידים את העדכונים וההערות שחשוב שנשמע מראש..."
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