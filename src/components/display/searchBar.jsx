import  SearchInput  from '@/components/ui/searchInput';

export default function SearchBar({ searchTerm, setSearchTerm, isSearching }) {
    return (
        <div className="relative w-full md:w-72">
            <SearchInput
                placeholder="Buscar disciplina..."
                className="w-full shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {isSearching && (
                <span className="absolute right-3 top-[-20px] md:top-3 md:right-[-90px] text-xs text-purple-600 font-medium animate-pulse">
                    Buscando...
                </span>
            )}
        </div>
    );
}
