import React from 'react';
import Button from '@/components/ui/button';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function QuestaoLista({ 
  questoes, 
  loading, 
  onDelete, 
  disciplinaId 
}) {
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Carregando banco de questões...</div>;
  }

  if (!questoes || questoes.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">Nenhuma questão cadastrada nesta disciplina.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questoes.map((questao) => (
        <div 
          key={questao.id} 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4 hover:shadow-md transition-shadow"
        >
          {/* Conteúdo da Questão */}
          <div className="flex-grow">
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              {questao.descricao}
            </h4>
            
            {/* Exibe prévia das alternativas (Opcional) */}
            <div className="space-y-1">
              {questao.alternativas && questao.alternativas.slice(0, 3).map((alt, idx) => (
                <div key={alt.id || idx} className="flex items-center gap-2 text-sm text-gray-600">
                  {alt.correta ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-gray-300 block"></span>
                  )}
                  <span className={alt.correta ? 'font-medium text-green-700' : ''}>
                    {alt.descricao}
                  </span>
                </div>
              ))}
              {questao.alternativas && questao.alternativas.length > 3 && (
                <span className="text-xs text-gray-400 pl-6">
                  + {questao.alternativas.length - 3} alternativas...
                </span>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2 self-start md:self-center">
            {/* Botão Editar */}
            <Link href={`/professor/disciplina/${disciplinaId}/questoes/${questao.id}/editar`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2" title="Editar Questão">
                <Pencil className="w-4 h-4" /> <span className="hidden md:inline">Editar</span>
              </Button>
            </Link>

            <Button 
              variant="danger" 
              size="sm" 
              className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-2"
              onClick={() => onDelete(questao.id)}
              title="Excluir Questão"
            >
              <Trash2 className="w-4 h-4" /> <span className="hidden md:inline">Excluir</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}