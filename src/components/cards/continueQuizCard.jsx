import Button from '@/components/ui/button';

export default function WelcomeHeader({ 
  userName = "Professor",
  userInitials = "P",
  showStatsButton = true,
  statsButtonText = "Estatísticas",
  onStatsClick
}) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
      <div>
        <h1 className="text-3xl font-light text-gray-800 mb-2">Olá, {userName}</h1>
        <p className="text-gray-600">Gerencie suas disciplinas e quizzes</p>
      </div>
      
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-700 font-semibold">{userInitials}</span>
          </div>
          <span className="font-medium text-gray-800">{userName}</span>
        </div>
        
        {showStatsButton && (
          <Button
            variant="purple"
            onClick={onStatsClick}
          >
            {statsButtonText}
          </Button>
        )}
      </div>
    </section>
  );
}