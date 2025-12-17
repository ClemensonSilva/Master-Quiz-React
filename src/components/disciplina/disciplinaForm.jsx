'use client';

import { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/display/card';

export default function DisciplinaForm({ 
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Cadastrar Disciplina"
}) {
  const [formData, setFormData] = useState({
    nome: initialData.nome || '',
    cargaHoraria: initialData.cargaHoraria || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome da disciplina"
          required
          disabled={loading}
        />

        <Input
          label="Carga Horária"
          name="cargaHoraria"
          value={formData.cargaHoraria}
          onChange={handleChange}
          placeholder="Ex: 60 horas"
          disabled={loading}
        />

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <Button
            variant="dark"
            fullWidth
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