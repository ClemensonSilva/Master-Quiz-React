export default function IsEmpty({
    searchTerm,
    emptyMessage,
    searchMessage,
}) {
    return (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            {searchTerm ? (
                <p className="text-gray-500">
                    {searchMessage
                        ? searchMessage(searchTerm)
                        : `Nada foi encontrado com o nome "${searchTerm}".`}
                </p>
            ) : (
                <p className="text-gray-500 mb-4">
                    {emptyMessage || 'Nenhum item disponível no momento.'}
                </p>
            )}
        </div>
    );
}
