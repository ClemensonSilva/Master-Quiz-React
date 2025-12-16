'use client';
import QuizzesLoading from '../display/card-isLoading';
import QuizzesEmpty from '../display/card-isEmpty';
import QuizzesGrid from './quizzes-section';
// Esse componente orquestra o estado de exibição dos quizzes
export default function QuizzesState({
    loading,
    hasAluno,
    quizzes,
    searchTerm,
    isSearching,
    texts = {},
}) {
    if (loading && !hasAluno) {
        return (
            <QuizzesLoading message={texts.loading} />
        );
    }

    if (!quizzes || quizzes.length === 0) {
        return (
            <QuizzesEmpty
                searchTerm={searchTerm}
                emptyMessage={texts.empty}
                searchMessage={texts.search}
            />
        );
    }

    return (
        <QuizzesGrid
            quizzes={quizzes}
            isSearching={isSearching}
        />
    );
}
