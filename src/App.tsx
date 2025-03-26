import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ThankYou from './pages/ThankYou';
import Questionnaire from './pages/Questionnaire';
import QuestionnairePage2 from './pages/QuestionnairePage2';
import QuestionnairePage3 from './pages/QuestionnairePage3';
import { Toaster } from 'sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import { useEffect } from 'react';
import './App.css';

// פונקציה להתמודדות עם ניתוב עמוק ב-SPA
const useSpaRouting = () => {
  useEffect(() => {
    // קוד להתמודדות עם ניתוב עמוק בגיטהאב פייג'ס
    const redirectScript = document.getElementById('redirect-script');
    if (redirectScript) {
      return; // הסקריפט כבר קיים
    }

    // הוספת סקריפט שמטפל בניתוב
    const script = document.createElement('script');
    script.id = 'redirect-script';
    script.innerHTML = `
      (function() {
        const redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;
        if (redirect && redirect !== location.href) {
          history.replaceState(null, null, redirect);
        }
      })();
    `;
    document.head.appendChild(script);
  }, []);
};

// פונקציה לקבלת נתיב תמונה נכון
export const getImagePath = (path: string): string => {
  // הסר / בתחילת הנתיב אם קיים
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // השתמש בנתיב יחסי פשוט - עובד הן בפיתוח והן בייצור עם דומיין מותאם אישית
  return `/${cleanPath}`;
};

function App() {
  // שימוש בפונקציה לניתוב עמוק
  useSpaRouting();

  return (
    <LanguageProvider>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/thank-you" element={<ThankYou />} />
          
          {/* ניתובי שאלון */}
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/questionnaire/page2" element={<QuestionnairePage2 />} />
          <Route path="/questionnaire/page3" element={<QuestionnairePage3 />} />
          
          {/* דף 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
