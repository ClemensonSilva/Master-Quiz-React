'use client';

import { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/display/card';

export default function QuizForm({ 
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Cadastrar Quiz"
}) {
  const [formData, setFormData] = useState({
    nome: initialData.nome || '',
    disciplina: initialData.disciplina || '',
    descricao: initialData.descricao || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    setFormData(prev => ({
      ...prev,
      disciplina: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome do Quiz"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Digite o nome do quiz"
          required
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[100px] resize-none"
            placeholder="Digite uma descrição para o quiz"
            disabled={loading}
          />
        </div>

        <div className="flex space-x-4 pt-4">
         
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
            
          >
            {loading ? 'Processando...' : submitText}
          </Button>
        </div>
      </form>
    </Card>
  );
}