export default function EmptyState({ 
  searchTerm = "",
  emptyMessage = "Nenhum item disponível no momento.",
  searchMessage = null,
  showButton = false,
  buttonText = "Adicionar",
  buttonOnClick
}) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
      <p className="text-gray-500 mb-4">
        {searchTerm 
          ? (searchMessage || `Nada foi encontrado com o nome "${searchTerm}".`)
          : emptyMessage
        }
      </p>
      
      {showButton && buttonOnClick && (
        <button
          onClick={buttonOnClick}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}