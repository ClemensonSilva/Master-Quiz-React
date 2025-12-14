import React from 'react';
import Card from './Card'; 
import ProgressBar from './ProgressBar';
import Button from '../ui/Button';

export default function DisciplineCard({ name, progress }) {
  return (
    <Card>
      <h4 className="text-lg font-semibold text-gray-900 mb-3">{name}</h4>
      <p className="text-sm text-gray-600 mb-1">Progresso: {progress}%</p>
      
      <ProgressBar progress={progress} />
      
      <p className="text-sm text-gray-600 mb-4">Descrição dos quizzes</p>
      
      <Button variant="primary" fullWidth>Detalhes</Button>
    </Card>
  );
}