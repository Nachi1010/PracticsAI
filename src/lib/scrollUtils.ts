/**
 * פונקציית עזר לגלילה חלקה בין אלמנטים בדף
 * Utility function for smooth scrolling between page elements
 */

export const smoothScrollTo = (
  eOrId: React.MouseEvent<HTMLAnchorElement> | string
): void => {
  // בדיקה אם המכשיר הינו מובייל
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  // זמן השהייה לפני חישוב מחדש של המיקום, נותן להידר זמן להתכווץ במידה ויש צורך
  const delayForHeaderResizing = isMobile ? 50 : 0;
  
  // פונקציה מסייעת לחישוב המיקום המדויק
  const scrollToElement = (element: HTMLElement) => {
    if (!element) return;
    
    // חישוב הגובה של ההידר במצב מכווץ (יש להתאים לפי הערכים בקובץ Header.tsx)
    const headerHeight = isMobile ? 48 : 64; // גובה ההידר - צריך להתאים את הערכים לפי ההידר במובייל
    
    // מיקום האלמנט יחסית לראש הדף
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    
    // החישוב לוקח בחשבון את גובה ההידר
    const offsetPosition = elementPosition - headerHeight;
    
    // גלילה עם אנימציה חלקה
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };
  
  // אם נתנו ID ישירות
  if (typeof eOrId === 'string') {
    const element = document.getElementById(eOrId);
    if (element) {
      if (delayForHeaderResizing > 0) {
        // השהייה קצרה כדי לתת להידר להתכווץ אם צריך
        setTimeout(() => scrollToElement(element), delayForHeaderResizing);
      } else {
        scrollToElement(element);
      }
    }
    return;
  }

  // התנהגות מקורית עם אובייקט אירוע
  const e = eOrId;
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href");
  
  if (href?.startsWith("#")) {
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      if (delayForHeaderResizing > 0) {
        // השהייה קצרה כדי לתת להידר להתכווץ אם צריך
        setTimeout(() => scrollToElement(element), delayForHeaderResizing);
      } else {
        scrollToElement(element);
      }
    }
  }
};