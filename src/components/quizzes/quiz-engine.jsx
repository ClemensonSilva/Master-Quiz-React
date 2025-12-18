'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/cards/questaoCard';
import Button from '@/components/ui/button';
import { apiFetch } from '@/services/api';

export default function QuizEngine({ quizData, userId }) {
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); 
    const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(0); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTotalSecondsElapsed(s => s + 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []); 

    useEffect(() => {
        setQuestionStartTime(totalSecondsElapsed); 
    }, [currentIndex]);

    // Proteção contra quiz vazio
    if (!quizData || !quizData.questoes || quizData.questoes.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Quiz sem questões</h2>
                    <p className="text-gray-600 mb-6">
                        Este quiz ainda não possui questões cadastradas. Peça ao professor para adicionar conteúdo.
                    </p>
                    <Button onClick={() => router.back()} fullWidth>
                        Voltar
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = quizData.questoes[currentIndex];
    const totalQuestions = quizData.questoes.length;
    
    const calculateTimeSpent = () => {
        return totalSecondsElapsed - questionStartTime;
    };

    const handleAnswer = (alternativeId) => {
        const timeSpent = calculateTimeSpent();
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: {
                alternativeId: alternativeId,
                timeSpent: timeSpent 
            }
        }));
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNext = async () => {
        // Registra resposta atual se não existir
        if (!answers[currentQuestion.id]) {
            const timeSpent = calculateTimeSpent();
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: {
                    alternativeId: null, 
                    timeSpent: timeSpent 
                }
            }));
        }
        
        if (currentIndex === totalQuestions - 1) {
            await submitQuiz();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const submitQuiz = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                alunoId: userId,
                respostas: Object.entries(answers).map(([questaoId, responseData]) => ({
                    questaoId: parseInt(questaoId),
                    alternativaId: responseData.alternativeId,
                    tempoResposta: responseData.timeSpent 
                }))
            };
            
            const url = `/disciplinas/${quizData.disciplinaId}/quizes/${quizData.id}`; 
            
            const response = await apiFetch(url, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // CORREÇÃO AQUI: Ajustado para bater com sua estrutura de pastas
                // src/app/disciplinas/[id]/quiz/[quizId]/resultado/page.jsx
                router.push(`/disciplinas/${quizData.disciplinaId}/quiz/${quizData.id}/resultado`);
            } else {
                alert('Erro ao enviar respostas. Verifique a API.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatoTempo = `${String(Math.floor(totalSecondsElapsed / 60)).padStart(2, '0')}:${String(totalSecondsElapsed % 60).padStart(2, '0')}`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-xl font-medium text-gray-700 mb-4">
                Tempo Total: {formatoTempo}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{quizData.titulo}</h1>

            <QuestionCard
                question={currentQuestion}
                totalQuestions={totalQuestions}
                currentIndex={currentIndex}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onPrev={handlePrev}
                selectedOptionId={answers[currentQuestion.id]?.alternativeId}
            />
        </div>
    );
}