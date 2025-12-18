import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/services/api';

// 1. Adicione disciplinaIdParam como segundo argumento
export function useQuizResult(quizId, disciplinaIdParam) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const disciplinaIdUrl = searchParams.get('disciplinaId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultData, setResultData] = useState(null);

  // 2. Determina o ID com prioridade: Parâmetro da Página > URL Query > LocalStorage
  const disciplinaId = disciplinaIdParam || disciplinaIdUrl || (typeof window !== 'undefined' ? localStorage.getItem('disciplinaId') : null);

  useEffect(() => {
    async function fetchResult() {
      try {
        const alunoId = localStorage.getItem('userId');
        
        if (!alunoId) {
            router.push('/auth/login');
            return;
        }

        // Validação usando a constante calculada acima
        if (!disciplinaId) {
            setError("Identificação da disciplina ausente.");
            setLoading(false);
            return;
        }

        const url = `/disciplinas/${disciplinaId}/quizes/${quizId}/alunos/${alunoId}`;
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
          setError(`Erro ${status}: ${errorMsg}`);        
        }

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
  }, [quizId, disciplinaId, router]); // Adicione disciplinaId na dependência

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

  const feedback = useMemo(() => {
    const { score } = stats;
    if (score >= 7) return { variant: 'success', title: 'Excelente!', message: 'Você dominou o conteúdo.' };
    if (score >= 5) return { variant: 'warning', title: 'Bom trabalho!', message: 'Você está no caminho certo, mas pode melhorar.' };
    return { variant: 'error', title: 'Atenção necessária', message: 'Recomendamos revisar o material e tentar novamente.' };
  }, [stats]);

  const actions = {
    // 3. Atualize as rotas de ação para usar o novo formato de URL
    retry: () => router.push(`/disciplinas/${disciplinaId}/quiz/${quizId}/answer`),
    continue: () => router.push(`/disciplinas/${disciplinaId}`),
    goDashboard: () => router.push('/aluno/dashboard')
  };

  return { loading, error, resultData, stats, feedback, actions };
}