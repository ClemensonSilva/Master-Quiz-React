import QuizCard from "../cards/quizCard";

export default function QuizzesGrid({ quizzes, isSearching }) {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
                isSearching ? 'opacity-60' : 'opacity-100'
            }`}
        >
            {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} {...quiz} />
            ))}
        </div>
    );
}
