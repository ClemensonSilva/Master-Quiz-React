'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alertas';
import QuestaoSeletor from '@/components/questao/questaoSeletor';
import { apiFetch } from '@/services/api';

export default function AssociarQuestoesPage() {
  const router = useRouter();
  const params = useParams();
  
  // Mapeando os parâmetros da URL
  const disciplinaId = params?.id;
  const quizId = params?.quizId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [todasQuestoes, setTodasQuestoes] = useState([]);
  const [questoesDoQuiz, setQuestoesDoQuiz] = useState([]); // O que já existe no banco
  const [idsSelecionados, setIdsSelecionados] = useState([]); // O que o usuário marcou na tela
  
  const [alertInfo, setAlertInfo] = useState(null);

  // 1. Carregar Dados Iniciais (Questões da Disciplina + Questões do Quiz)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [resQuestoes, resQuiz] = await Promise.all([
            apiFetch(`/disciplinas/${disciplinaId}/questoes`),       
            apiFetch(`/disciplinas/${disciplinaId}/quizes/${quizId}`)
        ]);

        if (resQuestoes.ok && resQuiz.ok) {
          const dadosQuestoes = await resQuestoes.json();
          const dadosQuiz = await resQuiz.json();

          setTodasQuestoes(dadosQuestoes);
          
          // Armazena as questões que o quiz JÁ possui para evitar duplicidade
          const jaExistentes = dadosQuiz.questoes || [];
          setQuestoesDoQuiz(jaExistentes);
          
          // Marca visualmente as que já existem
          setIdsSelecionados(jaExistentes.map(q => q.id));
        } else {
          throw new Error("Falha ao carregar dados.");
        }
      } catch (error) {
        setAlertInfo({ type: 'error', message: "Erro ao conectar com o servidor." });
      } finally {
        setLoading(false);
      }
    }
    
    if (disciplinaId && quizId) fetchData();
  }, [disciplinaId, quizId]);

  // 2. Lógica de Salvar (Adaptada para o seu Endpoint Unitário)
  const handleSave = async () => {
    setSaving(true);
    setAlertInfo(null);

    try {
      // Filtra apenas os IDs que foram marcados AGORA e que NÃO estavam no quiz antes.
      // Isso evita tentar adicionar uma questão que já existe.
      const novosIdsParaAdicionar = idsSelecionados.filter(idSelecionado => 
        !questoesDoQuiz.some(qExistente => qExistente.id === idSelecionado)
      );

      if (novosIdsParaAdicionar.length === 0) {
        setAlertInfo({ type: 'info', message: "Nenhuma questão nova selecionada para adicionar." });
        setSaving(false);
        return;
      }

      // Cria um array de promessas (requisições) para rodar em paralelo
      const requisicoes = novosIdsParaAdicionar.map(questaoId => {
        // Endpoint: /disciplinas/{disciplinaId}/quizes/{id}/questoes/{questaoId}
        const url = `/disciplinas/${disciplinaId}/quizes/${quizId}/questoes/${questaoId}`;
        
        return apiFetch(url, {
          method: 'POST' // Geralmente 'add' usa POST. Se seu backend usar PUT, mude aqui.
        });
      });

      // Aguarda TODAS as requisições terminarem
      await Promise.all(requisicoes);

      // Sucesso
      setAlertInfo({ type: 'success', message: `${novosIdsParaAdicionar.length} questões adicionadas com sucesso!` });
      
      setTimeout(() => {
          router.push(`/professor/disciplina/${disciplinaId}`);
      }, 1500);

    } catch (error) {
      console.error(error);
      setAlertInfo({ type: 'error', message: "Erro ao adicionar algumas questões. Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={true} userType="professor" userName="Professor" />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Selecionar Questões</h1>
                <p className="text-sm text-gray-500">Marque as questões para adicionar a este quiz.</p>
            </div>
            
            <div className="flex gap-3">
                 <Button 
                    variant="outline" 
                    onClick={() => router.back()} 
                    disabled={saving}
                 >
                   Cancelar
                 </Button>
                 <Button 
                    variant="purple" 
                    onClick={handleSave} 
                    disabled={saving || loading}
                 >
                   {saving ? 'Adicionando...' : 'Adicionar Selecionadas'}
                 </Button>
            </div>
        </div>

        {alertInfo && (
           <div className="mb-4">
             <Alert type={alertInfo.type} message={alertInfo.message} onClose={() => setAlertInfo(null)} />
           </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Carregando banco de questões...</div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             {/* Reutiliza o componente Seletor que já criamos */}
             <QuestaoSeletor 
                todasQuestoes={todasQuestoes}
                questoesSelecionadasIniciais={questoesDoQuiz}
                onChangeSelection={setIdsSelecionados}
             />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}