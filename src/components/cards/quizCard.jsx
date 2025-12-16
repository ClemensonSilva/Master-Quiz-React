import React from 'react';

const QuizCard = ({ title, progress, grade, reviewDate }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
      <h3 className="font-bold text-lg text-gray-800">{title}</h3>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gray-800 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 font-semibold">Progresso: {progress}%</span>

      <div className="text-sm text-gray-600 space-y-1">
        <p>Descrição dos quizzes</p>
        <p>Nota: {grade}/10</p>
        <p>Data revisão: {reviewDate}</p>
      </div>

      <button className="bg-black text-white text-xs py-2 px-4 rounded-full w-max mt-2 hover:bg-gray-800 transition">
        Responder
      </button>
    </div>
  );
};

export default QuizCard;