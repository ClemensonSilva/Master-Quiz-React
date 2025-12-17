'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuizEngine from '@/components/quizzes/quiz-engine';
import { apiFetch } from '@/services/api';
export default function PlayQuizPage() {
    const params = useParams();
    const router = useRouter();

    const quizId = params?.quizId;
    const disciplinaId = params.id
    const [quiz, setQuiz] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId'); 
        
        if (storedUserId) {
            setCurrentUserId(parseInt(storedUserId)); 
        } else {
            console.error("userId não encontrado no localStorage. Redirecionando...");
            router.push('/auth/login');
            return;
        }
        async function fetchQuiz() {
            try {
                const response = await apiFetch(`/disciplinas/${disciplinaId}/quizes/${quizId}`); 
                
                if (response.ok) {
                    const data = await response.json();
                    setQuiz(data);
                } else {
                    alert("Quiz não encontrado ou erro de acesso.");
                    router.push('/aluno/dashboard');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchQuiz();
    }, [params.id, router]);

    if (loading) return <div className="text-center mt-20">Carregando Quiz...</div>;
    if (!quiz) return null;

    return <QuizEngine quizData={quiz} userId={currentUserId} />;
}