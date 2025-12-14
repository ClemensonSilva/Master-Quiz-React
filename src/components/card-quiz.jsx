'use client';
export function CardQuiz({ title, progress, description, onDetailsClick } ) {

return(

        <div className="bg-quiz-light-gray p-5 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{title}</h4>
            <p className="text-sm text-gray-600 mb-1">Progresso: {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-quiz-progress h-2 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <button onClick={onDetailsClick} className="bg-quiz-dark text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800">
                Detalhes
            </button>
        </div>
)
}
