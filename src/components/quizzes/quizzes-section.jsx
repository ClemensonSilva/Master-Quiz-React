import QuizCard from "../cards/quizCard";
import Button from "@/components/ui/button";
export default function QuizzesGrid({ quizzes, isSearching, userType, onDelete }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isSearching ? 'opacity-60' : 'opacity-100'
        }`}
    >
      {quizzes.map((quiz) => {
        const linkAcao =
          userType === 'ROLE_PROFESSOR'
            ? `/disciplinas/${quiz.disciplinaId}/quiz/${quiz.id}/editar`
            : `/disciplinas/${quiz.disciplinaId}/quiz/${quiz.id}/answer`;

        const buttonText =
          userType === 'ROLE_PROFESSOR' ? 'Editar' : 'Responder';

        return (
          <QuizCard
            key={quiz.id}
            {...quiz}
            linkAcao={linkAcao}
            buttonText={buttonText}
          ><Button
            variant="danger" // Supondo que você tenha uma variante vermelha
            fullWidth
            size="sm"
            onClick={() => onDelete(quiz.id)}
          >
              Excluir Quiz
            </Button></QuizCard>
        );
      })}
    </div>
  );
}
