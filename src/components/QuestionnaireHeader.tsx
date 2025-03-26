import React from 'react';

interface QuestionnaireHeaderProps {
  mainTitle: string;
  pageTitle: string;
  currentPage: number;
  totalPages: number;
}

const QuestionnaireHeader: React.FC<QuestionnaireHeaderProps> = ({
  mainTitle,
  pageTitle,
  currentPage,
  totalPages
}) => {
  return (
    <div className="bg-white shadow-md py-6 px-4 mb-8 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-blue-900 mb-2 text-right">
          {mainTitle}
        </h1>
        <div className="flex justify-between items-center">
          <div className="text-sm text-right text-blue-600 bg-blue-50 py-1 px-3 rounded-md font-medium">
            <span className="text-blue-700 font-medium">
              עמוד {currentPage}
            </span>
            <span className="mx-1">מתוך</span>
            <span className="text-blue-700 font-medium">
              {totalPages}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 text-right">
            {pageTitle}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader; 