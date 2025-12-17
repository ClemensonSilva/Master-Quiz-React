import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';

const QuizCard = ({ 
  title, 
  progress, 
  grade, 
  reviewDate, 
  linkAcao,         
  buttonText,
  children // 1. Recebemos o children aqui
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3 h-full">
      <h3 className="font-bold text-lg text-gray-800">{title}</h3>

      {/* Se quiser esconder progresso para professor, pode usar condicional aqui */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gray-800 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 font-semibold">Progresso: {progress}%</span>

      <div className="text-sm text-gray-600 space-y-1 flex-grow">
        <p>Nota: {grade}/10</p>
        <p>Data revisão: {reviewDate}</p>
      </div>

      {/* 2. Área de Ações (Botões) */}
      <div className="mt-2 flex flex-col gap-2">
        
        {/* Botão Principal (Acessar/Editar) */}
        <Link href={linkAcao} className="w-full">     
          <Button variant="primary" fullWidth size="sm" tabIndex={-1}>
            {buttonText || 'Acessar'} 
          </Button>
        </Link>

        {/* 3. Renderiza o botão extra (Children) aqui, se existir */}
        {children && (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;