import React from 'react';

interface QuestionnaireHeaderProps {
  mainTitle: string;
  pageTitle: string;
}

const QuestionnaireHeader: React.FC<QuestionnaireHeaderProps> = ({ mainTitle, pageTitle }) => {
  return (
    <header className="relative text-right text-white h-[clamp(20vh,43vw,50vh)] overflow-hidden">
      {/* Background Image */}
      <img 
        src="/images/D.jpeg"
        alt="תמונת רקע" 
        className="absolute top-0 left-0 w-full h-full object-cover brightness-[0.6] z-[-1] select-none transition-[filter] duration-300 ease-in-out"
        loading="eager"
      />
      
      {/* Overlay - צובע את הרקע כדי שהטקסט יבלוט יותר */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/90 to-black/80 z-0" />
      
      {/* Header Text */}
      <div className="absolute top-[20%] right-[10%] leading-none text-right w-full z-10 flex flex-col gap-0">
        <h1 className="font-frank text-[clamp(2rem,5vw,4rem)] text-white rtl font-bold text-shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {mainTitle}
        </h1>
        <h2 className="font-alef text-[clamp(1.2rem,4vw,2.5rem)] text-blue-200 tracking-wider font-medium mt-4 text-shadow drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
          {pageTitle}
        </h2>
      </div>
    </header>
  );
};

export default QuestionnaireHeader; 