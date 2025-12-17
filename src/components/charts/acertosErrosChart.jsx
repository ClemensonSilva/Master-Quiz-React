export default function AcertosErrosChart({ 
  acertos, 
  erros,
  size = 160
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
      <div className={`relative w-${size} h-${size}`}>
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="15" />
          <circle 
            cx="60" cy="60" r="50" fill="none" 
            stroke="#3B82F6" strokeWidth="15"
            strokeDasharray={`${acertos * 3.14} ${erros * 3.14}`}
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">
              {acertos}%
            </span>
            <p className="text-sm text-gray-600">Acertos</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-sm text-gray-600">Acertos</span>
          <span className="text-sm font-medium text-gray-900 ml-auto">
            {acertos}%
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-gray-200 rounded-full mr-3"></span>
          <span className="text-sm text-gray-600">Erros</span>
          <span className="text-sm font-medium text-gray-900 ml-auto">
            {erros}%
          </span>
        </div>
      </div>
    </div>
  );
}