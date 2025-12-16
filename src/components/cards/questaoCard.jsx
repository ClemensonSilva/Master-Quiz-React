// src/components/quiz/question-card.jsx
import React from 'react';
import Button from '@/components/ui/button'; 

export default function QuestionCard({ 
    question, 
    totalQuestions, 
    currentIndex, 
    onAnswer, 
    onNext, 
    onPrev,
    selectedOptionId 
}) {
    const progresso = currentIndex + 1;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 max-w-2xl w-full mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {'Tópico da Questão' || question.topico}
                </h2>
                <p className="text-gray-600 text-lg">
                    {question.descricao}
                </p>
            </div>

            <div className="space-y-3 mb-8">
                {question.alternativas.map((alt) => (
                    <button
                        key={alt.id}
                        onClick={() => onAnswer(alt.id)}
                        className={`w-full p-4 rounded-xl text-center font-medium transition-all duration-200 border-2 
                            ${selectedOptionId === alt.id 
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md transform scale-[1.02]' // Selecionado
                                : 'bg-purple-100 text-purple-700 border-transparent hover:bg-purple-200 hover:border-purple-300' // Padrão
                            }`}
                    >
                        {alt.descricao}
                    </button>
                ))}
            </div>

           

            <div className="flex justify-between items-center mt-auto">
                <Button 
                    variant="purple" 
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="w-32 bg-purple-600 disabled:opacity-50"
                >
                    Retornar
                </Button>

                <span className="font-bold text-gray-800 text-lg">
                    {progresso}/{totalQuestions}
                </span>

                <Button 
                    variant="purple" 
                    onClick={onNext}
                    className="w-32 bg-purple-600"
                >
                    {progresso === totalQuestions ? 'Finalizar' : 'Pular'}
                </Button>
            </div>
        </div>
    );
}