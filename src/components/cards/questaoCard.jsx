import Button from '@/components/ui/button';

export default function QuestaoCard({ 
  questao,
  onEdit,
  onDelete
}) {
  return (
    <div className="bg-quiz-light-gray p-5 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {questao.titulo}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{questao.descricao}</p>
          
          {questao.alternativas && questao.alternativas.length > 0 && (
            <div className="space-y-1 mb-4">
              {questao.alternativas.map((alt, index) => (
                <p key={index} className="text-sm text-gray-600">{alt}</p>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(questao.id)}
        >
          Editar
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(questao.id)}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}