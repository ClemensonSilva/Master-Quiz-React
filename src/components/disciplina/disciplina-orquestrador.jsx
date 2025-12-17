'use client';
import DisciplinesLoading from '../display/card-isLoading';
import DisciplinesEmpty from '../display/card-isEmpty';
import DisciplinesGrid from './disciplina-section';
// Esse componente orquestra o estado de exibição das disciplinas
export default function DisciplinesState({
    loading,
    hasAluno,
    urlParaAcessar,
    disciplinas,
    searchTerm,
    isSearching,
    texts = {},
}) {
    if (loading && !hasAluno) {
        return (
            <DisciplinesLoading message={texts.loading} />
        );
    }

    if (!disciplinas ||disciplinas.length === 0) {
        return (
            <DisciplinesEmpty
                searchTerm={searchTerm}
                emptyMessage={texts.empty}
                searchMessage={texts.search}
            />
        );
    }

    return (
        <DisciplinesGrid
            disciplinas={disciplinas}
            isSearching={isSearching}
            urlParaAcessar={urlParaAcessar}
        />
    );
}
