import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/services/api';

export function useQuizResult(quizId) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const disciplinaIdUrl = searchParams.get('disciplinaId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para armazenar os dados vindos do Backend
  const [resultData, setResultData] = useState(null);
  const [disciplinaId, setDisciplinaId] = useState(disciplinaIdUrl);

  useEffect(() => {
    async function fetchResult() {
      try {
        const alunoId = localStorage.getItem('userId');
        const storedDisciplinaId = disciplinaId || localStorage.getItem('disciplinaId');
        
        if (!alunoId) {
            router.push('/auth/login');
            return;
        }

        if (!storedDisciplinaId) {
            setError("Identificação da disciplina ausente.");
            setLoading(false);
            return;
        }

        setDisciplinaId(storedDisciplinaId);

        const url = `/disciplinas/${storedDisciplinaId}/quizes/${quizId}/alunos/${alunoId}`;
        console.log('Fetching quiz result from URL:', url);
        const response = await apiFetch(url);

        if (response.ok) {
          const data = await response.json();
          setResultData(data);
        } else {
const status = response.status;
  let errorMsg = 'Erro desconhecido';
  try {
      const errorData = await response.json();
      errorMsg = errorData.message || JSON.stringify(errorData);
  } catch (e) {
      errorMsg = await response.text();
  }
  
  console.error(`Erro na API (${status}):`, errorMsg);
  setError(`Erro ${status}: ${errorMsg}`);        }

      } catch (err) {
        console.error(err);
        setError('Erro de conexão.');
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
        fetchResult();
    }
  }, [quizId, disciplinaId, router]);
  //  Cálculo das Estatísticas
  const stats = useMemo(() => {
    if (!resultData) return { percentage: 0, errors: 0, score: 0 };

    const rawScore = resultData.pontuacaoFinal || resultData.nota || 0;
    
    const percentage = Math.round((rawScore / 10) * 100);

    return {
      score: rawScore,
      percentage: percentage,
      errors: 100 - percentage
    };
  }, [resultData]);

  //   Feedback Visual
  const feedback = useMemo(() => {
    const { score } = stats;
    if (score >= 7) return { variant: 'success', title: 'Excelente!', message: 'Você dominou o conteúdo.' };
    if (score >= 5) return { variant: 'warning', title: 'Bom trabalho!', message: 'Você está no caminho certo, mas pode melhorar.' };
    return { variant: 'error', title: 'Atenção necessária', message: 'Recomendamos revisar o material e tentar novamente.' };
  }, [stats]);

  const actions = {
    retry: () => router.push(`/quiz/${quizId}/answer?disciplinaId=${disciplinaId}`),
    continue: () => router.push(`/disciplinas/${disciplinaId}`),
    goDashboard: () => router.push('/aluno/dashboard')
  };

  return { loading, error, resultData, stats, feedback, actions };
}