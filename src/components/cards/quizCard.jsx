import Link from 'next/link';
import Button from '@/components/ui/button';
import ProgressBar from '@/components/display/progressBar';

export default function QuizCard({ 
  quiz,
  showDetails = true,
  showEdit = true
}) {
  return (
    <div className="bg-quiz-light-gray p-5 rounded-lg border border-gray-200 flex flex-col h-full">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">{quiz.nome}</h4>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Progresso: {quiz.progresso}%</p>
        <ProgressBar progress={quiz.progresso} />
      </div>
      
      <p className="text-sm text-gray-600 mb-2 flex-grow">{quiz.descricao}</p>
      
      {quiz.nota && (
        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-500">Nota: {quiz.nota}</p>
          {quiz.dataRevisao && (
            <p className="text-sm text-gray-500">Data revisão: {quiz.dataRevisao}</p>
          )}
        </div>
      )}
      
      <div className="flex space-x-2 mt-auto">
        {showDetails && (
          <Link href={`/prof/quiz/${quiz.id}/relatorio`} className="flex-1">
            <Button variant="dark" fullWidth size="sm">
              Detalhes
            </Button>
          </Link>
        )}
        {showEdit && (
          <Link href={`/prof/quiz/${quiz.id}/questoes`} className="flex-1">
            <Button variant="purple" fullWidth size="sm">
              Editar
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}