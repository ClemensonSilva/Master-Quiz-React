
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/cards/questaoCard';

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
                const result = await response.json();
                
                router.push(`/quiz/${quizData.id}/resultado?disciplinaId=${quizData.disciplinaId}`);
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
            {/* Exibe o tempo total */}
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