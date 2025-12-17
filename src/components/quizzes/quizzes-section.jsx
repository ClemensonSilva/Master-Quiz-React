import QuizCard from "../cards/quizCard";

export default function QuizzesGrid({ quizzes, isSearching, userType }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
        isSearching ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {quizzes.map((quiz) => {
        const linkAcao =
          userType === 'ROLE_PROFESSOR'
            ? `/disciplinas/${quiz.disciplinaId}/quiz/${quiz.id}/edit`
            : `/disciplinas/${quiz.disciplinaId}/quiz/${quiz.id}/answer`;

        const buttonText =
          userType === 'ROLE_PROFESSOR' ? 'Editar' : 'Responder';

        return (
          <QuizCard
            key={quiz.id}
            {...quiz}
            linkAcao={linkAcao}
            buttonText={buttonText}
          />
        );
      })}
    </div>
  );
}
