'use client';
import { useState, useEffect } from 'react';
import { Check, BookOpen } from 'lucide-react'; // Certifique-se de ter lucide-react ou use ícones SVG padrão

export default function QuestaoSeletor({ 
  todasQuestoes, 
  questoesSelecionadasIniciais = [], 
  onChangeSelection 
}) {
  // Usamos um Set para gerir os IDs selecionados de forma eficiente
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 1. Sincroniza o estado inicial (marca as questões que o quiz já tem)
  useEffect(() => {
    // Extrai apenas os IDs dos objetos de questão iniciais
    const idsIniciais = new Set(questoesSelecionadasIniciais.map(q => q.id));
    setSelectedIds(idsIniciais);
  }, [questoesSelecionadasIniciais]);

  // 2. Manipula o clique (Selecionar / Desmarcar)
  const handleToggle = (id) => {
    const newSet = new Set(selectedIds);
    
    if (newSet.has(id)) {
      newSet.delete(id); // Se já tem, remove
    } else {
      newSet.add(id);    // Se não tem, adiciona
    }
    
    setSelectedIds(newSet);
    
    // Devolve para o componente Pai a lista convertida em Array
    onChangeSelection(Array.from(newSet));
  };

  // Estado de lista vazia
  if (!todasQuestoes || todasQuestoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-500">
        <BookOpen className="w-10 h-10 mb-2 opacity-20" />
        <p>Não há questões cadastradas nesta disciplina.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {todasQuestoes.map((q) => {
        // Verifica se esta questão específica está selecionada
        const isSelected = selectedIds.has(q.id);
        
        // Verifica se a questão JÁ estava no quiz originalmente (para dar feedback visual diferente, opcional)
        const wasAlreadyInQuiz = questoesSelecionadasIniciais.some(init => init.id === q.id);

        return (
          <div 
            key={q.id}
            onClick={() => handleToggle(q.id)}
            className={`
              relative cursor-pointer p-4 rounded-lg border transition-all duration-200
              flex items-start gap-4 group
              ${isSelected 
                ? 'bg-purple-50 border-purple-500 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm'}
            `}
          >
            {/* Checkbox Visual */}
            <div className={`
              flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center mt-0.5 transition-colors
              ${isSelected 
                ? 'bg-purple-600 border-purple-600' 
                : 'bg-white border-gray-300 group-hover:border-purple-400'}
            `}>
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>

            {/* Conteúdo da Questão */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                  <p className={`text-sm font-medium mb-1 line-clamp-2 ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}>
                    {q.descricao}
                  </p>
                  
                  {/* Badge se já pertencia ao quiz */}
                  {wasAlreadyInQuiz && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold text-green-700 bg-green-100 rounded-full flex-shrink-0">
                      Já Adicionada
                    </span>
                  )}
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {q.alternativas ? q.alternativas.length : 0} alternativas
                 </span>
                 {/* Aqui você poderia mostrar dificuldade ou tags se tivesse */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}