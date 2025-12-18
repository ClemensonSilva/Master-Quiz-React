'use client';

import { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/display/card';
import { Trash2, PlusCircle, CheckCircle } from 'lucide-react';

export default function QuestaoForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = "Salvar Questão"
}) {
  
  const [descricao, setDescricao] = useState(initialData.descricao || '');
  
  
  const [alternativas, setAlternativas] = useState(initialData.alternativas || [
    { descricao: '', correta: false },
    { descricao: '', correta: false }
  ]);

  
  const handleAlternativaChange = (index, value) => {
    const novasAlternativas = [...alternativas];
    novasAlternativas[index].descricao = value;
    setAlternativas(novasAlternativas);
  };

  
  const handleSetCorreta = (index) => {
    const novasAlternativas = alternativas.map((alt, i) => ({
      ...alt,
      correta: i === index 
    }));
    setAlternativas(novasAlternativas);
  };

  const handleAddAlternativa = () => {
    setAlternativas([...alternativas, { descricao: '', correta: false }]);
  };

  const handleRemoveAlternativa = (index) => {
    if (alternativas.length <= 2) {
      alert("A questão deve ter pelo menos 2 alternativas.");
      return;
    }
    const novasAlternativas = alternativas.filter((_, i) => i !== index);
    setAlternativas(novasAlternativas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (descricao.length < 5 || descricao.length > 100) {
      alert("A descrição deve ter entre 5 e 100 caracteres.");
      return;
    }

    const temCorreta = alternativas.some(a => a.correta);
    if (!temCorreta) {
      alert("Selecione pelo menos uma alternativa correta.");
      return;
    }

    
    const questaoDTO = {
        id: initialData.id || null,
        descricao: descricao,
        alternativas: alternativas.map(alt => ({
            id: alt.id || null, 
            descricao: alt.descricao,
            correta: alt.correta
        }))
    };

    onSubmit(questaoDTO);
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Campo Descrição da Questão */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Enunciado da Questão
            </label>
            <textarea
                name="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[80px]"
                placeholder="Ex: Qual a capital da França?"
                required
                disabled={loading}
            />
            <span className={`text-xs block text-right mt-1 ${descricao.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                {descricao.length}/100
            </span>
        </div>

        <div className="border-t border-gray-100 pt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Alternativas</h3>
            
            <div className="space-y-3">
                {alternativas.map((alt, index) => (
                    <div key={index} className="flex items-center gap-3">
                        {/* Botão para marcar correta */}
                        <button
                            type="button"
                            onClick={() => handleSetCorreta(index)}
                            className={`p-2 rounded-full transition-colors ${
                                alt.correta ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title="Marcar como correta"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>

                        {/* Input da Alternativa */}
                        <div className="flex-grow">
                            <Input
                                value={alt.descricao}
                                onChange={(e) => handleAlternativaChange(index, e.target.value)}
                                placeholder={`Alternativa ${index + 1}`}
                                required
                                className="mb-0" 
                            />
                        </div>

                        {/* Botão Remover */}
                        <button
                            type="button"
                            onClick={() => handleRemoveAlternativa(index)}
                            className="text-red-400 hover:text-red-600 p-2"
                            title="Remover alternativa"
                            disabled={loading}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAlternativa}
                className="mt-4 flex items-center gap-2 border-dashed"
            >
                <PlusCircle className="w-4 h-4" /> Adicionar Alternativa
            </Button>
        </div>

        {/* Ações do Formulário */}
        <div className="flex space-x-4 pt-6 border-t border-gray-100 mt-6">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            disabled={loading}
            variant="purple"
            className="flex-1"
          >
            {loading ? 'Salvando...' : submitText}
          </Button>
        </div>
      </form>
    </Card>
  );
}