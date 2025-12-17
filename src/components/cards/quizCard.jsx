import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';

// Adicionamos 'href' e 'buttonText' nas props
const QuizCard = ({ 
  title, 
  progress, 
  grade, 
  reviewDate, 
  linkAcao,         
  buttonText    
}) => {
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
        <p>Nota: {grade}/10</p>
        <p>Data revisão: {reviewDate}</p>
      </div>

      <Link href={linkAcao} className="w-full">     
       <Button variant="primary" fullWidth size="sm" tabIndex={-1}>
          {buttonText || 'Acessar'} 
        </Button>
      </Link>
    </div>
  );
};

export default QuizCard;