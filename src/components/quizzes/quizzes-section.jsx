import QuizCard from "../cards/quizCard";
import Button from "@/components/ui/button";

export default function QuizzesGrid({ quizzes, isSearching, userType, onDelete }) {
  // Verifica se é professor
  const isProfessor = userType === 'ROLE_PROFESSOR';

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isSearching ? 'opacity-60' : 'opacity-100'
        }`}
    >
      {quizzes.map((quiz) => {
        const linkAcao = isProfessor
            ? `/disciplinas/${quiz.disciplinaId}/quiz/${quiz.id}/editar`
            : `/disciplinas/${quiz.disciplinaId}/quiz/${quiz.id}/answer`;

        const buttonText = isProfessor ? 'Editar' : 'Responder';

        return (
          <QuizCard
            key={quiz.id}
            {...quiz}
            linkAcao={linkAcao}
            buttonText={buttonText}
          >
            {/* CORREÇÃO AQUI: Só mostra o botão se for professor */}
            {isProfessor && (
              <Button
                variant="danger" 
                fullWidth
                size="sm"
                onClick={() => onDelete(quiz.id)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white" // Estilo extra para garantir cor vermelha
              >
                  Excluir Quiz
              </Button>
            )}
          </QuizCard>
        );
      })}
    </div>
  );
}