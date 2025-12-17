export default function DataTable({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyMessage = "Nenhum item encontrado.",
  searchTerm = "",
  onRowClick,
  className = ""
}) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="text-gray-500 mt-2">Carregando...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {searchTerm 
          ? `Nenhum item encontrado com "${searchTerm}"`
          : emptyMessage
        }
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className={`grid grid-cols-${columns.length} gap-4 items-center bg-quiz-light-gray px-6 py-4 border-b border-gray-200`}>
        {columns.map((col, index) => (
          <div key={index} className="text-sm font-semibold text-gray-600 uppercase">
            {col.header}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {data.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`grid grid-cols-${columns.length} gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((col, colIndex) => (
              <div key={colIndex} className={col.className}>
                {col.render ? col.render(row) : row[col.field]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}