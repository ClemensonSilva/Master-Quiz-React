import DisciplineCard from '@/components/cards/disciplinaCard';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { Pencil } from 'lucide-react';
export default function DisciplinesGrid({ disciplinas, isSearching, urlParaAcessar, professorId }) {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isSearching ? 'opacity-60' : 'opacity-100'
                }`}
        >
            {disciplinas.map((disc) => (
                <DisciplineCard key={disc.id} disciplina={disc} linkDestino={urlParaAcessar}  >
                    {professorId && (
                        <Link href={`/professor/${professorId}/disciplina/${disc.id}/editar`}>
                            <Button variant='purple' fullWidth size="sm" className="px-3" title="Editar Disciplina">
                                {/* Pode usar texto 'Editar' ou um ícone */}
                                <Pencil className="w-4 h-4" /> Editar
                            </Button>
                        </Link>
                    )}                
                </DisciplineCard>
            ))}
        </div>
    );
}
