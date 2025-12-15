import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import ProgressBar from '@/components/display/progressBar'; 
const DisciplineCard = ({ disciplina }) => {
  // Dados esperados: { id, nome, progresso, descricao }
  return (
    <div className="bg-quiz-light-gray p-5 rounded-lg border border-gray-200 flex flex-col h-full">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">{disciplina.nome}</h4>
      
      <p className="text-sm text-gray-600 mb-1">Progresso: {disciplina.progresso}%</p>
      <ProgressBar progress={disciplina.progresso} />
      
      <p className="text-sm text-gray-600 mb-4 flex-grow">
        {disciplina.descricao || 'Descrição da disciplina'}
      </p>
      
      <Link href={`/disciplina/${disciplina.id} `}>
        <Button variant="primary" fullWidth size="sm">
          Detalhes
        </Button>
      </Link>
    </div>
  );
};

export default DisciplineCard;