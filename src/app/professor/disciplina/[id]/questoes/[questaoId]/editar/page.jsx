'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alertas';
import QuestaoForm from '@/components/questao/questaoForm';
import { apiFetch } from '@/services/api';

export default function EditarQuestaoPage() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = params?.id;
  const questaoId = params?.questaoId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

  const urlRetorno = `/professor/disciplina/${disciplinaId}`;
  const urlListarQuestoes = `/professor/disciplina/${disciplinaId}/questoes`;
  useEffect(() => {
    async function fetchQuestao() {
      try {
        const response = await apiFetch(`/disciplinas/${disciplinaId}/questoes/${questaoId}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        } else {
          setAlertInfo({ type: 'error', message: 'Erro ao carregar questão.' });
        }
      } catch (error) {
        setAlertInfo({ type: 'error', message: 'Erro de conexão.' });
      } finally {
        setFetching(false);
      }
    }
    if(questaoId) fetchQuestao();
  }, [disciplinaId, questaoId]);

  const handleUpdate = async (questaoDTO) => {
    setLoading(true);
    setAlertInfo(null);
    // --- DEBUG: Verifique o que está sendo enviado ---
    console.log("URL de Destino:", `/disciplinas/${disciplinaId}/questoes/${questaoId}`);
    console.log("Payload (JSON):", JSON.stringify(questaoDTO, null, 2));
    // ------------------------------------------------
    try {
      const response = await apiFetch(`/disciplinas/${disciplinaId}/questoes/${questaoId}`, {
        method: 'PUT',
        body: JSON.stringify(questaoDTO)
      });

      if (response.ok) {
        setAlertInfo({ type: 'success', message: 'Questão atualizada com sucesso!' });
        setTimeout(() => router.push(urlListarQuestoes), 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao atualizar questão.');
      }
    } catch (error) {
      setAlertInfo({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Tem certeza que deseja excluir esta questão permanentemente?")) return;

    setLoading(true);
    try {
      const response = await apiFetch(`/disciplinas/${disciplinaId}/questoes/${questaoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAlertInfo({ type: 'success', message: "Questão excluída com sucesso.", autoClose: true });
        router.push(urlRetorno);
      } else {
        throw new Error("Falha ao excluir.");
      }
    } catch (error) {
      setAlertInfo({ type: 'error', message: error.message });
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center mt-20">Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={true} userType="professor" userName="Professor" />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Editar Questão</h1>
            
            <Button variant="danger" onClick={handleDelete} disabled={loading} size="sm">
                Excluir Questão
            </Button>
        </div>

        {alertInfo && (
          <div className="mb-6 max-w-3xl mx-auto">
             <Alert type={alertInfo.type} message={alertInfo.message} onClose={() => setAlertInfo(null)} />
          </div>
        )}

        {initialData && (
            <QuestaoForm 
              initialData={initialData}
              onSubmit={handleUpdate} 
              onCancel={() => router.push(urlRetorno)}
              loading={loading}
              submitText="Atualizar Questão"
            />
        )}
      </main>
      <Footer />
    </div>
  );
}