'use client';
import React from 'react';
import { useParams } from 'next/navigation';

// Componentes
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import DonutChart from '@/components/ui/donutsChart';
import FeedbackCard from '@/components/ui/feedbackCard';

import { useQuizResult } from '@/hooks/useQuizResult';

export default function ResultadoPage() {
  const params = useParams();
  
  // 1. Extraímos os IDs da URL (baseado na estrutura de pastas [id] e [quizId])
  const disciplinaId = params?.id; 
  const quizId = params?.quizId;

  // 2. PASSAMOS O disciplinaId COMO SEGUNDO ARGUMENTO PARA O HOOK
  const { 
    loading, 
    error,
    resultData, 
    stats, 
    feedback, 
    actions 
  } = useQuizResult(quizId, disciplinaId); 

  if (loading) {
      return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header isLoggedIn={true} userName="Aluno" userType="aluno" />
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-pulse text-purple-600 font-semibold">Carregando resultados...</div>
            </div>
        </div>
      );
  }

  if (error) {
      return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header isLoggedIn={true} userName="Aluno" userType="aluno" />
            <div className="flex-grow flex flex-col items-center justify-center gap-4">
                <p className="text-red-600 font-medium">{error}</p>
                <div className="flex gap-4">
                   <Button onClick={actions.goDashboard} variant="outline">Voltar ao Dashboard</Button>
                   <Button onClick={actions.continue} variant="purple">Voltar à Disciplina</Button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header isLoggedIn={true} userName="Aluno" userType="aluno" />

      <main className="flex-grow container mx-auto max-w-4xl px-6 py-10 flex flex-col items-center">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {resultData?.quiz?.titulo || 'Resultado do Quiz'}
        </h1>
        <p className="text-gray-500 mb-12">Confira seu desempenho abaixo</p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">Acertos x Erros</h2>
            
            <DonutChart percentage={stats.percentage} />

            <div className="flex gap-8 mt-6">
              <LegendItem color="bg-blue-500" label="Acertos" value={`${stats.percentage}%`} />
              <LegendItem color="bg-gray-200" label="Erros" value={`${stats.errors}%`} />
            </div>
          </div>

          <FeedbackCard 
            variant={feedback.variant}
            title={feedback.title}
            message={feedback.message}
          />

        </div>

        <div className="w-full flex justify-between items-center mt-20 max-w-2xl">
          <Button 
            variant="purple" 
            className="w-40 bg-purple-600 hover:bg-purple-700 text-white" 
            onClick={actions.retry}
          >
            Tentar novamente
          </Button>

          <Button 
            variant="outline" 
            className="w-40 border-purple-600 text-purple-600 hover:bg-purple-50" 
            onClick={actions.continue}
          >
            Continuar
          </Button>
        </div>

      </main>
      <Footer />
    </div>
  );
}

function LegendItem({ color, label, value }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
            <div className="flex flex-col">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="font-bold text-gray-900">{value}</span>
            </div>
        </div>
    );
}