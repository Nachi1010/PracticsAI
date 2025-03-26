import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";

const ThankYou = () => {
  const { currentLang } = useLanguage();
  const location = useLocation();
  const isQuestionnaire = location.search.includes('questionnaire=true') || location.state?.fromQuestionnaire;
  const contactName = location.state?.contactName || '';

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const texts = {
    en: {
      title: isQuestionnaire 
        ? "Thank You for Completing the Questionnaire!" 
        : "Thank You for Registering!",
      subtitle: isQuestionnaire 
        ? contactName ? `${contactName}, your responses have been submitted successfully.` : "Your responses have been submitted successfully." 
        : "We're excited to have you join our AI program.",
      message: isQuestionnaire
        ? "Our team will review your responses and contact you shortly with personalized recommendations for your AI journey."
        : "Our team will contact you shortly with more information about our AI program and how to get started.",
      homeLink: "Return to Home"
    },
    he: {
      title: isQuestionnaire 
        ? "תודה על מילוי השאלון!" 
        : "תודה על ההרשמה!",
      subtitle: isQuestionnaire 
        ? contactName ? `${contactName}, התשובות שלך נשלחו בהצלחה.` : "התשובות שלך נשלחו בהצלחה."
        : "אנחנו נרגשים לקבל אותך לתכנית ה-AI שלנו.",
      message: isQuestionnaire
        ? "הצוות שלנו יבחן את תשובותיך וייצור איתך קשר בקרוב לקביעת פגישת ראיון אישית עם נציג מחלקת ההשמה שלנו."
        : "צוות המומחים שלנו יצור איתך קשר בקרוב עם מידע נוסף על תכנית ה-AI שלנו וכיצד להתחיל.",
      homeLink: "חזרה לדף הבית"
    }
  };

  const t = texts[currentLang];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900 flex items-center justify-center py-20">
      <div className="container max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-blue-900">{t.title}</h1>
            <p className="text-xl mb-4 text-gray-700">{t.subtitle}</p>
            <p className="text-gray-600 mb-10 max-w-md mx-auto">{t.message}</p>
            <Link 
              to="/"
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg text-lg font-medium hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              {t.homeLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;