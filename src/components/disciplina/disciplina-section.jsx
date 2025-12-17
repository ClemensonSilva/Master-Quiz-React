import DisciplineCard from '@/components/cards/disciplinaCard';

export default function DisciplinesGrid({ disciplinas, isSearching, urlParaAcessar }) {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
                isSearching ? 'opacity-60' : 'opacity-100'
            }`}
        >
            {disciplinas.map((disc) => (
                <DisciplineCard key={disc.id} disciplina={disc} linkDestino={urlParaAcessar}  />
            ))}
        </div>
    );
}
