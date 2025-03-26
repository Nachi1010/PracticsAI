import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getImagePath } from "@/App";

// טופס רישום עם עיצוב מותאם ולוגיקה משופרת
export const Registration = () => {
  const { currentLang, getTextDirection } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // מצב הטופס
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    phone: ""
  });
  
  // עדכון ערכים
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // תרגומים
  const translations = {
    en: {
      title: "Join Our Elite Program",
      subtitle: "Take your first step towards AI mastery",
      namePlaceholder: "Enter your full name",
      idPlaceholder: "Enter your ID number",
      emailPlaceholder: "you@example.com",
      phonePlaceholder: "Enter your phone number",
      submitButton: "Join our journey",
      nameLabel: "Full Name",
      idLabel: "ID Number",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      successMessage: "Registration submitted successfully!",
      errorMessage: "Something went wrong. Please try again.",
      validationError: "Missing required information:",
      missingName: "Name is required",
      missingEmail: "Valid email is required",
      missingPhone: "Phone number with at least 10 digits is required",
      loading: "Processing..."
    },
    he: {
      title: "הגישו מועמדות לתכנית",
      subtitle: "רוכשים משרה נחשקת ומומחיות ב-AI",
      namePlaceholder: "שם מלא",
      idPlaceholder: "0-0000000-0",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "050-000-0000",
      submitButton: "הצטרפו אלינו",
      nameLabel: "שם מלא",
      idLabel: "מספר זהות",
      emailLabel: "כתובת אימייל",
      phoneLabel: "מספר טלפון",
      successMessage: "ההרשמה הושלמה בהצלחה!",
      errorMessage: "משהו השתבש. אנא נסו שוב.",
      validationError: "חסר מידע נדרש:",
      missingName: "נדרש למלא שם",
      missingEmail: "נדרשת כתובת אימייל תקינה",
      missingPhone: "נדרש מספר טלפון עם 10 ספרות",
      loading: "מעבד..."
    }
  };

  const t = translations[currentLang];
  
  // פונקציית עזר לבדיקת תקינות אימייל
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email ? emailRegex.test(email) : false;
  };
  
  // פונקציית עזר לבדיקת תקינות מספר טלפון (לפחות 9 ספרות)
  const isValidPhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 9;
  };

  // עדכון הלוגיקה של השליחה
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // שליחה לסופבייס בכל מקרה
      const { error } = await supabase.from('registrations').insert([{
        name: formData.name || '',
        id_number: formData.id || '',
        email: formData.email || '',
        phone: formData.phone || '',
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      // בדיקות תקינות
      const hasValidName = formData.name && formData.name.trim() !== '';
      const hasValidEmail = isValidEmail(formData.email);
      const hasValidPhone = isValidPhone(formData.phone);
      
      // בדיקת תנאים להצגת הודעת הצלחה:
      // 1. שם + אימייל תקין
      // 2. או מספר טלפון בן 9 ספרות
      const nameAndEmailValid = hasValidName && hasValidEmail;
      const phoneValid = hasValidPhone;
      const showSuccessMessage = nameAndEmailValid || phoneValid;
      
      // בדיקה אם כל הפרטים הנדרשים מולאו (לצורך מעבר לדף שאלון)
      const allFieldsValid = hasValidName && hasValidEmail && hasValidPhone;

      if (showSuccessMessage) {
        // הצגת הודעת הצלחה
        toast({
          title: "✅ " + "Success",
          description: t.successMessage,
          variant: "success",
          duration: 5000,
        });
        
        // ניווט לדף השאלון רק אם כל הפרטים מולאו
        if (allFieldsValid) {
          navigate('/#/questionnaire');
        }
      } else {
        // הצגת הודעת שגיאה עם פירוט החסרים
        let errorDetails = t.validationError + "\n";
        
        if (!hasValidName) {
          errorDetails += "\n- " + t.missingName;
        }
        
        if (!hasValidEmail) {
          errorDetails += "\n- " + t.missingEmail;
        }
        
        if (!hasValidPhone) {
          errorDetails += "\n- " + t.missingPhone;
        }
        
        toast({
          title: "❌ " + "Validation Error",
          description: errorDetails,
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "❌ " + "Error",
        description: t.errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // קבלת ערך ה-direction המתאים לשפה
  const direction = getTextDirection();

  return (
    <section 
      id="registration-form"
      className="py-10 md:py-14 min-h-screen flex items-center justify-center relative"
      style={{ direction }}
    >
      {/* תמונת רקע עם שכבת כיסוי */}
      <div className="absolute inset-0 z-0">
        <img 
          src={getImagePath("/images/D.jpeg")} 
          alt="Background" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-gray-800/90"></div>
      </div>
      
      {/* תוכן הטופס */}
      <div className="w-full max-w-xs sm:max-w-sm px-3 relative z-10">
        {/* כרטיס הטופס */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* כותרת */}
          <div className="p-4 md:p-5 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">
              {t.title}
            </h2>
            <p className="text-white/80 text-xs md:text-sm">
              {t.subtitle}
            </p>
          </div>
          
          {/* גוף הטופס */}
          <div className="p-4 md:p-5">
            <form onSubmit={onSubmit} className="space-y-3">
              {/* שם */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-sm"
                />
              </div>

              {/* מספר זהות */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t.idLabel}
                </label>
                <input
                  type="text"
                  name="id"
                  placeholder={t.idPlaceholder}
                  value={formData.id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-sm"
                />
              </div>

              {/* אימייל */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-sm"
                />
              </div>

              {/* טלפון */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  style={{ direction }}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-sm"
                />
              </div>

              {/* כפתור שליחה בעיצוב אלגנטי ומקצועי */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.loading}
                    </span>
                  ) : t.submitButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};