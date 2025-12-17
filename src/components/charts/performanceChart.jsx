export default function PerformanceChart({ 
  questoes = [],
  height = 160
}) {
  const calcularAlturaBarra = (porcentagem) => {
    return (porcentagem / 100) * height;
  };

  return (
    <div className="relative">
      <div className="flex items-end space-x-6 h-48 mb-2 border-l border-b border-gray-300 pl-4 pb-4">
        {questoes.map((questao) => (
          <div key={questao.id} className="flex flex-col items-center">
            <div 
              className={`${questao.cor} w-10 rounded-t transition-all duration-500`}
              style={{ height: `${calcularAlturaBarra(questao.acertos)}px` }}
            ></div>
            <span className="text-xs mt-1">Q{questao.id}</span>
            <span className="text-xs text-gray-500 mt-1">{questao.acertos}%</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col h-48 justify-between absolute left-0 top-0 text-xs text-gray-500 -ml-8">
        <span>100%</span>
        <span>80%</span>
        <span>60%</span>
        <span>40%</span>
        <span>20%</span>
        <span>0%</span>
      </div>
    </div>
  );
}