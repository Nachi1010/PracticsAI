import React from 'react';

interface QuestionnaireHeaderProps {
  mainTitle: string;
  pageTitle: string;
  currentPage?: number;
  totalPages?: number;
}

const QuestionnaireHeader: React.FC<QuestionnaireHeaderProps> = ({ 
  mainTitle, 
  pageTitle, 
  currentPage, 
  totalPages 
}) => {
  // חישוב אחוז ההתקדמות אם יש פרמטרים של מספרי עמודים
  const showProgress = currentPage !== undefined && totalPages !== undefined;
  const progressPercentage = showProgress ? Math.round((currentPage / totalPages) * 100) : 0;
  
  return (
    <header className="relative text-right text-white h-[clamp(20vh,43vw,50vh)] overflow-hidden">
      {/* תמונת רקע */}
      <img 
        src="/images/D.jpeg"
        alt="תמונת רקע" 
        className="absolute top-0 left-0 w-full h-full object-cover brightness-[0.6] z-[-1] select-none transition-[filter] duration-300 ease-in-out"
        loading="eager"
      />
      
      {/* מסך כהה מעל התמונה */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/90 to-black/80 z-0" />
      
      {/* טקסט כותרת */}
      <div className="absolute top-[20%] right-[10%] leading-none text-right w-full z-10 flex flex-col gap-0">
        <h1 className="font-frank text-[clamp(2rem,5vw,4rem)] text-white rtl font-bold text-shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {mainTitle}
        </h1>
        <h2 className="font-alef text-[clamp(1.2rem,4vw,2.5rem)] text-blue-200 tracking-wider font-medium mt-4 text-shadow drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
          {pageTitle}
        </h2>
        
        {/* בר התקדמות - מוצג רק אם יש מידע על מספר העמודים */}
        {showProgress && (
          <div className="mt-8 max-w-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-200">התקדמות</span>
              <span className="text-blue-100">{currentPage} מתוך {totalPages}</span>
            </div>
            <div className="h-2 w-full bg-blue-800/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default QuestionnaireHeader; 