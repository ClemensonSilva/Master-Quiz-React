import React from 'react';
import Button from '@/components/ui/button';

export default function DisciplineList({ 
  disciplinas, 
  loading, 
  onMatricula, 
  processingId 
}) {
  {console.log('Disciplinas recebidas:', disciplinas);}
  return (
    <div className="bg-white border-x border-b border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div>NOME</div>
        <div>PROFESSOR</div>
        <div className="text-right">AÇÃO</div>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando disciplinas...</div>
        ) : disciplinas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma disciplina encontrada.
          </div>
        ) : (
          disciplinas.map((disciplina) => (
            <DisciplineRow 
              key={disciplina.id} 
              disciplina={disciplina} 
              onMatricula={onMatricula} 
              isProcessing={processingId === disciplina.id} 
            />
          ))
        )}
      </div>
    </div>
  );
}

function DisciplineRow({ disciplina, onMatricula, isProcessing }) {
  return (
    <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
      <div className="font-medium text-gray-900">
        {disciplina.nome}
      </div>
      
      <div className="text-gray-600 text-sm">
        {disciplina.professor.nome || 'Professor não atribuído'}
      </div>

      <div className="text-right">
        <Button 
          variant="dark"
          size="sm"
          className="bg-gray-900 text-white hover:bg-gray-800 px-6"
          onClick={() => onMatricula(disciplina.id)}
          disabled={isProcessing}
        >
          {isProcessing ? '...' : '+ Matrícula'}
        </Button>
      </div>
    </div>
  );
}