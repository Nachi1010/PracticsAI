/**
 * פונקציית עזר לגלילה חלקה בין אלמנטים בדף
 * Utility function for smooth scrolling between page elements
 */

// משך האנימציה של ההידר (בהתאם ל-duration-700 בקובץ Header.tsx)
const ANIMATION_DURATION = 700; // התאמה למשך האנימציה של ההידר

export const smoothScrollTo = (
  eOrId: React.MouseEvent<HTMLAnchorElement> | string
): void => {
  if (typeof eOrId === 'string') {
    // If given an ID directly
    const element = document.getElementById(eOrId);
    if (element) {
      // החלפת scrollIntoView בפונקציית גלילה מותאמת אישית
      customSmoothScroll(element);
    }
    return;
  }

  // Original behavior with event object
  const e = eOrId;
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href");
  
  if (href?.startsWith("#")) {
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      // החלפת scrollIntoView בפונקציית גלילה מותאמת אישית
      customSmoothScroll(element);
    }
  }
};

/**
 * פונקציית גלילה מותאמת אישית שמתואמת עם קצב האנימציה של ההידר
 * Custom smooth scroll function that coordinates with header animation speed
 */
function customSmoothScroll(element: HTMLElement): void {
  // המיקום הנוכחי בדף
  const startPosition = window.scrollY || window.pageYOffset;
  // המיקום אליו נרצה להגיע
  const targetPosition = element.getBoundingClientRect().top + startPosition;
  // מחשבים את המרחק שצריך לגלול
  const distance = targetPosition - startPosition;
  
  // זמן התחלה
  let startTime: number | null = null;
  
  // פונקציית אנימציה
  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / ANIMATION_DURATION, 1);
    
    // פונקציית איזינג קובית (cubic easing) לתנועה טבעית יותר
    // התאמה לפונקציית ה-easing שההידר משתמש בה (ease-in-out)
    const ease = easeInOut(progress);
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < ANIMATION_DURATION) {
      requestAnimationFrame(animation);
    }
  }
  
  // התחלת האנימציה
  requestAnimationFrame(animation);
}

/**
 * פונקציית עזר ליצירת תנועה הדרגתית (easing function)
 * Helper function to create gradual movement (cubic ease-in-out)
 */
function easeInOut(t: number): number {
  // פונקציית cubic-bezier שמדמה את ease-in-out
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}